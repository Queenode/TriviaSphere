"use client";

import { PrivyProvider } from "@privy-io/react-auth";

export default function PrivyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || "clpxt1m9f000008l412345678"}
      config={{
        loginMethods: ["email", "wallet", "google", "apple"],
        appearance: {
          theme: "dark",
          accentColor: "#3B82F6", // Tailwind blue-500
          logo: "https://your-logo-url", // Optional
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
