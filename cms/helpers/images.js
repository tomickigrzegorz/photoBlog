import { statSync, existsSync, readdirSync, readFileSync, mkdirSync } from 'fs';
import path from 'path';

export function getAllFiles(dir, folder) {
  const sizeDir = path.join(dir, '1200');
  const sourceDir = existsSync(sizeDir) ? sizeDir : dir;
  const entries = readdirSync(sourceDir, { withFileTypes: true });
  return entries
    .filter(e => !e.isDirectory() && /\.(jpg|jpeg|png|gif)$/i.test(e.name))
    .map(e => `./images/${folder}/${e.name}`);
}

export function getAllDirectory(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
}

export function getAllJson(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter(f => f.endsWith('.json') && f !== 'index.json')
    .map(f => f.replace('.json', ''));
}

export function readJson(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

export function checkFolders(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}
