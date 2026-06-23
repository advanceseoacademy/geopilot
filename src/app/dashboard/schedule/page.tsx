import { getUserSchedules } from "@/app/actions/schedule";
import { requireUser } from "@/lib/session";
import { ScheduleManager } from "./ScheduleManager";

export default async function SchedulePage() {
  const user = await requireUser();
  const schedules = await getUserSchedules(user.id);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Scheduled Audits</h1>
        <p className="text-muted-foreground">Automatically re-audit URLs daily, weekly, or monthly.</p>
      </div>
      <ScheduleManager schedules={schedules} />
    </div>
  );
}
