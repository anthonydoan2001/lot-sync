import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Keyboard, Monitor, Cpu, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

type Section = "bios-keys" | "optiplex" | "cpu-stickers";

const sections = [
  { id: "bios-keys" as Section, title: "BIOS Keys", icon: Keyboard },
  { id: "optiplex" as Section, title: "Optiplex Form Factors", icon: Monitor },
  { id: "cpu-stickers" as Section, title: "Intel CPU Stickers", icon: Cpu },
];

const Manual = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section>("bios-keys");

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card/50 flex-shrink-0 hidden md:block">
        <div className="p-4 border-b">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            size="sm"
            className="w-full justify-start"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-65px)]">
          <nav className="p-4 space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2",
                  activeSection === section.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <section.icon className="h-4 w-4" />
                {section.title}
              </button>
            ))}
          </nav>
        </ScrollArea>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 border-b bg-card p-4">
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate("/")} variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <select
            value={activeSection}
            onChange={(e) => setActiveSection(e.target.value as Section)}
            className="flex-1 bg-muted rounded-md px-3 py-2 text-sm"
          >
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:pt-0 pt-20">
        <ScrollArea className="h-screen">
          <div className="max-w-4xl mx-auto px-6 py-10">
            {activeSection === "bios-keys" && <BiosKeysSection />}
            {activeSection === "optiplex" && <OptiplexSection />}
            {activeSection === "cpu-stickers" && <CpuStickersSection />}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
};

const BiosKeysSection = () => (
  <article className="prose prose-slate dark:prose-invert max-w-none">
    <h1 className="text-3xl font-bold mb-2">BIOS Keys by Manufacturer</h1>
    <p className="text-muted-foreground text-lg mb-8">
      Quick reference for accessing BIOS and boot menus on different PC brands.
    </p>

    <hr className="my-8" />

    <h2 className="text-xl font-semibold mt-8 mb-4">Common Manufacturers</h2>
    <p className="text-muted-foreground mb-6">
      Press the key repeatedly during startup before the OS loads.
    </p>

    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 font-semibold">Manufacturer</th>
            <th className="text-left p-3 font-semibold">BIOS Key</th>
            <th className="text-left p-3 font-semibold">Boot Menu</th>
            <th className="text-left p-3 font-semibold">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="p-3 font-medium">Dell</td>
            <td className="p-3"><code className="bg-muted px-2 py-0.5 rounded text-xs">F2</code></td>
            <td className="p-3"><code className="bg-muted px-2 py-0.5 rounded text-xs">F12</code></td>
            <td className="p-3 text-muted-foreground">Press repeatedly on startup</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium">HP</td>
            <td className="p-3"><code className="bg-muted px-2 py-0.5 rounded text-xs">F10</code></td>
            <td className="p-3"><code className="bg-muted px-2 py-0.5 rounded text-xs">F9</code></td>
            <td className="p-3 text-muted-foreground">ESC for startup menu</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium">Lenovo</td>
            <td className="p-3"><code className="bg-muted px-2 py-0.5 rounded text-xs">F1</code> / <code className="bg-muted px-2 py-0.5 rounded text-xs">F2</code></td>
            <td className="p-3"><code className="bg-muted px-2 py-0.5 rounded text-xs">F12</code></td>
            <td className="p-3 text-muted-foreground">ThinkPad: Enter then F1</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium">Acer</td>
            <td className="p-3"><code className="bg-muted px-2 py-0.5 rounded text-xs">F2</code> / <code className="bg-muted px-2 py-0.5 rounded text-xs">Del</code></td>
            <td className="p-3"><code className="bg-muted px-2 py-0.5 rounded text-xs">F12</code></td>
            <td className="p-3 text-muted-foreground">—</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium">ASUS</td>
            <td className="p-3"><code className="bg-muted px-2 py-0.5 rounded text-xs">F2</code> / <code className="bg-muted px-2 py-0.5 rounded text-xs">Del</code></td>
            <td className="p-3"><code className="bg-muted px-2 py-0.5 rounded text-xs">F8</code></td>
            <td className="p-3 text-muted-foreground">—</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium">MSI</td>
            <td className="p-3"><code className="bg-muted px-2 py-0.5 rounded text-xs">Del</code></td>
            <td className="p-3"><code className="bg-muted px-2 py-0.5 rounded text-xs">F11</code></td>
            <td className="p-3 text-muted-foreground">—</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium">Gigabyte</td>
            <td className="p-3"><code className="bg-muted px-2 py-0.5 rounded text-xs">Del</code></td>
            <td className="p-3"><code className="bg-muted px-2 py-0.5 rounded text-xs">F12</code></td>
            <td className="p-3 text-muted-foreground">—</td>
          </tr>
        </tbody>
      </table>
    </div>
  </article>
);

