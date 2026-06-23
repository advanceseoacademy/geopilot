"use client";

interface Entity {
  name: string;
  type: string;
  count: number;
}

const TYPE_COLORS: Record<string, string> = {
  Organization: "bg-indigo-500",
  Person: "bg-purple-500",
  Location: "bg-blue-500",
  Brand: "bg-pink-500",
  Product: "bg-green-500",
  Topic: "bg-zinc-500",
};

export function EntityGraph({ entities }: { entities: Entity[] }) {
  const top = entities.slice(0, 12);
  const maxCount = Math.max(...top.map((e) => e.count), 1);

  return (
    <div className="flex flex-wrap gap-3 justify-center items-end min-h-[200px] p-4">
      {top.map((entity) => {
        const size = Math.max(48, (entity.count / maxCount) * 120);
        const color = TYPE_COLORS[entity.type] || "bg-zinc-600";
        return (
          <div
            key={entity.name}
            className={`${color} rounded-full flex items-center justify-center text-white text-xs font-medium text-center p-2 opacity-90 hover:opacity-100 transition-opacity cursor-default`}
            style={{ width: size, height: size }}
            title={`${entity.name} (${entity.type}) — ${entity.count} mentions`}
          >
            <span className="truncate max-w-full px-1 leading-tight">
              {entity.name.length > 12 ? entity.name.slice(0, 10) + "…" : entity.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
