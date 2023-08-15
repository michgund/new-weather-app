import handlers from "./handlers";
import api from "./api";
import cities from "./cities";

const dom = (() => {
  let input = document.querySelector(".search");
  let searchVal;

  function render() {
    window.addEventListener("click", (e) => {
      if (e.target === input) {
        input.className = "search";
      } else {
        if (searchVal) {
          input.value = searchVal;
        }
        input.className = "search border";
        results.innerHTML = "";
      }
    });

    input.addEventListener("keyup", function (e) {
      if (e.key != "ArrowDown" && e.key != "ArrowUp" && e.key != "Enter") {
        search();
      }
    });

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
                input.value = searchVal;
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
        handlers.handleSearch(searchVal);
        input.value = searchVal;
        results.innerHTML = "";
        input.className = "search border";
      }
      if (e.key != "ArrowUp" && e.key != "ArrowDown" && e.key != "Enter") {
        a = -1;
      }
      // console.log("a:", a);
    });
  }

  function displayData(data) {
    console.log(data);
    let leftBot = document.querySelector("#left-bot");
    leftBot.innerHTML = "";

    let leftBotTop = document.createElement("div");
    let country = document.createElement("h1");
    country.className = "country";
    country.textContent = `, ${data.cityData.country}`;
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
      // let d = new Date(); //object of date()
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

    let midDiv = document.querySelector("#mid-top");
    midDiv.innerHTML = "";
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
      let unit = "C";
      temp.textContent = `${Math.round(data[i].tempC)} °${unit}`;
      hourlyDiv.appendChild(temp);

      container.appendChild(hourlyDiv);
    }
  }

  return {
    input,
    render,
    displayData,
    displayHourlyData,
  };
})();

export default dom;
