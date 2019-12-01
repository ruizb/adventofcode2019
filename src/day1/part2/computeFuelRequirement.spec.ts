import { pipe } from 'fp-ts/lib/pipeable'
import * as NEA from 'fp-ts/lib/NonEmptyArray'
import { ModuleMass, parseAsModuleMass } from '../domain'
import { computeFuelRequirement } from './computeFuelRequirement'

const moduleMasses = pipe(
  [
    '130676',
    '85676',
    '100556',
    '87693',
    '123830',
    '80912',
    '138679',
    '54162',
    '51866',
    '86617',
    '109838',
    '59043',
    '134132',
    '96531',
    '120194',
    '70404',
    '72361',
    '76161',
    '119764',
    '121228',
    '86196',
    '61936',
    '147793',
    '69226',
    '70059',
    '130473',
    '146038',
    '62889',
    '78648',
    '141921',
    '146270',
    '132600',
    '61658',
    '141392',
    '89173',
    '53501',
    '94835',
    '130408',
    '58427',
    '95394',
    '149591',
    '60199',
    '59829',
    '71011',
    '119922',
    '116359',
    '54330',
    '68431',
    '79188',
    '52061',
    '75151',
    '146200',
    '74022',
    '128589',
    '51944',
    '134746',
    '114670',
    '57787',
    '104051',
    '118206',
    '84622',
    '133143',
    '95292',
    '123703',
    '144581',
    '133101',
    '104711',
    '66849',
    '131474',
    '81989',
    '121964',
    '52866',
    '69993',
    '137283',
    '128549',
    '111680',
    '97570',
    '115016',
    '53024',
    '115880',
    '112085',
    '72821',
    '61449',
    '145167',
    '50947',
    '98655',
    '55298',
    '86164',
    '99636',
    '135613',
    '135293',
    '97938',
    '63816',
    '143939',
    '58524',
    '100805',
    '61520',
    '121312',
    '70638',
    '117762'
  ],
  NEA.map(parseAsModuleMass)
)

test('Given a mass of 12, total fuel requirement should be 2', () => {
  expect(computeFuelRequirement([12 as ModuleMass])).toBe(2)
})

test('Given a mass of 14, total fuel requirement should be 2', () => {
  expect(computeFuelRequirement([14 as ModuleMass])).toBe(2)
})

test('Given a mass of 1969, total fuel requirement should be 966', () => {
  expect(computeFuelRequirement([1969 as ModuleMass])).toBe(966)
})

test('Given a mass of 100756, total fuel requirement should be 50346', () => {
  expect(computeFuelRequirement([100756 as ModuleMass])).toBe(50346)
})

test('Given all the masses from part 2, total fuel requirement should be 4870838', () => {
  expect(computeFuelRequirement(moduleMasses)).toBe(4870838)
})
