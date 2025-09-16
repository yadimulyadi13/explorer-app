import { Elysia, t } from 'elysia'
import { nodeService } from '../services/nodeService'

// RESTful, versioned routes: /v1
// Resources: nodes
// - GET   /v1/nodes                -> list nodes by parentId (default root)
// - GET   /v1/nodes/:id/children   -> list direct children of a node
// - GET   /v1/nodes/tree           -> full hierarchical tree
// - POST  /v1/nodes                -> create a node (default type FOLDER)
export const nodeRoutes = (app: Elysia) =>
  app.group('/v1', app =>
    app.group('/nodes', app =>
      app
        // List nodes, optionally filtered by parentId. Default: root (parentId = null)
        .get('/', async ({ query }) => {
          let parentId: number | null = null
          const q = (query as any)?.parentId
          if (q !== undefined && q !== null && q !== '' && q !== 'null') {
            const n = Number(q)
            parentId = Number.isFinite(n) ? n : null
          }
          const nodes = await nodeService.getChildren(parentId)
          return { data: nodes }
        })

        // List direct children for a specific node
        .get('/:id/children', async ({ params }) => {
          const children = await nodeService.getChildren(Number(params.id))
          return { data: children }
        })

        // Create a node (default type FOLDER)
        .post('/', async ({ body }) => {
          const created = await nodeService.createNode(
            body.name,
            (body.type as 'FOLDER' | 'FILE') ?? 'FOLDER',
            body.parentId
          )
          return { data: created }
        }, {
          body: t.Object({
            name: t.String(),
            type: t.Optional(t.Union([t.Literal('FOLDER'), t.Literal('FILE')])),
            parentId: t.Optional(t.Number())
          })
        })

        // Full hierarchical tree
        .get('/tree', async () => {
          const tree = await nodeService.getTree()
          return { data: tree }
        })
    )
  )