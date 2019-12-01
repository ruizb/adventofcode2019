import { flow } from 'fp-ts/lib/function'
import { Monoid, monoidSum } from 'fp-ts/lib/Monoid'
import { pipe } from 'fp-ts/lib/pipeable'

type Int = number & { _as: 'Int' }
export type ModuleMass = Int & { _as: 'ModuleMass' }
export type ModuleFuel = Int & { _as: 'ModuleFuel' }

export const parseAsModuleMass = (n: string) => parseInt(n, 10) as ModuleMass
export const asModuleFuel = (n: number) => n as ModuleFuel

export const moduleFuelMonoid: Monoid<ModuleFuel> = {
  concat: flow(monoidSum.concat, asModuleFuel),
  empty: pipe(monoidSum.empty, asModuleFuel)
}
