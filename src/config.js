// WhatsApp number (digits only, with country code).
export const WHATSAPP_NUMBER = '919873328764'

const waLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`

export const QUOTE_LINK = waLink(
  "Hi 3D Spire, I'd like a quote. I have an idea / reference image for a 3D model.",
)
export const CATALOGUE_LINK = waLink(
  'Hi 3D Spire, please share the catalogue and prices.',
)
export const INSTAGRAM_LINK = 'https://www.instagram.com/3d_spire'

const asset = (file) => `${import.meta.env.BASE_URL}${file}`

// Served from /public, so it must respect Vite's base path.
export const MODEL_URL = asset('shiva-drinking-poison.glb')
// 2D reference shown as the "idea" stage before the sculpt fades in.
export const IDEA_IMAGE_URL = asset('idea-reference.jpg')

// Ready-made collection shown on the site (compressed GLBs + front stills in /public).
export const COLLECTION = [
  {
    id: 'shiva-drinking-poison',
    name: 'Shiva drinking poison',
    src: asset('shiva-drinking-poison.glb'),
    preview: asset('previews/shiva-drinking-poison.jpg'),
  },
  {
    id: 'hanuman-body',
    name: 'Hanuman',
    src: asset('hanuman-body.glb'),
    preview: asset('previews/hanuman-body.jpg'),
  },
  {
    id: 'narsingh',
    name: 'Narsingh',
    src: asset('narsingh.glb'),
    preview: asset('previews/narsingh.jpg'),
  },
  {
    id: 'neem-karoli-baba',
    name: 'Neem Karoli Baba',
    src: asset('neem-karoli-baba.glb'),
    preview: asset('previews/neem-karoli-baba.jpg'),
  },
]

// Lighting + material so the sculpt's form reads clearly on the dark background.
// The source .glb is a single flat light-grey material, which blows out to pure white
// under even lighting, so we use a directional studio light map and a mid-tone surface.
export const ENVIRONMENT_URL = `${import.meta.env.BASE_URL}studio.jpg`
export const MODEL_LOOK = {
  baseColor: [0.56, 0.54, 0.5, 1], // warm stone grey
  roughness: 0.42,
  metalness: 0.1,
}

// The "clay preview" stage shown in the Custom commissions section: the same sculpt
// with a matte, darker, warmer surface so the before/after reads at a glance.
export const CLAY_LOOK = {
  baseColor: [0.46, 0.33, 0.25, 1], // sculpting clay
  roughness: 1,
  metalness: 0,
}
