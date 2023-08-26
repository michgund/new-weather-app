//OK for this project that this free API key is publicly available as there is no consequence for exposing it.
//OpenWeather
// const APIkey = "8c0d6a6e3c285afa92b0398479b3ce9e";

//WeatherApi
const api = (() => {
  const APIkey = "59a3eae2b2ea4a18bf811307232707";
  let days = 1;

  async function getInfo(val) {
    let response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${APIkey}&q=${val}&days=${days}`
    );

    if (response.status == 200) {
      let json = await response.json();
      return json;
    } else {
      console.log(response.status);
      throw new Error(response.status);
    }
  }

  function getEssential(data) {
    const cityData = getCityData(
      data.location.country,
      data.location.localtime,
      data.location.name,
      data.location.region
    );

    const hour = cityData.localtime.slice(11, -3);

    const currentTemp = getTemp(
      data.current.cloud,
      data.current.condition.text,
      data.current.condition.icon,
      data.current.humidity,
      data.current.uv,
      data.forecast.forecastday[0].astro.sunrise,
      data.forecast.forecastday[0].astro.sunset,
      data.forecast.forecastday[0].day.daily_chance_of_rain
    );

    const currentTempC = getCurrentTempC(
      data.current.temp_c,
      data.current.wind_kph
    );

    const currentTempF = getCurrentTempF(
      data.current.temp_f,
      data.current.wind_mph
    );

    const todaysTemp = [];
    for (let i = hour; i < 24; i++) {
      let hourTemp = getHourlyTemp(
        data.forecast.forecastday[0].hour[i].condition.text,
        data.forecast.forecastday[0].hour[i].condition.icon,
        data.forecast.forecastday[0].hour[i].temp_c,
        data.forecast.forecastday[0].hour[i].temp_f
      );
      todaysTemp.push(hourTemp);
    }

    return {
      cityData,
      hour,
      currentTemp,
      currentTempC,
      currentTempF,
      todaysTemp,
    };
  }

  function getCityData(country, localtime, cityName, region) {
    return {
      country: country,
      localtime: localtime,
      cityName: cityName,
      region: region,
    };
  }

  function getTemp(cloud, text, icon, humidity, uv, sunrise, sunset, rainy) {
    return {
      cloud: cloud,
      text: text,
      icon: icon,
      humidity: humidity,
      uv: uv,
      sunrise: sunrise,
      sunset: sunset,
      rainy: rainy,
    };
  }

  function getCurrentTempC(temp, wind) {
    return {
      temp: temp,
      wind: wind,
    };
  }

  function getCurrentTempF(temp, wind) {
    return {
      temp: temp,
      wind: wind,
    };
  }

  function getHourlyTemp(text, icon, tempC, tempF) {
    return {
      text: text,
      icon: icon,
      tempC: tempC,
      tempF: tempF,
    };
  }

  return {
    getInfo,
    getEssential,
  };
})();

export default api;
