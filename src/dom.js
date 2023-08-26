import handlers from "./handlers";
import cities from "./cities";

const dom = (() => {
  let input = document.querySelector(".search");
  let searchVal;

  // toggle between celsius and fahrenheit
  let celsius = true;
  const toggle = document.querySelector(".unit-btn");
  let slider = toggle.parentElement;
  slider.addEventListener("click", (e) => {
    if (celsius) {
      toggle.classList.add("toggle");
      toggle.innerHTML = "°F";
      celsius = false;
    } else {
      toggle.classList.remove("toggle");
      toggle.innerHTML = "°C";
      celsius = true;
    }
  });

  function render() {
    // show border around input if it is not in focus
    input.addEventListener("focus", (e) => {
      input.className = "search";
      results.style = "opacity: 1";
    });
    
    input.addEventListener("blur", () => {
      input.className = "search border";
      results.style = "opacity: 0";
    });

    // update results search box with cities as user types
    input.addEventListener("keyup", function (e) {
      if (e.key != "ArrowDown" && e.key != "ArrowUp" && e.key != "Enter") {
        search();
      }
    });

    //
    function search() {
      let j = 0;
      results.innerHTML = "";
      let searched = input.value;
      if (input.value != "") {
        for (let i = 0; i < cities.sortedArr.length; i++) {
          if (
            cities.sortedArr[i].substr(0, searched.length).toLowerCase() ==
            searched.toLowerCase()
          ) {
            // Avoid duplicates
            if (
              cities.sortedArr[i].toLowerCase() !=
              cities.sortedArr[i + 1].toLowerCase()
            ) {
              let addCity = document.createElement("p");
              addCity.textContent = cities.sortedArr[i];
              addCity.className = "not-active";
              addCity.addEventListener("click", () => {
                searchVal = addCity.textContent;
                handlers.handleSearch(searchVal);
                input.value = "";
                results.innerHTML = "";
              });
              input.nextElementSibling.appendChild(addCity);
              j++;
              if (j == 5) {
                return;
              }
            }
          }
        }
      }
    }

    // scroll through the search results with up and down arrow
    let a = -1;
    input.addEventListener("keydown", function (e) {
      if (e.key == "ArrowDown") {
        a++;
        if (a == results.children.length) {
          a = 0;
          results.children[results.children.length - 1].className =
            "not-active";
          results.children[0].className = "active";
        }
        if (results.children[a - 1]) {
          results.children[a - 1].className = "not-active";
        }
        if (results.children[a]) {
          results.children[a].className = "active";
        }
      }
      if (e.key == "ArrowUp") {
        a--;
        if (a == -1) {
          a = results.children.length - 1;
          results.children[0].className = "not-active";
          results.children[results.children.length - 1].className = "active";
        } else {
          if (results.children[a + 1]) {
            results.children[a + 1].className = "not-active";
          }
          if (results.children[a]) {
            results.children[a].className = "active";
          }
        }
      }
      if (e.key == "Enter") {
        searchVal =
          a == -1
            ? input.value
            : (input.value = results.children[a].textContent);
        if (searchVal != "") {
          handlers.handleSearch(searchVal);
        }
        input.value = "";
        results.innerHTML = "";
        input.className = "search border";
      }
      if (e.key != "ArrowUp" && e.key != "ArrowDown" && e.key != "Enter") {
        a = -1;
      }
      // console.log("a:", a);
    });
  }

  function createLeftMain(data) {
    let leftBot = document.querySelector("#left-bot");
    leftBot.innerHTML = "";

    let leftBotTop = document.createElement("div");
    let country = document.createElement("h1");
    country.className = "country";
    country.textContent = `${data.cityData.cityName}, ${data.cityData.country}`;
    leftBotTop.appendChild(country);

    let leftBotBot = document.createElement("div");
    let localTime = document.createElement("h2");
    localTime.textContent = "Local Time:";
    leftBotBot.appendChild(localTime);
    let clock = createClockPiece("clock", "clockContainer");
    let hour = createClockPiece("hour", "hour");
    clock.appendChild(hour);
    let minute = createClockPiece("minute", "minute");
    clock.appendChild(minute);
    let second = createClockPiece("second", "second");
    clock.appendChild(second);
    setInterval(() => {
      let hr = data.hour;
      let min = new Date().getMinutes();
      let sec = new Date().getSeconds();
      let hr_rotation = 30 * hr + min / 2; //converting current time
      let min_rotation = 6 * min;
      let sec_rotation = 6 * sec;

      hour.style.transform = `rotate(${hr_rotation}deg)`;
      minute.style.transform = `rotate(${min_rotation}deg)`;
      second.style.transform = `rotate(${sec_rotation}deg)`;
    }, 1000);
    leftBotBot.appendChild(clock);

    leftBot.appendChild(leftBotTop);
    leftBot.appendChild(leftBotBot);
  }

  function createMidMain(data) {
    let midTop = document.querySelector("#mid-top");
    midTop.innerHTML = "";
    midTop.textContent = data.currentTemp.text;

    let midMid = document.querySelector("#mid-mid");
    midMid.innerHTML = "";
    let icon = document.createElement("img");
    icon.src = data.currentTemp.icon;
    midMid.appendChild(icon);
  }

  function createRightMain(data) {
    let rightDiv = document.querySelector("#right-bot");
    rightDiv.innerHTML = "";
    let title = document.createElement("h1");
    title.textContent = "Daily stats";
    rightDiv.appendChild(title);

    let cloudy = createMoreInfoDiv(
      "Cloudy",
      "fa-solid fa-cloud",
      `${data.currentTemp.cloud}%`
    );
    rightDiv.appendChild(cloudy);

    let humidity = createMoreInfoDiv(
      "Humidity",
      "fa-solid fa-droplet",
      `${data.currentTemp.humidity}%`
    );
    rightDiv.appendChild(humidity);

    let rainy = createMoreInfoDiv(
      "Chance of rain",
      "fa-solid fa-cloud-rain",
      `${data.currentTemp.rainy}%`
    );
    rightDiv.appendChild(rainy);

    let uv = createMoreInfoDiv(
      "UV index",
      "fa-solid fa-umbrella-beach",
      data.currentTemp.uv
    );
    rightDiv.appendChild(uv);

    let sunriseData = data.currentTemp.sunrise;
    sunriseData = sunriseData.replace(/^0/, "");
    let sunrise = createMoreInfoDiv(
      "Sunrise",
      "fa-regular fa-sun",
      sunriseData
    );
    rightDiv.appendChild(sunrise);

    let sunsetData = data.currentTemp.sunset;
    sunsetData = sunsetData.replace(/^0/, "");
    let sunset = createMoreInfoDiv("Sunset", "fa-solid fa-sun", sunsetData);
    rightDiv.appendChild(sunset);
  }

  function createUnitSensitiveInfo(data) {
    let midBot = document.querySelector("#mid-bot");
    midBot.innerHTML = "";
    if (celsius) {
      midBot.textContent = `${Math.round(data.currentTempC.temp)} °C`;
    } else {
      midBot.textContent = `${Math.round(data.currentTempF.temp)} °F`;
    }

    let temps = document.querySelectorAll(".hourly > img + p");
    for (let i = 0; i < temps.length; i++) {
      if (celsius) {
        temps[i].textContent = `${Math.round(data.todaysTemp[i].tempC)} °C`;
      } else {
        temps[i].textContent = `${Math.round(data.todaysTemp[i].tempF)} °F`;
      }
    }
  }

  function createMoreInfoDiv(description, iconClass, data) {
    let div = document.createElement("div");
    let divDiv = document.createElement("div");
    let icon = document.createElement("i");
    icon.className = iconClass;
    divDiv.appendChild(icon);
    div.appendChild(divDiv);

    let right = document.createElement("div");
    let element = document.createElement("p");
    element.textContent = description;
    right.appendChild(element);

    element = document.createElement("p");
    element.textContent = data;
    right.appendChild(element);

    div.appendChild(right);

    return div;
  }

  async function displayData(data) {
    createLeftMain(data);
    createMidMain(data);
    createRightMain(data);
    displayHourlyData(data.hour, data.todaysTemp);
    createUnitSensitiveInfo(data);
    slider.onclick = () => {
      createUnitSensitiveInfo(data);
    };
  }

  function createClockPiece(pieceName, id) {
    pieceName = document.createElement("div");
    pieceName.setAttribute("id", `${id}`);
    return pieceName;
  }

  function displayHourlyData(hour, data) {
    let container = document.querySelector("#bottom-cont");
    container.innerHTML = "";
    for (let i = 0; i < data.length; i++) {
      let hourlyDiv = document.createElement("div");
      hourlyDiv.className = "hourly";

      let time = document.createElement("p");
      // Add 1 because sent through current hour, but want to start showing from next hour.
      let hourTime = parseInt(hour) + i + 1;
      time.textContent = (() => {
        if (hourTime < 12) {
          return `${hourTime} a.m.`;
        } else if (hourTime == 12) {
          return `${hourTime} p.m.`;
        } else {
          return `${hourTime - 12} p.m.`;
        }
      })();
      hourlyDiv.appendChild(time);

      let text = document.createElement("p");
      text.textContent = data[i].text;
      hourlyDiv.appendChild(text);

      let img = document.createElement("img");
      img.src = data[i].icon;
      img.alt = `${data[i].text} icon`;
      hourlyDiv.appendChild(img);

      let temp = document.createElement("p");
      hourlyDiv.appendChild(temp);

      container.appendChild(hourlyDiv);
    }
  }

  function displayError(err, val) {
    console.log(err);
    if (err == "Error: 400") {
      const dialog = document.getElementById("favDialog");
      dialog.showModal();

      let text = document.querySelector(".no-city");
      console.log(text);
      if (!text) {
        let text = document.createElement("p");
        text.className = "no-city";
        text.textContent = `No city found. Are you sure you meant ${val}?`;
        dialog.firstElementChild.insertBefore(
          text,
          dialog.firstElementChild.firstElementChild
        );
      } else {
        text.textContent = `No city found. Are you sure you meant ${val}?`;
      }

      let form = dialog.querySelector("form");
      form.addEventListener("submit", () => {
        if (city.value != "") {
          handlers.handleSearch(city.value);
          city.value = "";
        }
        dialog.close();
      });

      const cancelButton = document.getElementById("cancel");
      // Form cancel button closes the dialog box
      cancelButton.addEventListener("click", () => {
        dialog.close();
      });
    } else {
      const dialog = document.getElementById("favDialogErr");
      dialog.showModal();

      const cancelButton = document.getElementById("cancelErr");
      // Form cancel button closes the dialog box
      cancelButton.addEventListener("click", () => {
        dialog.close();
      });
    }
  }

  return {
    input,
    render,
    displayData,
    displayError,
  };
})();

export default dom;
