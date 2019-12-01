import { flow } from 'fp-ts/lib/function'
import * as M from 'fp-ts/lib/Monoid'
import * as NEA from 'fp-ts/lib/NonEmptyArray'
import {
  asModuleFuel,
  ModuleFuel,
  moduleFuelMonoid,
  ModuleMass
} from '../domain'
import { getFuelFromMass } from '../index'

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
  NEA.map(getTotalFuelRequirementForMass),
  M.fold(moduleFuelMonoid)
)
