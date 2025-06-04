import { NextResponse } from "next/server";
import { posts } from "../route"; // Import the posts array from the parent route file

export async function GET(req, { params }) {
    const { id } = await params;
    const post = posts.find((p) => p.id.toString() === id);

    if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
}
