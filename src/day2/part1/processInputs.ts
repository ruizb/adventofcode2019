import * as A from 'fp-ts/lib/Array'
import { flow } from 'fp-ts/lib/function'
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
  intProductSemigroup,
  intSumSemigroup,
  isHaltOpCode,
  isProductOpCode,
  isSumOpCode
} from '../domain'

type Inputs = NEA.NonEmptyArray<Int>
type OptInputs = Option<Inputs>

const getInputValuesFromIndexes = (
  xIndex: number,
  yIndex: number
): ((inputs: Inputs) => [Option<Int>, Option<Int>]) => inputs => [
  option.chain(A.lookup(xIndex, inputs), xi => A.lookup(xi, inputs)),
  option.chain(A.lookup(yIndex, inputs), xi => A.lookup(xi, inputs))
]

const handleOp = (intOpSemigroup: Semigroup<Int>) => (
  inputs: OptInputs
): S.State<number, OptInputs> => playHeadPosition => {
  const updatedInputs = option.chain(inputs, inputs =>
    pipe(
      inputs,
      getInputValuesFromIndexes(playHeadPosition + 1, playHeadPosition + 2),
      A.array.sequence(option),
      O.map(([x, y]) => intOpSemigroup.concat(x, y)),
      O.chain(res =>
        pipe(
          A.lookup(playHeadPosition + 3, inputs),
          O.chain(resIndex => NEA.updateAt(resIndex, res)(inputs))
        )
      )
    )
  )
  return [updatedInputs, playHeadPosition + 4]
}

const handleAddOp = handleOp(intSumSemigroup)
const handleProductOp = handleOp(intProductSemigroup)

const processInputs = (
  inputs: OptInputs
): S.State<number, OptInputs> => playHeadPosition =>
  pipe(
    inputs,
    O.chain(_ => A.lookup(playHeadPosition, _)),
    O.map(asOpCode),
    O.fold(
      () => [inputs, playHeadPosition],
      opCode => {
        if (isHaltOpCode(opCode)) {
          return [inputs, playHeadPosition]
        } else if (isSumOpCode(opCode)) {
          return state.chain(
            handleAddOp(inputs),
            processInputs
          )(playHeadPosition)
        } else if (isProductOpCode(opCode)) {
          return state.chain(
            handleProductOp(inputs),
            processInputs
          )(playHeadPosition)
        } else {
          return [none, playHeadPosition]
        }
      }
    )
  )

export const restore1202ProgramAlarm = flow(
  NEA.updateAt(1, 12 as Int),
  O.chain(NEA.updateAt(2, 2 as Int))
)

export default processInputs
