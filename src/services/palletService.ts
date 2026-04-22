import { supabase } from "@/integrations/supabase/client";
import { Pallet } from "@/types/database.types";
import { toast } from "sonner";

export const palletService = {
  fetchPallets: async (isHistory: boolean): Promise<Pallet[]> => {
    const { data, error } = await supabase
      .from("pallets")
      .select("*")
      .eq("is_retired", isHistory)
      .order(isHistory ? "retired_at" : "created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch pallets");
      console.error(error);
      return [];
    }

    return data || [];
  },

  addPallet: async (data: Partial<Pallet>): Promise<boolean> => {
    const { error } = await supabase.from("pallets").insert([data as any]);

    if (error) {
      toast.error("Failed to add pallet");
      console.error(error);
      return false;
    }

    toast.success("Pallet added successfully");
    return true;
  },

  updatePallet: async (id: string, data: Partial<Pallet>): Promise<boolean> => {
    const { error } = await supabase.from("pallets").update(data).eq("id", id);

    if (error) {
      toast.error("Failed to update pallet");
      console.error(error);
      return false;
    }

    toast.success("Pallet updated successfully");
    return true;
  },

  retirePallet: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from("pallets")
      .update({ is_retired: true, retired_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast.error("Failed to retire pallet");
      console.error(error);
      return false;
    }

    toast.success("Pallet retired successfully");
    return true;
  },

  unretirePallet: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from("pallets")
      .update({ is_retired: false, retired_at: null })
      .eq("id", id);

    if (error) {
      toast.error("Failed to unretire pallet");
      console.error(error);
      return false;
    }

    toast.success("Pallet unretired successfully");
    return true;
  },

  deletePallet: async (id: string): Promise<boolean> => {
    const { error } = await supabase.from("pallets").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete pallet");
      console.error(error);
      return false;
    }

    toast.success("Pallet deleted successfully");
    return true;
  },

  subscribeToChanges: (callback: () => void) => {
    const channel = supabase
      .channel("pallets-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pallets",
        },
        callback
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};
