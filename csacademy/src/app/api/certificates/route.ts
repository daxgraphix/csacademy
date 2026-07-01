import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const certificateId = searchParams.get("id");

  if (certificateId) {
    // Verification lookup
    const { data, error } = await supabase
      .from("certificates")
      .select("*, profiles(full_name, institution), programs(title, icon, category, duration_days)")
      .eq("certificate_id", certificateId)
      .single();

    if (error || !data) return NextResponse.json({ error: "Certificate not found" }, { status: 404 });

    // Log verification
    await supabase.from("certificate_verifications").insert({ certificate_id: certificateId });

    return NextResponse.json({ certificate: data, valid: data.status === "issued" });
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("certificates")
    .select("*, programs(*)")
    .eq("user_id", user.id)
    .order("issued_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ certificates: data });
}
