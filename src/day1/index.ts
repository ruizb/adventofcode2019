import { flow } from 'fp-ts/lib/function'
import * as M from 'fp-ts/lib/Monoid'
import * as NEA from 'fp-ts/lib/NonEmptyArray'
import * as TE from 'fp-ts/lib/TaskEither'
import * as T from 'fp-ts/lib/Task'
import { pipe } from 'fp-ts/lib/pipeable'
import { srcRoot } from '../config'
import getFileContents from '../getFileContents'
import { resolve } from 'path'
import { EOL } from 'os'
import { error, log } from 'fp-ts/lib/Console'

type Int = number & { _as: 'Int' }
type ModuleMass = Int & { _as: 'ModuleMass' }
type ModuleFuel = Int & { _as: 'ModuleFuel' }

const inputFilePath = resolve(srcRoot, 'day1/input.txt')

const asNonEmptyArray = <A>(as: A[]) => as as NEA.NonEmptyArray<A>
const parseAsModuleMass = (n: string) => parseInt(n, 10) as ModuleMass
const asModuleFuel = (n: number) => n as ModuleFuel

const moduleFuelMonoid: M.Monoid<ModuleFuel> = {
  concat: flow(M.monoidSum.concat, asModuleFuel),
  empty: pipe(M.monoidSum.empty, asModuleFuel)
}

const parseInput = (fileContents: string): NEA.NonEmptyArray<ModuleMass> =>
  pipe(
    fileContents.split(EOL),
    asNonEmptyArray,
    NEA.init,
    asNonEmptyArray,
    NEA.map(parseAsModuleMass)
  )

const getFuelFromMass = (mass: ModuleMass): ModuleFuel =>
  (Math.floor(mass / 3) - 2) as ModuleFuel

// Day 1, part 2
const getTotalFuelRequirementForMass = (mass: ModuleMass): ModuleFuel => {
  const fuelRequirement = getFuelFromMass(mass)
  return fuelRequirement <= 0
    ? asModuleFuel(0)
    : moduleFuelMonoid.concat(
        fuelRequirement,
        getTotalFuelRequirementForMass(fuelRequirement as ModuleMass)
      )
}

const computeFuelRequirement = flow(
  getFileContents,
  TE.map(parseInput),
  TE.map(NEA.map(getTotalFuelRequirementForMass)),
  TE.map(M.fold(moduleFuelMonoid)),
  TE.fold(
    (err: Error) => T.fromIO(error(err)),
    (fuelVolume: ModuleFuel) =>
      T.fromIO(log(`Total fuel requirement: ${fuelVolume}`))
  )
)

computeFuelRequirement(inputFilePath)()
