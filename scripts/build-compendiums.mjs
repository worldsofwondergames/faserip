/**
 * Build compendiums from JSON source files
 *
 * Usage: node scripts/build-compendiums.mjs
 *
 * This script reads JSON source files from packs/_source/ and creates
 * LevelDB compendium databases in the packs/ directory.
 *
 * Requires: npm install classic-level
 */

import { ClassicLevel } from 'classic-level';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const compendiums = [
  { name: 'weapons', source: 'weapons.json' },
  { name: 'ammunition', source: 'ammunition.json' },
  { name: 'vehicles', source: 'vehicles.json' },
  { name: 'headquarters', source: 'headquarters.json' },
  { name: 'room-packages', source: 'room-packages.json' },
  { name: 'gear', source: 'gear.json' }
];

function generateId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function buildCompendium(compendium) {
  const sourceFile = join(rootDir, 'packs', '_source', compendium.source);
  const dbPath = join(rootDir, 'packs', compendium.name);

  if (!existsSync(sourceFile)) {
    console.log(`Source file not found: ${sourceFile}`);
    return;
  }

  // Ensure directory exists
  if (!existsSync(dbPath)) {
    mkdirSync(dbPath, { recursive: true });
  }

  console.log(`Building ${compendium.name}...`);

  try {
    const data = JSON.parse(readFileSync(sourceFile, 'utf8'));
    const db = new ClassicLevel(dbPath, { valueEncoding: 'json' });

    // Clear existing data
    await db.clear();

    // Add each item
    for (const item of data) {
      const id = generateId();
      const entry = {
        ...item,
        _id: id,
        _key: `!items!${id}`
      };
      await db.put(`!items!${id}`, entry);
    }

    await db.close();
    console.log(`  Created ${data.length} entries in ${compendium.name}`);
  } catch (error) {
    console.error(`Error building ${compendium.name}:`, error.message);
  }
}

async function main() {
  console.log('Building FASERIP compendiums...\n');

  for (const compendium of compendiums) {
    await buildCompendium(compendium);
  }

  console.log('\nDone! Compendiums built successfully.');
  console.log('Note: Restart Foundry VTT to see the new compendiums.');
}

main().catch(console.error);
