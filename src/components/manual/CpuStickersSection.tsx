import sticker1stGen from "@/assets/stickers/1st-gen.png";
import sticker2nd3rdGen from "@/assets/stickers/2nd-3rd-gen.png";
import sticker4thGen from "@/assets/stickers/4th-gen.png";
import sticker5thGen from "@/assets/stickers/5th-gen.png";
import sticker6th9thGen from "@/assets/stickers/6th-9th-gen.png";
import sticker10thGen from "@/assets/stickers/10th-gen.png";
import sticker11thGen from "@/assets/stickers/11th-gen.png";
import sticker11to13thGen from "@/assets/stickers/11-13th-gen.png";
import sticker14th15thGen from "@/assets/stickers/14th-15th-gen.png";

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

    <hr className="my-8" />
    
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
            <p className="text-xs text-muted-foreground">{item.codename}</p>
          </div>
        </div>
      ))}
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

export default CpuStickersSection;
