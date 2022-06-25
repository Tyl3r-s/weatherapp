var cityName = [];

var citySearches = [];

var apiKey = "96f33839c85744a54cc32451f4cf28cb";

var cityNameInputEl = document.querySelector(".search-bar");

var searchCityEl = document.querySelector(".search-button");

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
        document.querySelector(".city-name").innerText = data[0].name+", "+data[0].state;
        // finds weather data based on lon and lat input
        fetch("https://api.openweathermap.org/data/2.5/onecall?units=metric&lat="
            + data[0].lat
            + "&lon="
            + data[0].lon
            + "&exclude=minutely,hourly&appid="
            + apiKey
        )
            // takes all that data, parses, and fires displayWeather with data param
            .then((response) => response.json())
            .then((data) => this.displayWeather(data));
    },
    // sets specific weather variables and inserts into html
    displayWeather: function (data) {
        // puts the correct data on the screen
        document.querySelector(".current-date").innerText = data.current.dt;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" +data.current.weather[0].icon+ ".png";
        document.querySelector(".description").innerText = data.current.weather[0].main;
        document.querySelector(".temp").innerText = "Temperature: " +data.current.temp+ "°C";
        document.querySelector(".wind").innerText = "Wind Speed: " +data.current.wind_speed+ "m/s";
        document.querySelector(".humidity").innerText = "Humidity: " +data.current.humidity+ "%";
        document.querySelector(".UVindex").innerText = "UV index: " +data.current.uvi;
            //create the 5 forecast cards
            var forecastCards = function() {
                var day = data.daily
                forecastEl = $(".forecast");
                forecastEl.empty();
            // loop creates 5 cards with 5 day forecast
            for (var i = 1; i < 6; i++) {
                var forecastCardEl = $("<div>").addClass("column forecast-card");
                var dailyDateEl = $("<h5>").text(data.daily[i].dt);
                var dailyIconEl = $("<img>").attr("src","https://openweathermap.org/img/wn/"+data.daily[i].weather[0].icon+".png");
                var dailyTempEl = $("<h6>").text("temp: "+data.daily[i].temp.day+"°C");
                var dailyHumidityEl = $("<h6>").text("humidity: "+data.daily[i].humidity+"%");
                var dailyWindEl = $("<h6>").text("wind: "+data.daily[i].wind_speed+"m/s");
                forecastCardEl.append(dailyDateEl, dailyIconEl, dailyTempEl, dailyHumidityEl, dailyWindEl);
                forecastEl.append(forecastCardEl);
            }  
        }
    forecastCards();
    }
}; //weather end

searchCityEl.onclick = function() {
    cityName = cityNameInputEl.value 
    saveCitySearch();
}

var saveCitySearch = function() {
    cityName = JSON.parse(localStorage.getItem('citySearch'));
    if (cityName && cityNameInputEl.value !== "") {
        cityName = cityName + "," + cityNameInputEl.value
        localStorage.setItem('citySearch', JSON.stringify(cityName));
    } else if (cityNameInputEl.value !== ""){
        cityName =cityNameInputEl.value
        localStorage.setItem('citySearch', JSON.stringify(cityName));
    }
    if (cityNameInputEl.value == "") {
        alert("please enter valid city name, or please check spelling")
        return;
    } else {
    cityName = []
    cityName = cityNameInputEl.value 
    weather.fetchCoords();
    }
}

