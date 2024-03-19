interface GenerateProjectFileArgs {
  projectName: string
  FQDN: string
  fed_learn_port: number
  admin_port: number
  outputFilePath: string
  siteNames: string[]
}

export function generateProjectFile({
  projectName,
  FQDN,
  fed_learn_port,
  admin_port,
  outputFilePath,
  siteNames,
}: GenerateProjectFileArgs) {
    
}