const OptiplexSection = () => (
  <article className="prose prose-slate dark:prose-invert max-w-none">
    <h1 className="text-3xl font-bold mb-2">Dell Optiplex Form Factors</h1>
    <p className="text-muted-foreground text-lg mb-8">
      Understanding the different Optiplex chassis sizes and their specifications.
    </p>

    <hr className="my-8" />

    <h2 className="text-xl font-semibold mt-8 mb-4">SFF (Small Form Factor)</h2>
    <p className="mb-6">
      Compact desktop size. Accepts low-profile expansion cards only. 
      Common dimensions: approximately 11.4" x 3.65" x 12.3".
    </p>

    <h2 className="text-xl font-semibold mt-8 mb-4">USFF (Ultra Small Form Factor)</h2>
    <p className="mb-6">
      Smallest desktop option with no expansion slots. Can be VESA mounted behind monitors. 
      Dimensions: approximately 9.3" x 2.6" x 9.3".
    </p>

    <h2 className="text-xl font-semibold mt-8 mb-4">Tower (MT/Mini Tower)</h2>
    <p className="mb-6">
      Full-size tower format. Supports full-height expansion cards. 
      More drive bays and better cooling capacity for demanding workloads.
    </p>

    <h2 className="text-xl font-semibold mt-8 mb-4">Desktop (DT)</h2>
    <p className="mb-6">
      Lies flat with monitor sitting on top. Less common in newer models. 
      Similar internal specifications to SFF.
    </p>

    <h2 className="text-xl font-semibold mt-8 mb-4">Micro</h2>
    <p className="mb-6">
      Smallest option available in newer Optiplex models. VESA mountable. 
      Dimensions: approximately 7.2" x 1.4" x 7.2". Uses external power brick.
    </p>

    <hr className="my-8" />

    <h2 className="text-xl font-semibold mt-8 mb-4">Quick Comparison</h2>
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 font-semibold">Form Factor</th>
            <th className="text-left p-3 font-semibold">Expansion</th>
            <th className="text-left p-3 font-semibold">VESA Mount</th>
            <th className="text-left p-3 font-semibold">Best For</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="p-3 font-medium">SFF</td>
            <td className="p-3">Low-profile only</td>
            <td className="p-3">No</td>
            <td className="p-3 text-muted-foreground">General office use</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium">USFF</td>
            <td className="p-3">None</td>
            <td className="p-3">Yes</td>
            <td className="p-3 text-muted-foreground">Space-constrained setups</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium">Tower</td>
            <td className="p-3">Full-height</td>
            <td className="p-3">No</td>
            <td className="p-3 text-muted-foreground">Power users, GPU needs</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium">Desktop</td>
            <td className="p-3">Low-profile</td>
            <td className="p-3">No</td>
            <td className="p-3 text-muted-foreground">Under-monitor placement</td>
          </tr>
          <tr className="border-t">
            <td className="p-3 font-medium">Micro</td>
            <td className="p-3">None</td>
            <td className="p-3">Yes</td>
            <td className="p-3 text-muted-foreground">Minimal footprint</td>
          </tr>
        </tbody>
      </table>
    </div>
  </article>
);

// Sticker imports
import sticker1stGen from "@/assets/stickers/1st-gen.svg";
import sticker2nd3rdGen from "@/assets/stickers/2nd-3rd-gen.svg";
import sticker4thGen from "@/assets/stickers/4th-gen.svg";
import sticker5thGen from "@/assets/stickers/5th-gen.svg";
import sticker6th9thGen from "@/assets/stickers/6th-9th-gen.svg";
import sticker10thGen from "@/assets/stickers/10th-gen.svg";
import sticker11thGen from "@/assets/stickers/11th-gen.svg";
import sticker11to13thGen from "@/assets/stickers/11-13th-gen.svg";
import sticker14th15thGen from "@/assets/stickers/14th-15th-gen.svg";

