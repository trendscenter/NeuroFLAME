import { BrowserWindow, dialog } from 'electron'
import { promises as fs } from 'fs'

export async function useDirectoryDialog({
  mainWindow,
  pathString,
}: {
  mainWindow: BrowserWindow
  pathString?: string
}): Promise<{
  directoryPath?: string
  canceled: boolean
  error: string | null
}> {
  try {
    let defaultPath: string | undefined
    if (pathString) {
      try {
        await fs.access(pathString)
        defaultPath = pathString
      } catch {
        console.warn(`Invalid path: ${pathString}`)
        defaultPath = undefined
      }
    }

    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      defaultPath,
    })

    return { directoryPath: filePaths[0], canceled, error: null }
  } catch (e) {
    console.error('Failed to open directory dialog:', e)
    return {
      directoryPath: undefined,
      canceled: true,
      error: (e as Error).message,
    }
  }
}
