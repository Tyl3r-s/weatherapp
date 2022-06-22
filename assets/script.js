var apiKey = "456bcc1764018a22b8eb99867d768a6d"
var userFormEl = document.querySelector(`.city-search`)
var cityInputEl = document.querySelector(`.search-bar`)

var getCity = function(city) {
    // format the github api url
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}";
  
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
        nameInputEl.value = "";
    } else {
        alert("Please enter a city name!");
    }
    console.log(event);
}

userFormEl.addEventListener("submit", formSubmitHandler);