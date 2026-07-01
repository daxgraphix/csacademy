"use client";
import { Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label, Input, Switch } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Settings className="h-6 w-6 text-purple-400" /> Settings
        </h1>
        <p className="text-slate-400 text-sm mt-1">Configure platform-wide settings.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">General</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Platform Name</Label>
            <Input defaultValue={APP_NAME} />
          </div>
          <div className="space-y-1.5">
            <Label>Verification URL</Label>
            <Input defaultValue="https://verify.csacademy.com" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Feature Flags</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Enable Community", desc: "Allow students to post in community forums" },
            { label: "Enable Leaderboards", desc: "Show public XP leaderboards" },
            { label: "Public Registration", desc: "Allow anyone to register an account" },
          ].map((f) => (
            <div key={f.label} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-200">{f.label}</p>
                <p className="text-xs text-slate-500">{f.desc}</p>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>

      <Button>Save Settings</Button>
    </div>
  );
}
