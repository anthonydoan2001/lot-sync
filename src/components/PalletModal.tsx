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

interface PalletModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Pallet>) => void;
  pallet?: Pallet | null;
}

type PalletType = "DESKTOPS" | "LAPTOPS" | "DISPLAYS" | "WORKSTATIONS" | "CHROMEBOOKS" | "OTHER";

const DESKTOP_DESCRIPTIONS = [
  "B/C ↓ 4TH GEN",
  "B/C 5-7TH GEN",
  "B/C ↑ 8TH GEN",
  "D/F",
  "OTHER"
];

const LAPTOP_DESCRIPTIONS = [
  "B/C ↓ 4TH GEN",
  "B/C ↑ 5TH GEN",
  "D/F",
  "OTHER"
];

const DISPLAY_DESCRIPTIONS = [
  "B LCD",
  "C LCD",
  "OTHER"
];

const CHROMEBOOK_DESCRIPTIONS = [
  "B/C MANAGED",
  "B/C NON-MANAGED",
  "D",
  "F",
  "OTHER"
];

export function PalletModal({ open, onClose, onSubmit, pallet }: PalletModalProps) {
  const [palletNumber, setPalletNumber] = useState("");
  const [type, setType] = useState<PalletType | "">("");
  const [grade, setGrade] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [customDescription, setCustomDescription] = useState("");

  useEffect(() => {
    if (pallet) {
      // Parse the pallet number to remove PL- prefix for editing
      const numericPart = pallet.pallet_number.replace(/^PL-/, "");
      setPalletNumber(numericPart);
      setType((pallet.type as PalletType) || "");
      setGrade(pallet.grade || "");
      setDescription(pallet.description);
      
      // Check if description matches a predefined option
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
      setDescription("");
      setSelectedDescription("");
      setCustomDescription("");
    }
  }, [pallet, open]);

  const getDescriptionsForType = (palletType: PalletType): string[] => {
    switch (palletType) {
      case "DESKTOPS":
        return DESKTOP_DESCRIPTIONS;
      case "LAPTOPS":
        return LAPTOP_DESCRIPTIONS;
      case "DISPLAYS":
        return DISPLAY_DESCRIPTIONS;
      case "CHROMEBOOKS":
        return CHROMEBOOK_DESCRIPTIONS;
      default:
        return [];
    }
  };

  const getAutoGrade = (palletType: PalletType, desc: string): string | null => {
    if (palletType === "DESKTOPS") {
      if (desc === "D/F") return "D/F";
      if (desc !== "OTHER") return "B/C";
    }
    if (palletType === "LAPTOPS") {
      if (desc === "D/F") return "D/F";
      if (desc !== "OTHER") return "B/C";
    }
    if (palletType === "DISPLAYS") {
      if (desc === "B LCD") return "B";
      if (desc === "C LCD") return "C";
      return null;
    }
    if (palletType === "CHROMEBOOKS") {
      if (desc === "B/C MANAGED" || desc === "B/C NON-MANAGED") return "B/C";
      if (desc === "D") return "D";
      if (desc === "F") return "F";
      return null;
    }
    return null;
  };

  const shouldShowGradeInput = (): boolean => {
    if (!type) return false;
    if (type === "WORKSTATIONS" || type === "OTHER") return true;
    if (selectedDescription === "OTHER") {
      // For DISPLAYS with OTHER, don't show grade
      if (type === "DISPLAYS") return false;
      return true;
    }
    return false;
  };

  const shouldShowDescriptionDropdown = (): boolean => {
    if (!type) return false;
    return ["DESKTOPS", "LAPTOPS", "DISPLAYS", "CHROMEBOOKS"].includes(type);
  };

  const shouldShowCustomDescription = (): boolean => {
    if (!type) return false;
    if (type === "WORKSTATIONS" || type === "OTHER") return true;
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
    
    // Auto-set grade if applicable
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

    // Determine final description
    let finalDescription = "";
    if (shouldShowCustomDescription()) {
      if (!customDescription.trim()) return;
      finalDescription = customDescription.trim();
    } else {
      if (!selectedDescription || selectedDescription === "OTHER") return;
      finalDescription = selectedDescription;
    }

    // Determine final grade
    let finalGrade: string | null = null;
    if (shouldShowGradeInput()) {
      finalGrade = grade.trim() || null;
    } else {
      // Auto-set grade
      if (type && selectedDescription) {
        finalGrade = getAutoGrade(type as PalletType, selectedDescription);
      }
    }

    onSubmit({
      pallet_number: `PL-${palletNumber.trim()}`,
      type: type,
      grade: finalGrade,
      description: finalDescription,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{pallet ? "Edit Pallet" : "Add New Pallet"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="pallet-number">Pallet Number *</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">PL-</span>
                <Input
                  id="pallet-number"
                  value={palletNumber}
                  onChange={(e) => {
                    // Only allow numbers
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setPalletNumber(value);
                  }}
                  placeholder="123"
                  required
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select value={type} onValueChange={handleTypeChange} required>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DESKTOPS">DESKTOPS</SelectItem>
                  <SelectItem value="LAPTOPS">LAPTOPS</SelectItem>
                  <SelectItem value="DISPLAYS">DISPLAYS</SelectItem>
                  <SelectItem value="WORKSTATIONS">WORKSTATIONS</SelectItem>
                  <SelectItem value="CHROMEBOOKS">CHROMEBOOKS</SelectItem>
                  <SelectItem value="OTHER">OTHER</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {shouldShowDescriptionDropdown() && (
              <div className="space-y-2">
                <Label htmlFor="description-select">Description *</Label>
                <Select value={selectedDescription} onValueChange={handleDescriptionChange} required>
                  <SelectTrigger id="description-select">
                    <SelectValue placeholder="Select description" />
                  </SelectTrigger>
                  <SelectContent>
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
              <div className="space-y-2">
                <Label htmlFor="custom-description">Description *</Label>
                <Textarea
                  id="custom-description"
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="Enter description"
                  required
                  rows={3}
                />
              </div>
            )}

            {shouldShowGradeInput() && (
              <div className="space-y-2">
                <Label htmlFor="grade">Grade</Label>
                <Input
                  id="grade"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="e.g., B/C"
                />
              </div>
            )}
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
