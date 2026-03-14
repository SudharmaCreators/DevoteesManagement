import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { Bell, Check, CheckCheck, Trash2, AlertTriangle, Info, CheckCircle, XCircle, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
    case 'success': return <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />;
    case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />;
    case 'error': return <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />;
    default: return <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />;
  }
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  const { user } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/notifications"] }),
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

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diff < 1) return 'just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
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
              <div className="absolute right-0 top-10 w-96 bg-card border border-border rounded-lg shadow-xl z-50">
                <div className="flex items-center justify-between p-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="text-xs px-1.5 py-0">{unreadCount}</Badge>
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

                <ScrollArea className="max-h-80">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground text-sm">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      No notifications
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {notifications.map((n: Notification) => (
                        <div
                          key={n.id}
                          className={`p-3 hover:bg-muted/50 transition-colors ${!n.isRead ? 'bg-primary/5' : ''}`}
                        >
                          <div className="flex gap-2.5 items-start">
                            <NotificationIcon type={n.type} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-1">
                                <p className={`text-sm font-medium truncate ${!n.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                                  {n.title}
                                </p>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">{formatTime(n.createdAt)}</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                              <div className="flex gap-1 mt-1.5">
                                {!n.isRead && (
                                  <button
                                    onClick={() => markReadMutation.mutate(n.id)}
                                    className="text-xs text-primary hover:underline flex items-center gap-0.5"
                                  >
                                    <Check className="w-3 h-3" /> Mark read
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteMutation.mutate(n.id)}
                                  className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-0.5 ml-auto"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
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
