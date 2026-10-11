import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";

export const metadata = {
  title: "Token-Gated VIP Membership Portal",
  description: "Exclusive Web3 VIP Membership Portal on Base Sepolia",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white antialiased min-h-screen flex flex-col">
        <ThirdwebProvider>
          {children}
        </ThirdwebProvider>
      </body>
    </html>
  );
}
