import { migrateToLatest } from '../app/db/migrator';

async function main() {
  console.log('Running migrations...');
  await migrateToLatest();
  console.log('Migrations completed!');
  process.exit(0);
}

main().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});