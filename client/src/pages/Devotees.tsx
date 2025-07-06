import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/Layout/Header";
import { DevoteeList } from "@/components/Devotees/DevoteeList";
import { DevoteeForm } from "@/components/Devotees/DevoteeForm";
import { DevoteeProfile } from "@/components/Devotees/DevoteeProfile";
import { LoadingSpinner } from "@/components/Common/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Devotee, InsertDevotee } from "@shared/schema";

type ViewMode = "list" | "form" | "profile";

export default function Devotees() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedDevotee, setSelectedDevotee] = useState<Devotee | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [devoteeToDelete, setDevoteeToDelete] = useState<number | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: devotees, isLoading } = useQuery({
    queryKey: ["/api/devotees"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertDevotee) => {
      return await apiRequest("POST", "/api/devotees", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/devotees"] });
      setIsFormOpen(false);
      setSelectedDevotee(null);
      toast({
        title: "Success",
        description: "Devotee created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create devotee",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertDevotee) => {
      if (!selectedDevotee) throw new Error("No devotee selected");
      return await apiRequest("PUT", `/api/devotees/${selectedDevotee.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/devotees"] });
      setIsFormOpen(false);
      setSelectedDevotee(null);
      toast({
        title: "Success",
        description: "Devotee updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update devotee",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/devotees/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/devotees"] });
      setDeleteDialogOpen(false);
      setDevoteeToDelete(null);
      toast({
        title: "Success",
        description: "Devotee deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete devotee",
        variant: "destructive",
      });
    },
  });

  const handleAdd = () => {
    setSelectedDevotee(null);
    setIsFormOpen(true);
  };

  const handleEdit = (devotee: Devotee) => {
    setSelectedDevotee(devotee);
    setIsFormOpen(true);
  };

  const handleView = (devotee: Devotee) => {
    setSelectedDevotee(devotee);
    setIsProfileOpen(true);
  };

  const handleDelete = (id: number) => {
    setDevoteeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = (data: InsertDevotee) => {
    if (selectedDevotee) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const confirmDelete = () => {
    if (devoteeToDelete) {
      deleteMutation.mutate(devoteeToDelete);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading devotees..." />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title="Devotees" subtitle="Manage devotee information and profiles" />
      
      <main className="flex-1 overflow-y-auto p-6">
        <DevoteeList
          devotees={devotees || []}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </main>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedDevotee ? "Edit Devotee" : "Add New Devotee"}
            </DialogTitle>
          </DialogHeader>
          <DevoteeForm
            onSubmit={handleSubmit}
            onCancel={() => setIsFormOpen(false)}
            initialData={selectedDevotee || undefined}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Devotee Profile</DialogTitle>
          </DialogHeader>
          {selectedDevotee && (
            <DevoteeProfile
              devotee={selectedDevotee}
              onEdit={() => {
                setIsProfileOpen(false);
                setIsFormOpen(true);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the devotee
              and remove their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
