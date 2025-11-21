import { useState, useEffect } from "react";
import { Lot } from "@/types/database.types";
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

interface LotModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Lot>) => void;
  lot?: Lot | null;
}

export function LotModal({ open, onClose, onSubmit, lot }: LotModalProps) {
  const [lotNumber, setLotNumber] = useState("");
  const [contents, setContents] = useState("");

  useEffect(() => {
    if (lot) {
      setLotNumber(lot.lot_number);
      setContents(lot.contents);
    } else {
      setLotNumber("");
      setContents("");
    }
  }, [lot, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lotNumber.trim() || !contents.trim()) return;

    onSubmit({
      lot_number: lotNumber.trim(),
      contents: contents.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{lot ? "Edit Lot" : "Add New Lot"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="lot-number">Lot Number *</Label>
              <Input
                id="lot-number"
                value={lotNumber}
                onChange={(e) => setLotNumber(e.target.value)}
                placeholder="e.g., Lot 1234"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contents">Contents *</Label>
              <Textarea
                id="contents"
                value={contents}
                onChange={(e) => setContents(e.target.value)}
                placeholder="e.g., Desktops, laptops, monitors"
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
              {lot ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
