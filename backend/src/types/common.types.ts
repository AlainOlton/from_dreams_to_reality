export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?:   T
}

export interface PaginationQuery {
  page?:  string
  limit?: string
}

export interface PaginatedResult<T> {
  data:       T[]
  total:      number
  page:       number
  totalPages: number
}
