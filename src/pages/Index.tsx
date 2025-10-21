import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Pallet, Lot } from "@/types/database.types";
import { PalletCard } from "@/components/PalletCard";
import { LotCard } from "@/components/LotCard";
import { PalletModal } from "@/components/PalletModal";
import { LotModal } from "@/components/LotModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [pallets, setPallets] = useState<Pallet[]>([]);
  const [lots, setLots] = useState<Lot[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"active" | "history">("active");
  const [activeTab, setActiveTab] = useState<"pallets" | "lots">("pallets");
  
  const [palletModalOpen, setPalletModalOpen] = useState(false);
  const [lotModalOpen, setLotModalOpen] = useState(false);
  const [editingPallet, setEditingPallet] = useState<Pallet | null>(null);
  const [editingLot, setEditingLot] = useState<Lot | null>(null);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingType, setDeletingType] = useState<"pallet" | "lot">("pallet");

  // Fetch pallets
  const fetchPallets = async () => {
    const { data, error } = await supabase
      .from("pallets")
      .select("*")
      .eq("is_retired", viewMode === "history")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch pallets");
      console.error(error);
    } else {
      setPallets(data || []);
    }
  };

  // Fetch lots
  const fetchLots = async () => {
    const { data, error } = await supabase
      .from("lots")
      .select("*")
      .eq("is_retired", viewMode === "history")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch lots");
      console.error(error);
    } else {
      setLots(data || []);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPallets();
    fetchLots();
  }, [viewMode]);

  // Real-time subscriptions
  useEffect(() => {
    const palletChannel = supabase
      .channel("pallets-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pallets",
        },
        () => {
          fetchPallets();
        }
      )
      .subscribe();

    const lotChannel = supabase
      .channel("lots-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "lots",
        },
        () => {
          fetchLots();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(palletChannel);
      supabase.removeChannel(lotChannel);
    };
  }, [viewMode]);

  // Filter data based on search
  const filteredPallets = pallets.filter((pallet) =>
    pallet.pallet_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLots = lots.filter((lot) =>
    lot.lot_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pallet operations
  const handleAddPallet = async (data: Partial<Pallet>) => {
    const { error } = await supabase.from("pallets").insert([data as any]);

    if (error) {
      toast.error("Failed to add pallet");
      console.error(error);
    } else {
      toast.success("Pallet added successfully");
      setPalletModalOpen(false);
    }
  };

  const handleEditPallet = async (data: Partial<Pallet>) => {
    if (!editingPallet) return;

    const { error } = await supabase
      .from("pallets")
      .update(data)
      .eq("id", editingPallet.id);

    if (error) {
      toast.error("Failed to update pallet");
      console.error(error);
    } else {
      toast.success("Pallet updated successfully");
      setPalletModalOpen(false);
      setEditingPallet(null);
    }
  };

  const handleRetirePallet = async (id: string) => {
    const { error } = await supabase
      .from("pallets")
      .update({ is_retired: true, retired_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast.error("Failed to retire pallet");
      console.error(error);
    } else {
      toast.success("Pallet retired successfully");
    }
  };

  const handleDeletePallet = async () => {
    if (!deletingId) return;

    const { error } = await supabase.from("pallets").delete().eq("id", deletingId);

    if (error) {
      toast.error("Failed to delete pallet");
      console.error(error);
    } else {
      toast.success("Pallet deleted successfully");
    }

    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  // Lot operations
  const handleAddLot = async (data: Partial<Lot>) => {
    const { error } = await supabase.from("lots").insert([data as any]);

    if (error) {
      toast.error("Failed to add lot");
      console.error(error);
    } else {
      toast.success("Lot added successfully");
      setLotModalOpen(false);
    }
  };

  const handleEditLot = async (data: Partial<Lot>) => {
    if (!editingLot) return;

    const { error } = await supabase
      .from("lots")
      .update(data)
      .eq("id", editingLot.id);

    if (error) {
      toast.error("Failed to update lot");
      console.error(error);
    } else {
      toast.success("Lot updated successfully");
      setLotModalOpen(false);
      setEditingLot(null);
    }
  };

  const handleRetireLot = async (id: string) => {
    const { error } = await supabase
      .from("lots")
      .update({ is_retired: true, retired_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast.error("Failed to retire lot");
      console.error(error);
    } else {
      toast.success("Lot retired successfully");
    }
  };

  const handleDeleteLot = async () => {
    if (!deletingId) return;

    const { error } = await supabase.from("lots").delete().eq("id", deletingId);

    if (error) {
      toast.error("Failed to delete lot");
      console.error(error);
    } else {
      toast.success("Lot deleted successfully");
    }

    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Warehouse Management System
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={viewMode === "active" ? "default" : "outline"}
                onClick={() => setViewMode("active")}
              >
                Active
              </Button>
              <Button
                variant={viewMode === "history" ? "default" : "outline"}
                onClick={() => setViewMode("history")}
              >
                History
              </Button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "pallets" | "lots")}>
          <TabsList className="mb-6">
            <TabsTrigger value="pallets">
              Pallets ({filteredPallets.length})
            </TabsTrigger>
            <TabsTrigger value="lots">
              Lots ({filteredLots.length})
            </TabsTrigger>
          </TabsList>

          {/* Pallets Tab */}
          <TabsContent value="pallets">
            <div className="mb-6 flex gap-2">
              {viewMode === "active" && (
                <>
                  <Button
                    onClick={() => {
                      setEditingPallet(null);
                      setPalletModalOpen(true);
                    }}
                    className="bg-secondary hover:bg-secondary/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Pallet
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingLot(null);
                      setLotModalOpen(true);
                    }}
                    className="bg-secondary hover:bg-secondary/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Lot
                  </Button>
                </>
              )}
            </div>

            {filteredPallets.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No pallets found
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPallets.map((pallet) => (
                  <PalletCard
                    key={pallet.id}
                    pallet={pallet}
                    onEdit={(p) => {
                      setEditingPallet(p);
                      setPalletModalOpen(true);
                    }}
                    onRetire={handleRetirePallet}
                    onDelete={(id) => {
                      setDeletingId(id);
                      setDeletingType("pallet");
                      setDeleteDialogOpen(true);
                    }}
                    isHistory={viewMode === "history"}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Lots Tab */}
          <TabsContent value="lots">
            <div className="mb-6 flex gap-2">
              {viewMode === "active" && (
                <>
                  <Button
                    onClick={() => {
                      setEditingPallet(null);
                      setPalletModalOpen(true);
                    }}
                    className="bg-secondary hover:bg-secondary/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Pallet
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingLot(null);
                      setLotModalOpen(true);
                    }}
                    className="bg-secondary hover:bg-secondary/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Lot
                  </Button>
                </>
              )}
            </div>

            {filteredLots.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No lots found
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLots.map((lot) => (
                  <LotCard
                    key={lot.id}
                    lot={lot}
                    onEdit={(l) => {
                      setEditingLot(l);
                      setLotModalOpen(true);
                    }}
                    onRetire={handleRetireLot}
                    onDelete={(id) => {
                      setDeletingId(id);
                      setDeletingType("lot");
                      setDeleteDialogOpen(true);
                    }}
                    isHistory={viewMode === "history"}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Modals */}
      <PalletModal
        open={palletModalOpen}
        onClose={() => {
          setPalletModalOpen(false);
          setEditingPallet(null);
        }}
        onSubmit={editingPallet ? handleEditPallet : handleAddPallet}
        pallet={editingPallet}
      />

      <LotModal
        open={lotModalOpen}
        onClose={() => {
          setLotModalOpen(false);
          setEditingLot(null);
        }}
        onSubmit={editingLot ? handleEditLot : handleAddLot}
        lot={editingLot}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the{" "}
              {deletingType}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deletingType === "pallet" ? handleDeletePallet : handleDeleteLot}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
