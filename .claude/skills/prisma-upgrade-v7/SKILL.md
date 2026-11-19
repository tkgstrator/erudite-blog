---
name: prisma-upgrade-v7
description: Complete migration guide from Prisma ORM v6 to v7 covering all breaking changes. Use when upgrading Prisma versions, encountering v7 errors, or migrating existing projects. Triggers on "upgrade to prisma 7", "prisma 7 migration", "prisma-client generator", "driver adapter required".
license: MIT
metadata:
  author: prisma
  version: "7.6.0"
---

# Upgrade to Prisma ORM 7

Complete guide for migrating from Prisma ORM v6 to v7. The upgrade introduces significant breaking changes: the new `prisma-client` generator, required driver adapters, `prisma.config.ts`, explicit environment loading, and new generated client entrypoints.

## When to Apply

Use this skill when:

- Upgrading from Prisma v6 to v7
- Updating to the `prisma-client` generator
- Setting up driver adapters
- Configuring `prisma.config.ts`
- Fixing import errors after upgrade

## Requirements and Critical Notes

- **DO NOT migrate MongoDB projects to Prisma 7.** MongoDB projects must stay on the latest Prisma 6.x release. Do not follow Prisma 7's SQL client path for MongoDB apps. (MongoDB has no SQL `@prisma/adapter-*` package in the published Prisma 7.6.0 packages.)
- **Node.js**: 20.19.0 or later required.
- **TypeScript**: 5.4.0 or later required.
- **Latest stable Prisma ORM version**: `7.6.0`.

## Breaking Changes Summary

| Change | v6 | v7 |
|--------|----|----|
| Module format | Implicit / mixed | ESM-first, `moduleFormat = "cjs"` supported |
| Generator provider | `prisma-client-js` | `prisma-client` is the default, while `prisma-client-js` still exists for legacy setups |
| Output path | Auto (node_modules) | Required explicit |
| Driver adapters | Optional | Required for SQL providers |
| Config file | `.env` + schema | `prisma.config.ts` |
| Env loading | Automatic | Manual (dotenv) |
| Generated entrypoints | Single package export | `client`, `browser`, `models`, `enums` entrypoints |
| Type-safe query fragments | `Prisma.validator()` | TypeScript `satisfies` |
| Middleware | `$use()` | Client Extensions |
| Metrics | Preview feature | Removed |

## Reference Files

Each breaking change has a detailed migration guide in `references/`, listed here by priority. Read `schema-changes.md` and `driver-adapters.md` first, then apply the remaining files based on your project setup.

| Priority | Impact | File | Covers |
|----------|--------|------|--------|
| 1 | CRITICAL | `references/schema-changes.md` | Generator migration, required output paths, generated entrypoints, imports, and `Prisma.validator` replacement |
| 2 | CRITICAL | `references/driver-adapters.md` | Required adapter installation for SQL providers, pool differences, and Prisma Postgres adapter choices |
| 3 | CRITICAL | `references/esm-support.md` | ESM-first setup plus CommonJS fallback with `moduleFormat = "cjs"` |
| 4 | HIGH | `references/prisma-config.md` | Creating and using `prisma.config.ts` |
| 4 | HIGH | `references/env-variables.md` | Explicit environment variable loading |
| 5 | HIGH | `references/removed-features.md` | Removed middleware, metrics, and legacy CLI behavior/flags |
| 6 | HIGH | `references/accelerate-users.md` | Migration notes / special handling for Accelerate users |

## Upgrade Steps Overview

1. Update packages to v7
2. Choose your module format (`esm` by default, `cjs` if needed)
3. Update TypeScript configuration
4. Update the schema generator block
5. Create `prisma.config.ts`
6. Install and configure a driver adapter for SQL providers
7. Update Prisma Client imports
8. Update client instantiation
9. Replace deprecated helper patterns like `Prisma.validator`
10. Run `prisma generate` and test

## Quick Upgrade Commands

```bash
# Update packages
npm install @prisma/client@7
npm install -D prisma@7

# Install a driver adapter (PostgreSQL or Prisma Postgres via direct TCP)
npm install @prisma/adapter-pg pg

# Install dotenv for env loading
npm install dotenv

# Regenerate client
npx prisma generate
```

## Step-by-Step Migration

### 1. Update package.json for ESM-first projects

```json
{
  "type": "module"
}
```

If you need to stay on CommonJS: keep your app as CJS and set `moduleFormat = "cjs"` in the generator block instead of forcing ESM.

### 2. Update tsconfig.json

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2023",
    "strict": true,
    "esModuleInterop": true
  }
}
```

### 3. Update schema.prisma

```prisma
// Before (v6)
generator client {
  provider = "prisma-client-js"
}

// After (v7)
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
  // Optional if you need CommonJS:
  // moduleFormat = "cjs"
}
```

### 4. Create prisma.config.ts

```typescript
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})
```

### 5. Install a driver adapter (SQL providers only)

```bash
# PostgreSQL
npm install @prisma/adapter-pg pg

# MySQL
npm install @prisma/adapter-mariadb mariadb

# SQLite
npm install @prisma/adapter-better-sqlite3 better-sqlite3

# Prisma Postgres in standard Node.js apps (recommended)
npm install @prisma/adapter-pg pg

# Prisma Postgres serverless driver (edge/serverless)
npm install @prisma/adapter-ppg @prisma/ppg

# Neon
npm install @prisma/adapter-neon
```

**MongoDB**: there is no SQL `@prisma/adapter-*` package for MongoDB in the published Prisma 7.6.0 packages. If you are upgrading a MongoDB project, STOP here — keep that project on the latest Prisma 6.x release instead of following the standard Prisma 7 migration path.

### 6. Update client instantiation

```typescript
// Before (v6)
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// After (v7)
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
})

const prisma = new PrismaClient({ adapter })
```

### 7. Replace Prisma.validator with satisfies

```typescript
import { Prisma } from '../generated/prisma/client'

const userSelect = {
  id: true,
  email: true,
  name: true,
} satisfies Prisma.UserSelect
```

### 8. Run migrations and generate

```bash
npx prisma generate
npx prisma migrate dev  # if needed
```

## Troubleshooting

### "Cannot find module" errors

- Check that the generator `output` path matches your import path.
- Ensure `prisma generate` ran successfully.

### SSL certificate errors

- Add `ssl: { rejectUnauthorized: false }` to the adapter config if you need to preserve old behavior.
- Or configure your certificates properly with `NODE_EXTRA_CA_CERTS` / OpenSSL CA settings.

### Connection timeout issues

- Driver adapters use the underlying driver's defaults, which differ from v6.
- Configure pool settings explicitly on the adapter if needed.

## Resources

- [Official v7 Upgrade Guide](https://www.prisma.io/docs/orm/more/upgrades/to-v7)
- [Driver Adapters Documentation](https://www.prisma.io/docs/orm/core-concepts/supported-databases/database-drivers)
- [Prisma Config Reference](https://www.prisma.io/docs/orm/reference/prisma-config-reference)
