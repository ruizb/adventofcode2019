export type PanelWires = [WirePathStep[], WirePathStep[]]

export type VerticalDirection = 'U' | 'D'
export type HorizontalDirection = 'L' | 'R'
export type WireDirection = VerticalDirection | HorizontalDirection

export const asWireDirection = (s: string) => s as WireDirection

export type WirePathStep = string & { _as: 'WirePathStep' }

export const wirePathStepPattern = /^([URDL])(\d+)$/

export const isWirePathStep = (s: string): s is WirePathStep =>
  wirePathStepPattern.test(s)

export interface Point {
  x: number
  y: number
}

export type IntersectionPoint = Point & { _as: 'IntersectionPoint' }
export type IntersectionPointWithSteps = IntersectionPoint & { steps: number }

export interface UnqualifiedSegment {
  from: Point
  to: Point
}

export type VerticalSegment = UnqualifiedSegment & { _as: 'VerticalSegment' }
export type HorizontalSegment = UnqualifiedSegment & {
  _as: 'HorizontalSegment'
}

export interface WithSteps {
  steps: number
  accSteps: number
}

export type UnqualifiedSegmentWithSteps = UnqualifiedSegment & WithSteps
export type VerticalSegmentWithSteps = VerticalSegment & WithSteps
export type HorizontalSegmentWithSteps = HorizontalSegment & WithSteps

export const isVerticalSegment = (
  s: UnqualifiedSegment
): s is VerticalSegment => s.from.x === s.to.x && s.from.y !== s.to.y

export const isHorizontalSegment = (
  s: UnqualifiedSegment
): s is HorizontalSegment => s.from.y === s.to.y && s.from.x !== s.to.x

export const isVerticalSegmentWithSteps = (
  s: UnqualifiedSegmentWithSteps
): s is VerticalSegmentWithSteps => s.from.x === s.to.x && s.from.y !== s.to.y

export const isHorizontalSegmentWithSteps = (
  s: UnqualifiedSegmentWithSteps
): s is HorizontalSegmentWithSteps => s.from.y === s.to.y && s.from.x !== s.to.x

export const emptyPoint: Point = {
  x: 0,
  y: 0
}
