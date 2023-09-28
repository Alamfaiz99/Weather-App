// Replace 'YOUR_API_KEY' with your actual API key from the weather service provider.
const apiKey = '6bd7f768d24577ec2a4ee693fd83092f';
const weatherContainer = document.getElementById('weatherContainer');
const errorMessage = document.getElementById('errorMessage');
const temperatureValueElement = document.getElementById('temperatureValue');
const temperatureUnitElement = document.getElementById('temperatureUnit');
const unitToggle = document.getElementById('unitToggle');

document.getElementById('getWeatherButton').addEventListener('click', () => {
    const locationInput = document.getElementById('locationInput').value;
    const unitToggle = document.getElementById('unitToggle').value;
    getWeather(locationInput, unitToggle);
});

document.getElementById('getLocationButton').addEventListener('click', () => {
    // Check if geolocation is supported by the browser
    if ('geolocation' in navigator) {
      // Request geolocation permission
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          // Get latitude and longitude
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
  
          // Make a request to a reverse geocoding service to get the city and country name from coordinates
          const reverseGeocodeResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
          const reverseGeocodeData = await reverseGeocodeResponse.json();
  
          // Extract city and country from reverse geocode response
          const cityName = reverseGeocodeData.name;
          const countryName = reverseGeocodeData.sys.country;
  
          // Display the city and country in the input field
          const locationInput = document.getElementById('locationInput');
          locationInput.value = `${cityName}, ${countryName}`;
  
          // Fetch weather data for the user's location
          getWeather(`${cityName},${countryName}`, document.getElementById('unitToggle').value);
        } catch (error) {
          console.error('Error fetching weather data:', error);
        }
      }, (error) => {
        console.error('Geolocation error:', error);
      });
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  });

// Function to convert temperature from Fahrenheit to Celsius
function convertToFahrenheitToCelsius(temperatureFahrenheit) {
    return (temperatureFahrenheit - 32) * (5 / 9);
}

// Function to convert temperature from Celsius to Fahrenheit
function convertToCelsiusToFahrenheit(temperatureCelsius) {
    return (temperatureCelsius * 9 / 5) + 32;
}

// Function to fetch weather data from the API
async function getWeather(location, units) {
    try {
        // Make an AJAX request to the weather API
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${units}&appid=${apiKey}`);

        if (!response.ok) {
            throw new Error('Weather data not found');
        }

        const data = await response.json();

        // Display weather data
        const weatherHTML = `
            <h2>${data.name}, ${data.sys.country}</h2>  
            <p>Temperature: <span id="temperatureValue">${data.main.temp.toFixed(2)}</span> <span id="temperatureUnit">${units === 'metric' ? '°C' : '°F'}</span></p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
            <p>Weather: ${data.weather[0].description}</p>
        `;

        errorMessage.textContent = '';
        weatherContainer.innerHTML = weatherHTML;
    } catch (error) {
        errorMessage.textContent = 'Location not found or an error occurred.';
        weatherContainer.innerHTML = '';
    }
}

// Function to update the temperature unit and value based on the selected unit
function updateTemperatureUnitAndValue(unit) {
    // Update temperature unit label
    temperatureUnitElement.textContent = unit === 'metric' ? '°C' : '°F';

    // Get the current temperature value
    const currentTemperature = parseFloat(temperatureValueElement.textContent);

    // Convert the temperature to the new unit
    const newTemperature = unit === 'metric' ? convertToFahrenheitToCelsius(currentTemperature) : convertToCelsiusToFahrenheit(currentTemperature);

    // Update the temperature value on the page
    temperatureValueElement.textContent = newTemperature.toFixed(2);
}
// Real Time conversion of Temperature Vallue based on selected unit
unitToggle.addEventListener('change',function(event){
     const newVal=event.target.value;
     const locationInput = document.getElementById('locationInput').value;
     if(locationInput!=''){
        getWeather(locationInput,newVal);
     }
     
})