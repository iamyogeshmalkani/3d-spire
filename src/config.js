// Replace [YOUR-NUMBER] with your WhatsApp number (digits only, with country code).
export const WHATSAPP_NUMBER = '[YOUR-NUMBER]'

const waLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`

export const QUOTE_LINK = waLink(
  "Hi 3D Spire, I'd like a quote. I'm sending my reference image now.",
)
export const CATALOGUE_LINK = waLink(
  'Hi 3D Spire, please share the catalogue and prices.',
)
export const INSTAGRAM_LINK = 'https://www.instagram.com/3d_spire'

// Served from /public, so it must respect Vite's base path.
export const MODEL_URL = `${import.meta.env.BASE_URL}shiva-drinking-poison.glb`

// Lighting + material so the sculpt's form reads clearly on the dark background.
// The source .glb is a single flat light-grey material, which blows out to pure white
// under even lighting, so we use a directional studio light map and a mid-tone surface.
export const ENVIRONMENT_URL = `${import.meta.env.BASE_URL}studio.png`
export const MODEL_LOOK = {
  baseColor: [0.56, 0.54, 0.5, 1], // warm stone grey
  roughness: 0.42,
  metalness: 0.1,
}
