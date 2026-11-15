/** Mutable scroll + pointer state shared between the DOM choreography and the WebGL stage. */
export const fx = {
  hero: 0, // 0..1 progress through the hero scroll
  globe: 0, // 0..1 progress through the closing scene
  mx: 0, // pointer, -1..1
  my: 0,
  reduced: typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches,
}

export const asset = (p: string) => import.meta.env.BASE_URL + p
