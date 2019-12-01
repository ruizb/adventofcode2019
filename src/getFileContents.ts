import { promisify } from 'util'
import fs from 'fs'
import { tryCatch, TaskEither } from 'fp-ts/lib/TaskEither'
import { toError } from 'fp-ts/lib/Either'

const readFromFile = promisify(fs.readFile)

const getFileContents = (path: string): TaskEither<Error, string> =>
  tryCatch(() => readFromFile(path, 'utf-8'), toError)

export default getFileContents
