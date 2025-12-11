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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package } from "lucide-react";
import { PalletType, getDescriptionsForType, getAutoGrade } from "@/constants/categories";

interface PalletModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Pallet>) => void;
  pallet?: Pallet | null;
}

export function PalletModal({ open, onClose, onSubmit, pallet }: PalletModalProps) {
  const [palletNumber, setPalletNumber] = useState("");
  const [type, setType] = useState<PalletType | "">("");
  const [grade, setGrade] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (pallet) {
      const numericPart = pallet.pallet_number.replace(/^PL-/, "");
      setPalletNumber(numericPart);
      setType((pallet.type as PalletType) || "");
      setGrade(pallet.grade || "");
      setNotes(pallet.notes || "");
      
      if (pallet.type) {
        const descriptions = getDescriptionsForType(pallet.type as PalletType);
        if (descriptions.includes(pallet.description)) {
          setSelectedDescription(pallet.description);
          setCustomDescription("");
        } else {
          setSelectedDescription("OTHER");
          setCustomDescription(pallet.description);
        }
      }
    } else {
      setPalletNumber("");
      setType("");
      setGrade("");
      setSelectedDescription("");
      setCustomDescription("");
      setNotes("");
    }
  }, [pallet, open]);

  const shouldShowGradeInput = (): boolean => {
    if (!type) return false;
    if (type === "MISC" || type === "WORKSTATIONS" || type === "OTHER") return true;
    if (selectedDescription === "OTHER") {
      if (type === "DISPLAYS") return false;
      return true;
    }
    return false;
  };

  const shouldShowDescriptionDropdown = (): boolean => {
    if (!type) return false;
    return ["DESKTOPS", "LAPTOPS", "AIO", "DISPLAYS", "CHROMEBOOKS"].includes(type);
  };

  const shouldShowCustomDescription = (): boolean => {
    if (!type) return false;
    if (type === "MISC" || type === "WORKSTATIONS" || type === "OTHER") return true;
    return selectedDescription === "OTHER";
  };

  const handleTypeChange = (value: string) => {
    setType(value as PalletType);
    setSelectedDescription("");
    setCustomDescription("");
    setGrade("");
  };

  const handleDescriptionChange = (value: string) => {
    setSelectedDescription(value);
    setCustomDescription("");
    
    if (type && value !== "OTHER") {
      const autoGrade = getAutoGrade(type as PalletType, value);
      if (autoGrade) {
        setGrade(autoGrade);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!palletNumber.trim() || !type) return;

    let finalDescription = "";
    if (shouldShowCustomDescription()) {
      if (!customDescription.trim()) return;
      finalDescription = customDescription.trim();
    } else {
      if (!selectedDescription || selectedDescription === "OTHER") return;
      finalDescription = selectedDescription;
    }

    let finalGrade: string | null = null;
    if (shouldShowGradeInput()) {
      finalGrade = grade.trim() || null;
    } else {
      if (type && selectedDescription) {
        finalGrade = getAutoGrade(type as PalletType, selectedDescription);
      }
    }

    onSubmit({
      pallet_number: `PL-${palletNumber.trim()}`,
      type: type,
      grade: finalGrade,
      description: finalDescription,
      notes: notes.trim() || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-[520px]">
        <DialogHeader className="px-8 pt-7 pb-5 -mx-6 -mt-6 bg-gradient-to-br from-[hsl(var(--modal-header-from))] to-[hsl(var(--modal-header-to))] border-b-2">
          <DialogTitle className="text-3xl font-bold flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[hsl(var(--modal-icon-from))] to-[hsl(var(--modal-icon-to))] rounded-[10px] flex items-center justify-center text-white">
              <Package className="w-5 h-5" />
            </div>
            {pallet ? "Edit Pallet" : "Add New Pallet"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-7 py-8">
            <div className="space-y-2.5">
              <Label htmlFor="pallet-number" className="text-[15px] font-semibold">
                Pallet Number <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 flex items-center px-[18px] bg-gradient-to-br from-muted to-muted/80 border-r-2 border-border rounded-l-[10px] font-bold text-lg text-muted-foreground">
                  PL-
                </div>
                <Input
                  id="pallet-number"
                  value={palletNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setPalletNumber(value);
                  }}
                  placeholder="123"
                  required
                  className="pl-[70px] h-[50px] text-[17px] font-medium border-2 rounded-[10px]"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="type" className="text-[15px] font-semibold">
                Type <span className="text-destructive">*</span>
              </Label>
              <Select value={type} onValueChange={handleTypeChange} required>
                <SelectTrigger id="type" className="h-[50px] text-[17px] font-medium border-2 rounded-[10px]">
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="MISC">MISC</SelectItem>
                  <SelectItem value="DESKTOPS">DESKTOPS</SelectItem>
                  <SelectItem value="LAPTOPS">LAPTOPS</SelectItem>
                  <SelectItem value="AIO">AIO</SelectItem>
                  <SelectItem value="DISPLAYS">DISPLAYS</SelectItem>
                  <SelectItem value="WORKSTATIONS">WORKSTATIONS</SelectItem>
                  <SelectItem value="CHROMEBOOKS">CHROMEBOOKS</SelectItem>
                  <SelectItem value="OTHER">OTHER</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {shouldShowDescriptionDropdown() && (
              <div className="space-y-2.5">
                <Label htmlFor="description-select" className="text-[15px] font-semibold">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Select value={selectedDescription} onValueChange={handleDescriptionChange} required>
                  <SelectTrigger id="description-select" className="h-[50px] text-[17px] font-medium border-2 rounded-[10px]">
                    <SelectValue placeholder="Select description..." />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    {getDescriptionsForType(type as PalletType).map((desc) => (
                      <SelectItem key={desc} value={desc}>
                        {desc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {shouldShowCustomDescription() && (
              <div className="space-y-2.5">
                <Label htmlFor="custom-description" className="text-[15px] font-semibold">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="custom-description"
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="Enter description"
                  required
                  rows={3}
                  className="text-[17px] font-medium border-2 rounded-[10px]"
                />
              </div>
            )}

            {shouldShowGradeInput() && (
              <div className="space-y-2.5">
                <Label htmlFor="grade" className="text-[15px] font-semibold">Grade</Label>
                <Input
                  id="grade"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="e.g., B/C"
                  className="h-[50px] text-[17px] font-medium border-2 rounded-[10px]"
                />
              </div>
            )}

            <div className="space-y-2.5">
              <Label htmlFor="notes" className="text-[15px] font-semibold">Notes (optional)</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., remove hard drive and ram"
                className="h-[50px] text-[15px] font-medium border-2 rounded-[10px]"
              />
            </div>
          </div>
          <DialogFooter className="px-8 pb-6 pt-6 -mx-6 -mb-6 bg-muted border-t-2 rounded-b-[16px] gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="h-[48px] px-7 text-base font-semibold border-2 rounded-[10px]">
              Cancel
            </Button>
            <Button type="submit" className="h-[48px] px-7 text-base font-semibold rounded-[10px] bg-gradient-to-br from-[hsl(var(--modal-icon-from))] to-[hsl(var(--modal-icon-to))] shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
              {pallet ? "Update" : "Add Pallet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
