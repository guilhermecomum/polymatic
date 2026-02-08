import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('compositions')
    .addColumn('id', 'varchar(255)', (col) => col.primaryKey())
    .addColumn('slug', 'varchar(12)', (col) => col.notNull().unique())
    .addColumn('title', 'varchar(255)')
    .addColumn('user_id', 'varchar(255)', (col) =>
      col.references('users.id').onDelete('cascade')
    )
    .addColumn('folder_id', 'varchar(255)', (col) =>
      col.references('folders.id').onDelete('set null')
    )
    .addColumn('bpm', 'integer', (col) => col.notNull().defaultTo(120))
    .addColumn('channels', 'jsonb', (col) => col.notNull())
    .addColumn('is_public', 'boolean', (col) => col.notNull().defaultTo(true))
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('compositions').execute();
}
