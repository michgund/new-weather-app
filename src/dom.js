import handlers from "./handlers";
import api from "./api";
import cities from "./cities";

const dom = (() => {
  let input = document.querySelector(".search");

  function render() {
    input.addEventListener("keypress", async (e) => {
      if (e.key === "Enter") {
        input.className = "search border";
        try {
          let data = await api.getInfo(input.value);
          console.log(data);
          handlers.getEssential(data);
        } catch (err) {
          if (err == "Error: 400") {
            console.log(
              `No city found. Are you sure you meant ${input.value}?`
            );
          } else {
            console.log("Uh oh! Something went wrong, please try again later!");
          }
        }
      }
    });

    window.addEventListener("click", (e) => {
      if (e.target === input) {
        input.className = "search";
      } else {
        input.className = "search border";
      }
    });

    input.addEventListener("keyup", function (e) {
      //   console.log(e);
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
              // addCity.addEventListener("click", () => {
              //   getInfo(addCity.textContent);
              // });
              input.nextElementSibling.appendChild(addCity);
              j++;
              if (j == 5) {
                return;
              }
            }
          }
        }
      } else {
        input.style.border = "1px solid green";
        return;
      }
    }
  }

  return {
    input,
    render,
  };
})();

export default dom;
