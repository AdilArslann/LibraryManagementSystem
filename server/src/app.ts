import express from 'express'
import {
  createExpressMiddleware,
  type CreateExpressContextOptions,
} from '@trpc/server/adapters/express'
import cors from 'cors'
import { renderTrpcPanel } from 'trpc-panel'
import * as Sentry from '@sentry/node'
import { ProfilingIntegration } from '@sentry/profiling-node'
import type { Database } from './database'
import { appRouter } from './modules'
import type { Context } from './trpc'
import config from './config'

export default function createApp(db: Database) {
  const app = express()

  if (config.sentryDSN && !config.isCi) {
    // Sentry can sometimes cause issues in CI when running the tests.
    // So it also checks if it's running in CI environment if so it won't initialize Sentry
    // hence avoiding any false fails.
    Sentry.init({
      dsn: config.sentryDSN,
      integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Sentry.Integrations.Express({ app }),
        new ProfilingIntegration(),
      ],
      // Performance Monitoring
      tracesSampleRate: 1.0, //  Capture 100% of the transactions
      // Set sampling rate for profiling - this is relative to tracesSampleRate
      profilesSampleRate: 1.0,
    })
    app.use(Sentry.Handlers.requestHandler())
    app.use(Sentry.Handlers.tracingHandler())
    app.use(Sentry.Handlers.errorHandler())
  }

  app.use(cors())
  app.use(express.json())

  // Endpoint for health checks - pinging the server to see if it's alive.
  // This can be used by tests, load balancers, monitoring tools, etc.
  app.use('/health', (_, res) => {
    res.status(200).send('OK')
  })

  // Using TRPC router, which will live under /v1/trpc
  // path. It will be used for all our procedures.
  app.use(
    '/v1/trpc',
    createExpressMiddleware({
      // Created context for each request, which we will be able to
      // access in our procedures.
      createContext: ({ req, res }: CreateExpressContextOptions): Context => ({
        // What we provide to our procedures under `ctx` key.
        db,
        req,
        res,
      }),

      // all routes
      router: appRouter,
    })
  )
  app.use('/panel', (_, res) =>
    res.send(
      renderTrpcPanel(appRouter, {
        url: 'http://localhost:3000/v1/trpc',
        transformer: 'superjson',
      })
    )
  )

  return app
}
