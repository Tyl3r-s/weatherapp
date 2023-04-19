var APIkey = "96f33839c85744a54cc32451f4cf28cb";
var previousCities = { city: [] }
var searchHistoryEl = $('.historySection');
var searchHistory = JSON.parse(localStorage.getItem('cities'));

let suggestedCities = [];
let searchedCities = [];
let cityName;
let weather;

// convert kelvin to celsius
var kelvinToCelsius = function(kelvin) {
    return (Math.round(kelvin - 273.15));
}

var getDateTime = function(offset) {
    // get base time
    var baseTime = luxon.DateTime.now().setZone('UTC');    

    // get offset
    var offset = weather.timezone_offset;
    
    // get local time of city
    return baseTime.plus({seconds: offset});
}

var getDateTimeString = function(time) {
    return time.toLocaleString({ weekday: 'long', month: 'long', day: '2-digit' });
}

var uviStatus = function(uvi) {
    switch (true) {
        case (uvi >= 0 && uvi <= 5):
            return 'aquamarine';
        case (uvi > 5 && uvi <= 7):
            return 'sandybrown';
        case (uvi > 7):
            return 'firebrick'
    }
}

// display current weather
var displayCurrentWeather = function() {
    var current = weather.current;
    var iconUrl = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;

    // determine time
    var time = getDateTime(weather.offset);
    var timeString = getDateTimeString(time);

    // determine temperature
    var temp = kelvinToCelsius(weather.current.temp)
    
    $(`#current-date`).text(timeString);
    $(`#city-name`).text(cityName);
    $(`#current-icon`).attr("src", iconUrl);
    $(`#temp`).text(`${temp}\u00B0`);
    $(`#humidity`).text(`${current.humidity}%`)
    $(`#wind`).text(`${current.wind_speed} m/s`);
    // $(`#uvi`).text(current.uvi).css("background-color", uviStatus(current.uvi));

}

var displayForecastedWeather = function() {
    var day = weather.daily;

    var forecastEl = $(`.forecast-weather`);
    forecastEl.empty();

    for (var i = 1; i <= 5; i++) {
        var dayCardEl = $(`<div>`).addClass(`corecast-card`);

        // determine day
        var time = getDateTime(weather.timezone_offset);
        time = time.plus({days: i}); // get the following day
        var timeString = getDateTimeString(time);

        // determine low and high temp in celsius
        var max = kelvinToCelsius(day[i].temp.max);
        var min = kelvinToCelsius(day[i].temp.min);

        // create date element
        var dayDateEl = $(`<p>`).text(timeString);
        
        // create main info element
        var dayMainInfoEl = $('<div>').addClass(`forecast-main-info`);
        var dayIcoEl = $(`<img>`).attr(`src`, `https://openweathermap.org/img/wn/${day[i].weather[0].icon}.png`)
        var dayTempEl = $(`<p>`).text(`${max}\u00B0`);
        var dayLowEl = $(`<span>`).text(`/ ${min}\u00B0`)
        dayTempEl.append(dayLowEl);
        dayMainInfoEl.append(dayIcoEl, dayTempEl);

        // create other info element
        var dayHumidityEl = $(`<p>`).text(`${day[i].humidity}%`);
        var dayWindEl = $(`<p>`).text(`${day[i].wind_speed} m/s`);

        // display onto html document
        dayCardEl.append(dayDateEl, dayMainInfoEl, dayHumidityEl, dayWindEl);
        forecastEl.append(dayCardEl);
    }
}

var displayWeather = function() {
    displayCurrentWeather();
    displayForecastedWeather();
    savePrevCity(cityName);
}

// gets the weather
// lat : latitude of city
// lon : longtitude of city
var getWeather = function(lat, lon, nextFunction) {
    var apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIkey}`; //&exclude=${part}
    
    fetch(`${apiURL}`)
    .then(response => response.json())
    .then(data => {
            weather = data;
            nextFunction();
        });
}

// gets the longitude and latitude of the city
var getCity = function(location, nextFunction) {
    var geoCode = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${APIkey}`;
    var runNext = nextFunction;

    fetch(geoCode)
        .then(response => response.json())
        .then(data => {     
            getWeather(data[0].lat, data[0].lon, runNext);
            // savePrevCity(data[0].name, data[0].state, data[0].country);
            // updatePrevCityWeather();
            
            cityName = locationString(data[0].name, data[0].state, data[0].country);

            // clears input
            $("#city").val("");

            // clear options list
            $("#city-options").empty();          
        });
}


// returns string depending if state is undefined or not
var locationString = function(city, state, country) {
    // if state exists display [City, State, Country]
    if (state) {
        return `${city}, ${state}, ${country}`;
    }
    // else display [City, Country]
    else {
        return `${city}, ${country}`;
    }
}

// displays a list of suggested cities depending on what is being inputed
var displaySuggestedCityList = function() {
    var suggestedCityListEl = $("#city-options");

    // clear options list
    suggestedCityListEl.empty();
        
    for (var i = 0; i < suggestedCities.length; i++) {
        // create suggestedCityEl
        var suggestedCityEl = $(`<option>`)
            .attr('value', locationString(suggestedCities[i].name,suggestedCities[i].state,suggestedCities[i].country));    

        suggestedCityListEl.append(suggestedCityEl);
    }
}

