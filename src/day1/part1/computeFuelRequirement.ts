import { flow } from 'fp-ts/lib/function'
import * as M from 'fp-ts/lib/Monoid'
import * as NEA from 'fp-ts/lib/NonEmptyArray'
import { moduleFuelMonoid } from '../domain'
import { getFuelFromMass } from '../index'

export const computeFuelRequirement = flow(
  NEA.map(getFuelFromMass),
  M.fold(moduleFuelMonoid)
)
