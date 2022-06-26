var apiKey = "96f33839c85744a54cc32451f4cf28cb";
var previousCities = {city: []}
var searchHistory = JSON.parse(localStorage.getItem('cities'));
var searchHistoryEl = $('.historySection');
// searches for coords of city, uses coords to find city's weather data, passes specified data into HTML
let weather = {
    // find your coords
    fetchCoords: function (city) {
        // finds the lon and lat coords based on city name
        fetch("http://api.openweathermap.org/geo/1.0/direct?q="+city+"&limit=5&appid="+apiKey)
            // parses data then sets param for fetchWeather
            .then((response) => response.json())
            .then((data) => this.fetchWeather(data));
    },
    // set coord variables and searches for weather
    fetchWeather: function (data) {
        document.querySelector(".city-name").innerText = data[0].name+", "+data[0].state;
        var prevCity = $('<p>').addClass("btn history-button").text(data[0].name);
        searchHistoryEl.append(prevCity);
        // finds weather data based on lon and lat input
        fetch("https://api.openweathermap.org/data/2.5/onecall?units=metric&lat="
        +data[0].lat+"&lon="+data[0].lon+"&exclude=minutely,hourly&appid="+apiKey)
            // takes all that data, parses, and fires displayWeather with data param
            .then((response) => response.json())
            .then((data) => this.displayWeather(data));
    },
    // sets specific weather variables and inserts into html
    displayWeather: function (data) {
        var date = new Date(data.current.dt * 1000).toLocaleString();
        // puts the correct data on the screen
        $(".current-date").text(date);
        $(".icon").attr('src', "https://openweathermap.org/img/wn/" +data.current.weather[0].icon+ ".png");
        $(".description").innerText = data.current.weather[0].main;
        $(".temp").text("Temperature: " +data.current.temp+ "°C");
        $(".wind").text("Wind Speed: " +data.current.wind_speed+ "m/s");
        $(".humidity").text("Humidity: " +data.current.humidity+ "%");
        $(".UVindex").text("UV index: " +data.current.uvi);
        if (data.current.uvi < "4") {
            $(".UVindex").removeClass("UVindexModerate UVindexHigh").addClass("UVindexLight")
        } if (data.current.uvi > "3") {
            $(".UVindex").removeClass("UVindexLight UVindexHigh").addClass("UVindexModerate")
        } if (data.current.uvi > "6") {
            $(".UVindex").removeClass("UVindexLight UVindexModerate").addClass("UVindexHigh")
        }
            //create the 5 forecast cards
            var forecastCards = function() {
                forecastEl = $(".forecast");
                forecastEl.empty();
            // loop creates 5 cards with 5 day forecast
            for (var i = 1; i < 6; i++) {
                var date = new Date(data.daily[i].dt * 1000).toLocaleDateString();
                var forecastCardEl = $("<div>").addClass("column forecast-card");
                var dailyDateEl = $("<h5>").text(date);
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

$('.search-button').click(() => {
    const city = $('.search-bar').val().trim();
    previousCities.city = city;
    
    savedCities = JSON.parse(localStorage.getItem('cities'));
    if (!savedCities) {
        savedCities = [];
    }
    savedCities.push(previousCities);
    localStorage.setItem('cities', JSON.stringify(savedCities));
    weather.fetchCoords(city);
})

for(var i = 0; i < searchHistory.length; i++) {
    var prevCity = $('<p>').addClass("btn history-button").text(searchHistory[i].city);
    searchHistoryEl.append(prevCity);
}

$('.delete-button').click(() => {
    console.log("clicked")
    localStorage.clear();
    location.reload();
})


