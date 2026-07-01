import Link from "next/link";
import { Rocket } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-space-900 flex flex-col">
      {/* Minimal header */}
      <header className="border-b border-border/50 px-6 py-4">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-cyber-500 to-purple-600 flex items-center justify-center">
            <Rocket className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-display font-bold text-slate-100">CS<span className="text-cyber-400">Academy</span></span>
        </Link>
      </header>

      {/* Background */}
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
      <div className="absolute inset-0 bg-dark-mesh pointer-events-none" />

      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        {children}
      </main>

      <footer className="text-center py-4 text-xs text-slate-600 border-t border-border/30">
        © {new Date().getFullYear()} CSAcademy · <Link href="/privacy" className="hover:text-slate-400">Privacy</Link> · <Link href="/terms" className="hover:text-slate-400">Terms</Link>
      </footer>
    </div>
  );
}
