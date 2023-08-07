import handlers from "./handlers";
import api from "./api";
import cities from "./cities";

const dom = (() => {
  let input = document.querySelector(".search");

  function render() {
    window.addEventListener("click", (e) => {
      if (e.target === input) {
        input.className = "search";
      } else {
        input.className = "search border";
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
                handlers.handleSearch(addCity.textContent);
                input.value = addCity.textContent;
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
        let searchVal =
          a == -1
            ? input.value
            : (input.value = results.children[a].textContent);
        handlers.handleSearch(searchVal);
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
    let midDiv = document.querySelector("#mid-top");
    let country = document.createElement("h1");
    country.className = "country";
    country.textContent = `, ${data.cityData.country}`;
    midDiv.appendChild(country);
  }

  function displayHourlyData(hour, data) {
    let container = document.querySelector("#bottom-cont");
    container.innerHTML = "";
    for (let i = 0; i < data.length; i++) {
      let hourlyDiv = document.createElement("div");
      hourlyDiv.className = "hourly";

      let time = document.createElement("p");
      let hourTime = parseInt(hour) + i;
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
