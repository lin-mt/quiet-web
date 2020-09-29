export enum ResultType {
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  FAILURE = 'FAILURE',
  EXCEPTION = 'EXCEPTION'
}

export interface Result<T> {
  result?: ResultType,
  code?: string,
  message?: string,
  data?: T
}