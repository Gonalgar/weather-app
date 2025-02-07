
function renderCurrentWeather(location, weekday, time, temperature, description, rainChance, icon, metric) {
    const currentWeatherDiv = document.querySelector('.current-weather');
    currentWeatherDiv.innerHTML = '';

    const weatherIcon = document.createElement('div');
    weatherIcon.classList.add('weather-icon');
    const iconDiv = document.createElement('img');
    iconDiv.src = `icons/${icon}.png`;
    iconDiv.alt = 'Weather Icon';
    weatherIcon.appendChild(iconDiv);
    currentWeatherDiv.appendChild(weatherIcon);

    const temp = document.createElement('div');
    temp.classList.add('temperature');
    temp.innerHTML = `${temperature}°<sup>${metric}</sup>`;
    currentWeatherDiv.appendChild(temp);

    const dayTime = document.createElement('div');
    dayTime.classList.add('day-time');

    const p = document.createElement('p');
    p.innerHTML = `${weekday}, <span class="time">${time}</span>`;
    dayTime.appendChild(p);
    currentWeatherDiv.appendChild(dayTime);

    const hr = document.createElement('hr');
    currentWeatherDiv.appendChild(hr);
    
    const weatherDescription = document.createElement('div');
    weatherDescription.classList.add('weather-description');
    const img = document.createElement('img');
    img.src = `icons/cloud.png`;
    img.alt = 'weather-icon small';
    weatherDescription.appendChild(img);
    const p1 = document.createElement('p');
    p1.innerHTML = description;
    weatherDescription.appendChild(p1);
    currentWeatherDiv.appendChild(weatherDescription);

    const rain = document.createElement('div');
    rain.classList.add('weather-description');
    const img1 = document.createElement('img');
    img1.src = `icons/wet.png`;
    img1.alt = 'weather-icon small';
    rain.appendChild(img1);
    const p2 = document.createElement('p');
    p2.innerHTML = `Rain - ${rainChance}%`;
    rain.appendChild(p2);
    currentWeatherDiv.appendChild(rain);

    const loc = document.createElement('div');
    loc.classList.add('location');
    const h2 = document.createElement('h2');
    h2.innerHTML = location;
    loc.appendChild(h2);
    currentWeatherDiv.appendChild(loc);
}

function updateDayForecast(index, day, high, low, icon) {
    const dayForecasts = document.querySelectorAll('.weekly-carousel .day-forecast');
    if (index < 0 || index >= dayForecasts.length) {
        console.error('Index out of bounds');
        return;
    }
    high = parseInt(high, 10);
    low = parseInt(low, 10);
    const date = new Date(day);
    const options = { weekday: 'short' };
    day = date.toLocaleDateString('en-US', options);
  
    const dayForecast = dayForecasts[index];
    dayForecast.querySelector('.day').textContent = day;
    dayForecast.querySelector('.high').textContent = high + '°';
    dayForecast.querySelector('.low').textContent = low + '°';
    dayForecast.querySelector('.icon').src = `icons/${icon}.png`;
}

function updateAllDayForecasts(data) {
    data.forEach((weekday, index) => {
        updateDayForecast(index, weekday.datetime, weekday.tempmax, weekday.tempmin, weekday.icon);
    });
}
function updateRainChance(value) {
    let rainStatus;
    if (value < 20) {
        rainStatus = 'Low';
    } else if (value < 50) {
        rainStatus = 'Moderate';
    } else {
        rainStatus = 'High';
    }

    document.querySelector('.card.rain .value').textContent = value + ' %';
    document.querySelector('.card.rain .status').textContent = rainStatus;
}

function updateUVIndex(value) {
    let uvStatus;
    if (value < 3) {
        uvStatus = 'Low';
    } else if (value < 6) {
        uvStatus = 'Moderate';
    } else if (value < 8) {
        uvStatus = 'High';
    } else if (value < 11) {
        uvStatus = 'Very High';
    } else {
        uvStatus = 'Extreme';
    }

    document.querySelector('.card.uv-index .value').textContent = value;
    document.querySelector('.card.uv-index .status').textContent = uvStatus;
}

function updateWind(value, direction, metric) {
    let unit = ' km/h';
    if (metric === 'f') {
        unit = ' mph';
    }
    document.querySelector('.card.wind .value').textContent = value + unit;
    document.querySelector('.card.wind .status').textContent = direction;
}
  
function updateSunriseSunset(sunrise, sunset) {
    document.querySelector('.card.sunrise-sunset .sunrise .status').textContent = sunrise;
    document.querySelector('.card.sunrise-sunset .sunset .status').textContent = sunset;
}
  
function updateHumidity(value) { 
    let humidityStatus;
    if (value < 30) {
        humidityStatus = 'Low';
    } else if (value < 60) {
        humidityStatus = 'Moderate';
    } else {
        humidityStatus = 'High';
    }

    document.querySelector('.card.humidity .value').textContent = value + " %";
    document.querySelector('.card.humidity .status').textContent = humidityStatus;
}

function updateVisibility(value, metric) {
    let visibilityStatus;
    if (value > 10) {
        visibilityStatus = 'Very Good';
    } else if (value > 5) {
        visibilityStatus = 'Good';
    } else if (value > 2) {
        visibilityStatus = 'Moderate';
    } else {
        visibilityStatus = 'Poor';
    }

    let unit = ' km';
    if (metric === 'f') {
        unit = ' miles';
    }

    document.querySelector('.card.visibility .value').textContent = value + unit;
    document.querySelector('.card.visibility .status').textContent = visibilityStatus;
}

function updateAirQuality(value) {
    let airQualityStatus;
    if (value <= 50) {
        airQualityStatus = 'Good';
    } else if (value <= 100) {
        airQualityStatus = 'Moderate';
    } else if (value <= 150) {
        airQualityStatus = 'Unhealthy for Sensitive Groups';
    } else if (value <= 200) {
        airQualityStatus = 'Unhealthy';
    } else if (value <= 300) {
        airQualityStatus = 'Very Unhealthy';
    } else {
        airQualityStatus = 'Hazardous';
    }
    
    document.querySelector('.card.air-quality .value').textContent = value;
    document.querySelector('.card.air-quality .status').textContent = airQualityStatus;
    
}

function updatePressure(value) {
    let pressureStatus;
    if (value < 1000) {
        pressureStatus = 'Low';
    } else if (value < 1020) {
        pressureStatus = 'Normal';
    } else {
        pressureStatus = 'High';
    }

    document.querySelector('.card.pressure .value').textContent = value + ' hPa';
    document.querySelector('.card.pressure .status').textContent = pressureStatus;
    }

export { renderCurrentWeather, updateAllDayForecasts, updateRainChance, updateUVIndex, updateWind, updateSunriseSunset, updateHumidity, updateVisibility, updateAirQuality, updatePressure };