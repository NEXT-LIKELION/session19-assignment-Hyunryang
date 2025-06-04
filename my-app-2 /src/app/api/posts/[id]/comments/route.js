// api/posts/[id]/comments/route.js
import { NextResponse } from "next/server";

// 댓글 데이터를 저장할 배열 (실제 프로젝트에서는 데이터베이스 사용 권장)
export let comments = [];

function getRandomNickname() {
    const adjectives = [
        "Happy",
        "Crazy",
        "Silent",
        "Cool",
        "Funny",
        "Smart",
        "Brave",
        "Kind",
        "Clever",
        "Wise",
    ];
    const animals = [
        "Lion",
        "Tiger",
        "Bear",
        "Eagle",
        "Shark",
        "Wolf",
        "Fox",
        "Hawk",
        "Dolphin",
        "Falcon",
    ];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    return `${randomAdj} ${randomAnimal}`;
}

// 특정 게시글의 댓글 조회
export async function GET(req, { params }) {
    const postId = parseInt(params.id);
    const postComments = comments.filter(
        (comment) => comment.postId === postId
    );
    return NextResponse.json(postComments);
}

// 댓글 작성
export async function POST(req, { params }) {
    const postId = parseInt(params.id);
    const { content, author } = await req.json();

    if (!content || content.trim() === "") {
        return NextResponse.json(
            { error: "댓글 내용을 입력해주세요." },
            { status: 400 }
        );
    }

    const nickname =
        author && author.trim() !== "" ? author : getRandomNickname();

    const newComment = {
        id: comments.length + 1,
        postId,
        content: content.trim(),
        author: nickname,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    comments.push(newComment);
    return NextResponse.json(newComment);
}
