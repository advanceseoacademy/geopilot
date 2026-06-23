"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Bell, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchMyNotifications, fetchUnreadCount, markAllRead } from "@/app/actions/notifications";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  link: string | null;
  createdAt: Date;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    fetchUnreadCount().then(setUnread).catch(() => {});
  }, []);

  function handleToggle() {
    const next = !open;
    setOpen(next);

    if (next && !loaded) {
      startTransition(async () => {
        const data = await fetchMyNotifications();
        setItems(data);
        setLoaded(true);
        setUnread(data.filter((n) => !n.read).length);
      });
    }
  }

  async function handleMarkAll() {
    await markAllRead();
    setItems(items.map((n) => ({ ...n, read: true })));
    setUnread(0);
  }

  return (
    <div className="relative">
      <Button variant="outline" size="icon" className="border-border relative" onClick={handleToggle}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-purple-600 text-[10px] text-white flex items-center justify-center">
            {unread}
          </span>
        )}
      </Button>
      {open && (
        <div className="absolute right-0 top-10 w-80 bg-card border border-border rounded-lg shadow-xl z-50">
          <div className="flex items-center justify-between p-3 border-b border-border">
            <span className="font-medium text-sm">Notifications</span>
            {unread > 0 && (
              <button onClick={handleMarkAll} className="text-xs text-purple-400 hover:text-purple-300">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-64 overflow-y-auto">
            {pending && !loaded ? (
              <p className="p-4 text-sm text-muted-foreground">Loading...</p>
            ) : items.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">No notifications</p>
            ) : (
              items.map((n) => (
                <Link
                  key={n.id}
                  href={n.link || "#"}
                  onClick={() => setOpen(false)}
                  className={`block p-3 border-b border-border hover:bg-muted/50 ${!n.read ? "bg-purple-500/5" : ""}`}
                >
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
