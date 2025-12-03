import { useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Keyboard, Monitor, Cpu } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

// Lazy load the CPU stickers section (large SVG assets)
const CpuStickersSection = lazy(() => import("@/components/manual/CpuStickersSection"));

const CpuStickersFallback = () => (
  <div className="space-y-6">
    <Skeleton className="h-10 w-64" />
    <Skeleton className="h-px w-full" />
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex gap-4 p-4 rounded-lg border">
        <Skeleton className="w-20 h-20 rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
    ))}
  </div>
);

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
            {activeSection === "cpu-stickers" && (
              <Suspense fallback={<CpuStickersFallback />}>
                <CpuStickersSection />
              </Suspense>
            )}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
};

const BiosKeysSection = () => (
  <article className="prose prose-slate dark:prose-invert max-w-none">
    <h1 className="text-3xl font-bold mb-8">BIOS Keys by Manufacturer</h1>

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

export default Manual;
