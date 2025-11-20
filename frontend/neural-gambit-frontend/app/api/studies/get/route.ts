import { NextResponse } from "next/server";
import { BACKEND_URL } from "../../interface";
import { cookies } from "next/headers";

export async function GET() {
    try{
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value ?? "";
        
        const response = await fetch(`${BACKEND_URL}/studies/studies/list`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const error = await response.text();
            console.error("Erro ao buscar estudos:", error);
            return NextResponse.json({ error: "Erro ao buscar estudos" }, { status: 500 });
        }

        const data = await response.json();
        console.log("Estudos recebidos:", data);
        return NextResponse.json(data);
    } catch (error) {
        console.error("Erro inesperado:", error);
        return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
    }
}