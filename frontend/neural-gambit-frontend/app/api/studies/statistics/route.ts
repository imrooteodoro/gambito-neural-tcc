import { NextResponse } from "next/server";
import { BACKEND_URL } from "../../interface";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    const response = await fetch(`${BACKEND_URL}/studies/studies/statistics`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch statistics");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.error();
  }
}
