export default class Dict {
  constructor() {

    this.feel = {
      en: 'Feels like:',
      ru: 'Ощущается как:',
      be: 'Адчуваецца як:',
    };

    this.wind = {
      en: 'Wind:',
      ru: 'Ветер:',
      be: 'Вецер:',
    };

    this.windSpeedUnits = {
      en: 'm/s',
      ru: 'м/с',
      be: 'м/с',
    };

    this.humidity = {
      en: 'Humidity:',
      ru: 'Влажность:',
      be: 'Вiльготнасць:',
    };

    this.daysOfWeek = {
      en: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'monday', 'tuesday'],
      ru: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье', 'понедельник', 'вторник']
    };

    this.shortDaysOfWeek = {
      en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      ru: ['Вск', 'Пнд', 'Втр', 'Срд', 'Чтв', 'Птн', 'Сбт']
    };

    this.months = {
      en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
    };
  }
}