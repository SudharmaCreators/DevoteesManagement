import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Layout/Header";
import { LoadingSpinner } from "@/components/Common/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { TrendingUp, Users, Heart, Calendar, Activity, Download, Bell, CreditCard, Clock } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#a4de6c', '#d0ed57'];

export default function Analytics() {
  const [, navigate] = useLocation();
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["/api/analytics"],
  });
  const { data: devotees = [] } = useQuery({ queryKey: ["/api/devotees"] });
  const { data: events = [] } = useQuery({ queryKey: ["/api/events"] });

  const stats = (analytics as any)?.stats;
  const donationTrends: Array<{month: string; amount: number}> = (analytics as any)?.donationTrends || [];
  const attendanceTrends: Array<{month: string; present: number; absent: number}> = (analytics as any)?.attendanceTrends || [];
  const volunteeringStats: Array<{activity: string; hours: number}> = (analytics as any)?.volunteeringStats || [];

  // Build event type pie data from actual events
  const eventTypeCounts: Record<string, number> = {};
  (events as any[]).forEach((e: any) => {
    const type = e.eventType || "Other";
    eventTypeCounts[type] = (eventTypeCounts[type] || 0) + 1;
  });
  const eventTypeData = Object.entries(eventTypeCounts).map(([name, value]) => ({ name, value }));

  // Build age group data from devotees
  const ageBuckets: Record<string, number> = { '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, '56+': 0 };
  (devotees as any[]).forEach((d: any) => {
    if (d.dateOfBirth) {
      const age = Math.floor((Date.now() - new Date(d.dateOfBirth).getTime()) / (365.25 * 24 * 3600 * 1000));
      if (age <= 25) ageBuckets['18-25']++;
      else if (age <= 35) ageBuckets['26-35']++;
      else if (age <= 45) ageBuckets['36-45']++;
      else if (age <= 55) ageBuckets['46-55']++;
      else ageBuckets['56+']++;
    }
  });
  const ageGroupData = Object.entries(ageBuckets).map(([group, count]) => ({ group, count }));

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading analytics..." />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header 
        title="Analytics" 
        subtitle="Insights and reports for your organization"
        actions={
          <Select defaultValue="6months">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        }
      />
      
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="pt-5 pb-4"><div className="flex items-center gap-3"><Users className="w-8 h-8 text-blue-600" /><div><p className="text-2xl font-bold">{stats?.totalDevotees || 0}</p><p className="text-xs text-muted-foreground">Total Devotees</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-5 pb-4"><div className="flex items-center gap-3"><Heart className="w-8 h-8 text-red-500" /><div><p className="text-2xl font-bold">₹{(stats?.totalDonations || 0).toLocaleString('en-IN')}</p><p className="text-xs text-muted-foreground">Total Donations</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-5 pb-4"><div className="flex items-center gap-3"><Activity className="w-8 h-8 text-purple-600" /><div><p className="text-2xl font-bold">{stats?.avgAttendance || 0}%</p><p className="text-xs text-muted-foreground">Avg Attendance</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-5 pb-4"><div className="flex items-center gap-3"><Calendar className="w-8 h-8 text-green-600" /><div><p className="text-2xl font-bold">{stats?.activeFamilies || 0}</p><p className="text-xs text-muted-foreground">Active Families</p></div></div></CardContent></Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Trends */}
          <Card>
            <CardHeader><CardTitle>Attendance Trends</CardTitle></CardHeader>
            <CardContent>
              {attendanceTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={attendanceTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="present" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} name="Present" />
                    <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="Absent" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center"><Activity className="w-12 h-12 mx-auto mb-2 opacity-30" /><p>No attendance data yet</p></div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Donation Trends */}
          <Card>
            <CardHeader><CardTitle>Donation Trends</CardTitle></CardHeader>
            <CardContent>
              {donationTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={donationTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Amount']} />
                    <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center"><Heart className="w-12 h-12 mx-auto mb-2 opacity-30" /><p>No donation data yet</p></div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Event Types Distribution */}
          <Card>
            <CardHeader><CardTitle>Event Types Distribution</CardTitle></CardHeader>
            <CardContent>
              {eventTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={eventTypeData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {eventTypeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center"><Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" /><p>No events data yet</p></div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Volunteering Hours by Activity */}
          <Card>
            <CardHeader><CardTitle>Volunteering Hours by Activity</CardTitle></CardHeader>
            <CardContent>
              {volunteeringStats.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={volunteeringStats} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="activity" tick={{ fontSize: 11 }} width={90} />
                    <Tooltip formatter={(v: any) => [`${v}h`, 'Hours']} />
                    <Bar dataKey="hours" fill="hsl(var(--secondary))" radius={[0, 3, 3, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : ageGroupData.some(a => a.count > 0) ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={ageGroupData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="group" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v: any) => [`${v}`, 'Devotees']} />
                    <Bar dataKey="count" fill="hsl(var(--secondary))" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center"><TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-30" /><p>No data yet</p></div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" className="h-auto py-3 flex-col gap-1.5" onClick={() => navigate("/events")}>
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-xs font-medium">Schedule Event</span>
              </Button>
              <Button variant="outline" className="h-auto py-3 flex-col gap-1.5" onClick={() => navigate("/id-cards")}>
                <CreditCard className="w-5 h-5 text-primary" />
                <span className="text-xs font-medium">Generate ID Cards</span>
              </Button>
              <Button variant="outline" className="h-auto py-3 flex-col gap-1.5" onClick={() => navigate("/donations")}>
                <Heart className="w-5 h-5 text-primary" />
                <span className="text-xs font-medium">Record Donation</span>
              </Button>
              <Button variant="outline" className="h-auto py-3 flex-col gap-1.5" onClick={() => navigate("/devotees")}>
                <Users className="w-5 h-5 text-primary" />
                <span className="text-xs font-medium">Manage Devotees</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
