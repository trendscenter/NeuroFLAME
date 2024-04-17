import {generateTokens} from "./authentication.js"

const site1Token = generateTokens({ userId: 'site1' }, { shouldExpire: false })
const site2Token = generateTokens({ userId: 'site2' }, { shouldExpire: false })
const centralToken = generateTokens({ userId: 'central' }, { shouldExpire: false })
console.log({ site1Token, site2Token, centralToken })
