import { API_KEY, FULL_RESPONSE } from "./config.js";

const cityInput = document.querySelector(".city");
const submitButton = document.querySelector(".submit-button");
const sectionWeather = document.querySelector(".weather-section");
const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


// Background
const urlDay = "url(../assets/image/day.webp)";
const urlNight = "url(../assets/image/night.webp)";
const hours = new Date().getHours()
const isDayTime = hours > 8 && hours < 20;
if(isDayTime === true){
    document.body.style.backgroundImage = urlDay;
} else {
    document.body.style.backgroundImage = urlNight;
}

// Chart
const canvas = document.querySelector(".chart-canvas")
const context = canvas.getContext("2d");
let heightRatio = 0.25;
canvas.height = window.innerWidth * heightRatio;


// Local Storage
//localStorage.clear();
let savedCity = JSON.parse(localStorage.getItem("user-city"));
if (savedCity[0] !== null) {
    cityInput.value = savedCity[0];
    //getWeatherForecastByCity(savedCity[0]);
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


function displayWeather(city, weatherForecast5Days) {

    const innerSection = document.createElement("section");
    innerSection.className = "inner-section";

    // Display City
    const cityDisplay = document.createElement("h3");

    cityDisplay.innerText = city;
    innerSection.appendChild(cityDisplay);

    let dataList = [];


    // Iterate throw WeatherList
    for (let i = 0; i < weatherForecast5Days["list"].length; i += 8) {
        let weatherObject = weatherForecast5Days["list"][i];

        // Create Article
        const article = document.createElement("article");
        innerSection.appendChild(article);

        // Display Image
        const img = document.createElement("img");
        let imageSource = weatherObject.weather[0].icon;
        let imageUrl = `https://openweathermap.org/img/wn/${imageSource}@2x.png`;
        img.setAttribute("src", imageUrl)
        article.appendChild(img);

        // Display Temperature
        const tempDisplay = document.createElement("h2");
        let temp = tempConverter(weatherObject.main.temp);
        tempDisplay.innerText = temp + "°C";
        article.appendChild(tempDisplay);

        // Display Date
        const dayDisplay = document.createElement("h4");
        let date = new Date(weatherObject.dt * 1000);
        let day = weekday[date.getDay()];
        dayDisplay.innerText = day;
        article.appendChild(dayDisplay);

        sectionWeather.appendChild(innerSection);

        dataList.push({ day: day, temp: temp });
    }
    drawChart(dataList);
}

async function getWeatherForecastByCity(cityList) {
    // Clean up
    sectionWeather.innerHTML = null;

    const result = Array.isArray(cityList);

    if (result) {
        for (let i = 0; i < cityList.length; i++) {
            let city = cityList[i];
            /*    let coordinates = await getCoordinates(city);
             let lat = coordinates[0];
             let lon = coordinates[1];
             let weatherForecast5Days = await getWeather(lat, lon); */

            let weatherForecast5Days = FULL_RESPONSE;
            displayWeather(city, weatherForecast5Days);

        }
    } else {
        /*         let coordinates = await getCoordinates(cityList);
                let lat = coordinates[0];
                let lon = coordinates[1];
                let weatherForecast5Days = await getWeather(lat, lon); */

        let weatherForecast5Days = FULL_RESPONSE;
        displayWeather(cityList, weatherForecast5Days);

    }
}

/**
 * 
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
 * 
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

function tempConverter(temp) {
    return Math.floor(temp - 273.15);
}

function drawChart(datalist) {
    new Chart(context, {
        type: "line",
        data: {
            labels: datalist.map(data => data.day),
            datasets: [
                {
                    label: "Temperature by day",
                    data: datalist.map(data => data.temp),
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.50,
                    borderWidth: 5
                }
            ],
        },
        options: {
            plugins: {
                legend: { display: false },

            }
        }
    });
}

window.addEventListener('resize', function (event) {
    let heightRatio = 0.75;
    canvas.height = window.innerWidth.width * heightRatio;
}, true);