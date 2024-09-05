# Get Auth Tokens

- `npm run getTokens`

# Configure the Components

## Central API

- `centralApi/src/config/defaultConfig.ts`
- `centralApi/src/environmentVariables.ts`

## File Server

- `fileServer/src/config/defaultConfig.ts`

## Central Federated Client

- `centralFederatedClient/src/defaultConfig.ts`

## Edge Federated Client

- `edgeFederatedClient/src/config/defaultConfig.ts`
- `edgeFederatedClient/site1-config.json`
- `edgeFederatedClient/site2-config.json`

# Save Mount Config for Site/Consortium

- `[site base directory]/[consortiumId]/mount_config.json`
  Example contents:

```json
{
  "dataPath": "C:\\development\\nvflare_app_boilerplate\\test_data\\site1"
}
```

Example:

- `_devTestDirectories/edgeSite1/testconsortium/mount_config.json`

# Launch the Components

Launch each component in their own VS Code JavaScript debug terminal (Bash shell):

## Central API

- `cd centralApi`
- `npm start`

## Central Federated Client

- `cd centralFederatedClient`
- `npm start`

## File Server

- `cd fileServer`
- `npm start`

## Edge Federated Client

- `cd edgeFederatedClient`
- `npm start "./edgeFederatedClient/site1-config.json"`
- `npm start "./edgeFederatedClient/site2-config.json"`
