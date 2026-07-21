"use client";

import { PrivyProvider } from "@privy-io/react-auth";

export default function PrivyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || "cmrutcdtc00b10blbawudwjx7"}
      config={{
        loginMethods: ["email", "wallet", "google", "apple"],
        appearance: {
          theme: "dark",
          accentColor: "#3B82F6", // Tailwind blue-500
          logo: "https://your-logo-url", // Optional
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
