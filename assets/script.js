var apiKey = `96f33839c85744a54cc32451f4cf28cb`;
var userFormEl = document.querySelector(`.city-search`);
var cityInputEl = document.querySelector(`.search-bar`);

var getCity = function(city) {
    // format the github api url
    var apiUrl ="https://api.openweathermap.org/data/2.5/onecall?lat=" + "43.65" + "&lon=" + "79.98" + "&units=metric&exclude=minutely&appid=" + apiKey;
  
    // make a get request to url
    fetch(apiUrl).then(function(response) {
      console.log(response);
      response.json().then(function(data) {
        console.log(data);
      });
    });
  };

var formSubmitHandler = function (event) {

    event.preventDefault();

    // get value from input element
    var city = cityInputEl.value.trim();

    if (city) {
        getCity(city);
        cityInputEl.value = "";
    } else {
        alert("Please enter a city name!");
    }
    console.log(event);
}

userFormEl.addEventListener("submit", formSubmitHandler);