// toronto weather using city search (does not give UV index)
// https://api.openweathermap.org/data/2.5/weather?q=toronto&appid=96f33839c85744a54cc32451f4cf28cb 

// toronto weather searching with lat and lon (gives UV index)
// https://api.openweathermap.org/data/2.5/onecall?lat=43.7001&lon=-79.4163&exclude=minutely,hourly,daily&appid=96f33839c85744a54cc32451f4cf28cb

// get toronto (or any city) lat and lon by searching name
// http://api.openweathermap.org/geo/1.0/direct?q=Toronto&limit=5&appid=96f33839c85744a54cc32451f4cf28cb

var lat = [];

var lon = [];


// handles weather data for current day
let weather = {
    apiKey: "96f33839c85744a54cc32451f4cf28cb",
    fetchWeather: function(lat, lon) {
        fetch(
            // finds weather data based on lon and lat input
            "https://api.openweathermap.org/data/2.5/onecall?units=metric&lat="
            + lat
            + "&lon="
            + lon
            + "&exclude=minutely,hourly,daily&appid=" 
            + this.apiKey
            )
            // takes all that data, parses, and gives to displayWeather
            .then((response) => response.json())
            .then((data) => this.displayWeather(data));
        },
        // grabs specified parts of the data just collected and assigns to variable
        displayWeather: function(data) {
            const name = data.timezone;
            const temp = data.current.temp;
            const wind = data.current.wind_speed;
            const humidity = data.current.humidity;
            const UVindex = data.current.uvi;
            const icon = data.current.weather[0].icon;
            // puts the correct data on the screen
            document.querySelector(".city-name").innerText = "Weather in " + name;
            document.querySelector(".icon").src = "https://openweathermap.org/img/wn/"+icon+".png";
            document.querySelector(".temp").innerText = "Temperature: "+temp+"°C";            
            document.querySelector(".wind").innerText = "Wind Speed: "+wind+"m/s";
            document.querySelector(".humidity").innerText = "Humidity: "+humidity+"%";
            document.querySelector(".UVindex").innerText = "UV index: "+UVindex;
        }
}