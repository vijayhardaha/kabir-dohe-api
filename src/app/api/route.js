import { NextResponse } from "next/server";

/**
 * Handles GET requests to the root API endpoint.
 *
 * @async
 * @function GET
 * @returns {Promise<NextResponse>} A JSON response containing a success message
 * and instructions for using the API.
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Welcome to the Kabir Ke Dohe API! Use the /api/couplets endpoint to retrieve and filter couplets.",
  });
}
