// Utility functions for FastAPI integration
import type { QueryRequest, QueryResponse, ApiError } from "../types/api"

export class FastAPIClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "") // Remove trailing slash
  }

  async query(request: QueryRequest): Promise<QueryResponse> {
    const response = await fetch(`${this.baseUrl}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add authentication headers if needed
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}`)
    }

    return await response.json()
  }

}

// Export a default client instance
export const fastApiClient = new FastAPIClient("http://3.110.165.195:8000")
