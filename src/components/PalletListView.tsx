import { memo, useMemo } from "react";
import { Pallet } from "@/types/database.types";

interface PalletListViewProps {
  pallets: Pallet[];
}

type Category = "DESKTOPS" | "LAPTOPS" | "DISPLAYS" | "WORKSTATIONS" | "CHROMEBOOKS" | "OTHER";

const categorizePallet = (pallet: Pallet): Category => {
  if (!pallet.type) return "OTHER";
  return pallet.type as Category;
};

const cleanDescription = (description: string, category: Category): string => {
  let cleaned = description;

  switch (category) {
    case "DESKTOPS":
      cleaned = cleaned.replace(/\bdesktops?\b/gi, "");
      break;
    case "LAPTOPS":
      cleaned = cleaned.replace(/\blaptops?\b/gi, "");
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

const DESKTOP_SORT_ORDER = ["B/C 1-2ND GEN", "B/C 3RD GEN", "B/C 4TH GEN", "B/C 5-7TH GEN", "B/C ↑ 8TH GEN", "OTHER", "D/F"];
const LAPTOP_SORT_ORDER = ["B/C ↓ 4TH GEN", "B/C ↑ 5TH GEN", "OTHER", "D/F"];
const DISPLAY_SORT_ORDER = ["B LCD", "CLCD", "OTHER"];
const CHROMEBOOK_SORT_ORDER = ["B/C MANAGED", "B/C NON-MANAGED", "D", "F", "OTHER"];
const categoryOrder: Category[] = ["DESKTOPS", "LAPTOPS", "DISPLAYS", "WORKSTATIONS", "CHROMEBOOKS", "OTHER"];

const sortPalletsByDescription = (pallets: Pallet[], category: Category): Pallet[] => {
  let sortOrder: string[] = [];

  switch (category) {
    case "DESKTOPS":
      sortOrder = DESKTOP_SORT_ORDER;
      break;
    case "LAPTOPS":
      sortOrder = LAPTOP_SORT_ORDER;
      break;
    case "DISPLAYS":
      sortOrder = DISPLAY_SORT_ORDER;
      break;
    case "CHROMEBOOKS":
      sortOrder = CHROMEBOOK_SORT_ORDER;
      break;
    case "WORKSTATIONS":
    case "OTHER":
      return [...pallets].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
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

    if (aIsDF && !bIsDF) return 1; // D/F comes after everything
    if (!aIsDF && bIsDF) return -1; // Everything comes before D/F

    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }

    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
};

export const PalletListView = memo(function PalletListView({ pallets }: PalletListViewProps) {
  const sortedCategories = useMemo(() => {
    const categorizedPallets = pallets.reduce(
      (acc, pallet) => {
        const category = categorizePallet(pallet);
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(pallet);
        return acc;
      },
      {} as Record<Category, Pallet[]>,
    );

    return categoryOrder.map((category) => ({
      category,
      pallets: categorizedPallets[category] 
        ? sortPalletsByDescription(categorizedPallets[category], category)
        : [],
    })).filter(({ pallets }) => pallets.length > 0);
  }, [pallets]);

  return (
    <div className="space-y-12">
      {sortedCategories.map(({ category, pallets: sortedPallets }) => (
        <div key={category} className="space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-border">
            <h2 className="text-2xl font-semibold text-foreground tracking-tight">
              {category}
            </h2>
            <span className="text-sm font-medium text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
              {sortedPallets.length}
            </span>
          </div>
          <div className="space-y-3">
            {sortedPallets.map((pallet) => {
              let description = cleanDescription(pallet.description, category);
              if (pallet.grade && description.startsWith(pallet.grade)) {
                description = description.substring(pallet.grade.length).trim();
              }

              const isLowGrade = pallet.grade && ["D/F", "D", "F"].includes(pallet.grade.toUpperCase());

              return (
                <div
                  key={pallet.id}
                  className="flex items-center gap-4 px-6 py-4 rounded-xl border-2 border-border bg-background hover:border-primary hover:shadow-md transition-all duration-150"
                >
                  <div className="font-sans text-2xl font-bold text-blue-700 min-w-[140px] px-4 py-2 bg-background border-[3px] border-blue-500 rounded-lg text-center tracking-wider shadow-sm">
                    {pallet.pallet_number}
                  </div>
                  {pallet.grade && (
                    <div
                      className={`text-xl font-bold px-5 py-1.5 rounded-lg uppercase tracking-wider min-w-[70px] text-center shadow-md ${
                        isLowGrade
                          ? "bg-gradient-to-br from-red-500 to-red-600 text-white"
                          : "bg-gradient-to-br from-green-500 to-green-600 text-white"
                      }`}
                    >
                      {pallet.grade}
                    </div>
                  )}
                  <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-foreground uppercase flex-1 tracking-wide">
                    {description}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
});
