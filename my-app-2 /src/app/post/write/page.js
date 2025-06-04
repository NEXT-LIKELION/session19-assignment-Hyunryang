//post/write/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ACCUWEATHER_API_KEY = "osten51XApzdWp30FhZUYlUukZrKYuJA";

export default function WritePage() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");
    const [location, setLocation] = useState(null);
    const [weather, setWeather] = useState(null);
    const router = useRouter();

    // AccuWeather 위치 키 가져오기
    async function fetchLocationKey(lat, lon) {
        const url = `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${ACCUWEATHER_API_KEY}&q=${lat},${lon}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("위치 키를 가져오는데 실패했습니다.");
        const data = await res.json();
        return data.Key; // 위치 키
    }

    // AccuWeather 현재 날씨 가져오기
    async function fetchCurrentWeather(locationKey) {
        const url = `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${ACCUWEATHER_API_KEY}&language=ko-kr&details=true`;
        const res = await fetch(url);
        if (!res.ok)
            throw new Error("현재 날씨 정보를 가져오는데 실패했습니다.");
        const data = await res.json();
        return data[0]; // 첫번째 객체가 현재 날씨
    }

    // 위치 및 날씨 가져오기 버튼 클릭 시
    async function getLocationAndWeather() {
        if (!navigator.geolocation) {
            alert("이 브라우저는 위치 정보를 지원하지 않습니다.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                setLocation({ lat, lon });

                try {
                    const locationKey = await fetchLocationKey(lat, lon);
                    const weatherData = await fetchCurrentWeather(locationKey);

                    setWeather({
                        temperature: weatherData.Temperature.Metric.Value,
                        description: weatherData.WeatherText,
                        locationName: weatherData.LocalObservationDateTime,
                        weatherIcon: weatherData.WeatherIcon,
                    });
                } catch (error) {
                    alert(error.message);
                }
            },
            () => {
                alert("위치 정보를 사용할 수 없습니다.");
            }
        );
    }

    async function handleSubmit() {
        if (!location || !weather) {
            alert("위치 및 날씨 정보를 먼저 가져와 주세요.");
            return;
        }

        const res = await fetch("/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, author, content, location, weather }),
        });

        await res.json();
        router.push("/");
    }

    return (
        <div>
            <h1>글 작성</h1>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
            />
            <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="작성자 (비우면 랜덤 닉네임)"
            />
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="글 내용을 입력하세요"
            />
            <button onClick={getLocationAndWeather}>
                위치 및 날씨 가져오기
            </button>

            {location && (
                <p>
                    위치: 위도 {location.lat.toFixed(4)}, 경도{" "}
                    {location.lon.toFixed(4)}
                </p>
            )}

            {weather && (
                <p>
                    날씨: {weather.description} / 온도: {weather.temperature}°C
                    / 관측 시간: {weather.locationName}
                    <br />
                    <img
                        src={`https://developer.accuweather.com/sites/default/files/${String(
                            weather.weatherIcon
                        ).padStart(2, "0")}-s.png`}
                        alt="weather icon"
                    />
                </p>
            )}

            <button onClick={handleSubmit}>작성하기</button>
        </div>
    );
}
