export interface LightingOption {
  id: string;
  name: string;
  description: string;
  promptText: string;
}

export const lightingOptions: LightingOption[] = [
  { id: "golden_hour", name: "Golden Hour", description: "Warm, low-angle sunlight typical of late afternoon", promptText: "during golden hour with warm low-angle sunlight" },
  { id: "magic_hour", name: "Magic Hour", description: "Soft, glowing sky shortly after sunset or before sunrise", promptText: "during magic hour with a soft glowing ambient sky light" },
  { id: "rembrandt", name: "Rembrandt", description: "Dramatic lighting with a characteristic triangle of light on one cheek", promptText: "with Rembrandt style studio lighting, creating dramatic contrast and depth" },
  { id: "neon_backlight", name: "Neon Backlight", description: "Vibrant neon lighting from behind the subject", promptText: "illuminated by vibrant neon backlight casting colorful glow" },
  { id: "studio_softbox", name: "Studio Softbox", description: "Diffuse, even studio light with soft shadows", promptText: "lit with professional studio softboxes for clean diffused lighting" },
  { id: "ring_light", name: "Ring Light", description: "Circular light creating unique ring-shaped catches in eyes", promptText: "shot with a ring light source creating even facial highlights" },
  { id: "overcast_flat", name: "Overcast Flat", description: "Muted, shadowless lighting from a cloud-covered sky", promptText: "under flat overcast moody skies with shadowless lighting" },
  { id: "candlelight", name: "Candlelight", description: "Flickering, intimate amber light", promptText: "illuminated by the warm flickering glow of candlelight" },
  { id: "moonlight", name: "Moonlight", description: "Cool blue, dim natural night lighting", promptText: "bathed in cool blue ethereal moonlight under a dark night sky" },
  { id: "hard_midday", name: "Hard Midday", description: "Strong overhead direct sunlight creating sharp shadows", promptText: "shot under harsh direct midday sun with strong vertical contrast and dark shadows" },
  { id: "split_lighting", name: "Split Lighting", description: "Divides the subject exactly in half with one side lit and one dark", promptText: "with split lighting casting half of the subject in deep shadow" },
  { id: "silhouette_backlit", name: "Silhouette Backlit", description: "Strong light behind the subject, outlining their form", promptText: "backlit creating a strong dark silhouette against a bright light source" },
  { id: "practical_lamp", name: "Practical Lamp", description: "Light originating from a lamp or light source in the frame", promptText: "lit by a warm table lamp visible in the scene" },
  { id: "bioluminescent", name: "Bioluminescent", description: "Glowing natural organisms lighting up the environment", promptText: "with a soft bioluminescent glow emitting from natural sources in the background" },
  { id: "volumetric_rays", name: "Volumetric Rays", description: "Visible shafts of light passing through haze or dust", promptText: "with dramatic volumetric god rays cutting through misty air" },
  { id: "window_diffuse", name: "Window Diffuse", description: "Soft, directional natural light through a window", promptText: "lit by soft directional window light pouring into the room" },
  { id: "chiaroscuro", name: "Chiaroscuro", description: "Extreme contrast between dark shadows and brilliant highlights", promptText: "with high-contrast chiaroscuro styling for fine-art painterly depth" },
  { id: "high_key", name: "High Key", description: "Bright, airy scene dominated by light tones", promptText: "rendered in clean high-key white aesthetic with minimal shadow" },
  { id: "low_key", name: "Low Key", description: "Moody, dark scene dominated by dark tones", promptText: "rendered in low-key style with deep shadows and select highlights" },
  { id: "firelight", name: "Firelight", description: "Deep amber, dynamic flickering light from a campfire or fireplace", promptText: "bathed in the flickering orange glow of a nearby crackling bonfire" }
];
