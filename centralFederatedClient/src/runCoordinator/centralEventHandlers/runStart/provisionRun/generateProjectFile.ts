import fs from 'fs'
import yaml from 'js-yaml'
import { logger } from '../../../../logger.js'

interface GenerateProjectFileArgs {
  projectName: string
  FQDN: string
  fed_learn_port: number
  admin_port: number
  outputFilePath: string
  siteNames: string[]
}

export async function generateProjectFile({
  projectName,
  FQDN,
  fed_learn_port,
  admin_port,
  outputFilePath,
  siteNames,
}: GenerateProjectFileArgs) {
  // Define the structure of the YAML content according to the provided specifications
  const data = {
    api_version: 3,
    name: projectName,
    participants: [
      {
        name: FQDN,
        org: 'nvidia',
        type: 'server',
        admin_port: admin_port,
        fed_learn_port: fed_learn_port,
      },
      {
        name: 'admin@admin.com',
        org: 'nvidia',
        type: 'admin',
        role: 'project_admin',
      },
      ...siteNames.map((siteName) => ({
        name: siteName,
        org: 'nvidia',
        type: 'client',
      })),
    ],
    builders: [
      {
        path: 'nvflare.lighter.impl.workspace.WorkspaceBuilder',
        args: {
          template_file: 'master_template.yml',
        },
      },
      {
        path: 'nvflare.lighter.impl.template.TemplateBuilder',
      },
      {
        path: 'nvflare.lighter.impl.static_file.StaticFileBuilder',
        args: {
          config_folder: 'config',
          overseer_agent: {
            path: 'nvflare.ha.dummy_overseer_agent.DummyOverseerAgent',
            overseer_exists: false,
            args: {
              sp_end_point: `${FQDN}:${fed_learn_port}:${admin_port}`,
            },
          },
        },
      },
      { path: 'nvflare.lighter.impl.cert.CertBuilder' },
      { path: 'nvflare.lighter.impl.signature.SignatureBuilder' },
    ],
    description: 'project yaml file',
  }

  // Convert the data structure to a YAML formatted string
  const yamlContent = yaml.dump(data)

  // Write the YAML content to the specified output file path
  try {
    await fs.promises.writeFile(outputFilePath, yamlContent, 'utf8')
    logger.info(`Project file generated at: ${outputFilePath}`)
  } catch (error) {
    logger.error(`Failed to generate project file: ${error}`)
    throw error // Allows further error handling by the caller
  }
}
