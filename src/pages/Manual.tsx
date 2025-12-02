import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, BookOpen, Keyboard, Monitor, Cpu } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Manual = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              size="lg"
              className="shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                <BookOpen className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Company Manual
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Accordion type="multiple" className="space-y-4">
          {/* BIOS Keys Section */}
          <AccordionItem value="bios-keys" className="border rounded-lg shadow-md bg-card">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Keyboard className="h-5 w-5" />
                </div>
                <span className="text-lg font-semibold">BIOS Keys by Manufacturer</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-semibold">Manufacturer</th>
                      <th className="text-left p-3 font-semibold">BIOS Key</th>
                      <th className="text-left p-3 font-semibold">Boot Menu</th>
                      <th className="text-left p-3 font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium">Dell</td>
                      <td className="p-3"><code className="bg-muted px-2 py-1 rounded">F2</code></td>
                      <td className="p-3"><code className="bg-muted px-2 py-1 rounded">F12</code></td>
                      <td className="p-3 text-muted-foreground">Press repeatedly on startup</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium">HP</td>
                      <td className="p-3"><code className="bg-muted px-2 py-1 rounded">F10</code></td>
                      <td className="p-3"><code className="bg-muted px-2 py-1 rounded">F9</code></td>
                      <td className="p-3 text-muted-foreground">ESC for startup menu</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium">Lenovo</td>
                      <td className="p-3"><code className="bg-muted px-2 py-1 rounded">F1</code> or <code className="bg-muted px-2 py-1 rounded">F2</code></td>
                      <td className="p-3"><code className="bg-muted px-2 py-1 rounded">F12</code></td>
                      <td className="p-3 text-muted-foreground">ThinkPad: Enter then F1</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium">Acer</td>
                      <td className="p-3"><code className="bg-muted px-2 py-1 rounded">F2</code> or <code className="bg-muted px-2 py-1 rounded">Del</code></td>
                      <td className="p-3"><code className="bg-muted px-2 py-1 rounded">F12</code></td>
                      <td className="p-3 text-muted-foreground">—</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium">ASUS</td>
                      <td className="p-3"><code className="bg-muted px-2 py-1 rounded">F2</code> or <code className="bg-muted px-2 py-1 rounded">Del</code></td>
                      <td className="p-3"><code className="bg-muted px-2 py-1 rounded">F8</code></td>
                      <td className="p-3 text-muted-foreground">—</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium">MSI</td>
                      <td className="p-3"><code className="bg-muted px-2 py-1 rounded">Del</code></td>
                      <td className="p-3"><code className="bg-muted px-2 py-1 rounded">F11</code></td>
                      <td className="p-3 text-muted-foreground">—</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium">Gigabyte</td>
                      <td className="p-3"><code className="bg-muted px-2 py-1 rounded">Del</code></td>
                      <td className="p-3"><code className="bg-muted px-2 py-1 rounded">F12</code></td>
                      <td className="p-3 text-muted-foreground">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Optiplex Form Factors Section */}
          <AccordionItem value="optiplex" className="border rounded-lg shadow-md bg-card">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                  <Monitor className="h-5 w-5" />
                </div>
                <span className="text-lg font-semibold">Dell Optiplex Form Factors</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">SFF (Small Form Factor)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      Compact desktop size. Accepts low-profile expansion cards only. 
                      Common dimensions: ~11.4" x 3.65" x 12.3"
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">USFF (Ultra Small Form Factor)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      Smallest desktop option. No expansion slots. 
                      Can be VESA mounted. ~9.3" x 2.6" x 9.3"
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Tower (MT/Tower)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      Full-size tower. Full-height expansion cards. 
                      More drive bays and cooling capacity.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Desktop (DT)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      Lies flat, monitor sits on top. Less common now. 
                      Similar specs to SFF.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Micro</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      Smallest option (newer models). VESA mountable. 
                      ~7.2" x 1.4" x 7.2". External power brick.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Intel CPU Stickers Section */}
          <AccordionItem value="cpu-stickers" className="border rounded-lg shadow-md bg-card">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10 text-accent">
                  <Cpu className="h-5 w-5" />
                </div>
                <span className="text-lg font-semibold">Intel CPU Stickers by Generation</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-semibold">Generation</th>
                      <th className="text-left p-3 font-semibold">Years</th>
                      <th className="text-left p-3 font-semibold">Model Numbers</th>
                      <th className="text-left p-3 font-semibold">Sticker Design</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium">4th Gen (Haswell)</td>
                      <td className="p-3">2013-2014</td>
                      <td className="p-3"><code className="bg-muted px-2 py-1 rounded">i5-4xxx</code></td>
                      <td className="p-3 text-muted-foreground">Blue gradient, curved design</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium">6th Gen (Skylake)</td>
                      <td className="p-3">2015-2016</td>
                      <td className="p-3"><code className="bg-muted px-2 py-1 rounded">i5-6xxx</code></td>
                      <td className="p-3 text-muted-foreground">Blue square, white text</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium">7th Gen (Kaby Lake)</td>
                      <td className="p-3">2016-2017</td>
                      <td className="p-3"><code className="bg-muted px-2 py-1 rounded">i5-7xxx</code></td>
                      <td className="p-3 text-muted-foreground">Blue square, "7th Gen" badge</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium">8th Gen (Coffee Lake)</td>
                      <td className="p-3">2017-2018</td>
                      <td className="p-3"><code className="bg-muted px-2 py-1 rounded">i5-8xxx</code></td>
                      <td className="p-3 text-muted-foreground">Blue hexagon design</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium">10th Gen (Comet Lake)</td>
                      <td className="p-3">2020</td>
                      <td className="p-3"><code className="bg-muted px-2 py-1 rounded">i5-10xxx</code></td>
                      <td className="p-3 text-muted-foreground">Blue badge, "10" prominent</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium">11th Gen (Tiger Lake)</td>
                      <td className="p-3">2020-2021</td>
                      <td className="p-3"><code className="bg-muted px-2 py-1 rounded">i5-11xxx</code></td>
                      <td className="p-3 text-muted-foreground">Blue gradient, modern look</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium">12th Gen (Alder Lake)</td>
                      <td className="p-3">2021-2022</td>
                      <td className="p-3"><code className="bg-muted px-2 py-1 rounded">i5-12xxx</code></td>
                      <td className="p-3 text-muted-foreground">Blue/black, "12th Gen Intel Core"</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium">13th Gen (Raptor Lake)</td>
                      <td className="p-3">2022-2023</td>
                      <td className="p-3"><code className="bg-muted px-2 py-1 rounded">i5-13xxx</code></td>
                      <td className="p-3 text-muted-foreground">Blue, "13th Gen Intel Core"</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Placeholder for more sections */}
        <div className="mt-8 p-6 border-2 border-dashed border-muted-foreground/30 rounded-lg text-center">
          <p className="text-muted-foreground">More sections coming soon...</p>
        </div>
      </main>
    </div>
  );
};

export default Manual;
