import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Layout/Header";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { AttendanceChart } from "@/components/Dashboard/AttendanceChart";
import { RecentActivities } from "@/components/Dashboard/RecentActivities";
import { DevoteeProfile } from "@/components/Devotees/DevoteeProfile";
import { GroupManager } from "@/components/Groups/GroupManager";
import { DashboardDesigner } from "@/components/Dashboard/DashboardDesigner";
import { IDCardGenerator } from "@/components/IDCard/IDCardGenerator";
import { LoadingSpinner } from "@/components/Common/LoadingSpinner";
import { Users, Building, Heart, Calendar } from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: devotees } = useQuery({
    queryKey: ["/api/devotees"],
  });

  const { data: groups } = useQuery({
    queryKey: ["/api/groups"],
  });

  if (statsLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const handleGroupActions = {
    onAddGroup: () => console.log("Add group"),
    onEditGroup: (group: any) => console.log("Edit group", group),
    onCreateWhatsAppGroup: (group: any) => {
      if (group.whatsappLink) {
        window.open(group.whatsappLink, '_blank');
      } else {
        alert(`Create WhatsApp group for ${group.name}`);
      }
    },
    onCreateTelegramGroup: (group: any) => {
      if (group.telegramLink) {
        window.open(group.telegramLink, '_blank');
      } else {
        alert(`Create Telegram group for ${group.name}`);
      }
    },
    onSendBulkMessage: (group: any) => {
      alert(`Send bulk message to ${group.name} (${group.currentMembers} members)`);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header 
        title="Dashboard" 
        subtitle="Welcome back, Admin User" 
      />
      
      <main className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Devotees"
            value={stats?.totalDevotees?.toLocaleString() || "0"}
            change={{ value: "+12%", trend: "up" }}
            icon={Users}
            color="from-primary to-secondary"
          />
          <StatsCard
            title="Active Families"
            value={stats?.activeFamilies?.toLocaleString() || "0"}
            change={{ value: "+8%", trend: "up" }}
            icon={Building}
            color="from-blue-500 to-blue-600"
          />
          <StatsCard
            title="Total Donations"
            value={`₹${stats?.totalDonations?.toLocaleString() || "0"}`}
            change={{ value: "+15%", trend: "up" }}
            icon={Heart}
            color="from-green-500 to-green-600"
          />
          <StatsCard
            title="Avg. Attendance"
            value={`${stats?.avgAttendance || 0}%`}
            change={{ value: "-2%", trend: "down" }}
            icon={Calendar}
            color="from-yellow-500 to-yellow-600"
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AttendanceChart />
          <RecentActivities />
        </div>

        {/* Devotee Management Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {devotees && devotees.length > 0 && (
            <DevoteeProfile 
              devotee={devotees[0]} 
              onEdit={() => console.log("Edit devotee")}
            />
          )}
          
          {groups && (
            <GroupManager 
              groups={groups}
              {...handleGroupActions}
            />
          )}
        </div>

        {/* Dashboard Designer Section */}
        <DashboardDesigner />

        {/* ID Card Generation */}
        <IDCardGenerator 
          devotees={devotees || []} 
          onGenerate={(settings) => {
            console.log("Generating ID cards with settings:", settings);
            // In a real implementation, this would call an API to generate PDFs
            alert(`Generating ID cards for ${devotees?.length || 0} devotees`);
          }}
        />
      </main>
    </div>
  );
}
