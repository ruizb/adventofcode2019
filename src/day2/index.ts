import { flow } from 'fp-ts/lib/function'
import * as NEA from 'fp-ts/lib/NonEmptyArray'
import { pipe } from 'fp-ts/lib/pipeable'
import * as TE from 'fp-ts/lib/TaskEither'
import { resolve } from 'path'
import { srcRoot } from '../config'
import { Int, parseAsInt } from '../day1/domain'
import getFileContents from '../getFileContents'

export const inputFilePath = resolve(srcRoot, 'day2/input.txt')

export const asNonEmptyArray = <A>(as: A[]) => as as NEA.NonEmptyArray<A>

const parseInput = (fileContents: string): NEA.NonEmptyArray<Int> =>
  pipe(
    fileContents.split(','),
    asNonEmptyArray,
    NEA.map(_ => _.trim()),
    NEA.map(parseAsInt)
  )

export const getInputs = flow(getFileContents, TE.map(parseInput))
