import { Pallet } from "@/types/database.types";
import { toast } from "sonner";

interface Envelope<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function call<T>(path: string, init?: RequestInit): Promise<Envelope<T>> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  return (await res.json()) as Envelope<T>;
}

export const palletService = {
  fetchPallets: async (isHistory: boolean): Promise<Pallet[]> => {
    const env = await call<Pallet[]>(
      `/api/pallets?retired=${isHistory ? 1 : 0}`,
    );
    if (!env.success) {
      toast.error(env.error ?? "Failed to fetch pallets");
      return [];
    }
    return env.data ?? [];
  },

  addPallet: async (data: Partial<Pallet>): Promise<boolean> => {
    const env = await call<Pallet>("/api/pallets", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!env.success) {
      toast.error(env.error ?? "Failed to add pallet");
      return false;
    }
    toast.success("Pallet added successfully");
    return true;
  },

  updatePallet: async (id: string, data: Partial<Pallet>): Promise<boolean> => {
    const env = await call<Pallet>(`/api/pallets/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!env.success) {
      toast.error(env.error ?? "Failed to update pallet");
      return false;
    }
    toast.success("Pallet updated successfully");
    return true;
  },

  retirePallet: async (id: string): Promise<boolean> => {
    const env = await call<Pallet>(`/api/pallets/${id}/retire`, {
      method: "POST",
    });
    if (!env.success) {
      toast.error(env.error ?? "Failed to retire pallet");
      return false;
    }
    toast.success("Pallet retired successfully");
    return true;
  },

  unretirePallet: async (id: string): Promise<boolean> => {
    const env = await call<Pallet>(`/api/pallets/${id}/unretire`, {
      method: "POST",
    });
    if (!env.success) {
      toast.error(env.error ?? "Failed to unretire pallet");
      return false;
    }
    toast.success("Pallet unretired successfully");
    return true;
  },

  deletePallet: async (id: string): Promise<boolean> => {
    const env = await call<null>(`/api/pallets/${id}`, { method: "DELETE" });
    if (!env.success) {
      toast.error(env.error ?? "Failed to delete pallet");
      return false;
    }
    toast.success("Pallet deleted successfully");
    return true;
  },
};
