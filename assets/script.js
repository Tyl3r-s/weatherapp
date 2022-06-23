// var apiKey = `96f33839c85744a54cc32451f4cf28cb`;
// var userFormEl = document.querySelector(`.city-search`);
// var cityInputEl = document.querySelector(`.search-bar`);

// var formSubmitHandler = function (event) {

//   event.preventDefault();

//   // get value from input element
//   var city = cityInputEl.value.trim();

//   if (city) {
//       getCity(city);
//       cityInputEl.value = "";
//   } else {
//       alert("Please enter a city name!");
//   }
// }

// var getCity = function(city) {
//     // format the github api url
//     var apiUrl ="https://api.openweathermap.org/data/2.5/onecall?lat=" + "43.65" + "&lon=" + "90.04" + "&units=metric&exclude=minutely&appid=" + apiKey;
  
//     // make a get request to url
//     fetch(apiUrl).then(function(response) {
//       response.json().then(function(data) {
//         console.log(data);
//       });
//     });
//   };
  
// var displayWeather = function() {

// }

// userFormEl.addEventListener("submit", formSubmitHandler);

// toronto weather using city search (does not give UV index)
// https://api.openweathermap.org/data/2.5/weather?q=toronto&appid=96f33839c85744a54cc32451f4cf28cb 

// toronto weather searching with lat and lon (gives UV index)
// https://api.openweathermap.org/data/2.5/onecall?lat=43.7001&lon=-79.4163&exclude=minutely,hourly,daily&appid=96f33839c85744a54cc32451f4cf28cb

// get toronto (or any city) lat and lon by searching name
// http://api.openweathermap.org/geo/1.0/direct?q=Toronto&limit=5&appid=96f33839c85744a54cc32451f4cf28cb

let weather = {
    apiKey: "96f33839c85744a54cc32451f4cf28cb",
    fetchWeather: function(lat, lon) {
        fetch(
            "https://api.openweathermap.org/data/2.5/onecall?lat="
            + lat
            + "&lon="
            + lon
            + "&exclude=minutely,hourly,daily&appid=" 
            + this.apiKey
            )
            .then((response) => response.json())
            .then((data) => console.log(data));
        }
}