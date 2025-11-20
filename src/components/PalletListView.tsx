import { Pallet } from "@/types/database.types";
import { Badge } from "@/components/ui/badge";

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

const DESKTOP_SORT_ORDER = ["B/C 1-2ND GEN", "B/C 3RD GEN", "B/C 4TH GEN", "B/C 5-7TH GEN", "B/C ↑ 8TH GEN", "OTHER", "D/F", "D", "F"];
const LAPTOP_SORT_ORDER = ["B/C ↓ 4TH GEN", "B/C ↑ 5TH GEN", "OTHER", "D/F", "D", "F"];
const DISPLAY_SORT_ORDER = ["B LCD", "CLCD", "OTHER", "D/F", "D", "F"];
const CHROMEBOOK_SORT_ORDER = ["B/C MANAGED", "B/C NON-MANAGED", "OTHER", "D/F", "D", "F"];

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
    const aGrade = a.grade?.toUpperCase() || "";
    const bGrade = b.grade?.toUpperCase() || "";

    const lowGrades = ["D/F", "D", "F"];
    const aIsLowGrade = lowGrades.includes(aGrade);
    const bIsLowGrade = lowGrades.includes(bGrade);

    if (aIsLowGrade && !bIsLowGrade) return 1;
    if (!aIsLowGrade && bIsLowGrade) return -1;

    if (aIsLowGrade && bIsLowGrade) {
      const lowGradeOrder = ["D/F", "D", "F"];
      return lowGradeOrder.indexOf(aGrade) - lowGradeOrder.indexOf(bGrade);
    }

    const aDesc = a.description?.toUpperCase() || "OTHER";
    const bDesc = b.description?.toUpperCase() || "OTHER";

    const aIndex = sortOrder.indexOf(aDesc);
    const bIndex = sortOrder.indexOf(bDesc);

    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }

    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
};

export function PalletListView({ pallets }: PalletListViewProps) {
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

  const categoryOrder: Category[] = ["DESKTOPS", "LAPTOPS", "DISPLAYS", "WORKSTATIONS", "CHROMEBOOKS", "OTHER"];

  return (
    <div className="space-y-12">
      {categoryOrder.map((category) => {
        const categoryPallets = categorizedPallets[category];
        if (!categoryPallets || categoryPallets.length === 0) return null;

        const sortedPallets = sortPalletsByDescription(categoryPallets, category);

        return (
          <div key={category} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 pb-4 border-b-2 border-primary/20 sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-2">
              <div className="h-1.5 w-16 bg-gradient-to-r from-primary to-secondary rounded-full" />
              <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tight">
                {category}
              </h2>
              <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                {sortedPallets.length}
              </span>
            </div>
            <div className="space-y-3">
              {sortedPallets.map((pallet, index) => {
                let description = cleanDescription(pallet.description, category);
                if (pallet.grade && description.startsWith(pallet.grade)) {
                  description = description.substring(pallet.grade.length).trim();
                }

                const isLowGrade = pallet.grade && ["D/F", "D", "F"].includes(pallet.grade.toUpperCase());

                return (
                  <div
                    key={pallet.id}
                    className="flex items-center gap-5 px-6 py-4 rounded-xl border-2 border-border bg-card hover:bg-accent/5 hover:border-accent/30 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <Badge
                      variant="outline"
                      className="font-mono text-4xl font-bold px-5 py-2.5 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 shadow-md min-w-[140px] justify-center"
                    >
                      {pallet.pallet_number}
                    </Badge>
                    {pallet.grade && (
                      <Badge
                        variant={isLowGrade ? "destructive" : "secondary"}
                        className="font-bold text-2xl px-5 py-2 shadow-md min-w-[80px] justify-center"
                      >
                        {pallet.grade}
                      </Badge>
                    )}
                    <span className="text-3xl font-semibold text-foreground uppercase flex-1 tracking-wide">
                      {description}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
