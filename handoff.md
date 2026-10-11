# Project Handoff & Quickstart Guide

## Project Overview
- **Name:** Token-Gated VIP Membership Portal
- **Core Concept:** Web3 loyalty portal where users connect their wallet, check for an ERC-721 Membership Pass, claim a pass if they don't own one, and unlock gated VIP perks.
- **Language Policy:** Strict Pure JavaScript (`.js` / `.jsx`). **No TypeScript / `.ts` / `.tsx`.**

## Stack Specification
- **Framework:** Next.js (App Router, JavaScript)
- **Styling:** Tailwind CSS
- **Web3 Integration:** Thirdweb SDK v5 (`thirdweb`, `thirdweb/react`, `thirdweb/chains`, `thirdweb/extensions/erc721`)
- **Network:** Base Sepolia Testnet (Chain ID: `84532`)
- **Smart Contract:** Thirdweb `NFT Drop` (`DropERC721`)

## Environment Variables Setup
Create `.env.local` in root:
```env
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id_here
NEXT_PUBLIC_CONTRACT_ADDRESS=0x_your_deployed_drop_erc721_contract_address