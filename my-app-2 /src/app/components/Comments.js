"use client";
import { useState, useEffect } from "react";

export default function Comments({ postId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [author, setAuthor] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [loading, setLoading] = useState(true);

    // 댓글 목록 불러오기
    useEffect(() => {
        fetchComments();
    }, [postId]);

    async function fetchComments() {
        try {
            const res = await fetch(`/api/posts/${postId}/comments`);
            const data = await res.json();
            setComments(data);
            setLoading(false);
        } catch (error) {
            console.error("댓글을 불러오는데 실패했습니다:", error);
            setLoading(false);
        }
    }

    // 댓글 작성
    async function handleSubmitComment(e) {
        e.preventDefault();

        if (!newComment.trim()) {
            alert("댓글 내용을 입력해주세요.");
            return;
        }

        try {
            const res = await fetch(`/api/posts/${postId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: newComment,
                    author: author,
                }),
            });

            if (res.ok) {
                const comment = await res.json();
                setComments((prev) => [...prev, comment]);
                setNewComment("");
                setAuthor("");
            } else {
                const error = await res.json();
                alert(error.error || "댓글 작성에 실패했습니다.");
            }
        } catch (error) {
            console.error("댓글 작성 중 오류:", error);
            alert("댓글 작성에 실패했습니다.");
        }
    }

    // 댓글 수정 시작
    function startEdit(comment) {
        setEditingId(comment.id);
        setEditContent(comment.content);
    }

    // 댓글 수정 취소
    function cancelEdit() {
        setEditingId(null);
        setEditContent("");
    }

    // 댓글 수정 완료
    async function handleEditComment(commentId) {
        if (!editContent.trim()) {
            alert("댓글 내용을 입력해주세요.");
            return;
        }

        try {
            const res = await fetch(`/api/comments/${commentId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: editContent }),
            });

            if (res.ok) {
                const updatedComment = await res.json();
                setComments((prev) =>
                    prev.map((comment) =>
                        comment.id === commentId ? updatedComment : comment
                    )
                );
                setEditingId(null);
                setEditContent("");
            } else {
                const error = await res.json();
                alert(error.error || "댓글 수정에 실패했습니다.");
            }
        } catch (error) {
            console.error("댓글 수정 중 오류:", error);
            alert("댓글 수정에 실패했습니다.");
        }
    }

    // 댓글 삭제
    async function handleDeleteComment(commentId) {
        if (!confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
            return;
        }

        try {
            const res = await fetch(`/api/comments/${commentId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setComments((prev) =>
                    prev.filter((comment) => comment.id !== commentId)
                );
            } else {
                const error = await res.json();
                alert(error.error || "댓글 삭제에 실패했습니다.");
            }
        } catch (error) {
            console.error("댓글 삭제 중 오류:", error);
            alert("댓글 삭제에 실패했습니다.");
        }
    }

    // 날짜 포맷팅
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    if (loading) return <div>댓글을 불러오는 중...</div>;

    return (
        <div
            style={{
                marginTop: "2rem",
                padding: "1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
            }}
        >
            <h3>댓글 ({comments.length})</h3>

            {/* 댓글 작성 폼 */}
            <form
                onSubmit={handleSubmitComment}
                style={{ marginBottom: "1.5rem" }}
            >
                <div style={{ marginBottom: "0.5rem" }}>
                    <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="닉네임 (비우면 랜덤 닉네임)"
                        style={{
                            width: "100%",
                            padding: "0.5rem",
                            marginBottom: "0.5rem",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                        }}
                    />
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="댓글을 입력하세요..."
                        rows="3"
                        style={{
                            flex: 1,
                            padding: "0.5rem",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            resize: "vertical",
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            height: "fit-content",
                        }}
                    >
                        등록
                    </button>
                </div>
            </form>

            {/* 댓글 목록 */}
            <div>
                {comments.length === 0 ? (
                    <p style={{ color: "#666", fontStyle: "italic" }}>
                        아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
                    </p>
                ) : (
                    comments.map((comment) => (
                        <div
                            key={comment.id}
                            style={{
                                marginBottom: "1rem",
                                padding: "1rem",
                                backgroundColor: "#f8f9fa",
                                borderRadius: "6px",
                                border: "1px solid #e9ecef",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    marginBottom: "0.5rem",
                                }}
                            >
                                <div>
                                    <strong style={{ color: "#495057" }}>
                                        {comment.author}
                                    </strong>
                                    <span
                                        style={{
                                            color: "#6c757d",
                                            fontSize: "0.875rem",
                                            marginLeft: "0.5rem",
                                        }}
                                    >
                                        {formatDate(comment.createdAt)}
                                        {comment.updatedAt !==
                                            comment.createdAt && (
                                            <span
                                                style={{ fontStyle: "italic" }}
                                            >
                                                {" "}
                                                (수정됨)
                                            </span>
                                        )}
                                    </span>
                                </div>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <button
                                        onClick={() => startEdit(comment)}
                                        style={{
                                            padding: "0.25rem 0.5rem",
                                            fontSize: "0.75rem",
                                            backgroundColor: "#28a745",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "3px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        수정
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDeleteComment(comment.id)
                                        }
                                        style={{
                                            padding: "0.25rem 0.5rem",
                                            fontSize: "0.75rem",
                                            backgroundColor: "#dc3545",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "3px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>

                            {editingId === comment.id ? (
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "0.5rem",
                                        alignItems: "flex-end",
                                    }}
                                >
                                    <textarea
                                        value={editContent}
                                        onChange={(e) =>
                                            setEditContent(e.target.value)
                                        }
                                        rows="3"
                                        style={{
                                            flex: 1,
                                            padding: "0.5rem",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            resize: "vertical",
                                        }}
                                    />
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "0.25rem",
                                        }}
                                    >
                                        <button
                                            onClick={() =>
                                                handleEditComment(comment.id)
                                            }
                                            style={{
                                                padding: "0.25rem 0.5rem",
                                                fontSize: "0.75rem",
                                                backgroundColor: "#007bff",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "3px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            저장
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            style={{
                                                padding: "0.25rem 0.5rem",
                                                fontSize: "0.75rem",
                                                backgroundColor: "#6c757d",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "3px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            취소
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p
                                    style={{
                                        margin: "0",
                                        lineHeight: "1.5",
                                        whiteSpace: "pre-wrap",
                                    }}
                                >
                                    {comment.content}
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
