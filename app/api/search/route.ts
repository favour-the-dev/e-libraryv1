import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const isbn = searchParams.get("isbn") || "";
  const baseurl = process.env.NEXT_PUBLIC_SEARCHBOOKS_API_URL;

  if (!isbn) {
    return NextResponse.json(
      { message: "ISBN is required", book: null },
      { status: 200 }
    );
  }

  try {
    const respone = await fetch(
      `${baseurl}?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
    );

    if (!respone.ok) {
      return NextResponse.json(
        { message: "Failed to fetch book data", book: null },
        { status: 200 }
      );
    }

    const data = await respone.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred", book: null },
      { status: 500 }
    );
  }
}
