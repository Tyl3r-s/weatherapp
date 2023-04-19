var apiKey = "96f33839c85744a54cc32451f4cf28cb";
var previousCities = { city: [] }
var searchHistoryEl = $('.historySection');
var searchHistory = JSON.parse(localStorage.getItem('cities'));

// if theres local storage data, history section will print
if (searchHistory) {
    for (var i = 0; i < searchHistory.length; i++) {
        var prevCity = $('<p>').addClass("btn history-button").text(searchHistory[i].city);
        searchHistoryEl.append(prevCity);
    }
}

// city param comes from searchDemCities click, grabs lat lon passes to fetchWeather
let weather = {
    // find your coords
    fetchCoords: function (city) {
        // finds the lon and lat coords based on city name
        fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=" + apiKey)
            // parses data then sets param for fetchWeather
            .then((response) => response.json())
            .then((data) => this.fetchWeather(data));
    },
    // uses coords to find weather for city then passes data to displayWeather
    fetchWeather: function (data) {
        document.querySelector(".city-name").innerText = data[0].name + ", " + data[0].state;
        // finds weather data based on lon and lat input
        fetch("https://api.openweathermap.org/data/2.5/onecall?units=metric&lat="
            + data[0].lat + "&lon=" + data[0].lon + "&exclude=minutely,hourly&appid=" + apiKey)
            // takes all that data, parses, and fires displayWeather with data param
            .then((response) => response.json())
            .then((data) => this.displayWeather(data));
    },
    // uses data param to find specific endpoints, displays all data to screen including 5 day forecast
    displayWeather: function (data) {
        var date = new Date(data.current.dt * 1000).toLocaleString();
        // puts the correct data on the screen
        $(".current-date").text(date);
        $(".icon").attr('src', "https://openweathermap.org/img/wn/" + data.current.weather[0].icon + ".png");
        $(".description").text(data.current.weather[0].main);
        $(".temp").text("Temperature: " + data.current.temp + "°C");
        $(".wind").text("Wind Speed: " + data.current.wind_speed + "m/s");
        $(".humidity").text("Humidity: " + data.current.humidity + "%");
        $(".UVindex").text("UV index: " + data.current.uvi);
        if (data.current.uvi < "4") {
            $(".UVindex").removeClass("UVindexModerate UVindexHigh").addClass("UVindexLight")
        } if (data.current.uvi > "3") {
            $(".UVindex").removeClass("UVindexLight UVindexHigh").addClass("UVindexModerate")
        } if (data.current.uvi > "6") {
            $(".UVindex").removeClass("UVindexLight UVindexModerate").addClass("UVindexHigh")
        }
        //create the 5 forecast cards
        var forecastCards = function () {
            forecastEl = $(".forecast");
            forecastEl.empty();
            // loop creates 5 cards with 5 day forecast
            for (var i = 1; i < 6; i++) {
                // converts unix timestamp to date we can read 
                var date = new Date(data.daily[i].dt * 1000).toLocaleDateString();
                // fill in forecast cards
                var forecastCardEl = $("<div>").addClass("column forecast-card");
                var dailyDateEl = $("<h5>").text(date);
                var dailyIconEl = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png");
                var dailyTempEl = $("<h6>").text("temp: " + data.daily[i].temp.day + "°C");
                var dailyHumidityEl = $("<h6>").text("humidity: " + data.daily[i].humidity + "%");
                var dailyWindEl = $("<h6>").text("wind: " + data.daily[i].wind_speed + "m/s");
                forecastCardEl.append(dailyDateEl, dailyIconEl, dailyTempEl, dailyHumidityEl, dailyWindEl);
                forecastEl.append(forecastCardEl);
            }
        }
        forecastCards();
    }
}; //weather end

// pass input from search-bar or history section to fetchCoords()
var searchDemCities = function (event) {
    // sends search-bar value to fetchCoords, checks for search history, makes new button for city searched
    if (event.target.matches('.searchIcon')) {
        if ($('.search-bar').val() !== "") {
            const city = $('.search-bar').val().trim();
            previousCities.city = city;
            savedCities = JSON.parse(localStorage.getItem('cities'));
            if (!savedCities) {
                savedCities = [];
            }
            //adds search to local storage
            savedCities.push(previousCities);
            localStorage.setItem('cities', JSON.stringify(savedCities));
            weather.fetchCoords(city);
            var prevCity = $('<p>').addClass("btn history-button").text(city);
            searchHistoryEl.append(prevCity);
        }
    }
    // click city from history to search
    if (event.target.matches('.history-button')) {
        console.log(event.target.innerHTML)
        weather.fetchCoords(event.target.innerHTML);
    }
    // delete history 
    if (event.target.matches('.delete-button')) {
        console.log("clicked")
        localStorage.clear();
        searchHistoryEl.remove('.history-button');
        location.reload();
    }
}

// search cities
$(".city-search").click(searchDemCities);