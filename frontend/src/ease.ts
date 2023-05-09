export function cubicIn(x: number): number {
  return x * x * x
}

export function cubicOut(x: number): number {
  return 1 - Math.pow(1 - x, 3)
}
