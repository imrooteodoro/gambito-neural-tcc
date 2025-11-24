import { NextResponse } from "next/server";
import { BACKEND_URL } from "../../interface";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { message }: { message: string } = await request.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    const response = await fetch(`${BACKEND_URL}/genai/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
        "Accept": "text/event-stream",      
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend Error:", errorText);
      throw new Error(`Failed to analyze position: ${response.status}`);
    }


    return new Response(response.body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
          "Content-Encoding": "none", 
        }
      });

  } catch (error) {
    console.error("Proxy Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}