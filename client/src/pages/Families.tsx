import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/Layout/Header";
import { LoadingSpinner } from "@/components/Common/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Family } from "@shared/schema";

export default function Families() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: families, isLoading } = useQuery({
    queryKey: ["/api/families"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/families/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/families"] });
      toast({
        title: "Success",
        description: "Family deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete family",
        variant: "destructive",
      });
    },
  });

  const filteredFamilies = families?.filter((family: Family) =>
    family.familyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    family.headOfFamily.toLowerCase().includes(searchTerm.toLowerCase()) ||
    family.city?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this family?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading families..." />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header 
        title="Families" 
        subtitle="Manage family information and relationships"
        actions={
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Family
          </Button>
        }
      />
      
      <main className="flex-1 overflow-y-auto p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Family Directory</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search families..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredFamilies.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No families found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "No families match your search criteria." : "Start by adding your first family."}
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Family
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Family Name</TableHead>
                      <TableHead>Head of Family</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFamilies.map((family: Family) => (
                      <TableRow key={family.id}>
                        <TableCell className="font-medium">
                          {family.familyName}
                        </TableCell>
                        <TableCell>{family.headOfFamily}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {family.totalMembers || 0} members
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {family.city && <div>{family.city}</div>}
                            {family.state && <div className="text-muted-foreground">{family.state}</div>}
                          </div>
                        </TableCell>
                        <TableCell>
                          {family.joinDate 
                            ? new Date(family.joinDate).toLocaleDateString()
                            : "Unknown"
                          }
                        </TableCell>
                        <TableCell>
                          <Badge variant={family.isActive ? "default" : "secondary"}>
                            {family.isActive ? "Active" : "Inactive"}
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
                              onClick={() => handleDelete(family.id)}
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
