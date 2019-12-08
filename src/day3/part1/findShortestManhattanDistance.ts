import { flow } from 'fp-ts/lib/function'
import { ordNumber } from 'fp-ts/lib/Ord'
import { pipe } from 'fp-ts/lib/pipeable'
import { fold, getMeetSemigroup } from 'fp-ts/lib/Semigroup'
import * as O from 'fp-ts/lib/Option'
import * as A from 'fp-ts/lib/Array'
import * as Tuple from 'fp-ts/lib/Tuple'
import {
  emptyPoint,
  HorizontalSegment,
  IntersectionPoint,
  isHorizontalSegment,
  isVerticalSegment,
  Point,
  UnqualifiedSegment,
  VerticalSegment
} from '../domain'
import {
  toPoints,
  splitVerticalHorizontalSegments as _splitVerticalHorizontalSegments,
  pairVerticalsAndHorizontals,
  getAllIntersectionPoints
} from '../index'

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

const splitVerticalHorizontalSegments = _splitVerticalHorizontalSegments(
  isVerticalSegment,
  isHorizontalSegment
)

const createIntersectionPoint = (
  vSegment: VerticalSegment,
  hSegment: HorizontalSegment
) => ({ x: vSegment.from.x, y: hSegment.from.y } as IntersectionPoint)

const getIntersectionPoints = getAllIntersectionPoints(createIntersectionPoint)

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
