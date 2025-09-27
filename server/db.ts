import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn("DATABASE_URL not set, using mock database for development");
  // Mock database URL for development when no real database is available
  databaseUrl = "postgresql://mock:mock@localhost:5432/mock";
}

// Use pooled connection for better performance
const pooledUrl = databaseUrl.includes('.neon.tech') 
  ? databaseUrl.replace('.neon.tech', '-pooler.neon.tech')
  : databaseUrl;

export const pool = new Pool({ 
  connectionString: pooledUrl,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export const db = drizzle({ client: pool, schema });