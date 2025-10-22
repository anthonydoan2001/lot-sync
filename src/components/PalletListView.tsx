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
  
  // Clean up extra spaces and trim
  return cleaned.replace(/\s+/g, " ").trim();
};

// Define sort orders for each category
const DESKTOP_SORT_ORDER = ["B/C ↓ 4TH GEN", "B/C 5-7TH GEN", "B/C ↑ 8TH GEN", "OTHER", "D/F", "D", "F"];
const LAPTOP_SORT_ORDER = ["B/C ↓ 4TH GEN", "B/C ↑ 5TH GEN", "OTHER", "D/F", "D", "F"];
const DISPLAY_SORT_ORDER = ["B LCD", "CLCD", "OTHER", "D/F", "D", "F"];
const CHROMEBOOK_SORT_ORDER = ["B/C MANAGED", "B/C NON-MANAGED", "OTHER", "D/F", "D", "F"];

// Function to sort pallets within a category
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
      // No specific order, sort by created_at (newest first)
      return [...pallets].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    default:
      return pallets;
  }

  return [...pallets].sort((a, b) => {
    const aGrade = a.grade?.toUpperCase() || "";
    const bGrade = b.grade?.toUpperCase() || "";
    
    // Define low grades that should appear at the end
    const lowGrades = ["D/F", "D", "F"];
    const aIsLowGrade = lowGrades.includes(aGrade);
    const bIsLowGrade = lowGrades.includes(bGrade);
    
    // If one is a low grade and the other isn't, low grade goes last
    if (aIsLowGrade && !bIsLowGrade) return 1;
    if (!aIsLowGrade && bIsLowGrade) return -1;
    
    // If both are low grades, sort by specific order: D/F, D, F
    if (aIsLowGrade && bIsLowGrade) {
      const lowGradeOrder = ["D/F", "D", "F"];
      return lowGradeOrder.indexOf(aGrade) - lowGradeOrder.indexOf(bGrade);
    }
    
    // If neither are low grades, sort by description or created_at
    const aDesc = a.description?.toUpperCase() || "OTHER";
    const bDesc = b.description?.toUpperCase() || "OTHER";
    
    const aIndex = sortOrder.indexOf(aDesc);
    const bIndex = sortOrder.indexOf(bDesc);
    
    // If both are in the sort order, sort by order
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    
    // If only one is in the sort order, prioritize it
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    
    // If neither is in sort order, sort by created_at (newest first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
};

export function PalletListView({ pallets }: PalletListViewProps) {
  // Group pallets by category
  const categorizedPallets = pallets.reduce((acc, pallet) => {
    const category = categorizePallet(pallet);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(pallet);
    return acc;
  }, {} as Record<Category, Pallet[]>);

  // Define category order
  const categoryOrder: Category[] = [
    "DESKTOPS",
    "LAPTOPS",
    "DISPLAYS",
    "WORKSTATIONS",
    "CHROMEBOOKS",
    "OTHER",
  ];

  return (
    <div className="space-y-10">
      {categoryOrder.map((category) => {
        const categoryPallets = categorizedPallets[category];
        if (!categoryPallets || categoryPallets.length === 0) return null;

        // Sort pallets within category
        const sortedPallets = sortPalletsByDescription(categoryPallets, category);

        return (
          <div key={category} className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-primary/30">
              <div className="h-1 w-12 bg-primary rounded-full" />
              <h2 className="text-4xl font-bold text-primary tracking-tight">
                {category}
              </h2>
            </div>
            <div className="space-y-2">
              {sortedPallets.map((pallet) => {
                // Remove grade from description if it exists at the start
                let description = cleanDescription(pallet.description, category);
                if (pallet.grade && description.startsWith(pallet.grade)) {
                  description = description.substring(pallet.grade.length).trim();
                }
                
                // Determine if grade should be red (D/F, D, or F)
                const isLowGrade = pallet.grade && ['D/F', 'D', 'F'].includes(pallet.grade.toUpperCase());
                
                return (
                  <div
                    key={pallet.id}
                    className="flex items-center gap-4 px-5 py-3 rounded-lg border border-border bg-card hover:bg-accent/5 hover:border-accent/30 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Badge variant="outline" className="font-mono text-3xl font-bold px-4 py-2 bg-muted/70 border-2 border-primary/20 shadow-sm">
                      {pallet.pallet_number}
                    </Badge>
                    {pallet.grade && (
                      <Badge 
                        variant={isLowGrade ? "destructive" : "secondary"} 
                        className="font-bold text-xl px-4 py-1.5 shadow-sm"
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
