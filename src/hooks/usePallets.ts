"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { toast } from "sonner";
import { Pallet } from "@/types/database.types";
import { categorizePallets } from "@/utils/sorting";
import { PalletCategory } from "@/constants/categories";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

interface UsePalletsReturn {
  pallets: Pallet[];
  filteredPallets: Pallet[];
  categorizedPallets: Record<PalletCategory, Pallet[]>;
  loading: boolean;
  mutatingId: string | null;
  mutatingAction: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addPallet: (data: Partial<Pallet>) => Promise<boolean>;
  updatePallet: (id: string, data: Partial<Pallet>) => Promise<boolean>;
  retirePallet: (id: string) => Promise<boolean>;
  unretirePallet: (id: string) => Promise<boolean>;
  deletePallet: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function usePallets(
  viewMode: "active" | "history",
  isAuthenticated: boolean,
): UsePalletsReturn {
  const [searchQuery, setSearchQuery] = useState("");
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [mutatingAction, setMutatingAction] = useState<string | null>(null);

  const isHistory = viewMode === "history";

  const data = useQuery(
    api.pallets.list,
    isAuthenticated ? { retired: isHistory } : "skip",
  );
  const pallets = useMemo(() => (data ?? []) as Pallet[], [data]);
  const loading = data === undefined;

  const filteredPallets = useMemo(
    () =>
      pallets.filter((pallet) =>
        pallet.pallet_number.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [pallets, searchQuery],
  );

  const categorizedPallets = useMemo(
    () => categorizePallets(filteredPallets),
    [filteredPallets],
  );

  const createPallet = useMutation(api.pallets.create);
  const updatePalletMut = useMutation(api.pallets.update);
  const retirePalletMut = useMutation(api.pallets.retire);
  const unretirePalletMut = useMutation(api.pallets.unretire);
  const removePalletMut = useMutation(api.pallets.remove);

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

  const addPallet = (data: Partial<Pallet>) =>
    wrapMutation(
      "__new__",
      "add",
      "Failed to add pallet",
      "Pallet added successfully",
      async () => {
        await createPallet({
          pallet_number: data.pallet_number as string,
          description: data.description as string,
          type: data.type ?? null,
          grade: data.grade ?? null,
          generation: data.generation ?? null,
          notes: data.notes ?? null,
        });
      },
    );

  const updatePallet = (id: string, data: Partial<Pallet>) =>
    wrapMutation(
      id,
      "update",
      "Failed to update pallet",
      "Pallet updated successfully",
      async () => {
        await updatePalletMut({
          id: id as unknown as Id<"pallets">,
          pallet_number: data.pallet_number,
          description: data.description,
          type: data.type ?? undefined,
          grade: data.grade ?? undefined,
          generation: data.generation ?? undefined,
          notes: data.notes ?? undefined,
        });
      },
    );

  const retirePallet = (id: string) =>
    wrapMutation(
      id,
      "retire",
      "Failed to retire pallet",
      "Pallet retired successfully",
      async () => {
        await retirePalletMut({ id: id as unknown as Id<"pallets"> });
      },
    );

  const unretirePallet = (id: string) =>
    wrapMutation(
      id,
      "unretire",
      "Failed to unretire pallet",
      "Pallet unretired successfully",
      async () => {
        await unretirePalletMut({ id: id as unknown as Id<"pallets"> });
      },
    );

  const deletePallet = (id: string) =>
    wrapMutation(
      id,
      "delete",
      "Failed to delete pallet",
      "Pallet deleted successfully",
      async () => {
        await removePalletMut({ id: id as unknown as Id<"pallets"> });
      },
    );

  return {
    pallets,
    filteredPallets,
    categorizedPallets,
    loading,
    mutatingId,
    mutatingAction,
    searchQuery,
    setSearchQuery,
    addPallet,
    updatePallet,
    retirePallet,
    unretirePallet,
    deletePallet,
    refetch: async () => {
      // Convex queries are reactive — no-op
    },
  };
}
