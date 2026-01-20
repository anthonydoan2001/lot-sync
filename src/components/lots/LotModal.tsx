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
import { PackageSearch } from "lucide-react";

interface LotModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Lot>) => void;
  lot?: Lot | null;
}

export function LotModal({ open, onClose, onSubmit, lot }: LotModalProps) {
  const [lotNumber, setLotNumber] = useState("");
  const [contents, setContents] = useState("");
  const [io, setIo] = useState("");

  useEffect(() => {
    if (lot) {
      setLotNumber(lot.lot_number);
      setContents(lot.contents);
      setIo(lot.io || "");
    } else {
      setLotNumber("");
      setContents("");
      setIo("");
    }
  }, [lot, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lotNumber.trim() || !contents.trim()) return;

    onSubmit({
      lot_number: lotNumber.trim(),
      contents: contents.trim(),
      io: io.trim() || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[520px]">
        <DialogHeader className="px-8 pt-7 pb-5 -mx-6 -mt-6 bg-gradient-to-br from-[hsl(var(--modal-header-from))] to-[hsl(var(--modal-header-to))] border-b-2">
          <DialogTitle className="text-3xl font-bold flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[hsl(var(--modal-icon-from))] to-[hsl(var(--modal-icon-to))] rounded-[10px] flex items-center justify-center text-white">
              <PackageSearch className="w-5 h-5" />
            </div>
            {lot ? "Edit Lot" : "Add New Lot"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-7 py-8">
            <div className="space-y-2.5">
              <Label htmlFor="lot-number" className="text-[15px] font-semibold">
                Lot Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lot-number"
                value={lotNumber}
                onChange={(e) => setLotNumber(e.target.value)}
                placeholder="e.g., Lot 1234"
                required
                className="h-[50px] text-[17px] font-medium border-2 rounded-[10px]"
              />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="io" className="text-[15px] font-semibold">
                IO
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[17px] font-semibold text-muted-foreground">IO-</span>
                <Input
                  id="io"
                  value={io}
                  onChange={(e) => setIo(e.target.value.replace(/\D/g, ""))}
                  placeholder="e.g., 10437"
                  className="h-[50px] text-[17px] font-medium border-2 rounded-[10px] pl-12"
                />
              </div>
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="contents" className="text-[15px] font-semibold">
                Contents <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="contents"
                value={contents}
                onChange={(e) => setContents(e.target.value)}
                placeholder="e.g., Desktops, laptops, monitors"
                required
                rows={3}
                className="text-[17px] font-medium border-2 rounded-[10px]"
              />
            </div>
          </div>
          <DialogFooter className="px-8 pb-6 pt-6 -mx-6 -mb-6 bg-muted border-t-2 rounded-b-[16px] gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="h-[48px] px-7 text-base font-semibold border-2 rounded-[10px]">
              Cancel
            </Button>
            <Button type="submit" className="h-[48px] px-7 text-base font-semibold rounded-[10px] bg-gradient-to-br from-[hsl(var(--modal-icon-from))] to-[hsl(var(--modal-icon-to))] shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
              {lot ? "Update" : "Add Lot"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
