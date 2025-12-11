// Pallet categories and sort orders

export type PalletCategory = 
  | "MISC" 
  | "DESKTOPS" 
  | "LAPTOPS" 
  | "AIO" 
  | "DISPLAYS" 
  | "WORKSTATIONS" 
  | "CHROMEBOOKS" 
  | "OTHER";

export const CATEGORY_ORDER: PalletCategory[] = [
  "MISC",
  "DESKTOPS",
  "LAPTOPS",
  "AIO",
  "DISPLAYS",
  "WORKSTATIONS",
  "CHROMEBOOKS",
  "OTHER",
];

export const DESKTOP_SORT_ORDER = [
  "B/C 1-2ND GEN",
  "B/C 3RD GEN",
  "B/C 4TH GEN",
  "B/C 5-7TH GEN",
  "B/C ↑ 8TH GEN",
  "OTHER",
  "D/F",
];

export const LAPTOP_SORT_ORDER = [
  "B/C ↓ 4TH GEN",
  "B/C ↑ 5TH GEN",
  "OTHER",
  "D/F",
];

export const AIO_SORT_ORDER = [
  "5-7TH GEN",
  "↑ 8TH GEN",
  "OTHER",
  "D/F",
];

export const DISPLAY_SORT_ORDER = [
  "B LCD",
  "CLCD",
  "OTHER",
];

export const CHROMEBOOK_SORT_ORDER = [
  "B/C MANAGED",
  "B/C NON-MANAGED",
  "D",
  "F",
  "OTHER",
];

// Description options for PalletModal
export const DESKTOP_DESCRIPTIONS = [
  "B/C 1-2ND GEN",
  "B/C 3RD GEN",
  "B/C 4TH GEN",
  "B/C 5-7TH GEN",
  "B/C ↑ 8TH GEN",
  "D/F",
  "OTHER",
];

export const LAPTOP_DESCRIPTIONS = [
  "B/C ↓ 4TH GEN",
  "B/C ↑ 5TH GEN",
  "D/F",
  "OTHER",
];

export const AIO_DESCRIPTIONS = [
  "5-7TH GEN",
  "↑ 8TH GEN",
  "D/F",
  "OTHER",
];

export const DISPLAY_DESCRIPTIONS = [
  "B LCD",
  "C LCD",
  "OTHER",
];

export const CHROMEBOOK_DESCRIPTIONS = [
  "B/C MANAGED",
  "B/C NON-MANAGED",
  "D",
  "F",
  "OTHER",
];

export type PalletType = 
  | "MISC" 
  | "DESKTOPS" 
  | "LAPTOPS" 
  | "AIO" 
  | "DISPLAYS" 
  | "WORKSTATIONS" 
  | "CHROMEBOOKS" 
  | "OTHER";

export const getDescriptionsForType = (palletType: PalletType): string[] => {
  switch (palletType) {
    case "DESKTOPS":
      return DESKTOP_DESCRIPTIONS;
    case "LAPTOPS":
      return LAPTOP_DESCRIPTIONS;
    case "AIO":
      return AIO_DESCRIPTIONS;
    case "DISPLAYS":
      return DISPLAY_DESCRIPTIONS;
    case "CHROMEBOOKS":
      return CHROMEBOOK_DESCRIPTIONS;
    default:
      return [];
  }
};

export const getAutoGrade = (palletType: PalletType, desc: string): string | null => {
  if (palletType === "DESKTOPS") {
    if (desc === "D/F") return "D/F";
    if (desc !== "OTHER") return "B/C";
  }
  if (palletType === "LAPTOPS") {
    if (desc === "D/F") return "D/F";
    if (desc !== "OTHER") return "B/C";
  }
  if (palletType === "AIO") {
    if (desc === "D/F") return "D/F";
    if (["5-7TH GEN", "↑ 8TH GEN"].includes(desc)) return "B/C";
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
