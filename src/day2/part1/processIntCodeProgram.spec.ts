import { head } from 'fp-ts/lib/NonEmptyArray'
import { some, option } from 'fp-ts/lib/Option'
import { evalState } from 'fp-ts/lib/State'
import { Int } from '../../day1/domain'
import { asNonEmptyArray } from '../index'
import processIntCodeProgram, {
  initializeProgramMemory1202
} from './processIntCodeProgram'

test('Given the first example, Intcode program should be processed correctly', () => {
  expect(
    evalState(
      processIntCodeProgram(some(asNonEmptyArray([1, 0, 0, 0, 99] as Int[]))),
      0
    )
  ).toEqual(some([2, 0, 0, 0, 99]))
})

test('Given the second example, Intcode program should be processed correctly', () => {
  expect(
    evalState(
      processIntCodeProgram(some(asNonEmptyArray([2, 3, 0, 3, 99] as Int[]))),
      0
    )
  ).toEqual(some([2, 3, 0, 6, 99]))
})

test('Given the third example, Intcode program should be processed correctly', () => {
  expect(
    evalState(
      processIntCodeProgram(
        some(asNonEmptyArray([2, 4, 4, 5, 99, 0] as Int[]))
      ),
      0
    )
  ).toEqual(some([2, 4, 4, 5, 99, 9801]))
})

test('Given the fourth example, Intcode program should be processed correctly', () => {
  expect(
    evalState(
      processIntCodeProgram(
        some(asNonEmptyArray([1, 1, 1, 4, 99, 5, 6, 0, 99] as Int[]))
      ),
      0
    )
  ).toEqual(some([30, 1, 1, 4, 2, 5, 6, 0, 99]))
})

test('Given the puzzle Intcode program, the integer at the address 0 should have the correct value', () => {
  const intCodeProgram = asNonEmptyArray(
    JSON.parse(
      '[1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,1,10,19,1,6,19,23,1,13,23,27,1,6,27,31,1,31,10,35,1,35,6,39,1,39,13,43,2,10,43,47,1,47,6,51,2,6,51,55,1,5,55,59,2,13,59,63,2,63,9,67,1,5,67,71,2,13,71,75,1,75,5,79,1,10,79,83,2,6,83,87,2,13,87,91,1,9,91,95,1,9,95,99,2,99,9,103,1,5,103,107,2,9,107,111,1,5,111,115,1,115,2,119,1,9,119,0,99,2,0,14,0]'
    ) as Int[]
  )
  const updatedInputs = initializeProgramMemory1202(intCodeProgram)
  expect(
    option.map(evalState(processIntCodeProgram(updatedInputs), 0), head)
  ).toEqual(some(3706713))
})
