import * as A from 'fp-ts/lib/Array'
import { flow } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import { ordNumber } from 'fp-ts/lib/Ord'
import { pipe } from 'fp-ts/lib/pipeable'
import { fold, getMeetSemigroup } from 'fp-ts/lib/Semigroup'
import * as Tuple from 'fp-ts/lib/Tuple'
import {
  emptyPoint,
  HorizontalSegmentWithSteps,
  IntersectionPointWithSteps,
  isHorizontalSegment,
  isHorizontalSegmentWithSteps,
  isVerticalSegment,
  isVerticalSegmentWithSteps,
  Point,
  UnqualifiedSegmentWithSteps,
  VerticalSegmentWithSteps
} from '../domain'
import {
  getAllIntersectionPoints,
  pairVerticalsAndHorizontals,
  splitVerticalHorizontalSegments,
  toPoints
} from '../index'

const toSegmentsWithSteps = A.reduce(
  [],
  (
    acc: UnqualifiedSegmentWithSteps[],
    to: Point
  ): UnqualifiedSegmentWithSteps[] => {
    const from = pipe(
      A.last(acc),
      O.map(_ => _.to),
      O.getOrElse(() => emptyPoint)
    )
    const steps = isVerticalSegment({ from, to })
      ? Math.abs(to.y - from.y)
      : isHorizontalSegment({ from, to })
      ? Math.abs(to.x - from.x)
      : 0
    const accSteps = pipe(
      A.last(acc),
      O.map(({ accSteps }) => accSteps + steps),
      O.getOrElse(() => steps)
    )
    return A.getMonoid<UnqualifiedSegmentWithSteps>().concat(acc, [
      { from, to, steps, accSteps }
    ])
  }
)

// FIXME could use a transducer to optimize toPoints + toSegmentsWithSteps
const fromPanelWiresToSegmentsWithSteps = flow(toPoints, toSegmentsWithSteps)

const splitVerticalHorizontalSegmentsWithSteps = splitVerticalHorizontalSegments(
  isVerticalSegmentWithSteps,
  isHorizontalSegmentWithSteps
)

const createIntersectionPointWithSteps = (
  vSegment: VerticalSegmentWithSteps,
  hSegment: HorizontalSegmentWithSteps
) =>
  ({
    x: vSegment.from.x,
    y: hSegment.from.y,
    steps:
      vSegment.accSteps -
      Math.abs(vSegment.to.y - hSegment.from.y) +
      (hSegment.accSteps - Math.abs(hSegment.to.x - vSegment.from.x))
  } as IntersectionPointWithSteps)

const getIntersectionPointsWithSteps = getAllIntersectionPoints(
  createIntersectionPointWithSteps
)

const computeIntersectionFewestSteps = flow(
  Tuple.bimap(
    fromPanelWiresToSegmentsWithSteps,
    fromPanelWiresToSegmentsWithSteps
  ),
  Tuple.bimap(
    splitVerticalHorizontalSegmentsWithSteps,
    splitVerticalHorizontalSegmentsWithSteps
  ),
  pairVerticalsAndHorizontals,
  Tuple.bimap(getIntersectionPointsWithSteps, getIntersectionPointsWithSteps),
  intersectionPointsWithSteps =>
    A.getMonoid<IntersectionPointWithSteps>().concat(
      Tuple.fst(intersectionPointsWithSteps),
      Tuple.snd(intersectionPointsWithSteps)
    ),
  A.map(({ steps }) => steps),
  intersectionPointsSteps =>
    fold(getMeetSemigroup(ordNumber))(
      Number.POSITIVE_INFINITY,
      intersectionPointsSteps
    )
)

export default computeIntersectionFewestSteps
