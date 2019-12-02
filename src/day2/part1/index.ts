import { error, log } from 'fp-ts/lib/Console'
import { flow } from 'fp-ts/lib/function'
import { head } from 'fp-ts/lib/NonEmptyArray'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import { evalState } from 'fp-ts/lib/State'
import * as TE from 'fp-ts/lib/TaskEither'
import * as T from 'fp-ts/lib/Task'
import { Int } from '../../day1/domain'
import { getInputs, inputFilePath } from '../index'
import processIntCodeProgram, {
  initializeProgramMemory1202
} from './processIntCodeProgram'

const initialInstructionPointer = 0

pipe(
  getInputs(inputFilePath),
  TE.map(
    flow(
      initializeProgramMemory1202,
      processIntCodeProgram,
      _ => evalState(_, initialInstructionPointer),
      O.map(head)
    )
  ),
  TE.fold(
    (err: Error) => T.fromIO(error(err)),
    (valueAtFirstAddress: O.Option<Int>) =>
      T.fromIO(
        log(
          `[PART 1] Value at address 0: ${pipe(
            valueAtFirstAddress,
            O.map(String),
            O.getOrElse(() => 'unknown')
          )}`
        )
      )
  )
)()
