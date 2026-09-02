// API health route

import { NextRequest, NextResponse } from "next/server";
import { getSessionToken } from "@/app/lib/supabase-server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";


export async function GET() {
	const accesstoken = await getSessionToken();
	try {
		const backendRes = await fetch(`${BACKEND_URL}/health`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${accesstoken}`
			},
		});

      		if (!backendRes.ok) {
        		const errorText = await backendRes.text();
        		console.error(
        		  `[health] Backend error ${backendRes.status}:`,
        		  errorText,
        		);
        		throw new Error("health_backend_error");
      		}

		return NextResponse.json(
			{"message": "API is live and healthy"},
			{"status": 200}
		);
	} catch (error: any) {
		console.error("Failed to get API health status: ", error);

		return NextResponse.json(
			{"error": "API health check failed."},
			{"status": 500}
		);
	}
};
