import "regenerator-runtime/runtime";
import "../css/style.css";
import "normalize.css";
import playList from "./playList";

const time = document.querySelector(".time");
const greeting = document.querySelector(".greeting");
const name = document.querySelector(".name");
const currentShortDate = document.querySelector(".current-date");
const quote = document.querySelector(".quote");
const author = document.querySelector(".author");
const changeQuote = document.querySelector(".change-quote");
const city = document.querySelector(".city");
const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const weatherDescription = document.querySelector(".weather-description");
const wind = document.querySelector(".wind");
const humidity = document.querySelector(".humidity");
const slideNext = document.querySelector(".slide-next");
const slidePrev = document.querySelector(".slide-prev");
const play = document.querySelector(".play");
const playPrev = document.querySelector(".play-prev");
const playNext = document.querySelector(".play-next");
const playListContainer = document.querySelector(".play-list");

const base =
  "https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/";
const images = [
  "01.jpg",
  "02.jpg",
  "03.jpg",
  "05.jpg",
  "06.jpg",
  "07.jpg",
  "08.jpg",
  "09.jpg",
  "10.jpg",
  "11.jpg",
  "12.jpg",
  "13.jpg",
  "14.jpg",
  "15.jpg",
  "16.jpg",
  "17.jpg",
  "18.jpg",
  "19.jpg",
  "20.jpg",
];
const audio = new Audio();
let randomNum,
  isPlay = false,
  i = 0,
  playNum = 0;

function showTime() {
  let today = new Date(),
    hour = today.getHours(),
    min = today.getMinutes(),
    sec = today.getSeconds();

  time.innerHTML = `${hour}:${addZero(min)}:${addZero(sec)}`;

  showDate();
  showGreeting();

  setTimeout(showTime, 1000);
}

function getTimeOfDay() {
  let date = new Date(),
    hour = date.getHours();

  if (hour >= 6 && hour < 12) {
    return "morning";
  } else if (hour >= 12 && hour < 18) {
    return "day";
  } else if (hour >= 18 && hour < 24) {
    return "evening";
  } else if (hour >= 0 && hour < 6) {
    return "night";
  }
}

function showGreeting() {
  const timeOfDay = getTimeOfDay();
  greeting.textContent = `Good ${timeOfDay}, `;
}

function showDate() {
  const date = new Date();
  currentShortDate.textContent = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function addZero(n) {
  return (parseInt(n, 10) < 10 ? "0" : "") + n;
}

function getLocalStorage() {
  if (localStorage.getItem("name")) {
    name.value = localStorage.getItem("name");
    if (localStorage.getItem("city")) {
      city.value = localStorage.getItem("city");
    }
  } else {
    name.placeholder = "[Enter name]";
  }
}

function setLocalStorage() {
  localStorage.setItem("name", name.value);
  localStorage.setItem("city", city.value);
}

async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=a52f4980a7ba658d2a606c2e70a5d0b7&units=metric`;
  const res = await fetch(url);
  const data = await res.json();
  weatherIcon.className = "weather-icon owf";
  weatherIcon.classList.add(`owf-${data.weather[0].id}`);
  temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
  weatherDescription.textContent = `${data.weather[0].description}`;
  wind.textContent = `Wind speed: ${data.wind.speed.toFixed(0)} m/s`;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
}

function setCity(event) {
  if (event.code === "Enter") {
    getWeather().then((value) => value);
    city.blur();
  }
}

async function getQuote() {
  const url = `https://favqs.com/api/qotd`;
  const res = await fetch(url);
  const data = await res.json();
  quote.textContent = data.quote.body;
  author.textContent = data.quote.author;
}

randomNum = function getRandomNum() {
  return Math.floor(1 - 0.5 + Math.random() * 20);
};

function getSlideNext() {
  if (randomNum < 20) {
    randomNum++;
  } else {
    randomNum = 1;
  }
  showBackground();
}

function getSlidePrev() {
  if (randomNum > 1) {
    randomNum--;
  } else {
    randomNum = 20;
  }
  showBackground();
}

function showBackground() {
  const img = new Image();
  const timeOfDay = getTimeOfDay();
  const index = i % images.length;
  i++;
  img.src = base + timeOfDay + "/" + images[index];
  img.onload = () => {
    document.body.style.backgroundImage = `url(${img.src})`;
  };
}

function playSong() {
  isPlay = true;
  audio.src = playList[playNum].src;
  audio.currentTime = 0;
  document.querySelectorAll(".play-list .item-active").forEach((e) => {
    e.classList.remove("item-active");
  });
  playListContainer.childNodes[playNum].classList.add("item-active");
  audio.play();
  play.classList.replace("play", "pause");
}

function pauseSong() {
  isPlay = false;
  play.classList.replace("pause", "play");
  audio.pause();
}

function loadSong() {
  for (let i = 0; i < playList.length; i++) {
    const li = document.createElement("li");
    li.classList.add("play-item");
    li.textContent = playList[i].title;
    playListContainer.append(li);
  }
}

function prevSong() {
  pauseSong();
  if (playNum > 0) {
    playNum--;
  } else {
    playNum = playList.length - 1;
  }
  play.classList.replace("play", "pause");
  playSong();
}

function nextSong() {
  pauseSong();
  if (playNum < playList.length - 1) {
    playNum++;
  } else {
    playNum = 0;
  }
  play.classList.replace("play", "pause");
  playSong();
}

play.addEventListener("click", () => (isPlay ? pauseSong() : playSong()));
playPrev.addEventListener("click", prevSong);
playNext.addEventListener("click", nextSong);
audio.addEventListener("ended", nextSong);
document.addEventListener("DOMContentLoaded", getQuote);
document.addEventListener("DOMContentLoaded", getWeather);

changeQuote.addEventListener("click", getQuote);
city.addEventListener("keypress", setCity);

slideNext.addEventListener("click", getSlideNext);
slidePrev.addEventListener("click", getSlidePrev);

window.addEventListener("beforeunload", setLocalStorage);
window.addEventListener("load", getLocalStorage);

showTime();
getLocalStorage();
getWeather().then((value) => value);
showBackground();
loadSong(playList[playNum]);