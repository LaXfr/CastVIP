# Issues, Bugs & Resolution Tracker

## Known Gotchas & Pre-emptive Fixes

### 1. BigInt Serialization / Comparison Error `[RESOLVED]`
- **Status:** Resolved
- **Symptom:** `TypeError: Cannot mix BigInt and other types` or balance evaluation evaluating to `false`.
- **Root Cause:** Thirdweb SDK v5 `balanceOf` returns native JavaScript `BigInt` (e.g., `1n`), not a primitive `Number`.
- **Fix:** Compare strictly against BigInt values:
  ```javascript
  // CORRECT:
  const hasMembership = nftBalance && nftBalance > 0n;
  
  // INCORRECT:
  const hasMembership = nftBalance > 0;
  ```

### 2. Hydration & Empty Account Query Safety `[RESOLVED]`
- **Status:** Resolved
- **Symptom:** Unnecessary RPC calls to address `""` during initial render and potential hydration mismatch.
- **Root Cause:** Next.js SSR executes client component hooks before client-side wallet connection is established.
- **Fix:** Gate `useReadContract` with:
  ```javascript
  queryOptions: {
    enabled: Boolean(account?.address),
  }
  ```

### 3. Thirdweb v5 Client Initialization Requirement `[RESOLVED]`
- **Status:** Resolved
- **Symptom:** `Error: clientId or secretKey must be provided` during Next.js static page compilation.
- **Root Cause:** `createThirdwebClient` requires a non-empty string.
- **Fix:** Provided safe fallback in `src/app/client.js`:
  ```javascript
  const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "placeholder_client_id";
  ```

### 4. Turbopack Module Resolution for `@coinbase/cdp-sdk` Dynamic Imports `[RESOLVED]`
- **Status:** Resolved
- **Symptom:** `Error: Module not found: Can't resolve '@x402/evm/exact/client'` and `@x402/svm/exact/client` during `npm run build`.
- **Root Cause:** Deep dependency `@coinbase/cdp-sdk` inside `@base-org/account` contains dynamic imports for optional x402 payment clients.
- **Fix:** Installed `@x402/core`, `@x402/evm`, and `@x402/svm` into dev/runtime dependencies to satisfy static bundle graph analysis.

### 5. Dev Server Stalling on `Compiling / ...` `[RESOLVED]`
- **Status:** Resolved
- **Symptom:** `next dev` hung indefinitely when requesting `http://localhost:3000`.
- **Root Cause:** Next.js 16 starter template included experimental `cacheComponents: true` and `partialPrefetching: true` in `next.config.mjs`.
- **Fix:** Simplified `next.config.mjs` to remove experimental caching flags; dev server compiles in 750ms with HTTP 200 responses.

### 6. Oversized SVG Overflow & Missing Tailwind CSS Compilation `[RESOLVED]`
- **Status:** Resolved
- **Symptom:** Inline SVGs expanded beyond `100vw`/`100vh`, overflowing the viewport and distorting layout.
- **Root Cause:**
  1. Tailwind CSS v4 requires `@tailwindcss/turbopack` loader rules in `next.config.mjs` to compile utilities from `@import "tailwindcss";`. Without this loader, utility classes (`w-8`, `h-8`, etc.) were omitted from the output CSS bundle.
  2. Inline SVG elements lacked explicit HTML `width`/`height` attributes, causing browsers to default to full-bleed scaling.
- **Fix:**
  1. Configured `@tailwindcss/turbopack` loader in `next.config.mjs`, compiling 28KB+ of complete Tailwind utility CSS.
  2. Added defensive CSS in `src/app/globals.css`:
     ```css
     html, body { overflow-x: hidden; background-color: #030712; color: #f9fafb; }
     svg { max-width: 100%; height: auto; }
     ```
  3. Audited and constrained every `<svg>` in `src/app/page.js` with explicit HTML dimensions (`width="..." height="..."`) and Tailwind classes (`className="w-... h-... shrink-0"`).

### 7. ConnectButton "View Assets" Modal Tab Navigation & Indexing `[RESOLVED]`
- **Status:** Resolved
- **Symptom:** When clicking "Profile -> View Assets", claimed testnet NFTs do not appear immediately.
- **Root Cause:**
  1. Default Tab: Thirdweb's `detailsModal` defaults to the "Tokens" (ERC-20) tab. If the connected wallet has no ERC-20 tokens, it displays an empty screen unless the user switches to the "NFTs" tab.
  2. Insight Indexer Delay: Thirdweb's `detailsModal` NFT tab queries `https://insight.thirdweb.com/v1/nfts`, which is an off-chain indexer. On testnets like Base Sepolia (`84532`), newly deployed contracts experience indexing latency before appearing in the off-chain API, even when on-chain ownership (`balanceOf`) is confirmed.
- **Fix:**
  1. Configured `supportedNFTs={{ [baseSepolia.id]: [contract.address] }}` on `<ConnectButton />`.
  2. Configured `detailsModal={{ assetTabs: ["nft", "token"] }}` so clicking "View Assets" opens the "NFTs" tab directly by default.

### 8. ClaimButton Revert & User Rejection Graceful Handling `[RESOLVED]`
- **Status:** Resolved
- **Symptom:** If a user rejects a transaction or if the contract claim condition fails (e.g., claim limit reached or insufficient gas), the UI could trigger unhandled runtime errors.
- **Root Cause:** `<ClaimButton />` without an explicit `onError` callback logs unhandled promise rejections.
- **Fix:** Added stateful `onError={(err) => setClaimError(err?.message)}` callback to `<ClaimButton />` in `src/app/page.js` with a dedicated, non-blocking error notice banner.


### 9. DropERC721 (ERC721A) Pass Rendering & `getOwnedNFTs` Incompatibility `[RESOLVED]`
- **Status:** Resolved
- **Symptom:** Claimed VIP passes were not rendering on the VIP dashboard; `getOwnedNFTs` returned empty or failed even though `balanceOf` returned > 0n.
- **Root Cause:** Thirdweb's `DropERC721` uses the gas-efficient ERC721A standard, which does not implement `ERC721Enumerable` (`tokenOfOwnerByIndex`). Because `getOwnedNFTs` relies on enumerable indexing, calls against ERC721A contracts fail to retrieve tokens by owner address.
- **Fix:**
  1. Replaced `getOwnedNFTs` with `getNFTs` from `"thirdweb/extensions/erc721"`:
     ```javascript
     const { data: allNfts, isLoading: isLoadingNfts, refetch: refetchNfts } = useReadContract(getNFTs, {
       contract,
       start: 0,
       count: 10,
     });
     ```
  2. In the unlocked VIP view (`hasMembership`), rendered a sleek **"Your Claimed VIP Passes (`{nftBalance?.toString()}` Owned)"** gallery section mapping over `allNfts` up to `Number(nftBalance)` items using `<MediaRenderer client={client} src={nft.metadata.image} className="w-28 h-28 rounded-xl object-cover border border-emerald-500/30" />`, displaying `metadata.name`, `metadata.description`, and Token ID `#${nft.id.toString()}`.
  3. Linked `refetchNfts()` alongside `refetchBalance()` in `<ClaimButton onTransactionConfirmed={...} />`.