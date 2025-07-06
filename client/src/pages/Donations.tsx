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
import { Heart, Plus, IndianRupee, CreditCard, Banknote, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Donation } from "@shared/schema";

export default function Donations() {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: donations, isLoading } = useQuery({
    queryKey: ["/api/donations"],
  });

  const createDonationMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/donations", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/donations"] });
      toast({
        title: "Success",
        description: "Donation recorded successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to record donation",
        variant: "destructive",
      });
    },
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "cash":
        return <Banknote className="w-4 h-4" />;
      case "online":
        return <CreditCard className="w-4 h-4" />;
      case "cheque":
        return <CreditCard className="w-4 h-4" />;
      case "kind":
        return <Gift className="w-4 h-4" />;
      default:
        return <IndianRupee className="w-4 h-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      cash: "bg-green-100 text-green-800",
      online: "bg-blue-100 text-blue-800",
      cheque: "bg-purple-100 text-purple-800",
      kind: "bg-orange-100 text-orange-800"
    };
    
    return (
      <Badge className={colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {getTypeIcon(type)}
        <span className="ml-1 capitalize">{type}</span>
      </Badge>
    );
  };

  const filteredDonations = donations?.filter((donation: Donation) => {
    const matchesType = selectedType === "all" || donation.donationType === selectedType;
    const matchesPayment = selectedPayment === "all" || donation.paymentMethod === selectedPayment;
    return matchesType && matchesPayment;
  }) || [];

  const totalDonations = donations?.reduce((sum: number, donation: Donation) => 
    sum + parseFloat(donation.amount), 0
  ) || 0;

  const monthlyDonations = donations?.filter((donation: Donation) => {
    const donationDate = new Date(donation.date);
    const currentDate = new Date();
    return donationDate.getMonth() === currentDate.getMonth() &&
           donationDate.getFullYear() === currentDate.getFullYear();
  }).reduce((sum: number, donation: Donation) => 
    sum + parseFloat(donation.amount), 0
  ) || 0;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading donations..." />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header 
        title="Donations" 
        subtitle="Track and manage donations"
        actions={
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Record Donation
          </Button>
        }
      />
      
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <IndianRupee className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">₹{totalDonations.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Donations</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Heart className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">₹{monthlyDonations.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Gift className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{donations?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Records</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Donations Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Donation Records</CardTitle>
              <div className="flex items-center space-x-4">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="kind">In Kind</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedPayment} onValueChange={setSelectedPayment}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="netbanking">Net Banking</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredDonations.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No donations found</h3>
                <p className="text-muted-foreground mb-4">
                  No donation records match your current filters.
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Record First Donation
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Devotee</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Receipt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDonations.map((donation: Donation) => (
                      <TableRow key={donation.id}>
                        <TableCell className="font-medium">
                          {donation.isAnonymous ? "Anonymous" : `Devotee #${donation.devoteeId}`}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <IndianRupee className="w-4 h-4 mr-1" />
                            <span className="font-medium">₹{parseFloat(donation.amount).toLocaleString()}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getTypeBadge(donation.donationType)}
                        </TableCell>
                        <TableCell>
                          <span className="capitalize">{donation.paymentMethod || "Not specified"}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{donation.purpose || "General"}</span>
                        </TableCell>
                        <TableCell>
                          {new Date(donation.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {donation.receiptNumber ? (
                            <Badge variant="outline">#{donation.receiptNumber}</Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">No receipt</span>
                          )}
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
