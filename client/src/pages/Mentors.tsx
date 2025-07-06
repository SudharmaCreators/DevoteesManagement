import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/Layout/Header";
import { LoadingSpinner } from "@/components/Common/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, Bus, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mentor } from "@shared/schema";

export default function Mentors() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: mentors, isLoading } = useQuery({
    queryKey: ["/api/mentors"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/mentors/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mentors"] });
      toast({
        title: "Success",
        description: "Mentor deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete mentor",
        variant: "destructive",
      });
    },
  });

  const filteredMentors = mentors?.filter((mentor: Mentor) =>
    mentor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this mentor?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading mentors..." />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header 
        title="Mentors" 
        subtitle="Manage spiritual mentors and their devotees"
        actions={
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Mentor
          </Button>
        }
      />
      
      <main className="flex-1 overflow-y-auto p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Mentor Directory</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search mentors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredMentors.length === 0 ? (
              <div className="text-center py-12">
                <Bus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No mentors found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "No mentors match your search criteria." : "Start by adding your first mentor."}
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Mentor
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Specialization</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Devotees</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMentors.map((mentor: Mentor) => (
                      <TableRow key={mentor.id}>
                        <TableCell className="font-medium">
                          {mentor.firstName} {mentor.lastName}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {mentor.phone && <div>{mentor.phone}</div>}
                            {mentor.email && <div className="text-muted-foreground">{mentor.email}</div>}
                          </div>
                        </TableCell>
                        <TableCell>
                          {mentor.specialization && (
                            <Badge variant="outline">{mentor.specialization}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {mentor.experience ? `${mentor.experience} years` : "Not specified"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              {mentor.currentDevotees || 0} / {mentor.maxDevotees || 20}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={mentor.isActive ? "default" : "secondary"}>
                            {mentor.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(mentor.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
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
