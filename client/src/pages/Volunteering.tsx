import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/Layout/Header";
import { LoadingSpinner } from "@/components/Common/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HandHeart, Plus, Clock, Award, Users, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Volunteering } from "@shared/schema";

export default function VolunteeringPage() {
  const [selectedActivity, setSelectedActivity] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: volunteering, isLoading } = useQuery({
    queryKey: ["/api/volunteering"],
  });

  const createVolunteeringMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/volunteering", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/volunteering"] });
      toast({
        title: "Success",
        description: "Volunteering record added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add volunteering record",
        variant: "destructive",
      });
    },
  });

  const getActivityBadge = (activity: string) => {
    const colors = {
      seva: "bg-orange-100 text-orange-800",
      decoration: "bg-pink-100 text-pink-800",
      cooking: "bg-green-100 text-green-800",
      management: "bg-blue-100 text-blue-800",
      teaching: "bg-purple-100 text-purple-800",
      cleanup: "bg-yellow-100 text-yellow-800"
    };
    
    return (
      <Badge className={colors[activity as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {activity}
      </Badge>
    );
  };

  const filteredVolunteering = volunteering?.filter((record: Volunteering) => {
    const recordDate = new Date(record.date);
    const currentDate = new Date();
    
    const matchesActivity = selectedActivity === "all" || record.activityType === selectedActivity;
    
    let matchesMonth = true;
    if (selectedMonth === "current") {
      matchesMonth = recordDate.getMonth() === currentDate.getMonth() &&
                     recordDate.getFullYear() === currentDate.getFullYear();
    } else if (selectedMonth === "last") {
      const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
      matchesMonth = recordDate.getMonth() === lastMonth.getMonth() &&
                     recordDate.getFullYear() === lastMonth.getFullYear();
    }
    
    return matchesActivity && matchesMonth;
  }) || [];

  // Calculate stats
  const totalHours = volunteering?.reduce((sum: number, record: Volunteering) => 
    sum + parseFloat(record.hours), 0
  ) || 0;

  const monthlyHours = volunteering?.filter((record: Volunteering) => {
    const recordDate = new Date(record.date);
    const currentDate = new Date();
    return recordDate.getMonth() === currentDate.getMonth() &&
           recordDate.getFullYear() === currentDate.getFullYear();
  }).reduce((sum: number, record: Volunteering) => 
    sum + parseFloat(record.hours), 0
  ) || 0;

  const activeVolunteers = new Set(volunteering?.map((record: Volunteering) => record.devoteeId)).size || 0;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading volunteering records..." />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header 
        title="Volunteering" 
        subtitle="Track volunteer activities and seva hours"
        actions={
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Log Volunteering
          </Button>
        }
      />
      
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{Math.round(totalHours)}</p>
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <HandHeart className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">{Math.round(monthlyHours)}</p>
                  <p className="text-sm text-muted-foreground">This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Users className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{activeVolunteers}</p>
                  <p className="text-sm text-muted-foreground">Active Volunteers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Activity className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{volunteering?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Records</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Volunteering Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Volunteering Records</CardTitle>
              <div className="flex items-center space-x-4">
                <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    <SelectItem value="seva">Seva</SelectItem>
                    <SelectItem value="decoration">Decoration</SelectItem>
                    <SelectItem value="cooking">Cooking</SelectItem>
                    <SelectItem value="management">Management</SelectItem>
                    <SelectItem value="teaching">Teaching</SelectItem>
                    <SelectItem value="cleanup">Cleanup</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="current">This Month</SelectItem>
                    <SelectItem value="last">Last Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredVolunteering.length === 0 ? (
              <div className="text-center py-12">
                <HandHeart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No volunteering records</h3>
                <p className="text-muted-foreground mb-4">
                  No volunteering records match your current filters.
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Log First Activity
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Volunteer</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Supervisor</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVolunteering.map((record: Volunteering) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          Devotee #{record.devoteeId}
                        </TableCell>
                        <TableCell>
                          {getActivityBadge(record.activityType)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
                            <span className="font-medium">{record.hours}h</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(record.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {record.eventId ? `Event #${record.eventId}` : "General"}
                        </TableCell>
                        <TableCell>
                          {record.supervisorId ? `Mentor #${record.supervisorId}` : "Self-reported"}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {record.description || "No description"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
