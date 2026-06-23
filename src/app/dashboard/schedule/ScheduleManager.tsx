"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSchedule, toggleSchedule, deleteSchedule } from "@/app/actions/schedule";

interface Schedule {
  id: string;
  url: string;
  frequency: string;
  nextRunAt: Date;
  lastRunAt: Date | null;
  active: boolean;
}

export function ScheduleManager({ schedules }: { schedules: Schedule[] }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await createSchedule(formData);
    setLoading(false);
    router.refresh();
    e.currentTarget.reset();
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 border-border">
        <CardHeader><CardTitle>Add Schedule</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
            <Input name="url" placeholder="https://example.com" required className="flex-1 bg-zinc-950 border-zinc-800" />
            <select name="frequency" className="h-9 rounded-lg border border-border bg-zinc-950 px-3 text-sm">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">Schedule</Button>
          </form>
        </CardContent>
      </Card>

      {schedules.map((s) => (
        <Card key={s.id} className="bg-card/50 border-border">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-sm truncate">{s.url}</p>
              <p className="text-xs text-muted-foreground">
                {s.frequency} · Next: {new Date(s.nextRunAt).toLocaleString()}
                {s.lastRunAt && ` · Last: ${new Date(s.lastRunAt).toLocaleString()}`}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => { toggleSchedule(s.id, !s.active); router.refresh(); }}>
                {s.active ? "Pause" : "Resume"}
              </Button>
              <Button variant="outline" size="sm" className="text-red-400" onClick={() => { deleteSchedule(s.id); router.refresh(); }}>
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {schedules.length === 0 && <p className="text-center text-muted-foreground py-8">No scheduled audits yet.</p>}
    </div>
  );
}
