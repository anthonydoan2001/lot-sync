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
    <div className="space-y-8 font-mono text-2xl uppercase">
      {categoryOrder.map((category) => {
        const categoryPallets = categorizedPallets[category];
        if (!categoryPallets || categoryPallets.length === 0) return null;

        return (
          <div key={category} className="space-y-3">
            <h2 className="text-4xl font-bold text-primary border-b-2 border-border pb-2 mb-4">
              {category}
            </h2>
            <div className="space-y-2">
              {categoryPallets.map((pallet) => {
                const grade = pallet.grade ? ` - ${pallet.grade}` : '';
                const description = cleanDescription(pallet.description, category);
                return (
                  <div
                    key={pallet.id}
                    className="text-foreground hover:bg-accent/50 px-3 py-2 rounded transition-colors"
                  >
                    {pallet.pallet_number}{grade} - {description}
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
