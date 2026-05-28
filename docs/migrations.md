# Migration Commands

All database migration commands powered by Drizzle ORM. Configuration lives in `drizzle.config.ts`.

All commands operate against the connection string defined by `DATABASE_WRITE_URL`.

## `npm run db:generate`

Generates a new SQL migration file in `db/migrations/` based on changes detected in `db/schema/*.ts`.

Pass a migration name with `-- --name`:

```
npm run db:generate -- --name=add_users_table
npm run db:generate -- --name add_users_table
```

Produces a file like `0000_add_users_table.sql`.

## `npm run db:migrate`

Applies all pending migration files in `db/migrations/` to the database.

## `npm run db:push`

Pushes the current schema in `db/schema/*.ts` directly to the database without generating migration files. Use during early development. Never use in production.

## `npm run db:pull`

Introspects the live database and generates schema files from it. Use this once to bootstrap schemas from an existing database.

## `npm run db:studio`

Opens Drizzle Studio in the browser — a UI for exploring and editing data in the database connected via `drizzle.config.ts`.

## `npm run db:check`

Validates the consistency of all migration files in `db/migrations/`. Fails if migrations are out of order or contain conflicts.

## `npm run db:drop`

Drops a migration file from `db/migrations/`. Interactive — prompts which migration to remove.
