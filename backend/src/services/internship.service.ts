import { Prisma, InternshipStatus, InternshipType } from '@prisma/client'
import { prisma } from '@/config/db'
import { getPagination, buildPaginatedResult } from '@/utils/pagination'
import { PaginationQuery } from '@/types/common.types'

interface InternshipFilters extends PaginationQuery {
  field?:    string
  city?:     string
  country?:  string
  isRemote?: string
  isPaid?:   string
  type?:     InternshipType
  search?:   string
}

export const listInternships = async (filters: InternshipFilters) => {
  const { page, limit, skip } = getPagination(filters)

  const where: Prisma.InternshipWhereInput = {
    status: InternshipStatus.OPEN,
    ...(filters.field    && { field:    { contains: filters.field,   mode: 'insensitive' } }),
    ...(filters.city     && { city:     { contains: filters.city,    mode: 'insensitive' } }),
    ...(filters.country  && { country:  { contains: filters.country, mode: 'insensitive' } }),
    ...(filters.isRemote && { isRemote: filters.isRemote === 'true' }),
    ...(filters.isPaid   && { isPaid:   filters.isPaid   === 'true' }),
    ...(filters.type     && { type:     filters.type }),
    ...(filters.search   && {
      OR: [
        { title:       { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { field:       { contains: filters.search, mode: 'insensitive' } },
      ],
    }),
  }

  const [data, total] = await Promise.all([
    prisma.internship.findMany({
      where,
      skip,
      take:    limit,
      orderBy: { createdAt: 'desc' },
      include: {
        company: {
          select: { companyName: true, logoUrl: true, city: true, country: true, isVerified: true },
        },
        _count: { select: { applications: true } },
      },
    }),
    prisma.internship.count({ where }),
  ])

  return buildPaginatedResult(data, total, page, limit)
}

export const getInternshipById = async (id: string) => {
  const internship = await prisma.internship.findUnique({
    where:   { id },
    include: {
      company: {
        select: {
          companyName: true, logoUrl: true, city: true,
          country: true, website: true, isVerified: true, description: true,
        },
      },
      _count: { select: { applications: true, enrollments: true } },
    },
  })
  if (!internship) throw Object.assign(new Error('Internship not found'), { statusCode: 404 })
  return internship
}

export const createInternship = async (companyId: string, data: Prisma.InternshipCreateInput) => {
  return prisma.internship.create({
    data: { ...data, company: { connect: { id: companyId } } },
  })
}

export const updateInternship = async (
  id:        string,
  companyId: string,
  data:      Prisma.InternshipUpdateInput
) => {
  const internship = await prisma.internship.findUnique({ where: { id } })
  if (!internship)             throw Object.assign(new Error('Internship not found'), { statusCode: 404 })
  if (internship.companyId !== companyId) throw Object.assign(new Error('Forbidden'), { statusCode: 403 })
  return prisma.internship.update({ where: { id }, data })
}

export const deleteInternship = async (id: string, companyId: string) => {
  const internship = await prisma.internship.findUnique({ where: { id } })
  if (!internship)             throw Object.assign(new Error('Internship not found'), { statusCode: 404 })
  if (internship.companyId !== companyId) throw Object.assign(new Error('Forbidden'), { statusCode: 403 })
  await prisma.internship.delete({ where: { id } })
}

export const toggleBookmark = async (userId: string, internshipId: string) => {
  const existing = await prisma.bookmark.findUnique({
    where: { userId_internshipId: { userId, internshipId } },
  })
  if (existing) {
    await prisma.bookmark.delete({ where: { userId_internshipId: { userId, internshipId } } })
    return { bookmarked: false }
  }
  await prisma.bookmark.create({ data: { userId, internshipId } })
  return { bookmarked: true }
}

export const getBookmarks = async (userId: string) => {
  return prisma.bookmark.findMany({
    where:   { userId },
    include: {
      internship: {
        include: {
          company: { select: { companyName: true, logoUrl: true, city: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export const getCompanyInternships = async (companyId: string) => {
  return prisma.internship.findMany({
    where:   { companyId },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { applications: true, enrollments: true } } },
  })
}
