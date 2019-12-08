import { error, log } from 'fp-ts/lib/Console'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/pipeable'
import { getInputs, inputFilePath } from '../index'
import computeIntersectionFewestSteps from './computeIntersectionFewestSteps'

pipe(
  getInputs(inputFilePath),
  TE.map(computeIntersectionFewestSteps),
  TE.fold(
    (err: Error) => T.fromIO(error(err)),
    intersectionFewestSteps =>
      T.fromIO(
        log(
          `[PART 2] Fewest combined steps to reach an intersection point: ${intersectionFewestSteps}`
        )
      )
  )
)()
