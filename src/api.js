//OK for this project that this free API key is publicly available as there is no consequence for exposing it.
//OpenWeather
// const APIkey = "8c0d6a6e3c285afa92b0398479b3ce9e";

//WeatherApi
const api = (() => {
  const APIkey = "59a3eae2b2ea4a18bf811307232707";
  let units = "metric";
  let days = 3;

  async function getInfo(data) {
    let response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${APIkey}&q=${data}&days=${days}`
    );

    if (response.status == 200) {
      let json = await response.json();
      return json;
    } else {
      throw new Error(response.status);
    }
  }

  return {
    getInfo,
  };
})();

export default api;
