import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { Bell, Check, CheckCheck, Trash2, AlertTriangle, Info, CheckCircle, XCircle, X, Pin, PinOff } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  relatedEntity?: string;
  createdAt: string;
}

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

function NotificationIcon({ type }: { type: string }) {
  switch (type) {
    case 'success': return <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />;
    case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />;
    case 'error': return <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />;
    default: return <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />;
  }
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  const { user } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [pinnedIds, setPinnedIds] = useState<Set<number>>(new Set());
  const panelRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
    refetchInterval: 30000,
  });

  const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;

  const markReadMutation = useMutation({
    mutationFn: async (id: number) => apiRequest("PUT", `/api/notifications/${id}/read`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/notifications"] }),
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => apiRequest("PUT", "/api/notifications/read-all", {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/notifications"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => apiRequest("DELETE", `/api/notifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      setPinnedIds(prev => { const s = new Set(prev); s.delete(id); return s; });
    },
  });

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [notifOpen]);

  const togglePin = (id: number) => {
    setPinnedIds(prev => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id); else s.add(id);
      return s;
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diff < 1) return 'just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  const sortedNotifications = [...notifications].sort((a, b) => {
    const aPinned = pinnedIds.has(a.id) ? 0 : 1;
    const bPinned = pinnedIds.has(b.id) ? 0 : 1;
    return aPinned - bPinned;
  });

  const typeColor: Record<string, string> = {
    success: "border-l-green-400",
    warning: "border-l-yellow-400",
    error: "border-l-red-400",
    info: "border-l-blue-400",
  };

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {actions}
          
          {/* Notifications Bell */}
          <div className="relative" ref={panelRef}>
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => setNotifOpen(!notifOpen)}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>

            {notifOpen && (
              <div className="absolute right-0 top-10 w-96 bg-card border border-border rounded-lg shadow-xl z-50 flex flex-col" style={{ maxHeight: '520px' }}>
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b border-border flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="text-xs px-1.5 py-0">{unreadCount}</Badge>
                    )}
                    {pinnedIds.size > 0 && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0 text-amber-600 border-amber-300">
                        <Pin className="w-2.5 h-2.5 mr-0.5" />{pinnedIds.size} pinned
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {unreadCount > 0 && (
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => markAllReadMutation.mutate()}>
                        <CheckCheck className="w-3 h-3 mr-1" /> Mark all read
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setNotifOpen(false)}>
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Scrollable notifications list */}
                <ScrollArea className="flex-1 overflow-y-auto" style={{ maxHeight: '440px' }}>
                  {sortedNotifications.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground text-sm">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      No notifications
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {sortedNotifications.map((n: Notification) => {
                        const isPinned = pinnedIds.has(n.id);
                        return (
                          <div
                            key={n.id}
                            className={`p-3 hover:bg-muted/50 transition-colors border-l-4 ${typeColor[n.type] || 'border-l-border'} ${!n.isRead ? 'bg-primary/5' : ''} ${isPinned ? 'bg-amber-50/50 dark:bg-amber-900/10' : ''}`}
                          >
                            <div className="flex gap-2.5 items-start">
                              <NotificationIcon type={n.type} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <p className={`text-sm font-medium leading-tight ${!n.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                                      {n.title}
                                    </p>
                                    {isPinned && <Pin className="w-3 h-3 text-amber-500 flex-shrink-0" />}
                                  </div>
                                  <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">{formatTime(n.createdAt)}</span>
                                </div>
                                {/* word-wrap enabled — no truncation */}
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed break-words whitespace-pre-wrap">{n.message}</p>
                                {n.relatedEntity && (
                                  <p className="text-xs text-primary/70 mt-0.5 italic">{n.relatedEntity}</p>
                                )}
                                <div className="flex gap-1 mt-2 flex-wrap">
                                  {!n.isRead && (
                                    <button
                                      onClick={() => markReadMutation.mutate(n.id)}
                                      className="text-xs text-primary hover:underline flex items-center gap-0.5"
                                    >
                                      <Check className="w-3 h-3" /> Mark read
                                    </button>
                                  )}
                                  <button
                                    onClick={() => togglePin(n.id)}
                                    className={`text-xs flex items-center gap-0.5 ml-1 ${isPinned ? 'text-amber-600 hover:text-amber-700' : 'text-muted-foreground hover:text-foreground'}`}
                                    title={isPinned ? "Unpin" : "Pin to top"}
                                  >
                                    {isPinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
                                    {isPinned ? "Unpin" : "Pin"}
                                  </button>
                                  <button
                                    onClick={() => deleteMutation.mutate(n.id)}
                                    className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-0.5 ml-auto"
                                    title="Delete notification"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
