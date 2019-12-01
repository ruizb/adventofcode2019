import { error, log } from 'fp-ts/lib/Console'
import { flow } from 'fp-ts/lib/function'
import * as M from 'fp-ts/lib/Monoid'
import * as NEA from 'fp-ts/lib/NonEmptyArray'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import {
  asModuleFuel,
  ModuleFuel,
  moduleFuelMonoid,
  ModuleMass
} from '../domain'
import { getFuelFromMass, getModuleMassList, inputFilePath } from '../index'

const getTotalFuelRequirementForMass = (mass: ModuleMass): ModuleFuel => {
  const fuelRequirement = getFuelFromMass(mass)
  return fuelRequirement <= 0
    ? asModuleFuel(0)
    : moduleFuelMonoid.concat(
        fuelRequirement,
        getTotalFuelRequirementForMass(fuelRequirement as ModuleMass)
      )
}

export const computeFuelRequirement = flow(
  getModuleMassList,
  TE.map(
    flow(NEA.map(getTotalFuelRequirementForMass), M.fold(moduleFuelMonoid))
  )
)

TE.fold(
  (err: Error) => T.fromIO(error(err)),
  (fuelVolume: ModuleFuel) =>
    T.fromIO(log(`[PART 2] Total fuel requirement: ${fuelVolume}`))
)(computeFuelRequirement(inputFilePath))()
