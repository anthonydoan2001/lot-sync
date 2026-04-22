"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { toast } from "sonner";
import { Lot, Profile } from "@/types/database.types";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export interface LotWithWorkers extends Lot {
  workers: Profile[];
}

interface UseLotsReturn {
  lots: LotWithWorkers[];
  filteredLots: LotWithWorkers[];
  loading: boolean;
  mutatingId: string | null;
  mutatingAction: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addLot: (data: Partial<Lot>, userId?: string) => Promise<boolean>;
  updateLot: (id: string, data: Partial<Lot>) => Promise<boolean>;
  retireLot: (id: string) => Promise<boolean>;
  unretireLot: (id: string) => Promise<boolean>;
  deleteLot: (id: string) => Promise<boolean>;
  joinLot: (lotId: string) => Promise<boolean>;
  leaveLot: (lotId: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useLots(
  viewMode: "active" | "history",
  isAuthenticated: boolean,
): UseLotsReturn {
  const [searchQuery, setSearchQuery] = useState("");
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [mutatingAction, setMutatingAction] = useState<string | null>(null);

  const isHistory = viewMode === "history";

  const lotsQueryResult = useQuery(
    api.lots.list,
    isAuthenticated ? { retired: isHistory } : "skip",
  );
  const lotsData = useMemo(() => lotsQueryResult ?? [], [lotsQueryResult]);

  const lotIds = useMemo(
    () => lotsData.map((l) => l.id as unknown as Id<"lots">),
    [lotsData],
  );

  const workersQueryResult = useQuery(
    api.workers.forLots,
    isAuthenticated && lotIds.length > 0 ? { lotIds } : "skip",
  );
  const workersFlat = useMemo(
    () => workersQueryResult ?? [],
    [workersQueryResult],
  );

  const lots: LotWithWorkers[] = useMemo(() => {
    const byLot: Record<string, Profile[]> = {};
    for (const w of workersFlat) {
      if (!byLot[w.lotId]) byLot[w.lotId] = [];
      byLot[w.lotId].push({
        id: w.userId,
        display_name: w.displayName,
        created_at: "",
      });
    }
    return lotsData.map((l) => ({
      ...l,
      workers: byLot[l.id as string] ?? [],
    }));
  }, [lotsData, workersFlat]);

  const loading = lotsQueryResult === undefined;

  const filteredLots = useMemo(
    () =>
      lots.filter((lot) =>
        lot.lot_number.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [lots, searchQuery],
  );

  const createLot = useMutation(api.lots.create);
  const updateLotMut = useMutation(api.lots.update);
  const retireLotMut = useMutation(api.lots.retire);
  const unretireLotMut = useMutation(api.lots.unretire);
  const removeLotMut = useMutation(api.lots.remove);
  const joinLotMut = useMutation(api.workers.join);
  const leaveLotMut = useMutation(api.workers.leave);

  const wrapMutation = async <T,>(
    id: string,
    action: string,
    errorMsg: string,
    successMsg: string | null,
    fn: () => Promise<T>,
  ): Promise<boolean> => {
    setMutatingId(id);
    setMutatingAction(action);
    try {
      await fn();
      if (successMsg) toast.success(successMsg);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : errorMsg;
      toast.error(message);
      return false;
    } finally {
      setMutatingId(null);
      setMutatingAction(null);
    }
  };

  const addLot = async (data: Partial<Lot>) => {
    return wrapMutation(
      "__new__",
      "add",
      "Failed to add lot",
      "Lot added successfully",
      async () => {
        await createLot({
          lot_number: data.lot_number as string,
          contents: data.contents as string,
          io: data.io ?? null,
        });
      },
    );
  };

  const updateLot = async (id: string, data: Partial<Lot>) =>
    wrapMutation(id, "update", "Failed to update lot", "Lot updated successfully", async () => {
      await updateLotMut({
        id: id as unknown as Id<"lots">,
        lot_number: data.lot_number,
        contents: data.contents,
        io: data.io ?? undefined,
      });
    });

  const retireLot = async (id: string) =>
    wrapMutation(
      id,
      "retire",
      "Failed to retire lot",
      "Lot retired successfully",
      async () => {
        await retireLotMut({ id: id as unknown as Id<"lots"> });
      },
    );

  const unretireLot = async (id: string) =>
    wrapMutation(
      id,
      "unretire",
      "Failed to unretire lot",
      "Lot unretired successfully",
      async () => {
        await unretireLotMut({ id: id as unknown as Id<"lots"> });
      },
    );

  const deleteLot = async (id: string) =>
    wrapMutation(
      id,
      "delete",
      "Failed to delete lot",
      "Lot deleted successfully",
      async () => {
        await removeLotMut({ id: id as unknown as Id<"lots"> });
      },
    );

  const joinLot = async (lotId: string) =>
    wrapMutation(lotId, "join", "Failed to join lot", "Joined lot", async () => {
      await joinLotMut({ lotId: lotId as unknown as Id<"lots"> });
    });

  const leaveLot = async (lotId: string) =>
    wrapMutation(lotId, "leave", "Failed to leave lot", "Left lot", async () => {
      await leaveLotMut({ lotId: lotId as unknown as Id<"lots"> });
    });

  return {
    lots,
    filteredLots,
    loading,
    mutatingId,
    mutatingAction,
    searchQuery,
    setSearchQuery,
    addLot,
    updateLot,
    retireLot,
    unretireLot,
    deleteLot,
    joinLot,
    leaveLot,
    refetch: async () => {
      // Convex queries are reactive — refetch is a no-op. Kept for API compat.
    },
  };
}
