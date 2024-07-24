import { generateTokens } from './authentication.js'
import {logger} from '../logger.js'

const centralToken = generateTokens(
  { userId: '66289c79aebab67040a20067', roles: ['central'] },
  { shouldExpire: false },
)
const site1Token = generateTokens(
  { userId: '66289c79aebab67040a20068', roles: ['user'] },
  { shouldExpire: false },
)
const site2Token = generateTokens(
  { userId: '66289c79aebab67040a20069', roles: ['user'] },
  { shouldExpire: false },
)
logger.info({ site1Token, site2Token, centralToken })
