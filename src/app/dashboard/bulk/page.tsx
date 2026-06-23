import { BulkAuditForm } from "./BulkAuditForm";

export default function BulkPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bulk Audit</h1>
        <p className="text-muted-foreground">Audit up to 20 URLs at once via CSV or line-separated input.</p>
      </div>
      <BulkAuditForm />
    </div>
  );
}
