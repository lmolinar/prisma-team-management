import fs from "node:fs";

import { dirname } from "path";
import { fileURLToPath } from "url";

export function getSqlAsString(sqlFilePath: string): string {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    return fs.readFileSync(__dirname + sqlFilePath).toString();
}
