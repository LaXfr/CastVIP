"use client";

import { ConnectButton, ClaimButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { balanceOf } from "thirdweb/extensions/erc721";
import { client, contract } from "./client";
import { baseSepolia } from "thirdweb/chains";

export default function HomePage() {
  const account = useActiveAccount();

  const {
    data: nftBalance,
    isLoading: isCheckingBalance,
    refetch,
  } = useReadContract(balanceOf, {
    contract,
    owner: account?.address || "",
    queryOptions: {
      enabled: Boolean(account?.address),
    },
  });

  // BigInt safe comparison invariant
  const hasMembership = nftBalance && nftBalance > 0n;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-amber-500/20">
              VIP
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Foundry VIP Portal
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                  Base Sepolia
                </span>
              </h1>
              <p className="text-xs text-slate-400">Token-Gated Web3 Membership</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ConnectButton
              client={client}
              chain={baseSepolia}
              theme="dark"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-10 flex flex-col items-center justify-center">
        {/* State 1: Disconnected */}
        {!account && (
          <div className="max-w-2xl w-full text-center py-12 px-6 rounded-2xl border border-slate-800 bg-slate-900/40 shadow-2xl backdrop-blur-sm">
            <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Exclusive VIP Membership Portal
            </h2>
            <p className="mt-4 text-base text-slate-400 max-w-xl mx-auto">
              Connect your Web3 wallet to verify your ERC-721 Membership Pass on Base Sepolia. Unlocked members receive exclusive alpha access, governance rights, and priority protocol perks.
            </p>
            <div className="mt-8 flex justify-center">
              <ConnectButton
                client={client}
                chain={baseSepolia}
                theme="dark"
              />
            </div>
          </div>
        )}

        {/* State 2: Connected & Checking Balance */}
        {account && isCheckingBalance && (
          <div className="max-w-md w-full text-center py-12 px-6 rounded-2xl border border-slate-800 bg-slate-900/40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-white">Verifying Membership Pass...</h3>
            <p className="text-sm text-slate-400 mt-2 font-mono">
              Querying Base Sepolia for balance of {account.address.slice(0, 6)}...{account.address.slice(-4)}
            </p>
          </div>
        )}

        {/* State 3: Connected & Not a Member */}
        {account && !isCheckingBalance && !hasMembership && (
          <div className="max-w-xl w-full rounded-2xl border border-red-500/20 bg-slate-900/60 p-8 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <span className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </span>
              <div>
                <h3 className="text-xl font-bold text-white">VIP Membership Pass Required</h3>
                <p className="text-xs text-red-300">Access Restricted • No Token Detected</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 mb-6">
              Your wallet (<span className="font-mono text-amber-300">{account.address.slice(0, 6)}...{account.address.slice(-4)}</span>) does not currently hold a VIP Membership Pass on Base Sepolia. Claim your free pass below to immediately unlock the portal.
            </p>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 mb-6 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Pass Details</span>
                <span className="font-semibold text-white">VIP Founding Member Pass (ERC-721)</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Price</span>
                <span className="font-semibold text-emerald-400">Free (Testnet)</span>
              </div>
            </div>

            <div className="flex justify-center">
              <ClaimButton
                contractAddress={contract.address}
                chain={contract.chain}
                client={client}
                claimParams={{
                  type: "ERC721",
                  quantity: 1n,
                }}
                onTransactionConfirmed={() => {
                  refetch();
                }}
                theme="dark"
              >
                Claim VIP Pass (1n)
              </ClaimButton>
            </div>
          </div>
        )}

        {/* State 4: Connected & Membership Active */}
        {account && !isCheckingBalance && hasMembership && (
          <div className="w-full space-y-8">
            {/* VIP Status Banner */}
            <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-emerald-950/40 p-8 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    VIP Member Verified
                  </div>
                  <h2 className="text-3xl font-extrabold text-white">
                    Welcome to the VIP Portal
                  </h2>
                  <p className="text-sm text-slate-300 mt-1">
                    Connected Wallet: <span className="font-mono text-amber-300">{account.address}</span>
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-slate-950/80 px-6 py-4 rounded-xl border border-slate-800">
                  <div className="text-center">
                    <span className="text-xs text-slate-400 uppercase tracking-wider block">Pass Balance</span>
                    <span className="text-2xl font-black text-amber-400 font-mono">
                      {nftBalance?.toString()}
                    </span>
                  </div>
                  <div className="h-8 w-px bg-slate-800"></div>
                  <div className="text-center">
                    <span className="text-xs text-slate-400 uppercase tracking-wider block">Network</span>
                    <span className="text-sm font-bold text-blue-400">Base Sepolia</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Exclusive Perks Grid */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                Exclusive VIP Perks & Rewards
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-amber-500/30 transition-all group">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                    01
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Alpha Protocol Feeds</h4>
                  <p className="text-sm text-slate-400">
                    Direct access to private smart contract repositories, zero-knowledge testbeds, and early protocol releases.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-amber-500/30 transition-all group">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                    02
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Gas Subsidies</h4>
                  <p className="text-sm text-slate-400">
                    Smart contract relayer credits covering gas execution across all Foundry testnet experiments on Base.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-amber-500/30 transition-all group">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                    03
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Private Governance</h4>
                  <p className="text-sm text-slate-400">
                    Voting weight on upcoming smart contract deployments and community pool resource allocations.
                  </p>
                </div>
              </div>
            </div>

            {/* Contract Info Footer */}
            <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 font-mono">
              <span>Contract: {contract.address}</span>
              <a
                href={`https://sepolia.basescan.org/address/${contract.address}`}
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:underline flex items-center gap-1"
              >
                View on BaseScan &rarr;
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
