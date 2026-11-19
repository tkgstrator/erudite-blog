---
name: prisma-d1
description: Prisma ORM with Cloudflare D1 — schema configuration, migration workflow, client setup, and deployment. Load when working with Prisma + D1 migrations, schema changes, or PrismaClient instantiation in Workers.
---

# Prisma ORM + Cloudflare D1

Setup, migration, and deployment guide for Prisma with Cloudflare D1.

## Reference Docs

| Source | URL | Use for |
|--------|-----|---------|
| Prisma D1 Guide | `https://www.prisma.io/docs/guides/deployment/cloudflare-d1` | Official guide |
| Prisma Migrate Diff | `https://www.prisma.io/docs/orm/reference/prisma-cli-reference#migrate-diff` | `migrate diff` options |
| D1 Docs | `https://developers.cloudflare.com/d1` | D1 specs and limitations |

## Install Packages

```bash
bun add prisma --dev
bun add @prisma/client @prisma/adapter-d1
```

## Schema Configuration

File: `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
  runtime  = "cloudflare"
}

datasource db {
  provider = "sqlite"
}
```

Rules:

- Set datasource `provider = "sqlite"` — D1 is SQLite-based.
- Set `runtime = "cloudflare"` — generates a client for the Cloudflare Workers runtime.
- Always specify `output` explicitly.

## Migration Workflow

- DON'T use `prisma migrate dev` — it does not work with D1.
- DO use `prisma migrate diff` to generate SQL, then `wrangler d1 execute` to apply it.
- Local and remote D1 are separate databases. Apply every migration twice: once with `--local`, once with `--remote`.

### Initial Migration

```bash
# Generate SQL (empty state -> current schema)
bunx prisma migrate diff \
  --from-empty \
  --to-schema prisma/schema.prisma \
  --script > migrations/0001_init.sql

# Apply to local D1
bunx wrangler d1 execute <DB_NAME> --local \
  --file="./migrations/0001_init.sql"

# Apply to remote D1
bunx wrangler d1 execute <DB_NAME> --remote \
  --file="./migrations/0001_init.sql"
```

### Subsequent Migrations

```bash
# Generate SQL (current local D1 state -> current schema)
bunx prisma migrate diff \
  --from-local-d1 \
  --to-schema prisma/schema.prisma \
  --script > migrations/0002_<description>.sql

# Apply locally
bunx wrangler d1 execute <DB_NAME> --local \
  --file="./migrations/0002_<description>.sql"

# Apply remotely
bunx wrangler d1 execute <DB_NAME> --remote \
  --file="./migrations/0002_<description>.sql"
```

### Migration File Naming

Place sequentially numbered SQL files in the `migrations/` directory:

- `0001_init.sql`
- `0002_add_exercises.sql`
- `0003_add_index.sql`

## Client Generation

```bash
bunx prisma generate
```

- Run this after every schema change — the client is not regenerated automatically.
- Generates the typed client at the schema's `output` path.

## Using PrismaClient in Workers

```typescript
import { PrismaClient } from '@/generated/prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'

// Inside Workers fetch handler:
const adapter = new PrismaD1(env.DB)
const prisma = new PrismaClient({ adapter })

const users = await prisma.user.findMany()

// Resource cleanup (required)
ctx.waitUntil(prisma.$disconnect())
```

Rules:

- `env.DB` must match the `binding` name under `d1_databases` in `wrangler.toml` / `wrangler.jsonc`.
- Always call `prisma.$disconnect()` — skipping it causes Workers memory exhaustion (memory leaks).
- Wrap the disconnect in `ctx.waitUntil()` so it runs asynchronously after the response is sent.

## D1 Binding Configuration

File: `wrangler.toml`

```toml
[[d1_databases]]
binding = "DB"
database_name = "your-db-name"
database_id = "your-db-id"
```

## prisma.config.ts (for migrations)

```typescript
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations'
  },
  datasource: {
    url: env('DATABASE_URL')
  }
})
```

`.env`:

```
DATABASE_URL="file:./prisma/db.sqlite"
```

## Common Pitfalls

1. Using `prisma migrate dev` — it does not work with D1. Use the `migrate diff` + `wrangler d1 execute` workflow instead.
2. Forgetting `bunx prisma generate` after a schema change — the client must be regenerated.
3. Binding name mismatch — `binding` in `wrangler.toml` must match `env.DB` in code.
4. Missing `$disconnect()` — causes Workers memory exhaustion.
5. Applying a migration to only one environment — local and remote are separate; apply with both `--local` and `--remote`.
6. Assuming full Prisma feature support — D1 is SQLite-based, so some Prisma features (e.g. `@db.Text` and the `Json` type) are unavailable.
