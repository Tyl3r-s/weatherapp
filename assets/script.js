var cityName = [];

var citySearches = [];

var apiKey = "96f33839c85744a54cc32451f4cf28cb";

var cityNameInput = document.querySelector(".search-bar");

var searchCity = document.querySelector(".search-button");

// searches for coords of city, uses coords to find city's weather data, passes specified data into HTML
let weather = {
    // find your coords
    fetchCoords: function () {
        // finds the lon and lat coords based on city name
        fetch("http://api.openweathermap.org/geo/1.0/direct?q="
            + cityName
            + "&limit=5&appid="
            + apiKey)
            // parses data then sets param for fetchWeather
            .then((response) => response.json())
            .then((data) => this.fetchWeather(data));
    },

    // set coord variables and searches for weather
    fetchWeather: function (data) {
        const lon = data[0].lon;
        const lat = data[0].lat;
        const name = data[0].name+", "+data[0].state;
        document.querySelector(".city-name").innerText = name;
        // finds weather data based on lon and lat input
        fetch("https://api.openweathermap.org/data/2.5/onecall?units=metric&lat="
            + lat
            + "&lon="
            + lon
            + "&exclude=minutely,hourly,daily&appid="
            + apiKey
        )
            // takes all that data, parses, and fires displayWeather with data param
            .then((response) => response.json())
            .then((data) => this.displayWeather(data));
    },
    // sets specific weather variables and inserts into html
    displayWeather: function (data) {
        const temp = data.current.temp;
        const wind = data.current.wind_speed;
        const humidity = data.current.humidity;
        const UVindex = data.current.uvi;
        const icon = data.current.weather[0].icon;
        const description = data.current.weather[0].main;
        // puts the correct data on the screen
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = "Temperature: " + temp + "°C";
        document.querySelector(".wind").innerText = "Wind Speed: " + wind + "m/s";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".UVindex").innerText = "UV index: " + UVindex;
    }
    // search: function() {
    //     this.fetchCoords(document.querySelector(".search-bar").value);
    // }
};

searchCity.onclick = function() {

    cityName = cityNameInput.value 

    console.log(cityName);
    
    weather.fetchCoords();
}