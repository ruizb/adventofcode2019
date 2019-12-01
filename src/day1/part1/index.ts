import { flow } from 'fp-ts/lib/function'
import * as M from 'fp-ts/lib/Monoid'
import * as NEA from 'fp-ts/lib/NonEmptyArray'
import * as TE from 'fp-ts/lib/TaskEither'
import * as T from 'fp-ts/lib/Task'
import { error, log } from 'fp-ts/lib/Console'
import { ModuleFuel, moduleFuelMonoid } from '../domain'
import { getFuelFromMass, getModuleMassList, inputFilePath } from '../index'

export const computeFuelRequirement = flow(
  getModuleMassList,
  TE.map(flow(NEA.map(getFuelFromMass), M.fold(moduleFuelMonoid)))
)

TE.fold(
  (err: Error) => T.fromIO(error(err)),
  (fuelVolume: ModuleFuel) =>
    T.fromIO(log(`[PART 1] Total fuel requirement: ${fuelVolume}`))
)(computeFuelRequirement(inputFilePath))()
