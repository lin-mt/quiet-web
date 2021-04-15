export enum ResultType {
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  FAILURE = 'FAILURE',
  EXCEPTION = 'EXCEPTION',
}

export type Result<T> = {
  result: ResultType;
  code: string;
  message?: string;
  data: T;
};
