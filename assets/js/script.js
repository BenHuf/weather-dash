var cityLat = "";
var cityLon = "";
var cityName = "";

var testCoordinateCall = "https://api.openweathermap.org/geo/1.0/direct?q=london&limit=1&appid=1649c9000c0edd6212787cb652a2a6bb"
var testCall = "https://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=1649c9000c0edd6212787cb652a2a6bb"
var $currentContainer = $("#current-container");
var $fiveDayContainer = $("#five-day-container");
var $searchedCitiesContainer = $("#searched-cities");

var testUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=35&lon=139&exclude=hourly&appid=1649c9000c0edd6212787cb652a2a6bb"

var kelToFar = function(kelvin) {
    var farenheit = Math.round((kelvin-273.15)*(9/5)+32)
    return farenheit;
}

var getGeocode = async function(url) {
    try {
        var gotGeocode = await fetch(url);
        return await gotGeocode.json();
    } catch (error) {
        console.log(error)
    }
    
}

var getLatLon = async function(url) {
    var gotLatLon = await getGeocode(url)
    cityLat = gotLatLon[0].lat;
    cityLon = gotLatLon[0].lon;
    var weatherCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude=minutely,hourly,alerts&appid=1649c9000c0edd6212787cb652a2a6bb";
    console.log(weatherCall)
    return weatherCall;
}

var getWeather = async function(url) {
    var gotWeather = await fetch(url);
    return await gotWeather.json();
}

var createCurrent = async function(url) {
    var currentWeather = await getWeather(url);

    // capitalize city names if input is lowercase
    var parseCityName = function(string) {
        var lower = string.toLowerCase();
        var words = lower.split(" ")
        for (var i = 0; i < words.length; i++) {
            words[i] = words[i][0].toUpperCase() + words[i].slice(1);
        }

        return words.join(" ");
    }
    
    var cityText = parseCityName(cityName)
    var cityClass = cityText.replace(/ /g,"-")

    var unixTime = currentWeather.current.dt
    var date = new Date(unixTime * 1000)
    var dateText = date.toLocaleDateString("en-US")
    var icon = currentWeather.current.weather[0].icon + ".png";
    var altText = currentWeather.current.weather[0].description;
    var tempKelvin = currentWeather.current.temp;
    var temp = kelToFar(tempKelvin)
    var wind = currentWeather.current.wind_speed + " MPH";
    var humidity = currentWeather.current.humidity + " %"
    var uvIndex = currentWeather.current.uvi;



    var $cityDateIcon = $('<div>').addClass("del d-flex").appendTo($currentContainer);


    // city date icon
    $('<div>')
        .text(cityText + " " + dateText)
        .addClass('del big-bold')
        .appendTo($cityDateIcon)
    $('<img src="./assets/images/' + icon + '" alt="' + altText + '" width="36" height="36">')
        .addClass('del')
        .appendTo($cityDateIcon)
    // temp
    $('<div>')
        .text("Temp: " + temp + "\u00B0 F")
        .addClass('del my-2')
        .appendTo($currentContainer)
    // wind
    $('<div>')
        .text("Wind: " + wind)
        .addClass('del mb-2')
        .appendTo($currentContainer)
    // humidity
    $('<div>')
        .text("Humidity: " + humidity)
        .addClass('del mb-2')
        .appendTo($currentContainer)
    // UV index
    $('<div>')
        .text("UV Index: ")
        .attr('id', 'UV')
        .addClass('del')
        .appendTo($currentContainer)
    $('<span>')
        .text(" " + uvIndex + " ")
        .addClass('del')
        .appendTo($('#UV'))
    if (uvIndex <= 2) {
        $('span').addClass('low')
    }
    else if (uvIndex <= 5) {
        $('span').addClass('moderate')
    }
    else {
        $('span').addClass('severe')
    }
    // 5-day forecast
    for (i = 1; i < 6; i++) {
        // daily container
        var $dailyContainer = $('<div>').attr('id', [i]).addClass("day del col border border-black text-light bg-dark").appendTo($fiveDayContainer)
        
        var unixTime = currentWeather.daily[i].dt
        var date = new Date(unixTime * 1000);
        var dateText = (date.toLocaleDateString("en-US"))
        var icon = currentWeather.daily[i].weather[0].icon + ".png"
        var altText = currentWeather.daily[i].weather.description;
        var tempKelvin = currentWeather.daily[i].temp.max
        var temp = kelToFar(tempKelvin)
        var wind = currentWeather.daily[i].wind_speed
        var humidity = currentWeather.daily[i].humidity

        // date
        $('<div>')
            .text(dateText)
            .addClass('del')
            .appendTo($dailyContainer)
        // icon
        $('<img src="./assets/images/' + icon + '" alt="' + altText + '" width="32" height="32">')
            .addClass('del')
            .appendTo($dailyContainer)
        // temp
        $('<div>') 
            .text('Temp: ' + temp + "\u00B0 F")
            .addClass('del')
            .appendTo($dailyContainer)
        // wind
        $('<div>') 
            .text('Wind: ' + wind + " MPH")
            .addClass('del')
            .appendTo($dailyContainer)
        // humidity
        $('<div>') 
            .text('Humidity: ' + humidity + " %")
            .addClass('del')
            .appendTo($dailyContainer)
    }

    // create buttons for previously searched cities
    if (!$('button.' + cityClass).length) {
        $('<button type="button">')
        .addClass("btn btn-secondary split mb-3 " + cityClass)
        .attr('id', "city-button")
        .text(cityText)
        .appendTo($searchedCitiesContainer)
    }    
}

$("#city-form").submit(async function(event){
    event.preventDefault();
    $('.del').remove();
    cityName = $("#city-input").val();
    var coordinateCall = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=1649c9000c0edd6212787cb652a2a6bb";
    var weatherCallUrl = await getLatLon(coordinateCall);
    createCurrent(weatherCallUrl);
})

$(document).on('click', '#city-button', async function() {
    cityName = $(this).text()
    $('.del').remove();
    var coordinateCall = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=1649c9000c0edd6212787cb652a2a6bb";
    var weatherCallUrl = await getLatLon(coordinateCall);
    createCurrent(weatherCallUrl);
})