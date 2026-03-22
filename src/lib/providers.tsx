"use client";

import React from "react";
import { Provider } from "react-redux";
import { HeroUIProvider } from "@heroui/react";
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";
import dynamic from "next/dynamic";

import { persistor, store } from "../redux/store";

const PersistGate = dynamic(
  () => import("redux-persist/integration/react").then((m) => m.PersistGate),
  { ssr: false },
);

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HeroUIProvider navigate={router.push}>
          <NextThemesProvider
            {...themeProps}
            attribute="class"
            themes={["petverse-dark", "petverse-light"]}
            defaultTheme="petverse-dark"
          >
            {children}
            <Toaster />
          </NextThemesProvider>
        </HeroUIProvider>
      </PersistGate>
    </Provider>
  );
}
