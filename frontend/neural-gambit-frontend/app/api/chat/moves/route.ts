import { BACKEND_URL } from "../../interface";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { moves, board_pgn }: { moves: string[], board_pgn: string } = await request.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    const response = await fetch(`${BACKEND_URL}/moves/send-moves`, {
        method: "POST", 
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "text/event-stream",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ moves, board_pgn })
    });

    if (!response.ok) {
        throw new Error("Failed to send moves");
    }
    
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = (error as Error).message || "Unknown error";
    
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
