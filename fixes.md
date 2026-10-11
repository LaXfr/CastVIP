# Issues, Bugs & Resolution Tracker

## Known Gotchas & Pre-emptive Fixes

### 1. BigInt Serialization / Comparison Error
- **Symptom:** `TypeError: Cannot mix BigInt and other types` or balance evaluation evaluating to `false`.
- **Root Cause:** Thirdweb SDK v5 `balanceOf` returns native JavaScript `BigInt` (e.g., `1n`), not a primitive `Number`.
- **Fix:** Compare strictly against BigInt values:
  ```javascript
  // CORRECT:
  const hasMembership = nftBalance && nftBalance > 0n;
  
  // INCORRECT:
  const hasMembership = nftBalance > 0;
  ```

### 2. Hydration & Empty Account Query Safety
- **Symptom:** Unnecessary RPC calls to address `""` during initial render and potential hydration mismatch.
- **Root Cause:** Next.js SSR executes client component hooks before client-side wallet connection is established.
- **Fix:** Gate `useReadContract` with:
  ```javascript
  queryOptions: {
    enabled: Boolean(account?.address),
  }
  ```

### 3. Thirdweb v5 Client Initialization Requirement
- **Symptom:** `Error: clientId or secretKey must be provided` during Next.js static page compilation.
- **Root Cause:** `createThirdwebClient` requires a non-empty string.
- **Fix:** Provided safe fallback in `src/app/client.js`:
  ```javascript
  const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "placeholder_client_id";
  ```

### 4. Turbopack Module Resolution for `@coinbase/cdp-sdk` Dynamic Imports
- **Symptom:** `Error: Module not found: Can't resolve '@x402/evm/exact/client'` and `@x402/svm/exact/client` during `npm run build`.
- **Root Cause:** Deep dependency `@coinbase/cdp-sdk` inside `@base-org/account` contains dynamic imports for optional x402 payment clients.
- **Fix:** Installed `@x402/core`, `@x402/evm`, and `@x402/svm` into dev/runtime dependencies to satisfy static bundle graph analysis.

### 5. Dev Server Stalling on `Compiling / ...`
- **Symptom:** `next dev` hung indefinitely when requesting `http://localhost:3000`.
- **Root Cause:** Next.js 16 starter template included experimental `cacheComponents: true` and `partialPrefetching: true` in `next.config.mjs`.
- **Fix:** Simplified `next.config.mjs` to remove experimental caching flags; dev server compiles in 751ms with HTTP 200 responses.