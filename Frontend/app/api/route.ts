import { NextResponse } from "next/server"

// This is a proxy route handler to forward requests to the original API
export async function GET(request: Request) {
  const { pathname, search } = new URL(request.url)

  try {
    // Forward the request to the original API
    const response = await fetch(`http://localhost:3000${pathname}${search}`)

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("API proxy error:", error)
    return NextResponse.json({ error: "Failed to fetch data from API" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { pathname } = new URL(request.url)
  const body = await request.json()

  try {
    // Forward the request to the original API
    const response = await fetch(`http://localhost:3000${pathname}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("API proxy error:", error)
    return NextResponse.json({ error: "Failed to send data to API" }, { status: 500 })
  }
}
