import { memo, useMemo } from "react";
import { Pallet } from "@/types/database.types";
import { PalletCategory, CATEGORY_ORDER } from "@/constants/categories";
import { categorizePallet, sortPalletsByDescription, cleanDescription } from "@/utils/sorting";

interface PalletListViewProps {
  pallets: Pallet[];
}

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
      {} as Record<PalletCategory, Pallet[]>,
    );

    return CATEGORY_ORDER.map((category) => ({
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
          {category !== "MISC" && (
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <h2 className="text-2xl font-semibold text-foreground tracking-tight">
                {category === "AIO" ? "ALL IN ONE" : category}
              </h2>
              <span className="text-sm font-medium text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
                {sortedPallets.length}
              </span>
            </div>
          )}
          <div className="space-y-3">
            {sortedPallets.map((pallet) => {
              let description = pallet.description;
              if (pallet.grade && description.startsWith(pallet.grade)) {
                description = description.substring(pallet.grade.length).trim();
              }
              description = cleanDescription(description, category);

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
