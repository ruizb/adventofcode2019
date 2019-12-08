import { array } from 'fp-ts/lib/Array'
import { flow } from 'fp-ts/lib/function'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import * as NEA from 'fp-ts/lib/NonEmptyArray'
import * as A from 'fp-ts/lib/Array'
import { none, Option, some } from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import { reader } from 'fp-ts/lib/Reader'
import * as TE from 'fp-ts/lib/TaskEither'
import { EOL } from 'os'
import { resolve } from 'path'
import { srcRoot } from '../config'
import flattenOpts from '../flattenOps'
import getFileContents from '../getFileContents'
import {
  asWireDirection,
  emptyPoint,
  HorizontalSegment,
  IntersectionPoint,
  isWirePathStep,
  PanelWires,
  Point,
  VerticalSegment,
  WireDirection,
  WirePathStep,
  wirePathStepPattern
} from './domain'

export const inputFilePath = resolve(srcRoot, 'day3/input.txt')

export const asNonEmptyArray = <A>(as: A[]) => as as NEA.NonEmptyArray<A>

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

export const toPoints = A.reduce(
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

export const splitVerticalHorizontalSegments = <A, B extends A, C extends A>(
  verticalPredicate: (a: A) => a is B,
  horizontalPredicate: (a: A) => a is C
): ((segment: A[]) => [B[], C[]]) => segments => [
  array.filter(segments, verticalPredicate),
  array.filter(segments, horizontalPredicate)
]

// Pair vertical segments from first wire with horizontal segments from second wire, and vice-versa
export const pairVerticalsAndHorizontals = <A, B extends A[], C extends A[]>([
  [v1, h1],
  [v2, h2]
]: [[B, C], [B, C]]): [[B, C], [B, C]] => [
  [v1, h2],
  [v2, h1]
]

const isBetween = (n: number, a: number, b: number) => (n - a) * (n - b) <= 0

type CreateIntersectionPoint<
  A extends VerticalSegment,
  B extends HorizontalSegment,
  C extends IntersectionPoint
> = (vSegment: A, hSegment: B) => C

const getIntersectionPoint = <
  A extends VerticalSegment,
  B extends HorizontalSegment,
  C extends IntersectionPoint
>(
  createIntersectionPoint: CreateIntersectionPoint<A, B, C>
) => (vSegment: A, hSegment: B): Option<C> =>
  isBetween(hSegment.from.y, vSegment.from.y, vSegment.to.y) &&
  isBetween(vSegment.from.x, hSegment.from.x, hSegment.to.x) &&
  (vSegment.from.x !== 0 || vSegment.from.y !== 0)
    ? some(createIntersectionPoint(vSegment, hSegment))
    : none

export const getAllIntersectionPoints = reader.map(
  getIntersectionPoint,
  <
    A extends VerticalSegment,
    B extends HorizontalSegment,
    C extends IntersectionPoint
  >(
    findIntersectionPoint: (vSegment: A, hSegment: B) => Option<C>
  ) => ([verticalSegments, horizontalSegments]: [A[], B[]]): C[] =>
    flattenOpts(
      array.chain(verticalSegments, vSegment =>
        array.map(horizontalSegments, hSegment =>
          findIntersectionPoint(vSegment, hSegment)
        )
      )
    )
)

const parseInput = (fileContents: string): PanelWires =>
  pipe(
    fileContents.split(EOL),
    asNonEmptyArray,
    NEA.init,
    asNonEmptyArray,
    NEA.map(_ => asNonEmptyArray(_.split(','))),
    NEA.map(A.filter(isWirePathStep)),
    ([firstWire, secondWire]) => [firstWire, secondWire]
  )

export const getInputs = flow(getFileContents, TE.map(parseInput))
