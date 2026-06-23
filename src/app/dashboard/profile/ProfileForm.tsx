"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/app/actions/profile";

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage("");
    const result = await updateProfile(formData);
    setLoading(false);
    setMessage(result.success ? "Profile updated!" : result.error || "Failed to update");
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" name="name" defaultValue={name} required className="bg-zinc-950 border-zinc-800" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={email} disabled className="bg-zinc-950 border-zinc-800 opacity-60" />
        <p className="text-xs text-zinc-500">Email cannot be changed.</p>
      </div>
      {message && (
        <p className={`text-sm ${message.includes("updated") ? "text-green-400" : "text-red-400"}`}>{message}</p>
      )}
      <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
