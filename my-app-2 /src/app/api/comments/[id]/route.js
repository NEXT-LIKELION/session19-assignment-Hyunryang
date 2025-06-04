// api/comments/[id]/route.js
import { NextResponse } from "next/server";
import { comments } from "../../../posts/[id]/comments/route";

// 댓글 수정
export async function PUT(req, { params }) {
    const { id } = await params;
    const commentId = parseInt(id);
    const { content } = await req.json();

    if (!content || content.trim() === "") {
        return NextResponse.json(
            { error: "댓글 내용을 입력해주세요." },
            { status: 400 }
        );
    }

    const commentIndex = comments.findIndex(comment => comment.id === commentId);
    
    if (commentIndex === -1) {
        return NextResponse.json(
            { error: "댓글을 찾을 수 없습니다." },
            { status: 404 }
        );
    }

    comments[commentIndex] = {
        ...comments[commentIndex],
        content: content.trim(),
        updatedAt: new Date()
    };

    return NextResponse.json(comments[commentIndex]);
}

// 댓글 삭제
export async function DELETE(req, { params }) {
    const { id } = await params;
    const commentId = parseInt(id);
    const commentIndex = comments.findIndex(comment => comment.id === commentId);
    
    if (commentIndex === -1) {
        return NextResponse.json(
            { error: "댓글을 찾을 수 없습니다." },
            { status: 404 }
        );
    }

    const deletedComment = comments.splice(commentIndex, 1)[0];
    return NextResponse.json(deletedComment);
}