const WEEKDAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function averageCalculator(weatherForecast5Days) {
    let tempArray = [];
    let finalWeatherObject = {};

    // Iterate throw WeatherList
    for (let i = 0; i < weatherForecast5Days["list"].length; i++) {
        let weatherObject = weatherForecast5Days["list"][i];
        let date = new Date(weatherObject.dt * 1000);
        let day = WEEKDAY[date.getDay()];
        let weatherObjectTemp = tempConverter(weatherObject["main"].temp);

        switch (day) {
            case "Monday":
                let mondayPic = weatherObject["weather"][0].icon;
                tempArray.push({ day: day, temp: weatherObjectTemp, icon: mondayPic });
                break;

            case "Tuesday":
                let tuesdayPic = weatherObject["weather"][0].icon;
                tempArray.push({ day: day, temp: weatherObjectTemp, icon: tuesdayPic });
                break;

            case "Wednesday":
                let wednesdayPic = weatherObject["weather"][0].icon;
                tempArray.push({ day: day, temp: weatherObjectTemp, icon: wednesdayPic });
                break;

            case "Thursday":
                let thursdayPic = weatherObject["weather"][0].icon;
                tempArray.push({ day: day, temp: weatherObjectTemp, icon: thursdayPic });
                break;

            case "Friday":
                let fridayPic = weatherObject["weather"][0].icon;
                tempArray.push({ day: day, temp: weatherObjectTemp, icon: fridayPic });
                break;

            case "Saturday":
                let saturdayPic = weatherObject["weather"][0].icon;
                tempArray.push({ day: day, temp: weatherObjectTemp, icon: saturdayPic });
                break;

            case "Sunday":
                let sundayPic = weatherObject["weather"][0].icon;
                tempArray.push({ day: day, temp: weatherObjectTemp, icon: sundayPic });
                break;
        }

        finalWeatherObject[day] = {
            day,
            count: 0,
            sum: 0,
            average: 0,
            icon: null
        }

        tempArray.forEach(element => {
            if (day == element.day) {
                finalWeatherObject[element.day].sum += element.temp;
                finalWeatherObject[element.day].count++;
                finalWeatherObject[element.day].average = finalWeatherObject[element.day].sum / finalWeatherObject[element.day].count;
                finalWeatherObject[element.day].icon = element.icon;
            }
        });
    }

    return Object.entries(finalWeatherObject);
}

function tempConverter(temp) {
    return Math.floor(temp - 273.15);
}