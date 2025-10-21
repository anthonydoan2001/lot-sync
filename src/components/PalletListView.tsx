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
    <div className="space-y-8 font-mono text-2xl">
      {categoryOrder.map((category) => {
        const categoryPallets = categorizedPallets[category];
        if (!categoryPallets || categoryPallets.length === 0) return null;

        return (
          <div key={category} className="space-y-3">
            <h2 className="text-4xl font-bold text-primary border-b-2 border-border pb-2 mb-4">
              {category}
            </h2>
            <div className="space-y-2">
              {categoryPallets.map((pallet) => (
                <div
                  key={pallet.id}
                  className="text-foreground hover:bg-accent/50 px-3 py-2 rounded transition-colors"
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
