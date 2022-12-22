import { API_KEY } from "./config.js";
import { calculateTemp } from "./average-calculator.js";
import { drawChart } from "./chart.js";

const cityInput = document.querySelector(".city");
const submitButton = document.querySelector(".submit-button");
const sectionWeather = document.querySelector(".weather-section");

// Background
const urlDay = "url(../assets/image/day.webp)";
const urlNight = "url(../assets/image/night.webp)";
const hours = new Date().getHours()
const isDayTime = hours > 8 && hours < 20;
if (isDayTime === true) {
    document.body.style.backgroundImage = urlDay;
} else {
    document.body.style.backgroundImage = urlNight;
}

// Local Storage
//localStorage.clear()
let savedCity = JSON.parse(localStorage.getItem("user-city"));
if (savedCity !== null) {
    cityInput.value = savedCity[0];
}

submitButton.addEventListener("click", () => {
    let cityList = [];
    let inputSplitList = cityInput.value.split(",");

    for (let i = 0; i < inputSplitList.length; i++) {
        cityList.push(inputSplitList[i].replaceAll(" ", ""));
    }

    // Save user last research
    localStorage.setItem("user-city", JSON.stringify(cityList));

    // Fetch data
    getWeatherForecastByCity(cityList);
});

async function getWeatherForecastByCity(cityList) {
    // Clean up
    sectionWeather.innerHTML = null;

    const result = Array.isArray(cityList);
    if (result) {
        for (let i = 0; i < cityList.length; i++) {
            let city = cityList[i];
            let coordinates = await getCoordinates(city);
            let lat = coordinates[0];
            let lon = coordinates[1];
            let weatherForecast5Days = await getWeather(lat, lon);

            displayWeather(city, weatherForecast5Days);
        }
    } else {
        let coordinates = await getCoordinates(cityList);
        let lat = coordinates[0];
        let lon = coordinates[1];
        let weatherForecast5Days = await getWeather(lat, lon);

        displayWeather(cityList, weatherForecast5Days);
    }
}

/**
 * This function fetch coordinates for a given city
 * @param {String} city 
 * @returns Array with latitude (lat) and longitude (lon) for a given city.
 */
async function getCoordinates(city) {
    const GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
    try {
        const request = await fetch(GEOCODING_URL);
        const response = await request.json();
        let lat = response[0].lat;
        let lon = response[0].lon;

        return [lat, lon];

    } catch (error) {
        window.alert(error);
    }
}

/**
 * This function get the weather for given latitude (lat) and longitude (lon)
 * @param {Number} lat 
 * @param {Number} lon 
 * @returns Json object that contains weather for a given latitude and longitude 
 */
async function getWeather(lat, lon) {
    const DAILY_FORECAST5 = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    try {
        const request = await fetch(DAILY_FORECAST5);
        const response = await request.json();

        return response;

    } catch (error) {
        window.alert(error);
    }
}

function displayWeather(city, dayList) {
    const dataList = calculateTemp(dayList);
    const innerSection = document.createElement("section");
    innerSection.className = "inner-section";

    const div = document.createElement("div");
    div.className = "div-day";

    // Display City
    const cityDisplay = document.createElement("h3");
    cityDisplay.innerText = city.toUpperCase();
    div.appendChild(cityDisplay);

    for (let i = 0; i < dataList.length; i++) {
        let weatherObject = dataList[i];
        // Create Article
        const article = document.createElement("article");

        // Display Image
        const img = document.createElement("img");
        let imageSource = weatherObject[1].icon;
        let imageUrl = `https://openweathermap.org/img/wn/${imageSource}@2x.png`;
        img.setAttribute("src", imageUrl)
        article.appendChild(img);

        // Display Temperature
        const tempDisplay = document.createElement("h2");
        let temp = weatherObject[1].average.toFixed(1);
        tempDisplay.innerText = temp + "°C";
        article.appendChild(tempDisplay);

        // Display Date
        const dayDisplay = document.createElement("h4");
        dayDisplay.innerText = weatherObject[0];
        article.appendChild(dayDisplay);

        innerSection.appendChild(article);
        div.appendChild(innerSection);
    }

    sectionWeather.appendChild(div);
    drawChart(dataList);
}