# Project Handoff & Quickstart Guide

## Project Overview
- **Name:** Token-Gated VIP Membership Portal
- **Core Concept:** Luxury Web3 loyalty portal where users connect their wallet on Base Sepolia, check for an on-chain ERC-721 Membership Pass (`DropERC721`), claim a free pass if they don't own one, and unlock exclusive VIP perks (status banner, on-chain verified pass renderer, Tier 1 reward key, and BaseScan contract explorer links).
- **Language Policy:** Strict Pure JavaScript (`.js` / `.jsx`). **Zero TypeScript (`.ts` / `.tsx`) / No `tsconfig.json`.**

## Stack Specification
- **Framework:** Next.js 16 (App Router, JavaScript) with Turbopack
- **Styling:** Tailwind CSS v4 (configured with `@tailwindcss/turbopack`)
- **Web3 Integration:** Thirdweb SDK v5 (`thirdweb`, `thirdweb/react`, `thirdweb/chains`, `thirdweb/extensions/erc721`)
- **Network:** Base Sepolia Testnet (Chain ID: `84532`)
- **Smart Contract:** Thirdweb `NFT Drop` (`DropERC721`) on Base Sepolia: `0x0d02C1ACFDae922160f9A0c9cC0Df26A9d221dC6`

---

## Environment Variables Setup

Create `.env.local` in the project root (already ignored by `.gitignore`):
```env
NEXT_PUBLIC_DEPLOY_ADDRESS=0x0d02C1ACFDae922160f9A0c9cC0Df26A9d221dC6
NEXT_PUBLIC_CONTRACT_ADDRESS=0x0d02C1ACFDae922160f9A0c9cC0Df26A9d221dC6
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=37622355ac38f5d7779ee7e7c74fab77
```
*(Both `NEXT_PUBLIC_CONTRACT_ADDRESS` and `NEXT_PUBLIC_DEPLOY_ADDRESS` are supported with automatic fallback).*

A clean template is preserved in `.env.example`:
```env
NEXT_PUBLIC_DEPLOY_ADDRESS=0x_your_deployed_drop_erc721_contract_address
NEXT_PUBLIC_CONTRACT_ADDRESS=0x_your_deployed_drop_erc721_contract_address
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id_here
```

---

## Local Development Quickstart

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Local Dev Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Run Production Build:**
   ```bash
   npm run build
   ```

---

## Vercel Deployment Instructions

1. **Import Repository:**
   - Push your code to your GitHub / GitLab / Bitbucket repository.
   - Import the project into the [Vercel Dashboard](https://vercel.com).

2. **Configure Build Settings:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build` (or default Next.js build)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install`

3. **Configure Environment Variables:**
   Add the following environment variables in Vercel Project Settings -> **Environment Variables**:
   - `NEXT_PUBLIC_THIRDWEB_CLIENT_ID`: Your Thirdweb Client ID (e.g., `37622355ac38f5d7779ee7e7c74fab77`)
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`: Deployed Base Sepolia Drop contract (`0x0d02C1ACFDae922160f9A0c9cC0Df26A9d221dC6`)
   - `NEXT_PUBLIC_DEPLOY_ADDRESS`: (Optional fallback) `0x0d02C1ACFDae922160f9A0c9cC0Df26A9d221dC6`

4. **Deploy:**
   - Click **Deploy**. Vercel will compile the Next.js production build and publish the live site.