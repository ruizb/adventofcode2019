import { error, log } from 'fp-ts/lib/Console'
import { pipe } from 'fp-ts/lib/pipeable'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import { ModuleFuel } from '../domain'
import { getModuleMassList, inputFilePath } from '../index'
import { computeFuelRequirement } from './computeFuelRequirement'

pipe(
  getModuleMassList(inputFilePath),
  TE.map(computeFuelRequirement),
  TE.fold(
    (err: Error) => T.fromIO(error(err)),
    (fuelVolume: ModuleFuel) =>
      T.fromIO(log(`[PART 2] Total fuel requirement: ${fuelVolume}`))
  )
)()
