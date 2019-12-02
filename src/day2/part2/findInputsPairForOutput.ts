import { array } from 'fp-ts/lib/Array'
import { flow } from 'fp-ts/lib/function'
import { head } from 'fp-ts/lib/NonEmptyArray'
import { option } from 'fp-ts/lib/Option'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import { evalState } from 'fp-ts/lib/State'
import { asInt, Int } from '../../day1/domain'
import { IntCodeProgram } from '../domain'
import { initializeProgramMemory } from '../index'
import processIntCodeProgram from '../part1/processIntCodeProgram'

const initializeThenProcessIntCodeProgram = (noun: Int, verb: Int) =>
  flow(
    initializeProgramMemory(noun, verb),
    processIntCodeProgram,
    _ => evalState(_, 0),
    O.map(head)
  )

export const findInputsPairForOutput = (targetOutput: Int) => (
  intCodeProgram: IntCodeProgram
) =>
  pipe(
    [
      initializeThenProcessIntCodeProgram(asInt(0), asInt(0))(intCodeProgram),
      initializeThenProcessIntCodeProgram(asInt(1), asInt(0))(intCodeProgram)
    ],
    array.sequence(option),
    O.map(([output1, output2]) => [output1, output2 - output1]),
    O.map(([base, step]) => [
      Math.floor((targetOutput - base) / step),
      (targetOutput - base) % step
    ])
  )
