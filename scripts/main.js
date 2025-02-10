import { renderCurrentWeather, updateAllDayForecasts, updateRainChance, updateUVIndex, updateWind, updateSunriseSunset, updateHumidity, updateVisibility, updateAirQuality, updatePressure } from "./uiManager.js";

const API_KEY = 'JBQQD74L5H398ACL9YGDARTLR';
let metric = "c";

async function getWeatherData(location) {
    let query = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/next7days?`;

    if (metric === "c") {
        query += `&unitGroup=metric`;
    } else {
        query += `&unitGroup=us`;
    }

    query += `&include=days%2Ccurrent&key=${API_KEY}&contentType=json`;

    if (metric === "c") {
        query += `&elements=%2Baqieur`;
    } else {
        query += `&elements=%2Baqius`;
    }

    return fetch(query)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }
            return response.json();
        }).catch(error => {
            console.error(error);
        });
}

let data = await getWeatherData("London", true);
console.log(data);

function getWindDirection(degree) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degree / 22.5) % 16;
    return directions[index];
}

async function updateUI(location) {
    const data = await getWeatherData(location, false);
    
    if (!data) {
        console.error('No data received');
        return;
    }

    const today = data.currentConditions;
    const weeklyForecast = data.days;
    let todayWeekday = new Date(data.days[0].datetime);
    const options = { weekday: 'long' };
    todayWeekday = todayWeekday.toLocaleDateString('en-US', options);
    today.datetime = today.datetime.slice(0, 5);
    today.sunrise = today.sunrise.slice(0, 5);
    today.sunset = today.sunset.slice(0, 5);

    let airQuality = today.aqieur ? today.aqieur : today.aqius;

    renderCurrentWeather(data.resolvedAddress, todayWeekday, today.datetime, today.temp, today.conditions, today.precipprob, today.icon, metric);
    updateAllDayForecasts(weeklyForecast);
    updateRainChance(today.precipprob);
    updateUVIndex(today.uvindex);
    updateWind(today.windspeed, getWindDirection(today.winddir));
    updateSunriseSunset(today.sunrise, today.sunset);
    updateHumidity(today.humidity);
    updateVisibility(today.visibility, metric);
    updateAirQuality(airQuality);
    updatePressure(today.pressure);
}

document.getElementById('search-bar-input').addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {
        const location = event.target.value;
        await updateUI(location);
    }
});

await updateUI("London");