// pulls a list of cities depending on what is written in the input
var getCityList = function() {
    input = $("#city").val();
    
        if (input) {
            var geoCode = `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=${limit}&appid=${APIkey}`;
    
                fetch(geoCode)
                    .then(response => response.json())
                    .then(data => {
                        suggestedCities = data;
                        displaySuggestedCityList();
                    });
        }
    }

$("#city").on(`keyup change`, getCityList);

$("#city-section").submit(function(event){
    event.preventDefault();

    //handler for when input is empty
    if ($('#city').val() == '') {
        return;
    }

    getCity($('#city').val(), displayWeather);
});

// // if theres local storage data, history section will print
// if (searchHistory) {
//     for (var i = 0; i < searchHistory.length; i++) {
//         var prevCity = $('<p>').addClass("btn history-button").text(searchHistory[i].city);
//         searchHistoryEl.append(prevCity);
//     }
// }

// // city param comes from searchDemCities click, grabs lat lon passes to fetchWeather
// let weather = {
//     // find your coords
//     fetchCoords: function (city) {
//         // finds the lon and lat coords based on city name
//         fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=" + apiKey)
//             // parses data then sets param for fetchWeather
//             .then((response) => response.json())
//             .then((data) => this.fetchWeather(data));
//     },
//     // uses coords to find weather for city then passes data to displayWeather
//     fetchWeather: function (data) {
//         document.querySelector(".city-name").innerText = data[0].name + ", " + data[0].state;
//         // finds weather data based on lon and lat input
//         fetch("https://api.openweathermap.org/data/2.5/onecall?units=metric&lat="
//             + data[0].lat + "&lon=" + data[0].lon + "&exclude=minutely,hourly&appid=" + apiKey)
//             // takes all that data, parses, and fires displayWeather with data param
//             .then((response) => response.json())
//             .then((data) => this.displayWeather(data));
//     },
//     // uses data param to find specific endpoints, displays all data to screen including 5 day forecast
//     displayWeather: function (data) {
//         var date = new Date(data.current.dt * 1000).toLocaleString();
//         // puts the correct data on the screen
//         $(".current-date").text(date);
//         $(".icon").attr('src', "https://openweathermap.org/img/wn/" + data.current.weather[0].icon + ".png");
//         $(".description").text(data.current.weather[0].main);
//         $(".temp").text("Temperature: " + data.current.temp + "°C");
//         $(".wind").text("Wind Speed: " + data.current.wind_speed + "m/s");
//         $(".humidity").text("Humidity: " + data.current.humidity + "%");
//         $(".UVindex").text("UV index: " + data.current.uvi);
//         if (data.current.uvi < "4") {
//             $(".UVindex").removeClass("UVindexModerate UVindexHigh").addClass("UVindexLight")
//         } if (data.current.uvi > "3") {
//             $(".UVindex").removeClass("UVindexLight UVindexHigh").addClass("UVindexModerate")
//         } if (data.current.uvi > "6") {
//             $(".UVindex").removeClass("UVindexLight UVindexModerate").addClass("UVindexHigh")
//         }
//         //create the 5 forecast cards
//         var forecastCards = function () {
//             forecastEl = $(".forecast");
//             forecastEl.empty();
//             // loop creates 5 cards with 5 day forecast
//             for (var i = 1; i < 6; i++) {
//                 // converts unix timestamp to date we can read 
//                 var date = new Date(data.daily[i].dt * 1000).toLocaleDateString();
//                 // fill in forecast cards
//                 var forecastCardEl = $("<div>").addClass("column forecast-card");
//                 var dailyDateEl = $("<p>").text(date);
//                 var dailyIconEl = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png");
//                 var dailyTempEl = $("<p>").text("temp: " + data.daily[i].temp.day + "°C");
//                 var dailyHumidityEl = $("<p>").text("humidity: " + data.daily[i].humidity + "%");
//                 var dailyWindEl = $("<p>").text("wind: " + data.daily[i].wind_speed + "m/s");
//                 forecastCardEl.append(dailyDateEl, dailyIconEl, dailyTempEl, dailyHumidityEl, dailyWindEl);
//                 forecastEl.append(forecastCardEl);
//             }
//         }
//         forecastCards();
//     }
// }; //weather end

// // pass input from search-bar or history section to fetchCoords()
// var searchCities = function (event) {
//     // sends search-bar value to fetchCoords, checks for search history, makes new button for city searched
//     if (event.target.matches('.btn')) {
//         console.log('clicked')
//         if ($('.search-bar').val() !== "") {
//             const city = $('.search-bar').val().trim();
//             previousCities.city = city;
//             savedCities = JSON.parse(localStorage.getItem('cities'));
//             if (!savedCities) {
//                 savedCities = [];
//             }
//             //adds search to local storage
//             savedCities.push(previousCities);
//             localStorage.setItem('cities', JSON.stringify(savedCities));
//             weather.fetchCoords(city);
//             var prevCity = $('<p>').addClass("btn history-button").text(city);
//             searchHistoryEl.append(prevCity);
//         }
//     }
//     // click city from history to search
//     // if (event.target.matches('.history-button')) {
//     //     console.log(event.target.innerHTML)
//     //     weather.fetchCoords(event.target.innerHTML);
//     // }
//     // delete history 
//     // if (event.target.matches('.delete-button')) {
//     //     console.log("clicked")
//     //     localStorage.clear();
//     //     searchHistoryEl.remove('.history-button');
//     //     location.reload();
//     // }
// }

// // search cities
// $(".city-search").click(searchCities);

// // const el = document.querySelectorAll("city-search");
// // document.addEventListener("click", searchDemCities);