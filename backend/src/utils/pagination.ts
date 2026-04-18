import { PaginationQuery, PaginatedResult } from '@/types/common.types'

export const getPagination = (query: PaginationQuery) => {
  const page  = Math.max(1, parseInt(query.page  ?? '1',  10))
  const limit = Math.min(100, parseInt(query.limit ?? '10', 10))
  const skip  = (page - 1) * limit
  return { page, limit, skip }
}

export const buildPaginatedResult = <T>(
  data:  T[],
  total: number,
  page:  number,
  limit: number
): PaginatedResult<T> => ({
  data,
  total,
  page,
  totalPages: Math.ceil(total / limit),
})
