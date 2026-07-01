import { Navbar } from "@/components/layout/Navbar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-space-900">
      <Navbar />
      <main className="pt-16">{children}</main>
      <footer className="border-t border-border mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-cyber-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">CS</div>
                <span className="font-display font-bold text-slate-100">CS<span className="text-cyber-400">Academy</span></span>
              </div>
              <p className="text-sm text-slate-500">Master AI tools, cybersecurity, and digital skills through daily micro-learning.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-3">Learn</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                {["AI Tools Challenge", "Cybersecurity", "AI Safety", "Digital Skills"].map((l) => (
                  <li key={l}><a href="#" className="hover:text-slate-300 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                {["Pricing", "About", "Blog", "Contact"].map((l) => (
                  <li key={l}><a href="#" className="hover:text-slate-300 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-3">Account</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                {["Sign in", "Register", "Dashboard"].map((l) => (
                  <li key={l}><a href="#" className="hover:text-slate-300 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between gap-2 text-xs text-slate-600">
            <p>© {new Date().getFullYear()} CSAcademy. All rights reserved.</p>
            <p>Built for the future of learning.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
