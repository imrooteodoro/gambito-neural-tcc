import { NextResponse } from "next/server";
import { BACKEND_URL } from "../interface";
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
        return NextResponse.json({ error: "Token não fornecido" }, { status: 400 });
    }

    try {

        const response = await fetch(`${BACKEND_URL}/signup/auth/activate/?token=${token}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
            },
            cache: "no-store" 
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Erro do backend:", errorText);
            

            return NextResponse.redirect(new URL('/login?error=activation_failed', request.url));
        }

        const data = await response.json();
     

        return NextResponse.redirect(new URL('/activate', request.url));

    } catch (error) {
        console.error("Erro interno no Next.js:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}