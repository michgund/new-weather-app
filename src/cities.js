import list from "./city.list.json";

const cities = (() => {
  let sortedArr = [];

  ((citiesList) => {
    citiesList.sort(function (a, b) {
      a = a.name.toLowerCase();
      b = b.name.toLowerCase();

      return a < b ? -1 : a > b ? 1 : 0;
    });
    citiesList.forEach((object) => {
      sortedArr.push(object.name);
    });
    return sortedArr;
  })(list);

  return {
    sortedArr,
  };
})();

export default cities;
