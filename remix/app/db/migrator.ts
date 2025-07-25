import { promises as fs } from 'fs';
import { FileMigrationProvider, Migrator } from 'kysely';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { db } from './connection';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationFolder = path.join(__dirname, 'migrations');

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder,
  }),
});

export async function migrateToLatest() {
  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error('failed to migrate');
    console.error(error);
    process.exit(1);
  }
}

export async function migrateDown() {
  const { error, results } = await migrator.migrateDown();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was reverted successfully`);
    } else if (it.status === 'Error') {
      console.error(`failed to revert migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error('failed to revert migration');
    console.error(error);
    process.exit(1);
  }
}