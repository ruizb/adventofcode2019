import * as A from 'fp-ts/lib/Array'
import * as NEA from 'fp-ts/lib/NonEmptyArray'
import { none, Option, option } from 'fp-ts/lib/Option'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import { Semigroup } from 'fp-ts/lib/Semigroup'
import { state } from 'fp-ts/lib/State'
import * as S from 'fp-ts/lib/State'
import { Int } from '../../day1/domain'
import {
  asOpCode,
  IntCodeProgram,
  intProductSemigroup,
  intSumSemigroup,
  isHaltOpCode,
  isProductOpCode,
  isSumOpCode
} from '../domain'
import { initializeProgramMemory } from '../index'

type OptIntCodeProgram = Option<IntCodeProgram>

const getInputValuesFromParametersAddresses = (
  xAddress: number,
  yAddress: number
): ((
  intCodeProgram: IntCodeProgram
) => [Option<Int>, Option<Int>]) => intCodeProgram => [
  option.chain(A.lookup(xAddress, intCodeProgram), xInputAddress =>
    A.lookup(xInputAddress, intCodeProgram)
  ),
  option.chain(A.lookup(yAddress, intCodeProgram), yInputAddress =>
    A.lookup(yInputAddress, intCodeProgram)
  )
]

const processInstruction = (intOpSemigroup: Semigroup<Int>) => (
  intCodeProgram: OptIntCodeProgram
): S.State<number, OptIntCodeProgram> => instructionPointer => {
  const updatedInputs = option.chain(intCodeProgram, intCodeProgram =>
    pipe(
      intCodeProgram,
      getInputValuesFromParametersAddresses(
        instructionPointer + 1,
        instructionPointer + 2
      ),
      A.array.sequence(option),
      O.map(([x, y]) => intOpSemigroup.concat(x, y)),
      O.chain(res =>
        pipe(
          A.lookup(instructionPointer + 3, intCodeProgram),
          O.chain(resultAddress =>
            NEA.updateAt(resultAddress, res)(intCodeProgram)
          )
        )
      )
    )
  )
  return [updatedInputs, instructionPointer + 4]
}

const processAddInstruction = processInstruction(intSumSemigroup)
const processMultiplyInstruction = processInstruction(intProductSemigroup)

const processIntCodeProgram = (
  intCodeProgram: OptIntCodeProgram
): S.State<number, OptIntCodeProgram> => instructionPointer =>
  pipe(
    intCodeProgram,
    O.chain(_ => A.lookup(instructionPointer, _)),
    O.map(asOpCode),
    O.fold(
      () => [intCodeProgram, instructionPointer],
      opCode => {
        if (isHaltOpCode(opCode)) {
          return [intCodeProgram, instructionPointer]
        } else if (isSumOpCode(opCode)) {
          return state.chain(
            processAddInstruction(intCodeProgram),
            processIntCodeProgram
          )(instructionPointer)
        } else if (isProductOpCode(opCode)) {
          return state.chain(
            processMultiplyInstruction(intCodeProgram),
            processIntCodeProgram
          )(instructionPointer)
        } else {
          return [none, instructionPointer]
        }
      }
    )
  )

export const initializeProgramMemory1202 = initializeProgramMemory(
  12 as Int,
  2 as Int
)

export default processIntCodeProgram
