import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";

export const metadata = {
  title: "AURA // VIP Membership Portal",
  description: "Luxury Web3 VIP Membership Portal on Base Sepolia",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#030712] text-slate-100 antialiased min-h-screen flex flex-col selection:bg-indigo-500/30 selection:text-white">
        <ThirdwebProvider>
          {children}
        </ThirdwebProvider>
      </body>
    </html>
  );
}
