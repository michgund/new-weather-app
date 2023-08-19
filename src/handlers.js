import api from "./api";
import dom from "./dom";

const handlers = (() => {
  async function handleSearch(val) {
    try {
      let data = await api.getInfo(val);
      console.log(data);
      let essentialData = api.getEssential(data);
      dom.displayData(essentialData);
    } catch (err) {
      if (err == "Error: 400") {
        console.log(`No city found. Are you sure you meant ${val}?`);
      } else {
        console.log(err);
        console.log("Uh oh! Something went wrong, please try again later!");
      }
    }
  }

  return {
    handleSearch,
  };
})();

export default handlers;
