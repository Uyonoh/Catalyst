export interface TemplateBundle {
  id: string;
  name: string;
  description: string;
  fields: Record<string, string>;
}

export const templateLibrary: TemplateBundle[] = [
  {
    id: "cinematic_portrait",
    name: "Cinematic Portrait",
    description: "Moody, detailed studio portrait with film grain and rich colors",
    fields: {
      subject: "A sophisticated portrait of an expressive model looking thoughtfully into the distance",
      shotType: "close-up portrait",
      cameraAngle: "eye-level",
      environment: "dimly lit rustic coffee shop with rain trickling down the window in the background",
      compositionStyle: "rule of thirds, shallow depth of field",
      lighting: "window_diffuse", // references lightingOption id
      mood: "introspective, melancholic",
      cameraBody: "Sony A7R V",
      focalLength: "85mm",
      lensType: "f/1.4 prime lens",
      filmStock: "Kodak Portra 400",
      aspectRatio: "3:2",
      photographerStyle: "Steve McCurry style",
      visualAesthetic: "cinematic realism",
      texture: "fine dust and scratches, subtle film grain",
      colorGrade: "warm highlights, slightly teal undertones",
      negativePrompt: "deformed, blurry, low resolution, overhead fluorescent lighting, overexposed"
    }
  },
  {
    id: "neon_street_scene",
    name: "Neon Street Scene",
    description: "Cyberpunk aesthetic with rainy streets and glowing signs",
    fields: {
      subject: "A lone figure walking with a translucent umbrella down a narrow alleyway",
      shotType: "medium shot",
      cameraAngle: "low angle",
      environment: "futuristic Tokyo alley, wet asphalt reflecting bright colored signs, steam rising from grates",
      compositionStyle: "leading lines, high reflection",
      lighting: "neon_backlight",
      mood: "cyberpunk, mysterious, futuristic",
      cameraBody: "Leica M11",
      focalLength: "35mm",
      lensType: "f/2 anamorphic lens",
      filmStock: "Fujifilm Superia X-TRA 400",
      aspectRatio: "16:9",
      photographerStyle: "Liam Wong style",
      visualAesthetic: "neon noir",
      texture: "crisp details on rain droplets, glossy reflections",
      colorGrade: "vibrant purples, electric blues, neon pinks",
      negativePrompt: "sunny day, dry ground, traditional, low contrast, washed out colors"
    }
  },
  {
    id: "product_macro",
    name: "Product Macro",
    description: "Ultra-sharp commercial product shot with perfect studio lighting",
    fields: {
      subject: "An elegant glass perfume bottle with intricate golden engraving and liquid shimmering inside",
      shotType: "extreme close-up",
      cameraAngle: "eye-level",
      environment: "pure dark marble surface with subtle smoke wisps",
      compositionStyle: "centered, symmetrical composition",
      lighting: "studio_softbox",
      mood: "luxurious, premium, pristine",
      cameraBody: "Hasselblad H6D-100c",
      focalLength: "120mm",
      lensType: "macro lens f/2.8",
      filmStock: "digital medium format",
      aspectRatio: "1:1",
      photographerStyle: "commercial advertising style",
      visualAesthetic: "high-end product render",
      texture: "hyper-detailed glass reflections, metallic sheen, water condensation drops",
      colorGrade: "emerald and gold tones, clean neutral whites",
      negativePrompt: "dust, scratches, fingerprints, out of focus bottle, noisy, cheap, plastic"
    }
  },
  {
    id: "landscape_epic",
    name: "Epic Landscape",
    description: "Breath-taking panoramic landscape during sunrise",
    fields: {
      subject: "Towering snow-capped mountain peaks piercing through a sea of morning fog",
      shotType: "wide establishing shot",
      cameraAngle: "high angle",
      environment: "Swiss Alps, green pine forests below, crystal clear glacial lake in the foreground",
      compositionStyle: "golden ratio, deep depth of field",
      lighting: "golden_hour",
      mood: "majestic, serene, awe-inspiring",
      cameraBody: "Fujifilm GFX 100S",
      focalLength: "24mm",
      lensType: "ultra-wide angle lens",
      filmStock: "Fujichrome Velvia 50",
      aspectRatio: "21:9",
      photographerStyle: "Ansel Adams composition",
      visualAesthetic: "National Geographic realism",
      texture: "crisp mountain ridges, fine pine tree details, soft mist texture",
      colorGrade: "golden and orange sunrise sky, deep blue shadows",
      negativePrompt: "human figures, structures, powerlines, hazy sky, blurry, oversaturated colors"
    }
  },
  {
    id: "retro_film",
    name: "Retro Film Still",
    description: "Vintage 1970s cinematic style with high grain",
    fields: {
      subject: "A group of vintage cars parked outside a dusty desert motel roadhouse",
      shotType: "medium wide shot",
      cameraAngle: "low heroic angle",
      environment: "Route 66 highway, arid desert landscape with saguaro cacti, heat haze",
      compositionStyle: "vintage cinematic frame",
      lighting: "hard_midday",
      mood: "nostalgic, retro, hot, dry",
      cameraBody: "Arri Alexa Retro Mod",
      focalLength: "50mm",
      lensType: "vintage Panavision C-Series anamorphic",
      filmStock: "Kodachrome 64",
      aspectRatio: "16:9",
      photographerStyle: "William Eggleston style",
      visualAesthetic: "70s cinema aesthetic",
      texture: "heavy vintage grain, chromatic aberration, lens flare",
      colorGrade: "warm yellow-green color cast, faded shadows, saturated red tones",
      negativePrompt: "modern cars, cell phones, high tech, clean digital look, sharp 8k"
    }
  }
];
