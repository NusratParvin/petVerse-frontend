// "use client";

// import * as React from "react";
// import { NextUIProvider } from "@nextui-org/system";
// import { useRouter } from "next/navigation";
// import { ThemeProvider as NextThemesProvider } from "next-themes";
// import { ThemeProviderProps } from "next-themes/dist/types";

// // import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { Provider } from "react-redux";
// import { Toaster } from "sonner";
// import { PersistGate } from "redux-persist/integration/react";
// import { SessionProvider } from "next-auth/react";

// import { persistor, store } from "../redux/store";

// export interface ProvidersProps {
//   children: React.ReactNode;
//   themeProps?: ThemeProviderProps;
// }

// // const queryClient = new QueryClient();

// export function Providers({ children, themeProps }: ProvidersProps) {
//   const router = useRouter();
//   const [isClient, setIsClient] = React.useState(false);

//   React.useEffect(() => {
//     setIsClient(true);
//   }, []);

//   if (!isClient) {
//     return null;
//   }

//   return (
//     // <QueryClientProvider client={queryClient}>
//     <Provider store={store}>
//       <PersistGate loading={null} persistor={persistor}>
//         <SessionProvider>
//           <NextUIProvider navigate={router.push}>
//             <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
//             <Toaster />
//           </NextUIProvider>
//         </SessionProvider>
//       </PersistGate>
//     </Provider>
//     // </QueryClientProvider>
//   );
// }

// providers.tsx
"use client";

import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";

import { persistor, store } from "../redux/store";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: {
    attribute?: string;
    defaultTheme?: string;
  };
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Prevent hydration errors by ensuring client-side rendering

  return (
    <SessionProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NextUIProvider navigate={router.push}>
            <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
            <Toaster />
          </NextUIProvider>
        </PersistGate>
      </Provider>
    </SessionProvider>
  );
}
