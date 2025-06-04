//상위 post.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function HomePage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    async function fetchPosts() {
        try {
            const res = await fetch("/api/posts", {
                cache: "no-store",
            });
            const data = await res.json();
            setPosts(data);
            setLoading(false);
        } catch (error) {
            console.error("글 목록을 불러오는데 실패했습니다:", error);
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "2rem" }}>
                글 목록을 불러오는 중...
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
            <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
                📝 글 목록
            </h1>

            {posts.length === 0 ? (
                <div
                    style={{
                        textAlign: "center",
                        padding: "2rem",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px",
                    }}
                >
                    <p style={{ color: "#6c757d", fontSize: "1.1rem" }}>
                        아직 작성된 글이 없습니다.
                    </p>
                    <p style={{ color: "#6c757d" }}>
                        첫 번째 글을 작성해보세요!
                    </p>
                </div>
            ) : (
                <ul style={{ listStyle: "none", padding: "0" }}>
                    {posts.map((post) => (
                        <li
                            key={post.id}
                            style={{
                                marginBottom: "1rem",
                                padding: "1.5rem",
                                backgroundColor: "#f8f9fa",
                                borderRadius: "8px",
                                border: "1px solid #dee2e6",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <Link
                                        href={`/post/${post.id}`}
                                        style={{
                                            textDecoration: "none",
                                            color: "#007bff",
                                            fontSize: "1.2rem",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {post.title}
                                    </Link>
                                    <div
                                        style={{
                                            marginTop: "0.5rem",
                                            color: "#6c757d",
                                            fontSize: "0.9rem",
                                        }}
                                    >
                                        <strong>작성자:</strong> {post.author} |
                                        <strong style={{ marginLeft: "1rem" }}>
                                            작성일:
                                        </strong>{" "}
                                        {new Date(
                                            post.createdAt
                                        ).toLocaleDateString("ko-KR")}
                                    </div>
                                    {post.weather && (
                                        <div
                                            style={{
                                                marginTop: "0.5rem",
                                                color: "#6c757d",
                                                fontSize: "0.8rem",
                                            }}
                                        >
                                            🌤️ {post.weather.description}{" "}
                                            {post.weather.temp ||
                                                post.weather.temperature}
                                            °C
                                        </div>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <Link href="/post/write">
                    <button
                        style={{
                            padding: "1rem 2rem",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "1.1rem",
                            cursor: "pointer",
                            textDecoration: "none",
                        }}
                    >
                        ✏️ 글 작성하기
                    </button>
                </Link>
            </div>
        </div>
    );
}
