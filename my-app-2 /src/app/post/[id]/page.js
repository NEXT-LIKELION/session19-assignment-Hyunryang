import Link from "next/link";
import Comments from "../../components/Comments";

export default async function PostPage({ params }) {
    // 올바른 방법: params를 직접 await
    const { id } = await params;

    const res = await fetch(`http://localhost:3000/api/posts/${id}`, {
        cache: "no-store",
    });
    const post = await res.json();

    if (!post || post.error) {
        return (
            <div style={{ padding: "2rem", textAlign: "center" }}>
                <h2>글을 찾을 수 없습니다.</h2>
                <Link
                    href="/"
                    style={{ color: "#007bff", textDecoration: "underline" }}
                >
                    홈으로 돌아가기
                </Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
            {/* 게시글 헤더 */}
            <div
                style={{
                    marginBottom: "2rem",
                    paddingBottom: "1rem",
                    borderBottom: "2px solid #e9ecef",
                }}
            >
                <h1
                    style={{
                        fontSize: "2rem",
                        marginBottom: "1rem",
                        color: "#212529",
                    }}
                >
                    {post.title}
                </h1>
                <div style={{ color: "#6c757d", fontSize: "0.9rem" }}>
                    <strong>작성자:</strong> {post.author} |
                    <strong style={{ marginLeft: "1rem" }}>작성일:</strong>{" "}
                    {new Date(post.createdAt).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </div>
            </div>

            {/* 게시글 내용 */}
            <div
                style={{
                    marginBottom: "2rem",
                    lineHeight: "1.6",
                    fontSize: "1.1rem",
                }}
            >
                <p style={{ whiteSpace: "pre-wrap", margin: "0" }}>
                    {post.content}
                </p>
            </div>

            {/* 위치 및 날씨 정보 */}
            {(post.location || post.weather) && (
                <div
                    style={{
                        marginBottom: "2rem",
                        padding: "1rem",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px",
                        border: "1px solid #dee2e6",
                    }}
                >
                    <h4 style={{ marginBottom: "0.5rem", color: "#495057" }}>
                        📍 위치 및 날씨 정보
                    </h4>

                    {post.location &&
                        post.location.lat &&
                        post.location.lon && (
                            <p style={{ margin: "0.5rem 0" }}>
                                <strong>위치:</strong> 위도{" "}
                                {post.location.lat.toFixed(4)}, 경도{" "}
                                {post.location.lon.toFixed(4)}
                            </p>
                        )}

                    {post.weather && (
                        <p style={{ margin: "0.5rem 0" }}>
                            <strong>날씨:</strong> {post.weather.description} |
                            <strong> 온도:</strong>{" "}
                            {post.weather.temp || post.weather.temperature}°C
                            {post.weather.locationName && (
                                <span>
                                    {" "}
                                    | <strong>장소:</strong>{" "}
                                    {post.weather.locationName}
                                </span>
                            )}
                        </p>
                    )}
                </div>
            )}

            {/* 댓글 섹션 */}
            <Comments postId={id} />

            {/* 네비게이션 */}
            <div style={{ marginTop: "2rem", textAlign: "center" }}>
                <Link
                    href="/"
                    style={{
                        display: "inline-block",
                        padding: "0.75rem 1.5rem",
                        backgroundColor: "#007bff",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "6px",
                        fontSize: "1rem",
                        transition: "background-color 0.2s",
                    }}
                >
                    📝 글 목록으로 돌아가기
                </Link>
            </div>
        </div>
    );
}