import fs from 'fs';
import path from 'path';

export function findInParent(name, startFolder = __dirname) {
  let current = startFolder;
  let lastCurrent = current;
  while(true) {
    if (current === '/') return null;
    if (fs.existsSync(path.join(current, name))) {
      return path.join(current, name);
    }

    lastCurrent = current;
    current = path.dirname(current);

    // Simple check for infinite looping
    if (current === lastCurrent) return null;
  }
}