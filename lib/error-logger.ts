// A utility for better error logging and debugging

type ErrorDetails = {
    message: string
    stack?: string
    code?: string
    cause?: unknown
    context?: Record<string, unknown>
  }
  
  export function logError(error: unknown, context?: Record<string, unknown>): ErrorDetails {
    // Convert any error type to a structured error object
    const errorDetails: ErrorDetails = {
      message: "Unknown error occurred",
      context,
    }
  
    if (error instanceof Error) {
      errorDetails.message = error.message
      errorDetails.stack = error.stack
      // @ts-ignore - Some errors have a code property
      if (error.code) errorDetails.code = error.code
      // Modern errors might have a cause
      if ("cause" in error) errorDetails.cause = error.cause
    } else if (typeof error === "string") {
      errorDetails.message = error
    } else if (error && typeof error === "object") {
      try {
        errorDetails.message = JSON.stringify(error)
      } catch {
        errorDetails.message = "Unserializable error object"
      }
    }
  
    // Log to console in development
    if (process.env.NODE_ENV !== "production") {
      console.error("Error details:", errorDetails)
    }
  
    return errorDetails
  }
  
  // Helper for API routes
  export function createErrorResponse(error: unknown, status = 500) {
    const details = logError(error)
  
    return new Response(
      JSON.stringify({
        error: details.message,
        ...(process.env.NODE_ENV !== "production" ? { details } : {}),
      }),
      {
        status,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
  