import { array } from 'fp-ts/lib/Array'
import { flow } from 'fp-ts/lib/function'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import { none, Option, some } from 'fp-ts/lib/Option'
import { ordNumber } from 'fp-ts/lib/Ord'
import { pipe } from 'fp-ts/lib/pipeable'
import { fold, getMeetSemigroup } from 'fp-ts/lib/Semigroup'
import * as O from 'fp-ts/lib/Option'
import * as A from 'fp-ts/lib/Array'
import * as NEA from 'fp-ts/lib/NonEmptyArray'
import * as Tuple from 'fp-ts/lib/Tuple'
import {
  asWireDirection,
  emptyPoint,
  HorizontalSegment,
  IntersectionPoint,
  isHorizontalSegment,
  isVerticalSegment,
  Point,
  UnqualifiedSegment,
  VerticalSegment,
  WireDirection,
  WirePathStep,
  wirePathStepPattern
} from '../domain'

const flattenOpts = <X>(opts: Option<X>[]): X[] =>
  A.flatten(
    array.map(
      opts,
      O.fold(() => A.empty, A.of)
    )
  )

const getXYCoefFromDirection = (
  direction: WireDirection
): [0 | 1 | -1, 0 | 1 | -1] => {
  switch (direction) {
    case 'U':
      return [0, 1]
    case 'R':
      return [1, 0]
    case 'D':
      return [0, -1]
    case 'L':
      return [-1, 0]
    default:
      return [0, 0]
  }
}

const toPoints = A.reduce(
  NEA.of(emptyPoint),
  (acc: NonEmptyArray<Point>, pathStep: WirePathStep): NonEmptyArray<Point> => {
    const { x: prevX, y: prevY } = NEA.last(acc)
    const [, rawDirection, rawValue] = pathStep.match(
      wirePathStepPattern
    ) as RegExpMatchArray
    const [xCoef, yCoef] = pipe(
      rawDirection,
      asWireDirection,
      getXYCoefFromDirection
    )
    const value = parseInt(rawValue, 10)
    return NEA.concat(acc, [
      {
        x: prevX + xCoef * value,
        y: prevY + yCoef * value
      }
    ])
  }
)

const toSegments = A.reduce(
  [],
  (acc: UnqualifiedSegment[], to: Point): UnqualifiedSegment[] => {
    const from = pipe(
      A.last(acc),
      O.map(_ => _.to),
      O.getOrElse(() => emptyPoint)
    )
    return A.getMonoid<UnqualifiedSegment>().concat(acc, [{ from, to }])
  }
)

// FIXME could use a transducer to optimize toPoints + toSegments
const fromPanelWiresToSegments = flow(toPoints, toSegments)

const splitVerticalHorizontalSegments = (
  segments: UnqualifiedSegment[]
): [VerticalSegment[], HorizontalSegment[]] => [
  array.filter(segments, isVerticalSegment),
  array.filter(segments, isHorizontalSegment)
]

const isBetween = (n: number, a: number, b: number) => (n - a) * (n - b) <= 0

const getIntersectionPoint = (
  segmentV: VerticalSegment,
  segmentH: HorizontalSegment
): Option<IntersectionPoint> =>
  isBetween(segmentH.from.y, segmentV.from.y, segmentV.to.y) &&
  isBetween(segmentV.from.x, segmentH.from.x, segmentH.to.x) &&
  (segmentV.from.x !== 0 || segmentV.from.y !== 0)
    ? some({ x: segmentV.from.x, y: segmentH.from.y } as IntersectionPoint)
    : none

// Pair vertical segments from first wire with horizontal segments from second wire, and vice-versa
const pairVerticalsAndHorizontals = <
  A extends VerticalSegment[],
  B extends HorizontalSegment[]
>([[v1, h1], [v2, h2]]: [[A, B], [A, B]]): [[A, B], [A, B]] => [
  [v1, h2],
  [v2, h1]
]

const getIntersectionPoints = ([verticalSegments, horizontalSegments]: [
  VerticalSegment[],
  HorizontalSegment[]
]): IntersectionPoint[] =>
  flattenOpts(
    array.chain(verticalSegments, vSegment =>
      array.map(horizontalSegments, hSegment =>
        getIntersectionPoint(vSegment, hSegment)
      )
    )
  )

const getManhattanDistance = ({ x, y }: Point): number =>
  Math.abs(x) + Math.abs(y)

const findShortestManhattanDistance = flow(
  Tuple.bimap(fromPanelWiresToSegments, fromPanelWiresToSegments),
  Tuple.bimap(splitVerticalHorizontalSegments, splitVerticalHorizontalSegments),
  pairVerticalsAndHorizontals,
  Tuple.bimap(getIntersectionPoints, getIntersectionPoints),
  intersectionPoints =>
    A.getMonoid<IntersectionPoint>().concat(
      Tuple.fst(intersectionPoints),
      Tuple.snd(intersectionPoints)
    ),
  A.map(getManhattanDistance),
  manhattanDistances =>
    fold(getMeetSemigroup(ordNumber))(
      Number.POSITIVE_INFINITY,
      manhattanDistances
    )
)

export default findShortestManhattanDistance
