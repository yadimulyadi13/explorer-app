import { Elysia } from 'elysia'
import { nodeRoutes } from './routes/nodeRoutes'
import { cors } from '@elysiajs/cors'

const app = new Elysia()
  .use(cors())
  .use(nodeRoutes)
  .listen(3000)

console.log(`🚀 Server running on http://localhost:3000`)
