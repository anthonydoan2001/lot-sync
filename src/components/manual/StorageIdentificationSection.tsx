const StorageIdentificationSection = () => {
  return (
    <article className="prose prose-slate dark:prose-invert max-w-none">

      <div className="my-6">
        <img
          src="/storage/different-type-of-drives.png"
          alt="Different types of storage drives showing internal components"
          className="rounded-lg border w-full"
        />
      </div>

      <hr className="my-8" />

      {/* Form Factors */}
      <h2 className="text-xl font-semibold mt-8 mb-4">Form Factors</h2>

      <div className="overflow-x-auto rounded-lg border mb-6">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-semibold">Form Factor</th>
              <th className="text-left p-3 font-semibold">Description</th>
              <th className="text-left p-3 font-semibold">Common Use</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-3 font-medium">3.5-inch</td>
              <td className="p-3">Larger HDDs, higher capacity</td>
              <td className="p-3 text-muted-foreground">
                Desktops, data centers
              </td>
            </tr>
            <tr className="border-t">
              <td className="p-3 font-medium">2.5-inch</td>
              <td className="p-3">HDDs and SATA SSDs</td>
              <td className="p-3 text-muted-foreground">Laptops, desktops</td>
            </tr>
            <tr className="border-t">
              <td className="p-3 font-medium">M.2</td>
              <td className="p-3">Ultra-thin SSD modules</td>
              <td className="p-3 text-muted-foreground">
                Modern laptops/desktops
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-lg font-semibold mt-8 mb-4">M.2 Sizes</h3>
            <div className="my-6">
        <img
          src="/storage/m2-sizes.png"
          alt="M.2 SSD sizes comparison showing 2230, 2242, 2260, 2280, and 22110 form factors"
          className="rounded-lg border w-full"
        />
      </div>


      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-semibold">Size</th>
              <th className="text-left p-3 font-semibold">Dimensions</th>
              <th className="text-left p-3 font-semibold">Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-3 font-medium">22110</td>
              <td className="p-3">22mm x 110mm</td>
              <td className="p-3 text-muted-foreground">Enterprise/server</td>
            </tr>
            <tr className="border-t bg-primary/5">
              <td className="p-3 font-medium">2280</td>
              <td className="p-3">22mm x 80mm</td>
              <td className="p-3 font-medium text-primary">Most common</td>
            </tr>
            <tr className="border-t">
              <td className="p-3 font-medium">2260</td>
              <td className="p-3">22mm x 60mm</td>
              <td className="p-3 text-muted-foreground">Less common</td>
            </tr>
            <tr className="border-t">
              <td className="p-3 font-medium">2242</td>
              <td className="p-3">22mm x 42mm</td>
              <td className="p-3 text-muted-foreground">Small laptops</td>
            </tr>
            <tr className="border-t">
              <td className="p-3 font-medium">2230</td>
              <td className="p-3">22mm x 30mm</td>
              <td className="p-3 text-muted-foreground">Compact, ultrabooks</td>
            </tr>
          </tbody>
        </table>
      </div>

    </article>
  );
};

export default StorageIdentificationSection;
