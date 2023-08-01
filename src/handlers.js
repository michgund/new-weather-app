const handlers = (() => {
  function getEssential(data) {
    let cityData = getCityData(
      data.location.country,
      data.location.localtime,
      data.location.name,
      data.location.region
    );
    console.log(cityData);

    let hour = cityData.localtime.slice(11, -3);
    console.log(hour);

    let currentTemp = getTemp(
      data.current.cloud,
      data.current.condition.text,
      data.current.condition.icon,
      data.current.humidity,
      data.current.uv
    );
    console.log(currentTemp);

    let currentTempC = getCurrentTempC(
      data.current.feelslike_c,
      data.current.gust_kph,
      data.current.temp_c,
      data.current.wind_kph
    );
    console.log(currentTempC);

    let currentTempF = getCurrentTempF(
      data.current.feelslike_f,
      data.current.gust_mph,
      data.current.temp_f,
      data.current.wind_mph
    );
    console.log(currentTempF);

    let todaysTemp = [];
    for (let i = hour; i < 24; i++) {
      let hourTemp = getTemp(
        data.forecast.forecastday[0].hour[i].cloud,
        data.forecast.forecastday[0].hour[i].condition.text,
        data.forecast.forecastday[0].hour[i].condition.icon,
        data.forecast.forecastday[0].hour[i].humidity,
        data.forecast.forecastday[0].hour[i].uv
      );
      todaysTemp.push(hourTemp);
    }
    console.log(todaysTemp);
  }

  function getCityData(country, localtime, cityName, region) {
    return {
      country: country,
      localtime: localtime,
      cityName: cityName,
      region: region,
    };
  }

  function getTemp(cloud, text, icon, humidity, uv) {
    return {
      cloud: cloud,
      text: text,
      icon: icon,
      humidity: humidity,
      uv: uv,
    };
  }

  function getCurrentTempC(feelslike, gust, temp, wind) {
    return {
      feelslike: feelslike,
      gust: gust,
      temp: temp,
      wind: wind,
    };
  }

  function getCurrentTempF(feelslike, gust, temp, wind) {
    return {
      feelslike: feelslike,
      gust: gust,
      temp: temp,
      wind: wind,
    };
  }

  return {
    getEssential,
  };
})();

export default handlers;
