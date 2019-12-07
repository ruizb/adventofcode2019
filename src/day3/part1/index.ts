import { error, log } from 'fp-ts/lib/Console'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/pipeable'
import { getInputs, inputFilePath } from '../index'
import findShortestManhattanDistance from './findShortestManhattanDistance'

pipe(
  getInputs(inputFilePath),
  TE.map(findShortestManhattanDistance),
  TE.fold(
    (err: Error) => T.fromIO(error(err)),
    shortestManhattanDistance =>
      T.fromIO(
        log(
          `[PART 1] Manhattan distance to the closest intersection point to the origin: ${shortestManhattanDistance}`
        )
      )
  )
)()
