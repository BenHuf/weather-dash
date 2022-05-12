var cityLat = "";
var cityLon = "";
var cityName = "";
var today = moment().format("(MM/D/YYYY)");

var testCoordinateCall = "https://api.openweathermap.org/geo/1.0/direct?q=london&limit=1&appid=1649c9000c0edd6212787cb652a2a6bb"

var $currentContainer = $("#current-container");
var $fiveDayContainer = $("#five-day-container");
var $searchedCitiesContainer = $("#searched-cities");

var testUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid=1649c9000c0edd6212787cb652a2a6bb"


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
    console.log(cityLat + ", " + cityLon)
    var weatherCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude=minutely,hourly,alerts&appid=1649c9000c0edd6212787cb652a2a6bb";

    return weatherCall;
}

var getWeather = async function(url) {
    var gotWeather = await fetch(url);
    return await gotWeather.json();
}

var createCurrent = async function(url) {
    var currentWeather = await getWeather(url);


    var currentCity = cityName;
    var icon = currentWeather.current.weather[0].icon + ".png";
    console.log(icon)
    var altText = currentWeather.current.weather[0].description;
    var temp = currentWeather.current.temp;
    // ^^^create var to convert to Farenheit^^^
    var wind = currentWeather.current.wind_speed + " MPH";
    var humidity = currentWeather.current.humidity + " %"
    var uvIndex = currentWeather.current.uvi;



    var $cityDateIcon = $('<div>').addClass("del d-flex").appendTo($currentContainer);


    // city date icon
    $('<div>')
        .text(cityName + " " + today)
        .addClass('del big-bold')
        .appendTo($cityDateIcon)
    $('<img src="./assets/images/' + icon + '" alt="' + altText + '" width="36" height="36">')
        .addClass('.del')
        .appendTo($cityDateIcon)
    // temp
    $('<div>')
        .text("Temp: " + temp)
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
        .text("UV Index: " + uvIndex)
        .addClass('del')
        .appendTo($currentContainer)
}

$("#city-form").submit(async function(event){
    event.preventDefault();
    $('.del').remove();
    cityName = $("#city-input").val();
    console.log(cityName)
    var coordinateCall = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=1649c9000c0edd6212787cb652a2a6bb";
    var weatherCallUrl = await getLatLon(coordinateCall);
    createCurrent(weatherCallUrl);
})
//createCurrent(testUrl)
