
/**
 * Convert a color to a gradient
 * @param colorA the first color
 * @param from the starting shade
 * @param colorB the second color
 * @param to the ending shade
 * @returns the gradient
 */
// eslint-disable-next-line @typescript-eslint/max-params
export function colorToGradient (colorA: string, from?: number, colorB?: string, to?: number) {
  // from-slate-900 from-zinc-700 to-zinc-900 from-red-700 to-red-900 from-orange-700 to-orange-900 from-yellow-700 to-yellow-900 from-lime-700 to-lime-900 from-green-700 to-green-900 from-emerald-700 to-emerald-900 from-teal-700 to-teal-900 from-cyan-700 to-cyan-900 from-sky-700 to-sky-900 from-blue-700 to-blue-900 from-indigo-700 to-indigo-900 from-violet-700 to-violet-900 from-purple-700 to-purple-900 from-fuchsia-700 to-fuchsia-900 from-pink-700 to-pink-900
  return `bg-gradient-to-br from-${colorA}-${from ?? 700} to-${colorB ?? colorA}-${to ?? 900}` // eslint-disable-line @typescript-eslint/no-magic-numbers
}
