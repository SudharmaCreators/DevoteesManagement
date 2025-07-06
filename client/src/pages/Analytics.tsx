import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Layout/Header";
import { LoadingSpinner } from "@/components/Common/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { TrendingUp, Users, Heart, Calendar, Activity } from "lucide-react";

// Sample data - in a real app, this would come from the API
const attendanceData = [
  { month: 'Jan', attendance: 85 },
  { month: 'Feb', attendance: 92 },
  { month: 'Mar', attendance: 78 },
  { month: 'Apr', attendance: 89 },
  { month: 'May', attendance: 95 },
  { month: 'Jun', attendance: 87 },
];

const donationData = [
  { month: 'Jan', amount: 45000 },
  { month: 'Feb', amount: 52000 },
  { month: 'Mar', amount: 38000 },
  { month: 'Apr', amount: 61000 },
  { month: 'May', amount: 55000 },
  { month: 'Jun', amount: 67000 },
];

const eventTypeData = [
  { name: 'Satsang', value: 40, color: '#8884d8' },
  { name: 'Festival', value: 30, color: '#82ca9d' },
  { name: 'Workshop', value: 20, color: '#ffc658' },
  { name: 'Meeting', value: 10, color: '#ff7300' },
];

const ageGroupData = [
  { group: '18-25', count: 245 },
  { group: '26-35', count: 387 },
  { group: '36-45', count: 523 },
  { group: '46-55', count: 456 },
  { group: '56+', count: 234 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

export default function Analytics() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">+12%</p>
                  <p className="text-sm text-muted-foreground">Growth Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{stats?.totalDevotees || 0}</p>
                  <p className="text-sm text-muted-foreground">Active Devotees</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Heart className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">₹{stats?.totalDonations?.toLocaleString() || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Donations</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Activity className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{stats?.avgAttendance || 0}%</p>
                  <p className="text-sm text-muted-foreground">Avg Attendance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, 'Attendance']} />
                  <Line 
                    type="monotone" 
                    dataKey="attendance" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Donation Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Donation Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={donationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value?.toLocaleString()}`, 'Donations']} />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Event Types Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Event Types Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={eventTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {eventTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Age Group Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Age Group Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ageGroupData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="group" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}`, 'Count']} />
                  <Bar dataKey="count" fill="hsl(var(--secondary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Regions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { region: "Delhi", percentage: 92 },
                  { region: "Mumbai", percentage: 88 },
                  { region: "Bangalore", percentage: 85 },
                  { region: "Pune", percentage: 82 },
                  { region: "Chennai", percentage: 79 },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.region}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { activity: "New devotee joined", time: "2 hours ago", type: "positive" },
                  { activity: "Festival celebration completed", time: "1 day ago", type: "positive" },
                  { activity: "Workshop scheduled", time: "2 days ago", type: "neutral" },
                  { activity: "Attendance goal achieved", time: "3 days ago", type: "positive" },
                  { activity: "Monthly report generated", time: "1 week ago", type: "neutral" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      item.type === "positive" ? "bg-green-500" : "bg-blue-500"
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.activity}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="font-medium text-sm">Export Monthly Report</div>
                  <div className="text-xs text-muted-foreground">Download attendance and donation summary</div>
                </button>
                <button className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="font-medium text-sm">Schedule Event</div>
                  <div className="text-xs text-muted-foreground">Plan upcoming satsang or festival</div>
                </button>
                <button className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="font-medium text-sm">Send Notifications</div>
                  <div className="text-xs text-muted-foreground">Bulk message to devotee groups</div>
                </button>
                <button className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="font-medium text-sm">Generate ID Cards</div>
                  <div className="text-xs text-muted-foreground">Create cards for new devotees</div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
