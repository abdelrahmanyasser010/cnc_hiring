"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  // Here we can wrap children with Context Providers like Auth Session Provider,
  // Theme Providers, React Query Client Provider, etc.
  return <SessionProvider>{children}</SessionProvider>;
}

