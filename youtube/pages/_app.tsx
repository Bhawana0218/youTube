import type { AppProps } from "next/app";
import { UserProvider } from "@/lib/AuthContext";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import "@/app/globals.css";
import { Toaster } from "sonner";
import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <div className="flex flex-col md:flex-row">
        <aside className="hidden md:block md:w-72 shrink-0 sticky top-16 self-start h-[calc(100vh-4rem)] overflow-y-auto border-r border-slate-200 bg-white">
          <Sidebar />
        </aside>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ??
    ((page: ReactElement) => <DefaultLayout>{page}</DefaultLayout>);

  return (
    <UserProvider>
      <Toaster position={"top-center"} />
      {getLayout(<Component {...pageProps} />)}
    </UserProvider>
  );
}