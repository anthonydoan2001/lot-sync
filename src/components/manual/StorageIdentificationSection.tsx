import driveTypesImg from "@/assets/storage/different-type-of-drives.png";

const StorageIdentificationSection = () => {
  return (
    <article className="prose prose-slate dark:prose-invert max-w-none">
      <h1 className="text-3xl font-bold mb-2">Storage Drives</h1>
      <p className="text-muted-foreground text-lg mb-8">
        Identifying drive interfaces, protocols, and form factors.
      </p>

      <hr className="my-8" />

      {/* Interfaces & Protocols */}
      <h2 className="text-xl font-semibold mt-8 mb-4">Interfaces & Protocols</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* SATA HDD */}
        <div className="border rounded-lg p-4 bg-card">
          <h3 className="text-lg font-semibold mb-2 mt-0">SATA HDD</h3>
          <ul className="text-sm space-y-1 mb-0 list-disc pl-4">
            <li>Max: 20 TB, 600 MB/s (SATA III)</li>
            <li>Use: Desktops, external drives, bulk storage</li>
          </ul>
        </div>

        {/* SATA SSD */}
        <div className="border rounded-lg p-4 bg-card">
          <h3 className="text-lg font-semibold mb-2 mt-0">SATA SSD</h3>
          <ul className="text-sm space-y-1 mb-0 list-disc pl-4">
            <li>Same connector as SATA HDD</li>
            <li>2.5-inch form factor</li>
            <li>Use: General computing, web browsing, basic programs</li>
          </ul>
        </div>

        {/* NVMe SSD */}
        <div className="border rounded-lg p-4 bg-card">
          <h3 className="text-lg font-semibold mb-2 mt-0">NVMe SSD</h3>
          <ul className="text-sm space-y-1 mb-0 list-disc pl-4">
            <li>Uses PCIe lanes (x4 typical)</li>
            <li>M.2 form factor</li>
            <li>1000-7500 MB/s speeds</li>
            <li>Use: Performance tasks, gaming, OS drives</li>
          </ul>
        </div>

        {/* SAS */}
        <div className="border rounded-lg p-4 bg-card">
          <h3 className="text-lg font-semibold mb-2 mt-0">SAS</h3>
          <ul className="text-sm space-y-1 mb-0 list-disc pl-4">
            <li>Enterprise interface</li>
            <li>Servers and workstations</li>
            <li>Can connect multiple devices to single port</li>
            <li>Use: Data centers, RAID configurations</li>
          </ul>
        </div>
      </div>

      <div className="my-6">
        <img 
          src={driveTypesImg} 
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
              <td className="p-3 text-muted-foreground">Desktops, data centers</td>
            </tr>
            <tr className="border-t">
              <td className="p-3 font-medium">2.5-inch</td>
              <td className="p-3">HDDs and SATA SSDs</td>
              <td className="p-3 text-muted-foreground">Laptops, desktops</td>
            </tr>
            <tr className="border-t">
              <td className="p-3 font-medium">M.2</td>
              <td className="p-3">Ultra-thin SSD modules</td>
              <td className="p-3 text-muted-foreground">Modern laptops/desktops</td>
            </tr>
          </tbody>
        </table>
      </div>


      <h3 className="text-lg font-semibold mt-8 mb-4">M.2 Sizes</h3>
      <p className="text-muted-foreground mb-4">
        M.2 drives are named by their dimensions (width x length in mm).
      </p>

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
              <td className="p-3 font-medium">2230</td>
              <td className="p-3">22mm x 30mm</td>
              <td className="p-3 text-muted-foreground">Compact, ultrabooks</td>
            </tr>
            <tr className="border-t">
              <td className="p-3 font-medium">2242</td>
              <td className="p-3">22mm x 42mm</td>
              <td className="p-3 text-muted-foreground">Small laptops</td>
            </tr>
            <tr className="border-t">
              <td className="p-3 font-medium">2260</td>
              <td className="p-3">22mm x 60mm</td>
              <td className="p-3 text-muted-foreground">Less common</td>
            </tr>
            <tr className="border-t bg-primary/5">
              <td className="p-3 font-medium">2280</td>
              <td className="p-3">22mm x 80mm</td>
              <td className="p-3 font-medium text-primary">Most common</td>
            </tr>
            <tr className="border-t">
              <td className="p-3 font-medium">22110</td>
              <td className="p-3">22mm x 110mm</td>
              <td className="p-3 text-muted-foreground">Enterprise/server</td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  );
};

export default StorageIdentificationSection;
