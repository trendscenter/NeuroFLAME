import { BrowserWindow, dialog } from 'electron';
import { promises as fs } from 'fs';
import path from 'path';

// Define the type for the function parameters
interface DirectoryDialogParams {
  mainWindow: BrowserWindow;
  pathString?: string;
}

// Define the type for the function's return value
interface DirectoryDialogResult {
  directoryPath?: string;
  canceled: boolean;
  error: string | null;
}

export async function useDirectoryDialog({
  mainWindow,
  pathString,
}: DirectoryDialogParams): Promise<DirectoryDialogResult> {
  let defaultPath: string | undefined;

  if (pathString) {
    try {
      const resolvedPath = path.resolve(pathString);
      await fs.access(resolvedPath);
      defaultPath = resolvedPath;
    } catch {
      console.warn(`Invalid path provided: ${pathString}`);
    }
  }

  try {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      defaultPath,
    });

    return { directoryPath: filePaths[0], canceled, error: null };
  } catch (error) {
    console.error('Failed to open directory dialog:', error);
    return {
      directoryPath: undefined,
      canceled: true,
      error: (error as Error).message,
    };
  }
}
