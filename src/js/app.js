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
const weatherError = document.querySelector(".weather-error");
const slideNext = document.querySelector(".slide-next");
const slidePrev = document.querySelector(".slide-prev");
const play = document.querySelector(".play");
const playPrev = document.querySelector(".play-prev");
const playNext = document.querySelector(".play-next");
const playListContainer = document.querySelector(".play-list");
const audioTitle = document.querySelector(".audio-title");
const volumeButton = document.querySelector('.volume-button');
const audioProgress = document.querySelector('#audio-progress');
const volumeProgress = document.querySelector('#volume-progress');
const audioProgressText = document.querySelector('.audio-progress-text');
const playSVG = 'url("assets/svg/play.svg")';
const volSVG = 'url("assets/svg/volume.svg")';
const muteSVG = 'url("assets/svg/mute.svg")';

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
  playNum = 0;
city.value = 'Minsk'
const min = 1
const max = 20
let audioDuration;
let audioLengthMinutes;
let audioLengthSeconds;
let audioFullLength;
let currentTime;
let timer;

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
    return "afternoon";
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
  const url = 'https://api.openweathermap.org/data/2.5/weather?q='
    + city.value + '&lang=en'
    + '&units=metric&appid=a52f4980a7ba658d2a606c2e70a5d0b7&units=metric';
  const res = await fetch(url);
  if (res.status === 200) {
    const data = await res.json();
    weatherIcon.className = "weather-icon owf";
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
    weatherDescription.textContent = `${data.weather[0].description}`;
    wind.textContent = `Wind speed: ${data.wind.speed.toFixed(0)} m/s`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    weatherError.textContent = '';
  } else if (res.status === 400) {
    temperature.textContent = '';
    weatherDescription.textContent = '';
    wind.textContent = '';
    humidity.textContent = '';
    weatherError.textContent = `Error! Please enter the city!`
  } else if (res.status === 404) {
    temperature.textContent = '';
    weatherDescription.textContent = '';
    wind.textContent = '';
    humidity.textContent = '';
    weatherError.textContent = `Error! ${city.value} not found!`
  }
}

function setCity(event) {
  if (event.code === "Enter") {
    getWeather();
    city.blur();
  }
}

async function getQuote() {
  const url = `data.json`;
  const res = await fetch(url);
  const data = await res.json();
  const index = Math.floor(Math.random() * data.length);
  quote.textContent = data[index].text;
  author.textContent = data[index].author;
}

function getRandomNum(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

randomNum = getRandomNum(min, max)

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
  img.src = base + timeOfDay + "/" + images[randomNum];
  img.onload = () => {
    document.body.style.backgroundImage = `url(${img.src})`;
  };
}

async function playSong() {
  isPlay = true;
  audio.src = playList[playNum].src;
  audio.currentTime = 0;
  document.querySelectorAll(".play-list .item-active").forEach((e) => {
    e.classList.remove("item-active");
  });
  playListContainer.childNodes[playNum].classList.add("item-active");
  await audio.play();
  play.classList.replace("play", "pause");
}

function pauseSong() {
  isPlay = false;
  playListContainer.childNodes[playNum].classList.remove("item-active");
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

audio.volume = 0.5;
volumeProgress.value = audio.volume;
volumeProgress.style.background = `linear-gradient(to right, #82CFD0 0%, #82CFD0 ${volumeProgress.value * 100}%, 
                                    #fff ${volumeProgress.value * 100}%, white 100%)`

audio.addEventListener('loadedmetadata', () => {
  audioDuration = audio.duration;
  audioLengthMinutes = Math.floor(audioDuration / 60) < 10 ? `0${Math.floor(audioDuration / 60)}` : Math.floor(audioDuration / 60);
  audioLengthSeconds = Math.floor(audioDuration % 60) < 10 ? `0${Math.floor(audioDuration % 60)}` : Math.floor(audioDuration % 60);
  audioFullLength = `${audioLengthMinutes}:${audioLengthSeconds}`
  audioProgress.setAttribute("max", audioDuration)
  audioProgressText.textContent = `00:00/${audioFullLength}`;
  audioTitle.textContent = playList[playNum].title;
})

audio.addEventListener('play', () => {
  timer = setInterval(updateCurrentTime, 1000);
})

audioProgress.addEventListener('change', () => {
  audio.currentTime = audioProgress.value;
  let progressPercent = audio.currentTime / audioDuration * 100;
  audioProgress.style.background = `linear-gradient(to right, #82CFD0 0%, #82CFD0 ${progressPercent}%, #fff ${progressPercent}%, white 100%)`
})

volumeButton.addEventListener('click', volumeControl)

volumeProgress.addEventListener('pointermove', () => {
  audio.volume = volumeProgress.value;
  updateVolume();
})

function updateVolume() {
  volumeProgress.value = audio.volume;
  volumeProgress.style.background = `linear-gradient(to right, #82CFD0 0%, #82CFD0 ${volumeProgress.value * 100}%, #fff ${volumeProgress.value * 100}%, white 100%)`
  if (audio.volume === 0) {
    volumeButton.style.backgroundImage = muteSVG;
  } else {
    volumeButton.style.backgroundImage = volSVG;
  }
}

function updateCurrentTime() {
  currentTime = audio.currentTime;
  audioProgress.value = currentTime;
  let progressPercent = audio.currentTime / audioDuration * 100;
  let currentMinutes = Math.floor(currentTime / 60) < 10 ? `0${Math.floor(currentTime / 60)}` : Math.floor(currentTime / 60);
  let currentSeconds = Math.floor(currentTime % 60) < 10 ? `0${Math.floor(currentTime % 60)}` : Math.floor(currentTime % 60);
  audioProgress.style.background = `linear-gradient(to right, #82CFD0 0%, #82CFD0 ${progressPercent}%, #fff ${progressPercent}%, white 100%)`
  audioProgressText.textContent = `${currentMinutes}:${currentSeconds}/${audioFullLength}`;
  if (audio.currentTime === audio.duration) {
    playButton.classList.toggle('playing');
    playButton.style.backgroundImage = playSVG;
    audioProgress.value = 0;
    audioProgressText.textContent = `00:00/${audioFullLength}`;
    audioProgress.style.background = `linear-gradient(to right, #82CFD0 0%, #82CFD0 0%, #fff 0%, white 100%)`
    clearInterval(timer)
  }
}

function volumeControl() {
  volumeButton.classList.toggle('active');
  if (volumeButton.classList.contains('active')) {
    volumeButton.style.backgroundImage = volSVG;
    audio.muted = false;
  } else {
    volumeButton.style.backgroundImage = muteSVG;
    audio.muted = true;
  }
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
getWeather();
showBackground();
loadSong(playList[playNum]);