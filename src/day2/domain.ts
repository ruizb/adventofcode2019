import { flow } from 'fp-ts/lib/function'
import * as NEA from 'fp-ts/lib/NonEmptyArray'
import { Semigroup, semigroupProduct, semigroupSum } from 'fp-ts/lib/Semigroup'
import { Int, asInt } from '../day1/domain'

export type IntCodeProgram = NEA.NonEmptyArray<Int>
export type OpCode = 1 | 2 | 99

export const asOpCode = (n: Int) => n as OpCode
export const isSumOpCode = (n: OpCode): n is 1 => n === 1
export const isProductOpCode = (n: OpCode): n is 2 => n === 2
export const isHaltOpCode = (n: OpCode): n is 99 => n === 99

export const intSumSemigroup: Semigroup<Int> = {
  concat: flow(semigroupSum.concat, asInt)
}

export const intProductSemigroup: Semigroup<Int> = {
  concat: flow(semigroupProduct.concat, asInt)
}
