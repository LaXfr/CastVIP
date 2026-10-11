# Project Roadmap & Deliverables

## Phase 0: Project Setup & Pre-flight
- [x] Initialize repository with strictly JavaScript Next.js App Router template.
- [x] Install Thirdweb SDK (`npm install thirdweb`).
- [x] Establish environment configuration in `.env.local` and `.env.example`.
- [x] Verify `.env.local` is added to `.gitignore`.

## Phase 1: On-Chain Deployment & Configuration
- [ ] Fund deployment wallet via Base Sepolia faucet.
- [ ] Register new client application on Thirdweb Dashboard; obtain Client ID.
- [ ] Deploy `NFT Drop` (`DropERC721`) to Base Sepolia.
- [ ] Upload membership pass image and lazy mint Token #0.
- [ ] Configure Public Claim Condition (Price: 0 ETH, 1 claim per wallet).

## Phase 2: Core Frontend Integration
- [x] Implement `src/app/client.js` for Base Sepolia contract binding.
- [x] Wrap application root in `ThirdwebProvider` in `src/app/layout.js`.
- [x] Mount `<ConnectButton />` on `src/app/page.js` and verify wallet connection on Base Sepolia.

## Phase 3: Token-Gating & Minting Workflow
- [x] Implement reactive `balanceOf` query using `useReadContract`.
- [x] Build disconnected state UI prompt.
- [x] Build locked view with `<ClaimButton />` for non-holders.
- [x] Implement post-claim state invalidation (`refetch()`) to unlock gated view instantly.
- [x] Build unlocked VIP portal view displaying gated rewards.

## Phase 4: Quality Assurance & Launch
- [x] Verify zero TypeScript artifacts exist in the project tree (`.ts`/`.tsx`).
- [x] Verify dev server compilation and clean build (`GET / 200 OK`).
- [ ] Connect live Thirdweb Base Sepolia credentials in `.env.local` and verify live mint/pass claim.
- [ ] Verify error states (rejected transactions, faucet rate limits).
- [ ] Deploy frontend to Vercel and populate production environment variables.