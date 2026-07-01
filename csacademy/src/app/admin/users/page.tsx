"use client";
import { useQuery } from "@tanstack/react-query";
import { Users, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/primitives";
import { Avatar, AvatarFallback } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/utils";
import { useState } from "react";

export default function AdminUsersPage() {
  const supabase = createClient();
  const [search, setSearch] = useState("");

  const { data: users } = useQuery({
    queryKey: ["admin-all-users"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(200);
      return data ?? [];
    },
  });

  const filtered = users?.filter((u) =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const ROLE_COLORS: Record<string, string> = {
    student: "bg-cyber-500/10 text-cyber-400",
    instructor: "bg-green-500/10 text-green-400",
    org_manager: "bg-amber-500/10 text-amber-400",
    admin: "bg-purple-500/10 text-purple-400",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Users className="h-6 w-6 text-purple-400" /> Users
          </h1>
          <p className="text-slate-400 text-sm mt-1">{users?.length ?? 0} total users on the platform</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input className="pl-9" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <Card>
        <CardContent className="p-0 divide-y divide-border">
          {filtered?.map((u) => (
            <div key={u.id} className="flex items-center gap-4 p-3.5">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="text-xs bg-card">{getInitials(u.full_name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{u.full_name}</p>
                <p className="text-xs text-slate-500 truncate">{u.email}</p>
              </div>
              <span className="text-xs font-medium text-amber-400">{u.total_xp} XP</span>
              <span className={`text-xs px-2 py-1 rounded-full capitalize ${ROLE_COLORS[u.role]}`}>{u.role.replace("_", " ")}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
