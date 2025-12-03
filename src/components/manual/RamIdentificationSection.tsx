const RamIdentificationSection = () => (
  <article className="prose prose-slate dark:prose-invert max-w-none">
    <h1 className="text-3xl font-bold mb-8">RAM Identification Guide</h1>

    <h2 className="text-xl font-semibold mt-8 mb-4">DIMM vs SODIMM</h2>
    <div className="grid md:grid-cols-2 gap-4 not-prose">
      <div className="p-4 rounded-lg border bg-card">
        <h3 className="font-semibold mb-2">DIMM (Desktop)</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Full-size desktop memory</li>
          <li>• Used in: Desktops, servers</li>
        </ul>
      </div>
      <div className="p-4 rounded-lg border bg-card">
        <h3 className="font-semibold mb-2">SODIMM (Laptop)</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Compact laptop memory</li>
          <li>• Used in: Laptops, mini PCs, NUCs</li>
        </ul>
      </div>
    </div>

    <h2 className="text-xl font-semibold mt-8 mb-4">DDR Generations</h2>
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 font-semibold">Generation</th>
            <th className="text-left p-3 font-semibold">Speed Range</th>
            <th className="text-left p-3 font-semibold">Max per Stick</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="p-3 font-medium">DDR</td>
            <td className="p-3 text-muted-foreground">200–400 MT/s</td>
            <td className="p-3 text-muted-foreground">1GB</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium">DDR2</td>
            <td className="p-3 text-muted-foreground">400–1066 MT/s</td>
            <td className="p-3 text-muted-foreground">4GB</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium">DDR3</td>
            <td className="p-3 text-muted-foreground">800–2133 MT/s</td>
            <td className="p-3 text-muted-foreground">16GB</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium">DDR4</td>
            <td className="p-3 text-muted-foreground">2133–3200+ MT/s</td>
            <td className="p-3 text-muted-foreground">128GB</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium">DDR5</td>
            <td className="p-3 text-muted-foreground">4800–8000+ MT/s</td>
            <td className="p-3 text-muted-foreground">256GB</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2 className="text-xl font-semibold mt-8 mb-4">Common Speeds Reference</h2>
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 font-semibold">DDR Gen</th>
            <th className="text-left p-3 font-semibold">Speed (MT/s)</th>
            <th className="text-left p-3 font-semibold">Module Name</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t bg-muted/20">
            <td className="p-3 font-medium" rowSpan={2}>DDR3</td>
            <td className="p-3">1333 MHz</td>
            <td className="p-3 font-mono text-muted-foreground">PC3-10600</td>
          </tr>
          <tr className="border-t bg-muted/20">
            <td className="p-3">1600 MHz</td>
            <td className="p-3 font-mono text-muted-foreground">PC3-12800</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium" rowSpan={4}>DDR4</td>
            <td className="p-3">2133 MHz</td>
            <td className="p-3 font-mono text-muted-foreground">PC4-17000</td>
          </tr>
          <tr className="border-t">
            <td className="p-3">2400 MHz</td>
            <td className="p-3 font-mono text-muted-foreground">PC4-19200</td>
          </tr>
          <tr className="border-t">
            <td className="p-3">2666 MHz</td>
            <td className="p-3 font-mono text-muted-foreground">PC4-21300</td>
          </tr>
          <tr className="border-t">
            <td className="p-3">3200 MHz</td>
            <td className="p-3 font-mono text-muted-foreground">PC4-25600</td>
          </tr>
          <tr className="border-t bg-muted/20">
            <td className="p-3 font-medium" rowSpan={3}>DDR5</td>
            <td className="p-3">4800 MHz</td>
            <td className="p-3 font-mono text-muted-foreground">PC5-38400</td>
          </tr>
          <tr className="border-t bg-muted/20">
            <td className="p-3">5200 MHz</td>
            <td className="p-3 font-mono text-muted-foreground">PC5-41600</td>
          </tr>
          <tr className="border-t bg-muted/20">
            <td className="p-3">5600 MHz</td>
            <td className="p-3 font-mono text-muted-foreground">PC5-44800</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2 className="text-xl font-semibold mt-8 mb-4">Reading RAM Labels</h2>
    <p className="mb-4">Example label breakdown:</p>
    <div className="bg-muted/50 p-4 rounded-lg border font-mono text-sm mb-4">
      8GB 1Rx8 PC4-2666V-UA2-11
    </div>
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 font-semibold">Part</th>
            <th className="text-left p-3 font-semibold">Meaning</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="p-3 font-medium font-mono">8GB</td>
            <td className="p-3 text-muted-foreground">Capacity</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium font-mono">1Rx8</td>
            <td className="p-3 text-muted-foreground">Single rank, 8 chips per side</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium font-mono">PC4</td>
            <td className="p-3 text-muted-foreground">DDR4 (PC3=DDR3, PC5=DDR5)</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium font-mono">2666V</td>
            <td className="p-3 text-muted-foreground">2666 MT/s speed, V=1.2V</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium font-mono">UA2</td>
            <td className="p-3 text-muted-foreground">Unbuffered, non-ECC</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2 className="text-xl font-semibold mt-8 mb-4">Rank Compatibility</h2>
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 font-semibold">Code</th>
            <th className="text-left p-3 font-semibold">Meaning</th>
            <th className="text-left p-3 font-semibold">Typical Use</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="p-3 font-medium font-mono">1Rx8</td>
            <td className="p-3 text-muted-foreground">Single rank, 8 chips</td>
            <td className="p-3 text-muted-foreground">Consumer desktops</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium font-mono">2Rx8</td>
            <td className="p-3 text-muted-foreground">Dual rank, 8 chips per rank</td>
            <td className="p-3 text-muted-foreground">Higher capacity consumer</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium font-mono">1Rx4</td>
            <td className="p-3 text-muted-foreground">Single rank, 4 chips (high density)</td>
            <td className="p-3 text-muted-foreground">Servers</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium font-mono">2Rx4</td>
            <td className="p-3 text-muted-foreground">Dual rank, 4 chips per rank</td>
            <td className="p-3 text-muted-foreground">Server memory</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p className="text-sm text-muted-foreground mt-3">
      <strong>Note:</strong> Mixing ranks can work but may reduce performance. Some systems have rank limits per channel.
    </p>

    <h2 className="text-xl font-semibold mt-8 mb-4">ECC vs Non-ECC</h2>
    <div className="grid md:grid-cols-2 gap-4 not-prose">
      <div className="p-4 rounded-lg border bg-card">
        <h3 className="font-semibold mb-2">Non-ECC (Standard)</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• 8 memory chips per side</li>
          <li>• Consumer desktops/laptops</li>
          <li>• Lower cost</li>
        </ul>
      </div>
      <div className="p-4 rounded-lg border bg-card">
        <h3 className="font-semibold mb-2">ECC (Error-Correcting)</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• 9 memory chips per side</li>
          <li>• Servers, workstations</li>
          <li>• Requires compatible motherboard</li>
        </ul>
      </div>
    </div>

    <h2 className="text-xl font-semibold mt-8 mb-4">RDIMM vs UDIMM</h2>
    <div className="grid md:grid-cols-2 gap-4 not-prose">
      <div className="p-4 rounded-lg border bg-card">
        <h3 className="font-semibold mb-2">UDIMM (Unbuffered)</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Direct memory controller connection</li>
          <li>• Lower latency</li>
          <li>• Max 2 DIMMs per channel</li>
          <li>• Consumer desktops</li>
        </ul>
      </div>
      <div className="p-4 rounded-lg border bg-card">
        <h3 className="font-semibold mb-2">RDIMM (Registered)</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Buffered signals for stability</li>
          <li>• Supports more DIMMs per channel</li>
          <li>• Requires server motherboard</li>
          <li>• Servers, workstations</li>
        </ul>
      </div>
    </div>

    <h2 className="text-xl font-semibold mt-8 mb-4">Common Manufacturer Codes</h2>
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 font-semibold">Prefix</th>
            <th className="text-left p-3 font-semibold">Manufacturer</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="p-3 font-medium font-mono">KVR</td>
            <td className="p-3 text-muted-foreground">Kingston ValueRAM</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium font-mono">CT</td>
            <td className="p-3 text-muted-foreground">Crucial</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium font-mono">HX</td>
            <td className="p-3 text-muted-foreground">HyperX (Kingston)</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium font-mono">CMK</td>
            <td className="p-3 text-muted-foreground">Corsair Vengeance</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium font-mono">M378</td>
            <td className="p-3 text-muted-foreground">Samsung (desktop unbuffered)</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium font-mono">M393</td>
            <td className="p-3 text-muted-foreground">Samsung (server registered)</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium font-mono">HMA</td>
            <td className="p-3 text-muted-foreground">SK Hynix</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium font-mono">MTA</td>
            <td className="p-3 text-muted-foreground">Micron</td>
          </tr>
        </tbody>
      </table>
    </div>
  </article>
);

export default RamIdentificationSection;
