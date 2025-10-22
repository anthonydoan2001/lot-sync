import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Pallet, Lot } from "@/types/database.types";
import { PalletCard } from "@/components/PalletCard";
import { LotCard } from "@/components/LotCard";
import { PalletModal } from "@/components/PalletModal";
import { LotModal } from "@/components/LotModal";
import { PalletListView } from "@/components/PalletListView";
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
import { Plus, Search, List, Edit } from "lucide-react";
import { toast } from "sonner";

type PalletCategory = "DESKTOPS" | "LAPTOPS" | "DISPLAYS" | "WORKSTATIONS" | "CHROMEBOOKS" | "OTHER";

const Index = () => {
  const [pallets, setPallets] = useState<Pallet[]>([]);
  const [lots, setLots] = useState<Lot[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"active" | "history">("active");
  const [activeTab, setActiveTab] = useState<"pallets" | "lots">("pallets");
  const [palletViewMode, setPalletViewMode] = useState<"card" | "list">("card");
  
  const [palletModalOpen, setPalletModalOpen] = useState(false);
  const [lotModalOpen, setLotModalOpen] = useState(false);
  const [editingPallet, setEditingPallet] = useState<Pallet | null>(null);
  const [editingLot, setEditingLot] = useState<Lot | null>(null);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingType, setDeletingType] = useState<"pallet" | "lot">("pallet");

  // Helper function to categorize pallets
  const categorizePallet = (pallet: Pallet): PalletCategory => {
    if (!pallet.type) return "OTHER";
    return pallet.type as PalletCategory;
  };

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

  // Define sort orders for each category
  const DESKTOP_SORT_ORDER = ["B/C ↓ 4TH GEN", "B/C 5-7TH GEN", "B/C ↑ 8TH GEN", "D/F", "OTHER"];
  const LAPTOP_SORT_ORDER = ["B/C ↓ 4TH GEN", "B/C ↑ 5TH GEN", "D/F", "OTHER"];
  const DISPLAY_SORT_ORDER = ["B LCD", "CLCD", "OTHER"];
  const CHROMEBOOK_SORT_ORDER = ["B/C MANAGED", "B/C NON-MANAGED", "D", "F", "OTHER"];

  // Function to sort pallets within a category
  const sortPalletsByDescription = (pallets: Pallet[], category: PalletCategory): Pallet[] => {
    let sortOrder: string[] = [];
    
    switch (category) {
      case "DESKTOPS":
        sortOrder = DESKTOP_SORT_ORDER;
        break;
      case "LAPTOPS":
        sortOrder = LAPTOP_SORT_ORDER;
        break;
      case "DISPLAYS":
        sortOrder = DISPLAY_SORT_ORDER;
        break;
      case "CHROMEBOOKS":
        sortOrder = CHROMEBOOK_SORT_ORDER;
        break;
      case "WORKSTATIONS":
      case "OTHER":
        // No specific order, sort by created_at (newest first)
        return [...pallets].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      default:
        return pallets;
    }

    return [...pallets].sort((a, b) => {
      const aGrade = a.grade?.toUpperCase() || "OTHER";
      const bGrade = b.grade?.toUpperCase() || "OTHER";
      
      const aIndex = sortOrder.indexOf(aGrade);
      const bIndex = sortOrder.indexOf(bGrade);
      
      // If both are in the sort order, sort by order
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      
      // If only one is in the sort order, prioritize it
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      
      // If neither is in sort order, sort by created_at (newest first)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  };

  // Group pallets by category
  const categorizedPallets = filteredPallets.reduce((acc, pallet) => {
    const category = categorizePallet(pallet);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(pallet);
    return acc;
  }, {} as Record<PalletCategory, Pallet[]>);

  // Sort pallets within each category
  Object.keys(categorizedPallets).forEach((category) => {
    categorizedPallets[category as PalletCategory] = sortPalletsByDescription(
      categorizedPallets[category as PalletCategory],
      category as PalletCategory
    );
  });

  // Define category order (matching dropdown order)
  const categoryOrder: PalletCategory[] = [
    "DESKTOPS",
    "LAPTOPS",
    "DISPLAYS",
    "WORKSTATIONS",
    "CHROMEBOOKS",
    "OTHER"
  ];

  // Pallet operations
  const handleAddPallet = async (data: Partial<Pallet>) => {
    const { error } = await supabase.from("pallets").insert([data as any]);

    if (error) {
      toast.error("Failed to add pallet");
      console.error(error);
    } else {
      toast.success("Pallet added successfully");
      setPalletModalOpen(false);
      setActiveTab("pallets");
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

  const handleUnretirePallet = async (id: string) => {
    const { error } = await supabase
      .from("pallets")
      .update({ is_retired: false, retired_at: null })
      .eq("id", id);

    if (error) {
      toast.error("Failed to unretire pallet");
      console.error(error);
    } else {
      toast.success("Pallet unretired successfully");
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
      setActiveTab("lots");
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

  const handleUnretireLot = async (id: string) => {
    const { error } = await supabase
      .from("lots")
      .update({ is_retired: false, retired_at: null })
      .eq("id", id);

    if (error) {
      toast.error("Failed to unretire lot");
      console.error(error);
    } else {
      toast.success("Lot unretired successfully");
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
      {palletViewMode === "list" && activeTab === "pallets" ? (
        /* List View - Minimal UI */
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              onClick={() => setPalletViewMode("card")}
              variant="outline"
              size="lg"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Mode
            </Button>
          </div>
          <PalletListView pallets={filteredPallets} />
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="border-b bg-card">
            <div className="container mx-auto px-4 py-6">
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
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="pallets">
                Pallets ({filteredPallets.length})
              </TabsTrigger>
              <TabsTrigger value="lots">
                Lots ({filteredLots.length})
              </TabsTrigger>
            </TabsList>
            
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {activeTab === "pallets" && (
                <Button
                  onClick={() => setPalletViewMode(palletViewMode === "card" ? "list" : "card")}
                  variant="outline"
                  className="flex-shrink-0"
                >
                  {palletViewMode === "card" ? (
                    <>
                      <List className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">List View</span>
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Edit Mode</span>
                    </>
                  )}
                </Button>
              )}
              
              {viewMode === "active" && palletViewMode === "card" && (
                <>
                  <Button
                    onClick={() => {
                      setEditingPallet(null);
                      setPalletModalOpen(true);
                    }}
                    className="bg-secondary hover:bg-secondary/90 flex-shrink-0"
                  >
                    <Plus className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Add Pallet</span>
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingLot(null);
                      setLotModalOpen(true);
                    }}
                    className="bg-secondary hover:bg-secondary/90 flex-shrink-0"
                  >
                    <Plus className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Add Lot</span>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Pallets Tab */}
          <TabsContent value="pallets">
            {filteredPallets.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No pallets found
              </div>
            ) : (
              <div className="space-y-8">
                {categoryOrder.map((category) => {
                  const categoryPallets = categorizedPallets[category];
                  if (!categoryPallets || categoryPallets.length === 0) return null;

                  return (
                    <div key={category} className="space-y-4">
                      <h2 className="text-2xl font-bold text-primary border-b-2 border-border pb-2">
                        {category}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                        {categoryPallets.map((pallet) => (
                          <PalletCard
                            key={pallet.id}
                            pallet={pallet}
                            onEdit={(p) => {
                              setEditingPallet(p);
                              setPalletModalOpen(true);
                            }}
                            onRetire={handleRetirePallet}
                            onUnretire={handleUnretirePallet}
                            onDelete={(id) => {
                              setDeletingId(id);
                              setDeletingType("pallet");
                              setDeleteDialogOpen(true);
                            }}
                            isHistory={viewMode === "history"}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Lots Tab */}
          <TabsContent value="lots">
            {filteredLots.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No lots found
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                {filteredLots.map((lot) => (
                  <LotCard
                    key={lot.id}
                    lot={lot}
                    onEdit={(l) => {
                      setEditingLot(l);
                      setLotModalOpen(true);
                    }}
                    onRetire={handleRetireLot}
                    onUnretire={handleUnretireLot}
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
        </>
      )}

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
