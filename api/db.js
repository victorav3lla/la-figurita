import { neon } from '@neondatabase/serverless'

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.NEON_DATABASE_URL

if (!connectionString) {
  throw new Error('No database connection string found')
}

export const sql = neon(connectionString)
