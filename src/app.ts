import fastify from 'fastify'
import userRoutes from './routes/userRoutes'

const app = fastify()

app.register(userRoutes, { prefix: '/users' })

async function start() {
  try {
    const address = await app.listen({ port: 3000 })
    console.log(`Server listening at ${address}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start()