const stickerData = [
  {
    era: "2009–2011",
    logo: "2009 Logo",
    generations: "1st Gen (Nehalem)",
    codename: "Nehalem",
    notes: "Also updated Core 2 branding",
    sticker: sticker1stGen,
  },
  {
    era: "2011–2013",
    logo: "2011 Logo",
    generations: "2nd, 3rd Gen",
    codename: "Sandy Bridge, Ivy Bridge",
    notes: "Nehalem CPUs stayed with 2009 logos",
    sticker: sticker2nd3rdGen,
  },
  {
    era: "2013–2014",
    logo: "Haswell Logo",
    generations: "4th Gen",
    codename: "Haswell",
    notes: "Some Haswell PCs may have Broadwell stickers",
    sticker: sticker4thGen,
  },
  {
    era: "2014–2015",
    logo: "Broadwell Logo",
    generations: "5th Gen",
    codename: "Broadwell",
    notes: "—",
    sticker: sticker5thGen,
  },
  {
    era: "2015–2019",
    logo: "2015 Logo",
    generations: "6th, 7th, 8th, 9th Gen",
    codename: "Skylake, Kaby Lake, Coffee Lake",
    notes: "Gen number starts replacing 'Inside' on 7th Gen",
    sticker: sticker6th9thGen,
  },
  {
    era: "2019–2020",
    logo: "2019 Logo",
    generations: "10th Gen",
    codename: "Ice Lake, Comet Lake",
    notes: "Previous gens stayed with 2015 logos",
    sticker: sticker10thGen,
  },
  {
    era: "2020 (Prelaunch)",
    logo: "Prelaunch 2020",
    generations: "Early 11th Gen",
    codename: "Tiger Lake previews",
    notes: "Pre-release / marketing material only",
    sticker: sticker11thGen,
  },
  {
    era: "2020–2023",
    logo: "2020 Logo",
    generations: "11th, 12th, 13th Gen",
    codename: "Tiger Lake, Alder Lake, Raptor Lake",
    notes: "10th Gen still used 2019 logo",
    sticker: sticker11to13thGen,
  },
  {
    era: "2023–Present",
    logo: "2024 Logo (Core Ultra)",
    generations: "14th, 15th Gen",
    codename: "Meteor Lake, Lunar Lake",
    notes: "12th/13th Gen still use 2020 stickers",
    sticker: sticker14th15thGen,
  },
];

const CpuStickersSection = () => (
  <article className="prose prose-slate dark:prose-invert max-w-none">
    <h1 className="text-3xl font-bold mb-2">Intel CPU Stickers by Generation</h1>
    <p className="text-muted-foreground text-lg mb-8">
      Visual identification guide for Intel processor generations based on sticker design (2009–Present).
    </p>

    <hr className="my-8" />

    <h2 className="text-xl font-semibold mt-8 mb-4">Sticker Timeline</h2>
    
    <div className="grid gap-6">
      {stickerData.map((item, index) => (
        <div key={index} className="flex gap-4 p-4 rounded-lg border bg-card/50 items-start">
          <div className="flex-shrink-0 w-20 h-20 bg-white rounded-md flex items-center justify-center p-2 border">
            <img src={item.sticker} alt={`${item.logo} sticker`} className="max-w-full max-h-full object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-foreground">{item.era}</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{item.logo}</span>
            </div>
            <p className="text-sm font-medium text-foreground mb-1">{item.generations}</p>
            <p className="text-xs text-muted-foreground mb-1">Codename: {item.codename}</p>
            {item.notes !== "—" && (
              <p className="text-xs text-muted-foreground italic">{item.notes}</p>
            )}
          </div>
        </div>
      ))}
    </div>

    <hr className="my-8" />

    <h2 className="text-xl font-semibold mt-8 mb-4">Summary Table</h2>
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 font-semibold">Years</th>
            <th className="text-left p-3 font-semibold">Sticker Used</th>
            <th className="text-left p-3 font-semibold">CPU Generations</th>
          </tr>
        </thead>
        <tbody>
          {stickerData.map((item, index) => (
            <tr key={index} className="border-t">
              <td className="p-3 font-medium">{item.era}</td>
              <td className="p-3">{item.logo}</td>
              <td className="p-3 text-muted-foreground">{item.generations}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <hr className="my-8" />

    <h2 className="text-xl font-semibold mt-8 mb-4">How to Read Model Numbers</h2>
    <p className="mb-4">
      Intel processor model numbers follow a consistent pattern:
    </p>
    <ul className="list-disc pl-6 space-y-2 mb-6">
      <li><strong>Brand:</strong> i3, i5, i7, i9 (performance tier)</li>
      <li><strong>Generation:</strong> First 1-2 digits after brand</li>
      <li><strong>SKU:</strong> Remaining digits indicate performance within generation</li>
      <li><strong>Suffix:</strong> K (unlocked), F (no integrated graphics), T (power-optimized)</li>
    </ul>
    <p className="text-muted-foreground">
      Example: <code className="bg-muted px-2 py-0.5 rounded text-xs">i5-12400</code> = Core i5, 12th generation, SKU 400
    </p>
  </article>
);

export default Manual;
