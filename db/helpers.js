import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'node:fs';

export function getSqlAsString (sqlFilePath) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    return fs.readFileSync(__dirname + sqlFilePath).toString();
}
