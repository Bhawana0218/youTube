import type { AppProps } from "next/app";
import { UserProvider } from "@/lib/AuthContext";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import "@/app/globals.css";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
        <Toaster position={"top-center"} />
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Header />
        <div className="flex flex-col md:flex-row">
          <aside className="hidden md:block md:w-72 shrink-0 border-r border-slate-200 bg-white">
            <Sidebar />
          </aside>
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <Component {...pageProps} />
          </main>
        </div>
      </div>
    </UserProvider>
  );
}
