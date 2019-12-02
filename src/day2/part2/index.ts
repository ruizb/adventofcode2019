import { error, log } from 'fp-ts/lib/Console'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import { asInt } from '../../day1/domain'
import { getInputs, inputFilePath } from '../index'
import { findInputsPairForOutput } from './findInputsPairForOutput'

pipe(
  getInputs(inputFilePath),
  TE.map(findInputsPairForOutput(asInt(19690720))),
  TE.fold(
    (err: Error) => T.fromIO(error(err)),
    inputsPair =>
      T.fromIO(
        log(
          `[PART 2] Pair of inputs to get output 19690720: ${pipe(
            inputsPair,
            O.map(JSON.stringify),
            O.getOrElse(() => 'none')
          )}`
        )
      )
  )
)()
