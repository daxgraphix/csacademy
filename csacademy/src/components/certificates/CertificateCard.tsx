"use client";
import { useRef } from "react";
import { motion } from "framer-motion";
import { Award, Download, Share2, ExternalLink, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { VERIFY_URL } from "@/lib/constants";
import type { Certificate, Program, Profile } from "@/types";

interface CertificateCardProps {
  certificate: Certificate;
  program:     Program;
  profile:     Profile;
  showActions?: boolean;
}

export function CertificateCard({ certificate, program, profile, showActions = true }: CertificateCardProps) {
  const certRef = useRef<HTMLDivElement>(null);
  const verifyUrl = `${VERIFY_URL}/${certificate.certificate_id}`;

  async function handleDownload() {
    // In production, this would use html2canvas or a server-side PDF generator
    window.print();
  }

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({
        title: `${profile.full_name} — ${program.title} Certificate`,
        text:  `I just earned my ${program.title} certificate on CSAcademy! 🎓`,
        url:   verifyUrl,
      });
    } else {
      await navigator.clipboard.writeText(verifyUrl);
    }
  }

  return (
    <div className="space-y-4">
      {/* Certificate visual */}
      <motion.div
        ref={certRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-space-800 via-card to-space-800 p-8 shadow-xl"
        style={{ background: "linear-gradient(135deg, #0D1424 0%, #131D31 50%, #0D1424 100%)" }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-cyber-500 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-purple-500 blur-3xl" />
        </div>
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-cyber-500 to-purple-600 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">CS</span>
                </div>
                <span className="font-display font-bold text-slate-300 text-sm tracking-wider uppercase">CSAcademy</span>
              </div>
              <p className="text-xs text-slate-600 tracking-widest uppercase">Certificate of Completion</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge variant="success" className="text-[10px]">
                <CheckCircle className="h-3 w-3 mr-1" /> Verified
              </Badge>
              <p className="text-[10px] text-slate-600 font-mono">{certificate.certificate_id}</p>
            </div>
          </div>

          {/* Main content */}
          <div className="text-center mb-8">
            <p className="text-sm text-slate-500 mb-2 tracking-wider uppercase">This certifies that</p>
            <h2 className="font-display text-3xl font-bold text-slate-100 mb-1">{profile.full_name}</h2>
            {profile.institution && (
              <p className="text-sm text-slate-500">{profile.institution}</p>
            )}
            <p className="text-sm text-slate-400 mt-3">has successfully completed</p>
            <div className="mt-3 inline-flex items-center gap-3 rounded-xl bg-cyber-500/10 border border-cyber-500/20 px-5 py-3">
              <span className="text-2xl">{program.icon}</span>
              <div className="text-left">
                <p className="font-display font-bold text-slate-100">{program.title}</p>
                <p className="text-xs text-cyber-400">{program.duration_days} Days · {program.category.replace("_", " ").toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-end justify-between">
            {/* Signature */}
            <div>
              <div className="h-8 mb-1">
                <p className="font-display text-lg text-slate-300 italic">CSAcademy</p>
              </div>
              <div className="h-px w-32 bg-border mb-1" />
              <p className="text-[10px] text-slate-600">Issued: {formatDate(certificate.issued_at)}</p>
            </div>

            {/* QR Code placeholder */}
            <div className="flex flex-col items-center gap-1">
              <div className="h-16 w-16 rounded-lg bg-card border border-border flex items-center justify-center overflow-hidden">
                {/* Simple QR visual representation */}
                <div className="grid grid-cols-7 gap-px p-1">
                  {Array.from({ length: 49 }).map((_, i) => (
                    <div key={i} className={cn_cert(i, "h-1.5 w-1.5 rounded-[1px]")} />
                  ))}
                </div>
              </div>
              <p className="text-[9px] text-slate-600">Scan to verify</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      {showActions && (
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 gap-2" onClick={handleDownload}>
            <Download className="h-4 w-4" /> Download
          </Button>
          <Button variant="outline" className="flex-1 gap-2" onClick={handleShare}>
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href={verifyUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      )}

      {/* Verify link */}
      <p className="text-center text-xs text-slate-600">
        Verify at <a href={verifyUrl} target="_blank" rel="noopener noreferrer" className="text-cyber-400 hover:underline">{verifyUrl}</a>
      </p>
    </div>
  );
}

// Local helper (avoids cn import conflict with outer scope)
function cn_cert(i: number, base: string): string {
  const pattern = [0,1,2,3,4,5,6, 7,14, 8,13, 9,10,11,12, 15,21, 35,41, 42,43,44,45,46,47,48, 42,48, 43,47, 16,20, 36,40];
  const active = pattern.includes(i) || (Math.random() > 0.6 && i > 14 && i < 35);
  return `${base} ${active ? "bg-slate-300" : "bg-transparent"}`;
}
