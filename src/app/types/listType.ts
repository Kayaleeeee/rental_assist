export type ListParamsType<T> = {
  offset?: number; // 시작 index
  limit?: number; // 최대 개수 page size
  select?: string;
  count?: string;
} & T;

export type PageModelType = {
  offset: number;
  limit: number;
};

export type ListReturnType<T> = {
  data: T[];
  totalElements: number;
};

export const DEFAULT_LIMIT = 25;
