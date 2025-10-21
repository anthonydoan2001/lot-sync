import { Pallet } from "@/types/database.types";

interface PalletListViewProps {
  pallets: Pallet[];
}

type Category = "DESKTOPS" | "LAPTOPS" | "DISPLAYS" | "WORKSTATIONS" | "CHROMEBOOKS" | "OTHER";

const categorizePallet = (description: string): Category => {
  const desc = description.toLowerCase();
  if (desc.includes("desktop")) return "DESKTOPS";
  if (desc.includes("laptop")) return "LAPTOPS";
  if (desc.includes("display") || desc.includes("monitor")) return "DISPLAYS";
  if (desc.includes("workstation")) return "WORKSTATIONS";
  if (desc.includes("chromebook")) return "CHROMEBOOKS";
  return "OTHER";
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
    const category = categorizePallet(pallet.description);
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
    <div className="space-y-8 font-mono text-base">
      {categoryOrder.map((category) => {
        const categoryPallets = categorizedPallets[category];
        if (!categoryPallets || categoryPallets.length === 0) return null;

        return (
          <div key={category} className="space-y-2">
            <h2 className="text-2xl font-bold text-primary border-b border-border pb-1 mb-3">
              {category}
            </h2>
            <div className="space-y-1">
              {categoryPallets.map((pallet) => (
                <div
                  key={pallet.id}
                  className="text-foreground hover:bg-accent/50 px-2 py-1 rounded transition-colors"
                >
                  {pallet.pallet_number} - {cleanDescription(pallet.description, category)}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
