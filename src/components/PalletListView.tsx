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
    <div className="space-y-8">
      {categoryOrder.map((category) => {
        const categoryPallets = categorizedPallets[category];
        if (!categoryPallets || categoryPallets.length === 0) return null;

        // Sort pallets within category
        const sortedPallets = sortPalletsByDescription(categoryPallets, category);

        return (
          <div key={category} className="space-y-4">
            <h2 className="text-4xl font-bold text-primary border-b-2 border-primary/20 pb-2">
              {category}
            </h2>
            <div className="space-y-1.5">
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
                    className="flex items-center gap-3 px-4 py-2 rounded-lg border border-border/50"
                  >
                    <Badge variant="outline" className="font-mono text-3xl font-bold px-3 py-1.5 bg-muted border-2">
                      {pallet.pallet_number}
                    </Badge>
                    {pallet.grade && (
                      <Badge 
                        variant={isLowGrade ? "destructive" : "secondary"} 
                        className="font-semibold text-xl px-3 py-1"
                      >
                        {pallet.grade}
                      </Badge>
                    )}
                    <span className="text-3xl font-medium text-foreground uppercase flex-1">
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
