const RamIdentificationSection = () => (
  <article className="prose prose-slate dark:prose-invert max-w-none">
    <h1 className="text-3xl font-bold mb-2">RAM Identification Guide</h1>
    <p className="text-muted-foreground text-lg mb-8">
      Quick reference for identifying RAM types, speeds, and specifications.
    </p>

    <hr className="my-8" />

    <h2 className="text-xl font-semibold mt-8 mb-4">DDR Generations</h2>
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 font-semibold">Generation</th>
            <th className="text-left p-3 font-semibold">DIMM Pins</th>
            <th className="text-left p-3 font-semibold">SODIMM Pins</th>
            <th className="text-left p-3 font-semibold">Voltage</th>
            <th className="text-left p-3 font-semibold">Speed Range</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="p-3 font-medium">DDR</td>
            <td className="p-3">184</td>
            <td className="p-3">200</td>
            <td className="p-3">2.5V</td>
            <td className="p-3 text-muted-foreground">200–400 MT/s</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium">DDR2</td>
            <td className="p-3">240</td>
            <td className="p-3">200</td>
            <td className="p-3">1.8V</td>
            <td className="p-3 text-muted-foreground">400–1066 MT/s</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium">DDR3</td>
            <td className="p-3">240</td>
            <td className="p-3">204</td>
            <td className="p-3">1.5V</td>
            <td className="p-3 text-muted-foreground">800–2133 MT/s</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium">DDR4</td>
            <td className="p-3">288</td>
            <td className="p-3">260</td>
            <td className="p-3">1.2V</td>
            <td className="p-3 text-muted-foreground">2133–3200+ MT/s</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium">DDR5</td>
            <td className="p-3">288</td>
            <td className="p-3">262</td>
            <td className="p-3">1.1V</td>
            <td className="p-3 text-muted-foreground">4800–8000+ MT/s</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2 className="text-xl font-semibold mt-8 mb-4">DIMM vs SODIMM</h2>
    <div className="grid md:grid-cols-2 gap-4 not-prose">
      <div className="p-4 rounded-lg border bg-card">
        <h3 className="font-semibold mb-2">DIMM (Desktop)</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Full-size desktop memory</li>
          <li>• Length: ~133mm (5.25")</li>
          <li>• Used in: Desktops, servers</li>
        </ul>
      </div>
      <div className="p-4 rounded-lg border bg-card">
        <h3 className="font-semibold mb-2">SODIMM (Laptop)</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Compact laptop memory</li>
          <li>• Length: ~67mm (2.6")</li>
          <li>• Used in: Laptops, mini PCs, NUCs</li>
        </ul>
      </div>
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

    <h2 className="text-xl font-semibold mt-8 mb-4">ECC vs Non-ECC</h2>
    <div className="grid md:grid-cols-2 gap-4 not-prose mb-6">
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
            <td className="p-3">1333</td>
            <td className="p-3 font-mono text-muted-foreground">PC3-10600</td>
          </tr>
          <tr className="border-t bg-muted/20">
            <td className="p-3">1600</td>
            <td className="p-3 font-mono text-muted-foreground">PC3-12800</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium" rowSpan={4}>DDR4</td>
            <td className="p-3">2133</td>
            <td className="p-3 font-mono text-muted-foreground">PC4-17000</td>
          </tr>
          <tr className="border-t">
            <td className="p-3">2400</td>
            <td className="p-3 font-mono text-muted-foreground">PC4-19200</td>
          </tr>
          <tr className="border-t">
            <td className="p-3">2666</td>
            <td className="p-3 font-mono text-muted-foreground">PC4-21300</td>
          </tr>
          <tr className="border-t">
            <td className="p-3">3200</td>
            <td className="p-3 font-mono text-muted-foreground">PC4-25600</td>
          </tr>
          <tr className="border-t bg-muted/20">
            <td className="p-3 font-medium" rowSpan={3}>DDR5</td>
            <td className="p-3">4800</td>
            <td className="p-3 font-mono text-muted-foreground">PC5-38400</td>
          </tr>
          <tr className="border-t bg-muted/20">
            <td className="p-3">5200</td>
            <td className="p-3 font-mono text-muted-foreground">PC5-41600</td>
          </tr>
          <tr className="border-t bg-muted/20">
            <td className="p-3">5600</td>
            <td className="p-3 font-mono text-muted-foreground">PC5-44800</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2 className="text-xl font-semibold mt-8 mb-4">Quick ID Tips</h2>
    <div className="not-prose space-y-3">
      <div className="p-3 rounded-lg border bg-card">
        <span className="font-medium">DDR3 vs DDR4:</span>
        <span className="text-muted-foreground ml-2">DDR4 notch is more centered, DDR4 is slightly taller</span>
      </div>
      <div className="p-3 rounded-lg border bg-card">
        <span className="font-medium">Ranks (1Rx8 vs 2Rx8):</span>
        <span className="text-muted-foreground ml-2">2Rx8 has chips on both sides, may have compatibility limits</span>
      </div>
      <div className="p-3 rounded-lg border bg-card">
        <span className="font-medium">Low Voltage:</span>
        <span className="text-muted-foreground ml-2">DDR3L = 1.35V (look for "L" suffix), backwards compatible</span>
      </div>
    </div>
  </article>
);

export default RamIdentificationSection;
