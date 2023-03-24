import "regenerator-runtime/runtime";
import "../css/style.css";
import "normalize.css";
import playList from "./playList";
import * as log from './log'

log.logger()

const time = document.querySelector(".time");
const greeting = document.querySelector(".greeting");
const greetingContainer = document.querySelector(".greeting-container");
const name = document.querySelector(".name");
const currentShortDate = document.querySelector(".current-date");
const quote = document.querySelector(".quote");
const author = document.querySelector(".author");
const changeQuote = document.querySelector(".change-quote");
const city = document.querySelector(".city");
const weather = document.querySelector(".weather");
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
  "https://raw.githubusercontent.com/dima92/stage1-tasks/assets/images/";

const audio = new Audio();
let randomNum,
  isPlay = false,
  playNum = 0;
const min = 1
const max = 20

let audioDuration;
let audioLengthMinutes;
let audioLengthSeconds;
let audioFullLength;
let currentTime;
let timer;
let arr, out

city.value = 'Minsk'

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
  if (language === "en") {
    arr = ['Good night', 'Good morning', 'Good afternoon', 'Good evening']
  } else if (language === 'ru') {
    arr = ["Доброй ночи", "Доброе утро", "Добрый день", "Добрый вечер"]
  }
  out = arr[Math.floor(hour / 6)]

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
  const timeOfDay = getTimeOfDay()
  greeting.textContent = `${out}, `
}

function showDate() {
  const date = new Date();
  let options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  }
  if (language === 'en') {
    currentShortDate.textContent = date.toLocaleDateString("en-US", options);
  } else if (language === 'ru') {
    currentShortDate.textContent = date.toLocaleDateString("ru-Ru", options);
  }
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
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${language}&appid=a52f4980a7ba658d2a606c2e70a5d0b7&units=metric`;
  const res = await fetch(url);
  if (res.status === 200) {
    const data = await res.json();
    weatherIcon.className = "weather-icon owf";
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
    weatherDescription.textContent = `${data.weather[0].description}`;
    if (language === 'en') {
      wind.textContent = `Wind speed: ${data.wind.speed.toFixed(0)} m/s`;
      humidity.textContent = `Humidity: ${data.main.humidity}%`;
    } else if (language === 'ru') {
      wind.textContent = `Скорость ветра: ${data.wind.speed.toFixed(0)} м/с`;
      humidity.textContent = `Влажность: ${data.main.humidity}%`;
    }
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
  if (language === 'en') {
    const url = `data.json`;
    const res = await fetch(url);
    const data = await res.json();
    const index = Math.floor(Math.random() * data.length);
    quote.textContent = data[index].text;
    author.textContent = data[index].author || 'none';
  } else if (language === 'ru') {
    const url = `data-ru.json`;
    const res = await fetch(url);
    const data = await res.json();
    const index = Math.floor(Math.random() * data.length);
    quote.textContent = data[index].text;
    author.textContent = data[index].author || 'Неизвестен';
  }
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

const changePhotosource = document.querySelector('.change-photosource')

async function showBackground() {
  const img = new Image();
  const timeOfDay = getTimeOfDay()
  if (changePhotosource.value === 'github') {
    randomNum = randomNum < 10 ? `0${randomNum}` : randomNum
    img.src = `${base}/${timeOfDay}/${randomNum}.webp`;
  } else if (changePhotosource.value === 'unsplash') {
    img.src = await getUnsplashLinkToImage();
  } else if (changePhotosource.value === 'flickr') {
    img.src = await getFlickrLinkToImage();
  }
  img.onload = () => {
    document.body.style.backgroundImage = `url(${img.src})`;
  };
}

async function getUnsplashLinkToImage() {
  const url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${tags}&client_id=AD08lDhQkm6aY8BMuN6kT9VxRIWDbBcy3vWRzi0CNmk`;
  const res = await fetch(url);
  const data = await res.json();
  console.log(data.urls.full)
  return data.urls.full
}

const chooseBg = document.querySelector('.choose-background')

let tags;

chooseBg.addEventListener('change', changeTag)

function changeTag() {
  tags = chooseBg.value
  showBackground()
}

