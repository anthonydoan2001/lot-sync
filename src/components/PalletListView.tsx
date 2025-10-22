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

        return (
          <div key={category} className="space-y-4">
            <h2 className="text-3xl font-bold text-primary border-b-2 border-primary/20 pb-2">
              {category}
            </h2>
            <div className="space-y-2">
              {categoryPallets.map((pallet) => {
                // Remove grade from description if it exists at the start
                let description = cleanDescription(pallet.description, category);
                if (pallet.grade && description.startsWith(pallet.grade)) {
                  description = description.substring(pallet.grade.length).trim();
                }
                
                return (
                  <div
                    key={pallet.id}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/50 transition-colors border border-border/50"
                  >
                    <Badge variant="outline" className="font-mono text-sm px-3 py-1 bg-muted">
                      {pallet.pallet_number}
                    </Badge>
                    {pallet.grade && (
                      <Badge variant="secondary" className="font-semibold text-sm px-3 py-1">
                        {pallet.grade}
                      </Badge>
                    )}
                    <span className="text-lg font-medium text-foreground uppercase flex-1">
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
