import { supabase } from "@/integrations/supabase/client";
import { Lot } from "@/types/database.types";
import { toast } from "sonner";

export const lotService = {
  fetchLots: async (isHistory: boolean): Promise<Lot[]> => {
    const { data, error } = await supabase
      .from("lots")
      .select("*")
      .eq("is_retired", isHistory)
      .order(isHistory ? "retired_at" : "created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch lots");
      console.error(error);
      return [];
    }

    return data || [];
  },

  addLot: async (data: Partial<Lot>): Promise<boolean> => {
    const { error } = await supabase.from("lots").insert([data as any]);

    if (error) {
      toast.error("Failed to add lot");
      console.error(error);
      return false;
    }

    toast.success("Lot added successfully");
    return true;
  },

  updateLot: async (id: string, data: Partial<Lot>): Promise<boolean> => {
    const { error } = await supabase.from("lots").update(data).eq("id", id);

    if (error) {
      toast.error("Failed to update lot");
      console.error(error);
      return false;
    }

    toast.success("Lot updated successfully");
    return true;
  },

  retireLot: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from("lots")
      .update({ is_retired: true, retired_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast.error("Failed to retire lot");
      console.error(error);
      return false;
    }

    toast.success("Lot retired successfully");
    return true;
  },

  unretireLot: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from("lots")
      .update({ is_retired: false, retired_at: null })
      .eq("id", id);

    if (error) {
      toast.error("Failed to unretire lot");
      console.error(error);
      return false;
    }

    toast.success("Lot unretired successfully");
    return true;
  },

  deleteLot: async (id: string): Promise<boolean> => {
    const { error } = await supabase.from("lots").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete lot");
      console.error(error);
      return false;
    }

    toast.success("Lot deleted successfully");
    return true;
  },

  subscribeToChanges: (callback: () => void) => {
    const channel = supabase
      .channel("lots-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "lots",
        },
        callback
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};
