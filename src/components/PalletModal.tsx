import { useState, useEffect } from "react";
import { Pallet } from "@/types/database.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface PalletModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Pallet>) => void;
  pallet?: Pallet | null;
}

export function PalletModal({ open, onClose, onSubmit, pallet }: PalletModalProps) {
  const [palletNumber, setPalletNumber] = useState("");
  const [grade, setGrade] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (pallet) {
      setPalletNumber(pallet.pallet_number);
      setGrade(pallet.grade || "");
      setDescription(pallet.description);
    } else {
      setPalletNumber("");
      setGrade("");
      setDescription("");
    }
  }, [pallet, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!palletNumber.trim() || !description.trim()) return;

    onSubmit({
      pallet_number: palletNumber.trim(),
      grade: grade.trim() || null,
      description: description.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{pallet ? "Edit Pallet" : "Add New Pallet"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="pallet-number">Pallet Number *</Label>
              <Input
                id="pallet-number"
                value={palletNumber}
                onChange={(e) => setPalletNumber(e.target.value)}
                placeholder="e.g., PL-123"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Input
                id="grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="e.g., B/C"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., 4th Gen and Down Desktops"
                required
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {pallet ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
