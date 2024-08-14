import { getConfig } from '../config/config.js'
import { logger } from '../logger.js'
import inMemoryStore from '../inMemoryStore.js'

// TypeScript interfaces for the GraphQL response
interface GraphQLResponse<T> {
  data?: T
  errors?: { errorMessage: string }[]
}

interface ReportRunErrorResponse {
  reportRunError: {
    success: boolean
    errorMessage?: string
  }
}

// GraphQL mutation
const REPORT_RUN_ERROR_MUTATION = `
  mutation reportRunError($runId: String!, $errorMessage: String!) {
    reportRunError(runId: $runId, errorMessage: $errorMessage)
  }
`

export default async function reportRunError({
  runId,
  errorMessage,
}: {
  runId: string
  errorMessage: string
}) {
  const config = await getConfig()
  const { httpUrl } = config
  const accessToken = inMemoryStore.get('accessToken')

  try {
    const response = await fetch(httpUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': accessToken,
      },
      body: JSON.stringify({
        query: REPORT_RUN_ERROR_MUTATION,
        variables: { runId, errorMessage },
      }),
    })

    // Check for non-OK HTTP status
    if (!response.ok) {
      const responseText = await response.text()
      logger.error(
        `HTTP Error: ${response.status} - ${response.statusText}, Response: ${responseText}`,
      )
      throw new Error(
        `Failed to report run error: HTTP ${response.status} - ${response.statusText}`,
      )
    }

    // Parse the JSON response and assert its type
    const responseData = (await response.json()) as GraphQLResponse<
      ReportRunErrorResponse
    >

    // Handle GraphQL errors
    if (responseData.errors && responseData.errors.length > 0) {
      logger.error(`GraphQL Error: ${JSON.stringify(responseData.errors)}`)
      throw new Error('Failed to report run error due to GraphQL error')
    }

    // Validate response data
    if (!responseData.data || !responseData.data.reportRunError) {
      logger.error(`Invalid response data: ${JSON.stringify(responseData)}`)
      throw new Error('Invalid response data')
    }

    const {
      success,
      errorMessage: reportErrorMessage,
    } = responseData.data.reportRunError

    if (!success) {
      logger.error(`Report run error failed: ${reportErrorMessage}`)
      throw new Error(`Report run error failed: ${reportErrorMessage}`)
    }

    return responseData.data.reportRunError
  } catch (error) {
    logger.error(
      `Error reporting run error: ${
        (error as Error).message || JSON.stringify(error)
      }`,
    )
    throw error
  }
}
