import { flow } from 'fp-ts/lib/function'
import * as NEA from 'fp-ts/lib/NonEmptyArray'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/pipeable'
import { srcRoot } from '../config'
import getFileContents from '../getFileContents'
import { resolve } from 'path'
import { EOL } from 'os'
import { ModuleFuel, ModuleMass, parseAsModuleMass } from './domain'

export const inputFilePath = resolve(srcRoot, 'day1/input.txt')

const asNonEmptyArray = <A>(as: A[]) => as as NEA.NonEmptyArray<A>

const parseInput = (fileContents: string): NEA.NonEmptyArray<ModuleMass> =>
  pipe(
    fileContents.split(EOL),
    asNonEmptyArray,
    NEA.init,
    asNonEmptyArray,
    NEA.map(parseAsModuleMass)
  )

export const getFuelFromMass = (mass: ModuleMass): ModuleFuel =>
  (Math.floor(mass / 3) - 2) as ModuleFuel

export const getModuleMassList = flow(getFileContents, TE.map(parseInput))
