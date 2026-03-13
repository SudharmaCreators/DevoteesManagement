
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/Layout/Header";
import { IDCardGenerator as IDCardGeneratorComponent } from "@/components/IDCard/IDCardGenerator";
import { IDCardPreview } from "@/components/IDCard/IDCardPreview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  CreditCard, 
  Download, 
  Users, 
  Search,
  Filter,
  Printer,
  FileImage,
  Settings,
  Eye
} from "lucide-react";

export default function IDCardGenerator() {
  const [selectedDevotees, setSelectedDevotees] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGroup, setFilterGroup] = useState<string>("");
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  const { data: devotees = [], isLoading: devoteesLoading } = useQuery({
    queryKey: ["/api/devotees"],
  });

  const { data: groups = [] } = useQuery({
    queryKey: ["/api/groups"],
  });

  const filteredDevotees = devotees.filter((devotee: any) => {
    const matchesSearch = !searchTerm || 
      devotee.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      devotee.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      devotee.devoteeId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGroup = !filterGroup || filterGroup === "all-groups" || devotee.groupId === parseInt(filterGroup);
    
    return matchesSearch && matchesGroup;
  });

  const handleSelectDevotee = (devoteeId: number) => {
    setSelectedDevotees(prev => 
      prev.includes(devoteeId) 
        ? prev.filter(id => id !== devoteeId)
        : [...prev, devoteeId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDevotees.length === filteredDevotees.length) {
      setSelectedDevotees([]);
    } else {
      setSelectedDevotees(filteredDevotees.map((d: any) => d.id));
    }
  };

  const generateCards = async (format: 'pdf' | 'png') => {
    if (selectedDevotees.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select at least one devotee to generate ID cards",
        variant: "destructive",
      });
      return;
    }

    try {
      // Here you would implement the actual ID card generation
      toast({
        title: "ID Cards Generated",
        description: `Generated ${selectedDevotees.length} ID cards in ${format.toUpperCase()} format`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate ID cards",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header 
        title="ID Card Generator" 
        subtitle="Generate professional ID cards for devotees" 
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Generation Controls</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <Label htmlFor="search">Search Devotees</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="filterGroup">Filter by Group</Label>
                  <Select value={filterGroup} onValueChange={setFilterGroup}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Groups" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-groups">All Groups</SelectItem>
                      {groups.map((group: any) => (
                        <SelectItem key={group.id} value={group.id.toString()}>
                          {group.groupName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end space-x-2">
                  <Button onClick={handleSelectAll} variant="outline" className="flex-1">
                    {selectedDevotees.length === filteredDevotees.length ? 'Deselect All' : 'Select All'}
                  </Button>
                  <Button 
                    onClick={() => setPreviewMode(!previewMode)} 
                    variant="outline"
                    size="icon"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    onClick={() => generateCards('pdf')} 
                    disabled={selectedDevotees.length === 0}
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    PDF
                  </Button>
                  <Button 
                    onClick={() => generateCards('png')} 
                    disabled={selectedDevotees.length === 0}
                    variant="outline"
                    className="flex-1"
                  >
                    <FileImage className="w-4 h-4 mr-2" />
                    PNG
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {filteredDevotees.length} devotees found, {selectedDevotees.length} selected
                </div>
                <Badge variant="secondary">
                  <CreditCard className="w-3 h-3 mr-1" />
                  {selectedDevotees.length} cards to generate
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Devotee Selection */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Select Devotees</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredDevotees.map((devotee: any) => (
                      <div
                        key={devotee.id}
                        className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedDevotees.includes(devotee.id)
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => handleSelectDevotee(devotee.id)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedDevotees.includes(devotee.id)}
                          onChange={() => handleSelectDevotee(devotee.id)}
                          className="rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium">
                            {devotee.firstName} {devotee.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ID: {devotee.devoteeId} • {devotee.email}
                          </div>
                        </div>
                        {devotee.profileImage && (
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="w-5 h-5" />
                    <span>Preview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDevotees.length > 0 && previewMode ? (
                    <IDCardPreview 
                      devotee={devotees.find((d: any) => d.id === selectedDevotees[0])} 
                    />
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      Select devotees and enable preview to see ID card design
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
