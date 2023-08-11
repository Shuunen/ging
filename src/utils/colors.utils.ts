// eslint-disable-next-line max-params
export function colorToGradient (colorA: string, from?: number, colorB?: string, to?: number) {
  return `bg-gradient-to-br from-${colorA}-${from ?? 700} to-${colorB ?? colorA}-${to ?? 900}` // eslint-disable-line @typescript-eslint/no-magic-numbers
}
