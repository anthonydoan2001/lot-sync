import { Pallet } from "@/types/database.types";
import {
  PalletCategory,
  DESKTOP_SORT_ORDER,
  LAPTOP_SORT_ORDER,
  AIO_SORT_ORDER,
  DISPLAY_SORT_ORDER,
  CHROMEBOOK_SORT_ORDER,
} from "@/constants/categories";

export const categorizePallet = (pallet: Pallet): PalletCategory => {
  if (!pallet.type) return "OTHER";
  return pallet.type as PalletCategory;
};

export const cleanDescription = (description: string, category: PalletCategory): string => {
  let cleaned = description;

  switch (category) {
    case "DESKTOPS":
      cleaned = cleaned.replace(/\bdesktops?\b/gi, "");
      break;
    case "LAPTOPS":
      cleaned = cleaned.replace(/\blaptops?\b/gi, "");
      break;
    case "AIO":
      cleaned = cleaned.replace(/\bAIO\b/gi, "");
      break;
    case "DISPLAYS":
      cleaned = cleaned.replace(/\b(displays?|monitors?)\b/gi, "");
      break;
    case "WORKSTATIONS":
      cleaned = cleaned.replace(/\bworkstations?\b/gi, "");
      break;
    case "CHROMEBOOKS":
      cleaned = cleaned.replace(/\bchromebooks?\b/gi, "");
      break;
  }

  return cleaned.replace(/\s+/g, " ").trim();
};

export const sortPalletsByDescription = (
  pallets: Pallet[],
  category: PalletCategory
): Pallet[] => {
  let sortOrder: string[] = [];

  switch (category) {
    case "DESKTOPS":
      sortOrder = DESKTOP_SORT_ORDER;
      break;
    case "LAPTOPS":
      sortOrder = LAPTOP_SORT_ORDER;
      break;
    case "AIO":
      sortOrder = AIO_SORT_ORDER;
      break;
    case "DISPLAYS":
      sortOrder = DISPLAY_SORT_ORDER;
      break;
    case "CHROMEBOOKS":
      sortOrder = CHROMEBOOK_SORT_ORDER;
      break;
    case "MISC":
    case "WORKSTATIONS":
    case "OTHER":
      return [...pallets].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    default:
      return pallets;
  }

  return [...pallets].sort((a, b) => {
    const aDesc = a.description?.toUpperCase() || "OTHER";
    const bDesc = b.description?.toUpperCase() || "OTHER";

    const aIndex = sortOrder.indexOf(aDesc);
    const bIndex = sortOrder.indexOf(bDesc);

    // Special handling for D/F - always comes last
    const aIsDF = aDesc === "D/F";
    const bIsDF = bDesc === "D/F";

    if (aIsDF && !bIsDF) return 1;
    if (!aIsDF && bIsDF) return -1;

    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }

    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
};

export const categorizePallets = (
  pallets: Pallet[]
): Record<PalletCategory, Pallet[]> => {
  const grouped = pallets.reduce(
    (acc, pallet) => {
      const category = categorizePallet(pallet);
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(pallet);
      return acc;
    },
    {} as Record<PalletCategory, Pallet[]>
  );

  // Sort pallets within each category
  Object.keys(grouped).forEach((category) => {
    grouped[category as PalletCategory] = sortPalletsByDescription(
      grouped[category as PalletCategory],
      category as PalletCategory
    );
  });

  return grouped;
};
