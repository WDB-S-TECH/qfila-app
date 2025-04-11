import { createTRPCRouter, publicProcedure } from "@/trpc"

export const testRouter = createTRPCRouter({
  test: publicProcedure.query(() => {
    return "Hello World"
  })
})
