import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Edit, Trash2, Plus, Eye } from "lucide-react";
import { Devotee } from "@shared/schema";

interface DevoteeListProps {
  devotees: Devotee[];
  onEdit: (devotee: Devotee) => void;
  onDelete: (id: number) => void;
  onView: (devotee: Devotee) => void;
  onAdd: () => void;
  isLoading?: boolean;
}

export function DevoteeList({ 
  devotees, 
  onEdit, 
  onDelete, 
  onView, 
  onAdd, 
  isLoading 
}: DevoteeListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDevotees = devotees.filter(devotee =>
    devotee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    devotee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    devotee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    devotee.devoteeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Devotees</CardTitle>
          <Button onClick={onAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Devotee
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search devotees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading devotees...</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profile</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevotees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      {searchTerm ? "No devotees match your search." : "No devotees found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDevotees.map((devotee) => (
                    <TableRow key={devotee.id}>
                      <TableCell>
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={devotee.profileImageUrl || ""} alt={`${devotee.firstName} ${devotee.lastName}`} />
                          <AvatarFallback>
                            {devotee.firstName?.[0]}{devotee.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {devotee.firstName} {devotee.lastName}
                      </TableCell>
                      <TableCell>{devotee.devoteeId}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {devotee.phone && <div>{devotee.phone}</div>}
                          {devotee.email && <div className="text-muted-foreground">{devotee.email}</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {devotee.city && <div>{devotee.city}</div>}
                          {devotee.state && <div className="text-muted-foreground">{devotee.state}</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={devotee.isActive ? "default" : "secondary"}>
                          {devotee.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onView(devotee)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(devotee)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(devotee.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
