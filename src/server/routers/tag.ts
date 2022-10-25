/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { t } from '../trpc'
import { z } from 'zod'
import { prisma } from '../prisma'

/**
 * Default selector for Post.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */

export const tagRouter = t.router({
  list: t.procedure.query(async () => {
    return await prisma.tag.findMany({})
  }),
  add: t.procedure
    .input(
      z.object({
        title: z.string().min(2)
      })
    )
    .mutation(async ({ input }) => {
      const tag = await prisma.tag.create({
        data: input
      })
      return tag
    })
})
