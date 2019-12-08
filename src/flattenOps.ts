import { array } from 'fp-ts/lib/Array'
import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { Option } from 'fp-ts/lib/Option'

const flattenOpts = <X>(opts: Option<X>[]): X[] =>
  A.flatten(
    array.map(
      opts,
      O.fold(() => A.empty, A.of)
    )
  )

export default flattenOpts
