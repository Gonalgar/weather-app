import { renderCurrentWeather, updateAllDayForecasts, updateRainChance, updateUVIndex, updateWind, updateSunriseSunset, updateHumidity, updateVisibility, updateAirQuality, updatePressure } from "./uiManager.js";

const API_KEY = 'JBQQD74L5H398ACL9YGDARTLR';
let metric = "c";
let currentLocation = "London";

async function getWeatherData(location) {
    location = encodeURIComponent(location);
    console.log(location);
    
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

function getWindDirection(degree) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degree / 22.5) % 16;
    return directions[index];
}

async function updateUI(location) {
    const data = await getWeatherData(location);
    
    if (!data) {
        console.error('No data received');
        alert('No data was found for the given location');
        return;
    }

    console.log(data);

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
    updateWind(today.windspeed, getWindDirection(today.winddir), metric);
    updateSunriseSunset(today.sunrise, today.sunset);
    updateHumidity(today.humidity);
    updateVisibility(today.visibility, metric);
    updateAirQuality(airQuality);
    updatePressure(today.pressure);
}

document.getElementById('search-bar-input').addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {
        currentLocation = event.target.value;
        console.log(currentLocation)
        await updateUI(currentLocation);
    }
});

document.getElementById('toggle-celsius').addEventListener('click', async () => {
    if (metric !== "c") {
        metric = "c";
        document.getElementById('toggle-celsius').classList.add('active');
        document.getElementById('toggle-fahrenheit').classList.remove('active');
        await updateUI(currentLocation);
    }
});

document.getElementById('toggle-fahrenheit').addEventListener('click', async () => {
    if (metric !== "f") {
        metric = "f";
        document.getElementById('toggle-fahrenheit').classList.add('active');
        document.getElementById('toggle-celsius').classList.remove('active');
        await updateUI(currentLocation);
    }
});

await updateUI("London");