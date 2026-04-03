import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, User, LogOut, Heart, Droplets, Loader2 } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

interface Notification {
  _id: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface DashboardHeaderProps {
  notifications: Notification[];
}

const DashboardHeader = ({ notifications }: DashboardHeaderProps) => {
  const { activeRole, switchRole, logout, isSwitching } = useAuth();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const profilePath = activeRole === "donor" ? "/donor-profile" : "/recipient-profile";

  return (
    <header className="bg-background border-b border-border/50 sticky top-0 z-40">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-heading font-semibold text-lg">LifeSource</Link>

        {/* Role Switcher */}
        <div className="flex items-center gap-1 bg-muted rounded-full p-0.5">
          <button
            onClick={() => switchRole("donor")}
            disabled={isSwitching}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeRole === "donor"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {isSwitching && activeRole !== "donor" ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Heart className="w-3 h-3" />
            )}
            Donor
          </button>
          <button
            onClick={() => switchRole("recipient")}
            disabled={isSwitching}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeRole === "recipient"
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {isSwitching && activeRole !== "recipient" ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Droplets className="w-3 h-3" />
            )}
            Recipient
          </button>
        </div>

        <div className="flex items-center gap-1">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="font-heading font-semibold text-sm">Notifications</span>
              </div>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <div className="px-3 py-4 text-center text-sm text-muted-foreground">No notifications yet</div>
              ) : (
                notifications.slice(0, 10).map((n) => (
                  <DropdownMenuItem key={n._id} className={`flex flex-col items-start gap-0.5 px-3 py-2 ${!n.read ? "bg-primary/5" : ""}`}>
                    <span className="text-sm">{n.message}</span>
                    <span className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</span>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" asChild>
            <Link to={profilePath}><User className="w-4 h-4" /></Link>
          </Button>

          <Button onClick={logout} variant="ghost" size="sm" className="text-muted-foreground">
            <LogOut className="w-4 h-4 mr-1" /> Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
