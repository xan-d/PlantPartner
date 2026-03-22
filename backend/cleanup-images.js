/**
 * cleanup-images.js
 * 
 * Finds (and optionally deletes) orphaned plant images that are no longer
 * referenced by any row in the Plants table.
 *
 * Usage:
 *   node cleanup-images.js          # dry-run — just lists orphaned files
 *   node cleanup-images.js --delete  # actually removes them from disk
 */
require('dotenv').config();
const fs   = require('fs');
const path = require('path');
const db   = require('./db');

const IMAGE_DIR = path.join(__dirname, '../frontend/public/plantImages');
const shouldDelete = process.argv.includes('--delete');

(async () => {
    try {
        // 1. Get every image path currently stored in the DB
        const [rows] = await db.promise().query('SELECT image FROM Plants WHERE image IS NOT NULL');
        const usedFiles = new Set(rows.map(r => path.basename(r.image)));

        // 2. List every file on disk
        const diskFiles = fs.readdirSync(IMAGE_DIR);

        // 3. Find orphans (skip dotfiles like .gitkeep)
        const orphans = diskFiles.filter(f => !f.startsWith('.') && !usedFiles.has(f));

        if (orphans.length === 0) {
            console.log('No orphaned images found — everything on disk is referenced in the DB.');
            process.exit(0);
        }

        console.log(`Found ${orphans.length} orphaned image(s):\n`);
        orphans.forEach(f => console.log(`  ${f}`));

        if (shouldDelete) {
            console.log('\nDeleting orphaned files...');
            for (const f of orphans) {
                fs.unlinkSync(path.join(IMAGE_DIR, f));
            }
            console.log('Done — deleted', orphans.length, 'file(s).');
        } else {
            console.log('\nThis was a dry run. Re-run with --delete to remove these files.');
        }
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        db.end();
    }
})();
