import { flow } from 'fp-ts/lib/function'
import * as NEA from 'fp-ts/lib/NonEmptyArray'
import * as A from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/pipeable'
import * as TE from 'fp-ts/lib/TaskEither'
import { EOL } from 'os'
import { resolve } from 'path'
import { srcRoot } from '../config'
import getFileContents from '../getFileContents'
import { isWirePathStep, PanelWires } from './domain'

export const inputFilePath = resolve(srcRoot, 'day3/input.txt')

export const asNonEmptyArray = <A>(as: A[]) => as as NEA.NonEmptyArray<A>

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
