// TypeScript types for your FastAPI integration
export interface QueryRequest {
    query: string
    // Add other fields your FastAPI expects
    // user_id?: string
    // session_id?: string
    // options?: Record<string, any>
  }
  
  export interface QueryResponse {
    answer?: string
    result?: string
    // Add other fields your FastAPI returns
    // status?: string
    // timestamp?: string
    // metadata?: Record<string, any>
  }
  
  export interface ApiError {
    detail?: string
    message?: string
    error?: string
  }
  