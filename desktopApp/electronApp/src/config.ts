import path from 'path';
import { promises as fs } from 'fs';
import { app, shell } from 'electron';
import { defaultConfig } from './defaultConfig.js';
import logger from './logger.js';

export function getConfigPath(): string {
  const args: string[] = process.argv.slice(1); // Skip the first argument which is the path to node
  const configArgIndex: number = args.findIndex(arg => arg.startsWith('--config='));
  return configArgIndex !== -1
    ? path.resolve(args[configArgIndex].split('=')[1])
    : path.join(app.getPath('userData'), 'config.json');
}

export async function getConfig(): Promise<typeof defaultConfig> {
  const configPath = getConfigPath();
  logger.info('Reading configuration from:', configPath);
  try {
    const config = await fs.readFile(configPath, 'utf8');
    return JSON.parse(config);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      logger.info('Configuration file not found, creating default configuration.');
      await fs.writeFile(configPath, JSON.stringify(defaultConfig, null, 2));
      return defaultConfig;
    } else {
      logger.error('Failed to read or parse the configuration file:', error);
      throw new Error('Failed to access the configuration file.');
    }
  }
}

export async function applyDefaultConfig(): Promise<void> {
  const configPath = getConfigPath();
  await fs.writeFile(configPath, JSON.stringify(defaultConfig, null, 2));
}

export async function openConfig(): Promise<void> {
  const configPath = getConfigPath();
  try {
    await shell.openPath(configPath);
  } catch (e) {
    logger.error('Failed to open path:', e);
    throw new Error('Failed to open path');
  }
}
