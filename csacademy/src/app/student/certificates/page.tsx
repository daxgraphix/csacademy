"use client";
import { useQuery } from "@tanstack/react-query";
import { Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CertificateCard } from "@/components/certificates/CertificateCard";
import { useAuth } from "@/hooks/useAuth";
import type { Certificate, Program } from "@/types";

export default function CertificatesPage() {
  const { profile } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["certificates", profile?.id],
    enabled: !!profile,
    queryFn: async () => {
      const res = await fetch("/api/certificates");
      const json = await res.json();
      return json.certificates as (Certificate & { programs: Program })[];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Award className="h-6 w-6 text-green-400" /> Certificates
        </h1>
        <p className="text-slate-400 text-sm mt-1">Your verified accomplishments, ready to share.</p>
      </div>

      {isLoading && <p className="text-slate-500 text-sm">Loading certificates...</p>}

      {data && data.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-4xl mb-3">🎓</p>
            <p className="text-slate-300 font-semibold mb-1">No certificates yet</p>
            <p className="text-sm text-slate-500">Complete a program to earn your first certificate.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data?.map((cert) => profile && (
          <CertificateCard key={cert.id} certificate={cert} program={cert.programs} profile={profile} />
        ))}
      </div>
    </div>
  );
}
