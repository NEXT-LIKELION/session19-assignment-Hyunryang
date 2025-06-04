//posts/route.js
import { NextResponse } from "next/server";

export let posts = [];

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

async function fetchWeather(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=kr`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("날씨 정보를 불러오지 못했습니다.");
    }
    const data = await response.json();
    // 주요 날씨 정보만 추출
    return {
        temp: data.main.temp,
        description: data.weather[0].description,
        locationName: data.name,
    };
}

export async function GET() {
    return NextResponse.json(posts);
}

export async function POST(req) {
    const { title, author, content, location } = await req.json();

    function getRandomNickname() {
        const adjectives = ["Happy", "Crazy", "Silent", "Cool", "Funny", "Smart", "Brave", "Kind", "Clever", "Wise"];
        const animals = ["Lion", "Tiger", "Bear", "Eagle", "Shark", "Wolf", "Fox", "Hawk", "Dolphin", "Falcon"];
        const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
        return `${randomAdj} ${randomAnimal}`;
    }

    const nickname = author ? author : getRandomNickname();

    let weather = null;
    if (location && location.lat && location.lon) {
        try {
            weather = await fetchWeather(location.lat, location.lon);
        } catch (error) {
            console.error(error);
        }
    }

    const newPost = {
        id: posts.length + 1,
        title,
        author: nickname,
        content,
        createdAt: new Date(),
        weather, // 날씨 정보 추가
        location, // 위치 정보도 저장
    };
    posts.push(newPost);
    return NextResponse.json(newPost);
}
