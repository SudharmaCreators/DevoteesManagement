import { Link, useLocation } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { ThemeSelector } from "@/components/Common/ThemeSelector";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Users, 
  Building, 
  Bus, 
  Calendar, 
  Heart, 
  CalendarDays, 
  HandHeart, 
  BarChart3, 
  Settings, 
  PanelTop,
  CreditCard,
  LogOut
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Devotees", href: "/devotees", icon: Users },
  { name: "Families", href: "/families", icon: Building },
  { name: "Mentors", href: "/mentors", icon: Bus },
  { name: "Attendance", href: "/attendance", icon: Calendar },
  { name: "Donations", href: "/donations", icon: Heart },
  { name: "Events", href: "/events", icon: CalendarDays },
  { name: "Volunteering", href: "/volunteering", icon: HandHeart },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Dashboard Designer", href: "/dashboard-designer", icon: PanelTop },
  { name: "ID Card Generator", href: "/id-cards", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();
  const { theme } = useTheme();
  const { user } = useAuth();

  const getNavItemClass = (href: string) => {
    const isActive = location === href;
    const baseClasses = "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200";
    
    if (isActive) {
      return `${baseClasses} bg-primary/10 text-primary font-medium`;
    }
    
    return `${baseClasses} text-muted-foreground hover:bg-muted hover:text-foreground`;
  };

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground text-lg font-bold">॥</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Madhav Parivar</h1>
            <p className="text-xs text-muted-foreground">Database System</p>
          </div>
        </div>
      </div>

      {/* Theme Selector */}
      <div className="p-4 border-b border-border">
        <ThemeSelector />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href}>
              <a className={getNavItemClass(item.href)}>
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </a>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.profileImageUrl} alt={user?.firstName} />
            <AvatarFallback>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {user?.firstName} {user?.lastName}
            </p>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {user?.role}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = "/api/logout"}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
