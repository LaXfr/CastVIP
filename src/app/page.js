"use client";

import { useState } from "react";
import { ConnectButton, ClaimButton, useActiveAccount, useReadContract, MediaRenderer } from "thirdweb/react";
import { balanceOf, getOwnedNFTs } from "thirdweb/extensions/erc721";
import { client, contract } from "./client";
import { baseSepolia } from "thirdweb/chains";

export default function HomePage() {
  const account = useActiveAccount();
  const [copiedKey, setCopiedKey] = useState(false);

  // Reactive BigInt balance check
  const {
    data: nftBalance,
    isLoading: isCheckingBalance,
    refetch: refetchBalance,
  } = useReadContract(balanceOf, {
    contract,
    owner: account?.address || "",
    queryOptions: {
      enabled: Boolean(account?.address),
    },
  });

  // Query owned NFT metadata
  const {
    data: ownedNfts,
    isLoading: isLoadingNfts,
    refetch: refetchOwnedNfts,
  } = useReadContract(getOwnedNFTs, {
    contract,
    owner: account?.address || "",
    queryOptions: {
      enabled: Boolean(account?.address),
    },
  });

  // BigInt safe comparison invariant
  const hasMembership = nftBalance && nftBalance > 0n;

  const handleCopyKey = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("VIP-BASE-2026");
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const connectButtonSupportedNFTs = {
    [baseSepolia.id]: [contract.address],
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 relative overflow-hidden flex flex-col justify-between selection:bg-indigo-500/30 selection:text-white">
      {/* Ambient Lighting Accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/15 blur-[130px] rounded-full"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 right-1/4 w-[500px] h-[350px] bg-blue-600/10 blur-[140px] rounded-full"
      />

      {/* Top Navigation Bar */}
      <header className="max-w-5xl w-full mx-auto px-6 py-6 flex items-center justify-between border-b border-white/[0.06] relative z-10">
        <div className="flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 p-px shadow-lg shadow-indigo-500/20 shrink-0">
            <div className="w-full h-full bg-[#070b18] rounded-[11px] flex items-center justify-center">
              <svg
                width="18"
                height="18"
                className="w-4.5 h-4.5 shrink-0 text-indigo-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
          </div>
          <div>
            <span className="font-bold text-sm tracking-wider text-white font-mono uppercase block">
              AURA // VIP
            </span>
          </div>
          <div className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shrink-0" />
            Base Sepolia • 84532
          </div>
        </div>

        <div className="flex items-center">
          <ConnectButton
            client={client}
            chain={baseSepolia}
            theme="dark"
            supportedNFTs={connectButtonSupportedNFTs}
            detailsModal={{
              supportedNFTs: connectButtonSupportedNFTs,
            }}
          />
        </div>
      </header>

      {/* Spacious Centerpiece Card */}
      <main className="max-w-2xl w-full mx-auto my-auto px-6 py-12 relative z-10">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 sm:p-12 shadow-[0_20px_70px_-15px_rgba(0,0,0,0.8)]">
          <span className="text-xs uppercase tracking-[0.2em] text-indigo-400 font-semibold mb-3 block">
            Membership Portal
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Exclusive Token-Gated Lounge
          </h1>
          <p className="text-slate-400 text-base leading-relaxed mb-8">
            Access restricted protocol resources, alpha intelligence feeds, and priority perks authenticated on Base Sepolia.
          </p>

          {/* STATE 1: Disconnected */}
          {!account && (
            <div className="bg-slate-950/60 border border-white/[0.06] rounded-2xl p-8 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                <svg
                  width="22"
                  height="22"
                  className="w-5.5 h-5.5 shrink-0 text-slate-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-white mb-2">
                Authentication Required
              </h2>
              <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto leading-relaxed">
                Connect your Web3 wallet on Base Sepolia to verify your ERC-721 Membership Pass.
              </p>
              <div className="flex justify-center">
                <ConnectButton
                  client={client}
                  chain={baseSepolia}
                  theme="dark"
                  supportedNFTs={connectButtonSupportedNFTs}
                  detailsModal={{
                    supportedNFTs: connectButtonSupportedNFTs,
                  }}
                />
              </div>
            </div>
          )}

          {/* STATE 2a: Connected & Checking Balance */}
          {account && isCheckingBalance && (
            <div className="bg-slate-950/60 border border-white/[0.06] rounded-2xl p-8 text-center">
              <div className="w-10 h-10 mx-auto mb-4 border-2 border-indigo-500/20 border-t-indigo-400 rounded-full animate-spin shrink-0" />
              <p className="text-sm font-medium text-slate-200">
                Verifying On-Chain Membership...
              </p>
              <p className="text-xs text-slate-500 font-mono mt-1">
                Querying Base Sepolia for {account.address.slice(0, 6)}...{account.address.slice(-4)}
              </p>
            </div>
          )}

          {/* STATE 2b: Connected & Locked / Non-Holder */}
          {account && !isCheckingBalance && !hasMembership && (
            <div className="space-y-6">
              <div className="bg-slate-950/60 border border-white/[0.06] rounded-2xl p-6">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                      <svg
                        width="16"
                        height="16"
                        className="w-4 h-4 shrink-0 text-amber-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-white">Membership Pass Required</h2>
                      <p className="text-xs text-slate-400 font-mono">Status: Non-Holder</p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                    Locked
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center mb-6">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">Tier</span>
                    <span className="text-xs font-semibold text-slate-200">ERC-721 Pass</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">Network</span>
                    <span className="text-xs font-semibold text-blue-400">Base Sepolia</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">Price</span>
                    <span className="text-xs font-semibold text-emerald-400">Free Claim</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 text-center mb-5">
                  Connected as <span className="font-mono text-slate-300">{account.address.slice(0, 6)}...{account.address.slice(-4)}</span>. Claim your complimentary VIP pass below to unlock portal access.
                </p>

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
                      refetchBalance();
                      refetchOwnedNfts();
                    }}
                    theme="dark"
                  >
                    Claim VIP Membership Pass
                  </ClaimButton>
                </div>
              </div>
            </div>
          )}

          {/* STATE 3: Unlocked VIP Member Portal */}
          {account && !isCheckingBalance && hasMembership && (
            <div>
              {/* Luxury Status Banner */}
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <svg
                      width="20"
                      height="20"
                      className="w-5 h-5 shrink-0 text-emerald-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-semibold block">
                      VERIFIED VIP HOLDER
                    </span>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {account.address.slice(0, 8)}...{account.address.slice(-6)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:text-right">
                  <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-emerald-500/20">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Balance</span>
                    <span className="text-sm font-bold text-emerald-300 font-mono">
                      {nftBalance?.toString() || "1"} Pass(es)
                    </span>
                  </div>
                </div>
              </div>

              {/* Your Membership Pass Showcase Card */}
              <div className="bg-slate-950/60 border border-white/[0.08] rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-400 font-semibold block">
                    YOUR MEMBERSHIP PASS
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                    Token #{ownedNfts?.[0]?.id?.toString() || "0"}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative shrink-0">
                    {isLoadingNfts && !ownedNfts ? (
                      <div className="w-32 h-32 rounded-xl bg-slate-900 border border-white/10 animate-pulse flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-indigo-500/20 border-t-indigo-400 rounded-full animate-spin" />
                      </div>
                    ) : (
                      <MediaRenderer
                        client={client}
                        src={ownedNfts?.[0]?.metadata?.image}
                        className="w-32 h-32 rounded-xl object-cover border border-white/10 shadow-lg shadow-indigo-500/10"
                      />
                    )}
                  </div>

                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {ownedNfts?.[0]?.metadata?.name || "VIP Membership Pass"}
                    </h3>
                    <p className="text-xs text-indigo-400 font-mono">
                      Pass ID: #{ownedNfts?.[0]?.id?.toString() || "0"}
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {ownedNfts?.[0]?.metadata?.description || "Official ERC-721 VIP Membership Pass verified on Base Sepolia. Unlocks protocol benefits and exclusive holder perks."}
                    </p>
                  </div>
                </div>
              </div>

              {/* 2-Column Luxury Perks Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Perk 1: Reward Key */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.12] transition">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-semibold text-white">Exclusive Reward Key</h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      Tier 1
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    Use this active authentication token to access private channels and member rewards.
                  </p>
                  <button
                    onClick={handleCopyKey}
                    type="button"
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/[0.08] hover:border-indigo-500/40 transition group cursor-pointer"
                  >
                    <span className="font-mono text-xs font-semibold text-indigo-300 tracking-wider">
                      VIP-BASE-2026
                    </span>
                    <span className="text-[11px] text-slate-400 group-hover:text-white transition flex items-center gap-1.5">
                      {copiedKey ? (
                        <span className="text-emerald-400">Copied!</span>
                      ) : (
                        <>
                          <svg
                            width="14"
                            height="14"
                            className="w-3.5 h-3.5 shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          Copy
                        </>
                      )}
                    </span>
                  </button>
                </div>

                {/* Perk 2: On-Chain Verification */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.12] transition flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-sm font-semibold text-white">On-Chain Contract</h2>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        BaseScan
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                      Verify the official DropERC721 smart contract and provenance records on Base Sepolia.
                    </p>
                  </div>
                  <a
                    href={`https://sepolia.basescan.org/address/${contract.address}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/[0.08] hover:border-blue-500/40 transition group text-xs text-slate-300 hover:text-white"
                  >
                    <span className="font-mono text-xs text-slate-400 group-hover:text-slate-200 truncate pr-2">
                      {contract.address.slice(0, 10)}...{contract.address.slice(-8)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-blue-400 group-hover:text-blue-300 shrink-0 font-medium">
                      Verify
                      <svg
                        width="14"
                        height="14"
                        className="w-3.5 h-3.5 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="max-w-5xl w-full mx-auto px-6 py-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-3 relative z-10">
        <div>
          <span>AURA PROTOCOL // BASE SEPOLIA</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Chain ID: 84532</span>
          <span>•</span>
          <span>Thirdweb SDK v5</span>
        </div>
      </footer>
    </div>
  );
}
