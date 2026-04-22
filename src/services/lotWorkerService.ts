import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/database.types";
import { toast } from "sonner";

export const lotWorkerService = {
  getWorkersForLots: async (
    lotIds: string[]
  ): Promise<Record<string, Profile[]>> => {
    if (lotIds.length === 0) return {};

    const { data, error } = await supabase
      .from("lot_workers")
      .select("lot_id, profiles ( id, display_name, created_at )")
      .in("lot_id", lotIds);

    if (error) {
      console.error("Failed to fetch lot workers", error);
      return {};
    }

    const result: Record<string, Profile[]> = {};
    for (const row of data || []) {
      const lotId = row.lot_id;
      if (!result[lotId]) result[lotId] = [];
      if (row.profiles) {
        result[lotId].push(row.profiles as unknown as Profile);
      }
    }
    return result;
  },

  joinLot: async (lotId: string, userId: string): Promise<boolean> => {
    const { error } = await supabase
      .from("lot_workers")
      .insert({ lot_id: lotId, user_id: userId });

    if (error) {
      if (error.code === "23505") {
        toast.info("Already working on this lot");
        return true;
      }
      toast.error("Failed to join lot");
      console.error(error);
      return false;
    }

    toast.success("Joined lot");
    return true;
  },

  leaveLot: async (lotId: string, userId: string): Promise<boolean> => {
    const { error } = await supabase
      .from("lot_workers")
      .delete()
      .eq("lot_id", lotId)
      .eq("user_id", userId);

    if (error) {
      toast.error("Failed to leave lot");
      console.error(error);
      return false;
    }

    toast.success("Left lot");
    return true;
  },

  subscribeToChanges: (callback: () => void) => {
    const channel = supabase
      .channel("lot-workers-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "lot_workers",
        },
        callback
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};
