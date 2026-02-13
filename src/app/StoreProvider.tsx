"use client";

import { useRef } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { makeStore, AppStore } from "@/lib/store/store";
import { SessionProvider } from "next-auth/react"; // <-- MUST be imported

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    // SessionProvider MUST be on the outside
    <SessionProvider refetchOnWindowFocus={false}>
      <ReduxProvider store={storeRef.current}>{children}</ReduxProvider>
    </SessionProvider>
  );
}