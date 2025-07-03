"use client"

import type React from "react"
import { useState } from "react"
import "./QueryInterface.css"

const API_CONFIG = {
  baseUrl: "http://3.110.165.195:8000", // Change to your FastAPI server URL
  endpoints: {
    query: "/ask",
  },
}

const QueryInterface: React.FC = () => {
  const [query, setQuery] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [apiUrl, setApiUrl] = useState(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.query}`)
  const [showSettings, setShowSettings] = useState(false)
  const [lastQueryTime, setLastQueryTime] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setResponse("")

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Adjust this based on your FastAPI response structure
      const responseText = data.response || data.answer || data.result || JSON.stringify(data)

      setResponse(responseText)
      setLastQueryTime(new Date().toLocaleTimeString())
    } catch (error) {
      console.error("Query error:", error)

      if (error instanceof TypeError && error.message.includes("fetch")) {
        setResponse(
          "Error: Unable to connect to the API. Please check if your FastAPI server is running and the URL is correct.",
        )
      } else {
        setResponse(
          error instanceof Error
            ? `Error: ${error.message}`
            : "Sorry, there was an error processing your request. Please try again.",
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  const clearAll = () => {
    setQuery("")
    setResponse("")
    setLastQueryTime("")
  }

  return (
    <div className="query-interface">
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1 className="title">Query Interface</h1>
          <p className="subtitle">Enter your query below to get a response from FastAPI</p>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title settings-toggle" onClick={() => setShowSettings(!showSettings)}>
              <span className="settings-icon">⚙️</span>
              API Configuration
              <span className="toggle-text">({showSettings ? "hide" : "show"})</span>
            </h3>
          </div>
          {showSettings && (
            <div className="card-content">
              <div className="settings-content">
                <label htmlFor="api-url" className="label">
                  FastAPI Endpoint URL:
                </label>
                <input
                  id="api-url"
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="http://localhost:8000/query"
                  className="input"
                />
            </div>
        </div>
        )}
        </div>


        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="search-icon">🔍</span>
              Your Query
            </h3>
          </div>
          <div className="card-content">
            <form onSubmit={handleSubmit} className="form">
              <input
                type="text"
                placeholder="Enter your question or query here..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input"
                disabled={isLoading}
              />
              <div className="button-group">
                <button type="submit" disabled={!query.trim() || isLoading} className="button button-primary">
                  {isLoading ? (
                    <>
                      <span className="spinner">⟳</span>
                      Processing...
                    </>
                  ) : (
                    "Submit Query"
                  )}
                </button>
                {(query || response) && (
                  <button type="button" onClick={clearAll} disabled={isLoading} className="button button-secondary">
                    Clear
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {(response || isLoading) && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Response</h3>
              {lastQueryTime && <p className="timestamp">Last updated: {lastQueryTime}</p>}
            </div>
            <div className="card-content">
              {isLoading ? (
                <div className="loading-container">
                  <span className="spinner large">⟳</span>
                  Waiting for FastAPI response...
                </div>
              ) : (
                <textarea
                  value={response}
                  readOnly
                  className="response-textarea"
                  placeholder="Your response will appear here..."
                />
              )}
            </div>
          </div>
        )}

        <div className="footer">
          <p>
            Connected to: <code className="api-url">{apiUrl}</code>
          </p>
        </div>
      </div>
    </div>
  )
}

export default QueryInterface