async function getFlickrLinkToImage() {
  tags = chooseBg.value || 'nature'
  const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=6d2953dd8e3a7d856998a3b6fe3cdf59&tags=${tags}&extras=url_l&format=json&nojsoncallback=1`;
  const res = await fetch(url);
  const data = await res.json();
  let min = 1
  let max = 50
  let randomNumber = getRandomNum(min, max)
  console.log(data.photos.photo[randomNumber].url_l)
  return data.photos.photo[randomNumber].url_l
}

getFlickrLinkToImage()

let language;
const changeLanguage = document.querySelector('.change-language');

language = 'en';

changeLanguage.addEventListener('change', translation)

const textChooseLanguage = document.querySelector('.text-choose-language');
const textChoosePhotosource = document.querySelector('.text-choose-photosource');
const textShow = document.querySelector('.text-show');
const textTime = document.querySelector('.text-time');
const textDate = document.querySelector('.text-date');
const textGreeting = document.querySelector('.text-greeting');
const textQuotes = document.querySelector('.text-quotes');
const textWeather = document.querySelector('.text-weather');
const textAudioplayer = document.querySelector('.text-audioplayer');
const textTodo = document.querySelector('.text-todo');
const textChooseBackground = document.querySelector('.text-choose-background');

function translation() {
  if (changeLanguage.value === 'en') {
    language = 'en'
  } else if (changeLanguage.value === 'ru') {
    language = 'ru'
  }
  if (language === 'en') {
    city.placeholder = "{Enter city}";
    name.placeholder = "{Enter your name}";
    textChooseLanguage.textContent = "Choose language";
    textChoosePhotosource.textContent = "Choose photo source";
    textShow.textContent = "SHOW";
    textDate.textContent = "date";
    textTime.textContent = "time";
    textGreeting.textContent = "greeting";
    textQuotes.textContent = "quotes";
    textWeather.textContent = "weather";
    textAudioplayer.textContent = "audioplayer";
    textTodo.textContent = "todo";
    todoButton.textContent = "Todo";
    textChooseBackground.textContent = "Enter background theme";
  } else if (language === 'ru') {
    name.placeholder = "{Введите ваше имя}";
    city.placeholder = "{Введите город}";
    textChooseLanguage.textContent = "Выберите язык";
    textChoosePhotosource.textContent = "Выберите источник фото";
    textShow.textContent = "ОТОБРАЖАТЬ";
    textDate.textContent = "дата";
    textTime.textContent = "время";
    textGreeting.textContent = "приветствие";
    textQuotes.textContent = "цитаты";
    textWeather.textContent = "погода";
    textAudioplayer.textContent = "аудиоплеер";
    textTodo.textContent = "список дел";
    todoButton.textContent = "Список дел";
    textChooseBackground.textContent = "Выберите тему фона";
  }
  getWeather();
  getTimeOfDay();
  getQuote();
}

const popupSettings = document.querySelector('.settings');
const buttonSettings = document.querySelector('.settings-button');

let isOpen = false;

function openCloseSettings() {
  if (isOpen === false) {
    isOpen = true;
    popupSettings.style.transform = "translateX(0)"
  } else if (isOpen === true) {
    isOpen = false;
    popupSettings.style.transform = "translateX(-150%)"
  }
}

buttonSettings.addEventListener('click', openCloseSettings);

const timeSettings = document.getElementById('time');
const dateSettings = document.getElementById('date');
const greetingSettings = document.getElementById('greeting');
const quotesSettings = document.getElementById('quotes');
const weatherSettings = document.getElementById('weather');
const audioplayerSettings = document.getElementById('audioplayer');
const todoSettings = document.getElementById('todo');
const player = document.querySelector('.player')
const todoButton = document.querySelector('.button-todo');
const todo = document.querySelector('.todo');

timeSettings.addEventListener('change', showOptions);
dateSettings.addEventListener('change', showOptions);
greetingSettings.addEventListener('change', showOptions);
quotesSettings.addEventListener('change', showOptions);
weatherSettings.addEventListener('change', showOptions);
audioplayerSettings.addEventListener('change', showOptions);
todoSettings.addEventListener('change', showOptions);
changePhotosource.addEventListener('change', showOptions);

function showOptions() {
  if (timeSettings.checked === false) {
    time.style.opacity = 0;
  } else {
    time.style.opacity = 1;
  }
  if (dateSettings.checked === false) {
    currentShortDate.style.opacity = 0;
  } else {
    currentShortDate.style.opacity = 1;
  }
  if (greetingSettings.checked === false) {
    greetingContainer.style.opacity = 0;
  } else {
    greetingContainer.style.opacity = 1;
  }
  if (quotesSettings.checked === false) {
    changeQuote.style.opacity = 0;
    quote.style.opacity = 0;
    author.style.opacity = 0;
  } else {
    changeQuote.style.opacity = 1;
    quote.style.opacity = 1;
    author.style.opacity = 1;
  }
  if (weatherSettings.checked === false) {
    weather.style.opacity = 0;
  } else {
    weather.style.opacity = 1;
  }
  if (audioplayerSettings.checked === false) {
    player.style.opacity = 0;
  } else {
    player.style.opacity = 1;
  }
  if (todoSettings.checked === false) {
    todo.style.opacity = 0;
    todoButton.style.opacity = 0;
  } else {
    todo.style.opacity = 1;
    todoButton.style.opacity = 1;
  }
  if (changePhotosource.value === 'unsplash' || changePhotosource.value === 'flickr') {
    textChooseBackground.style.opacity = 1;
    chooseBg.style.opacity = 1;
  } else {
    textChooseBackground.style.opacity = 0;
    chooseBg.style.opacity = 0;
  }
}

showOptions();

audio.src = playList[playNum].src;

playList.forEach((item, i) => {
  const li = document.createElement('li');
  li.classList.add('play-item');
  li.dataset.number = i;
  li.textContent = item.title;
  playListContainer.append(li);
})

let playListLi = document.querySelectorAll('.play-item');

function playAudio() {
  const method = audio.paused ? 'play' : 'pause';
  audio[method]();
  togglePlayButton();

  activePlayListItem(playNum);
  if (audio.paused === true) {
    removeActivePlayListItem(playNum);
  }
  audio.onended = function () {
    nextSong();
  };
}

playListContainer.addEventListener('click', selectAudio)

function selectAudio(event) {
  let target = event.target;
  if (playNum === target.dataset.number && isPlay === true) {
    togglePlayButton()
    audio.pause();
    isPlay = false;
    removeActivePlayListItem(playNum);
  } else if (playNum === target.dataset.number && isPlay === false) {
    togglePlayButton()
    audio.play();
    isPlay = true;
    activePlayListItem(playNum);
  } else {
    togglePlayButton()
    playNum = target.dataset.number;
    playNum = Number(playNum);
    playCurrentAudio()
  }
}

function playCurrentAudio() {
  audio.src = playList[playNum].src;
  isPlay = false;
  playAudio();
}

function togglePlayButton() {
  if (isPlay === false) {
    play.classList.remove('play');
    play.classList.add('pause');
    isPlay = true;
  } else {
    play.classList.remove('pause');
    play.classList.add('play');
    isPlay = false;
  }
}

function prevSong() {
  if (playNum > 0) {
    playNum--;
  } else {
    playNum = playList.length - 1;
  }
  playCurrentAudio();
}

function nextSong() {
  if (playNum < playList.length - 1) {
    playNum++;
  } else {
    playNum = 0;
  }
  playCurrentAudio()
}

function activePlayListItem(playNum) {
  playListLi.forEach((item, index) => {
    if (index === playNum) item.classList.add('item-active');
    else item.classList.remove('item-active');
  })
}

function removeActivePlayListItem(playNum) {
  playListLi.forEach((item, index) => {
    item.classList.remove('item-active');
  })
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

todoButton.addEventListener('click', openCloseTodo);

let todoOpen = false;

function openCloseTodo() {
  if (todoOpen === false) {
    todoOpen = true;
    todo.style.transform = "translateX(0)"
  } else if (todoOpen === true) {
    todoOpen = false;
    todo.style.transform = "translateX(120%)"
  }
}

const todoFunction = {
  action(e) {
    const target = e.target;
    if (target.classList.contains('todo__action')) {
      const action = target.dataset.todoAction;
      const elemItem = target.closest('.todo__item');
      if (action === 'deleted' && elemItem.dataset.todoState === 'deleted') {
        elemItem.remove();
      } else {
        elemItem.dataset.todoState = action;
      }
      this.save();
    } else if (target.classList.contains('todo__add')) {
      this.add();
      this.save();
    }
  },
  add() {
    const elemText = document.querySelector('.todo__text');
    if (elemText.disabled || !elemText.value.length) {
      return;
    }
    document.querySelector('.todo__items').insertAdjacentHTML('beforeend', this.create(elemText.value));
    elemText.value = '';
  },
  create(text) {
    return `<li class="todo__item" data-todo-state="active">
  <span class="todo__task">${text}</span>
  <span class="todo__action todo__action_restore" data-todo-action="active"></span>
  <span class="todo__action todo__action_complete" data-todo-action="completed"></span>
  <span class="todo__action todo__action_delete" data-todo-action="deleted"></span></li>`;
  },
  init() {
    const fromStorage = localStorage.getItem('todo');
    if (fromStorage) {
      document.querySelector('.todo__items').innerHTML = fromStorage;
    }
    document.querySelector('.todo__options').addEventListener('change', this.update);
    document.addEventListener('click', this.action.bind(this));
  },
  update() {
    const option = document.querySelector('.todo__options').value;
    document.querySelector('.todo__items').dataset.todoOption = option;
    document.querySelector('.todo__text').disabled = option !== 'active';
  },
  save() {
    localStorage.setItem('todo', document.querySelector('.todo__items').innerHTML);
  }
};

play.addEventListener("click", playAudio);
playPrev.addEventListener("click", prevSong);
playNext.addEventListener("click", nextSong);
audio.addEventListener("ended", nextSong);
playListContainer.addEventListener('click', selectAudio);
document.addEventListener("DOMContentLoaded", getQuote);
document.addEventListener("DOMContentLoaded", getWeather);

let deg = 0
changeQuote.addEventListener("click", () => {
  getQuote();
  deg += 180;
  changeQuote.style.transform = `rotate(${deg}deg) scale(1.2)`;
  changeQuote.style.transition = '0.5s ease-in-out';
});
changeQuote.addEventListener('mouseout', () => {
  changeQuote.style.transform = `rotate(${deg}deg) scale(1)`;
});
city.addEventListener("keypress", setCity);

slideNext.addEventListener("click", getSlideNext);
slidePrev.addEventListener("click", getSlidePrev);

window.addEventListener("beforeunload", setLocalStorage);
window.addEventListener("load", getLocalStorage);

showTime();
getLocalStorage();
getWeather();
showBackground();
todoFunction.init();
