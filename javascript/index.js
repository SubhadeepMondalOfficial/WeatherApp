/*=================================
    Aquiring elements from DOM
===================================*/
let yourWeatherBtn = document.getElementById('your-weather-btn')
let searchWeatherBtn = document.getElementById('search-weather-btn')
let loaderContainer = document.getElementById('loader-container')
let grandLocationContainer = document.getElementById('grand-location-container')
let grandLocationBtn = document.getElementById('grand-location-btn')
let searchContainer = document.getElementById('search-container')
let searchInput = document.getElementById('search-input')
let tempDetailsContainer = document.getElementById('data-temp-details-container')
let notFoundContainer = document.getElementById('not-found-container')


//! Toggle Between two Button [Your Weather & Search Weather]
// yourWeatherBtn.addEventListener('click', () => {
//    yourWeatherBtn.style.background = '#8bbae9' 
//    searchWeatherBtn.style.background = 'none'
// })

// searchWeatherBtn.addEventListener('click', () => {
//     searchWeatherBtn.style.background = '#8bbae9'
//     yourWeatherBtn.style.background = 'none'
// })

let API_KEY = 'aa2a85e8547982f6c61fb1713cb32878'

let currentTab = yourWeatherBtn;
currentTab.classList.add('current-tab-style')
loaderContainer.classList.add('active')

getFromSessionStorage()
getLocation()

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove('current-tab-style')
        currentTab = clickedTab;
        currentTab.classList.add('current-tab-style')
        
        if(currentTab == yourWeatherBtn ){
            searchContainer.classList.remove('active')
            tempDetailsContainer.classList.remove('active')
            loaderContainer.classList.add('active')
            getFromSessionStorage()
            loaderContainer.classList.remove('active')
            showPosition()
        }
        // else{
        //     loaderContainer.classList.remove('active')
        // }

        if(currentTab == searchWeatherBtn){
            searchContainer.classList.add('active')
            grandLocationContainer.classList.remove('active')
            tempDetailsContainer.classList.remove('active')
        }
        else{
            searchContainer.classList.remove('active')
        }
    }
}
yourWeatherBtn.addEventListener('click', () => {
    switchTab(yourWeatherBtn)
})
searchWeatherBtn.addEventListener('click', () => {
    switchTab(searchWeatherBtn)
})


function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem('user-coordinates')
    
    if(!localCoordinates){
        loaderContainer.classList.remove('active')
        grandLocationContainer.classList.add('active')
    }
    else{
        const coordinates = JSON.parse(localCoordinates)
        fetchUserWeatherInfo(coordinates)

        // grandLocationContainer.classList.remove('active')
        // tempDetailsContainer.classList.add('active')
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;

    // Now Show the Loader before that remove Grand Location Container
    grandLocationContainer.classList.remove('active')
    loaderContainer.classList.add('active')

    // API CALL
    try {
        let response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)

        let data = await response.json()

        // Now Remove Loader & add Temp. details in UI bacause Temperature receive from API
        loaderContainer.classList.remove('active')
        tempDetailsContainer.classList.add('active')
        
        renderWeatherInfo(data)

    } catch (error) {
        console.log(`Error from API Call ${error}`);
    }
}

function renderWeatherInfo(weatherInfo){
    const dataCityName = document.getElementById('data-city-name')
    const dataCountryIcon = document.getElementById('data-country-icon')
    const dataWeatherDesc = document.getElementById('data-weather-descript')
    const dataWeatherIcon = document.getElementById('data-weather-icon')
    const dataTemperature = document.getElementById('data-temperature')
    const dataWindspeed = document.getElementById('data-windspeed')
    const dataHumidity = document.getElementById('data-humidity')
    const dataClouds = document.getElementById('data-clouds')

    // Now render API data in DOM
    dataCityName.innerText = weatherInfo?.name;
    dataCountryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`
    dataWeatherDesc.innerText = weatherInfo?.weather?.[0]?.description;
    dataWeatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`
    dataTemperature.innerText = `${weatherInfo?.main?.temp} °C`;
    dataWindspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    dataHumidity.innerText = `${weatherInfo?.main?.humidity}%`;
    dataClouds.innerText = `${weatherInfo?.clouds?.all}%`;
}

grandLocationBtn.addEventListener('click', getLocation)

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition)
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem('user-coordinates',JSON.stringify(userCoordinates))
    fetchUserWeatherInfo(userCoordinates)
}



searchContainer.addEventListener('submit', (e) => {
    e.preventDefault();
    notFoundContainer.classList.remove('active')
    
    let cityName = searchInput.value

    if (cityName === "") {
        return
    }
    else{
        
        fetchSearchWeatherInfo(cityName)
    }

})

async function fetchSearchWeatherInfo(cityName){
    loaderContainer.classList.add('active')
    tempDetailsContainer.classList.remove('active')
    grandLocationContainer.classList.remove('active')
    
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`)
        const data = await response.json()

        loaderContainer.classList.remove('active')
        
        if(data?.name){
            tempDetailsContainer.classList.add('active')
            renderWeatherInfo(data)

        }else{
            notFoundContainer.classList.add('active')
        }

    } catch (error) {
        console.log(`Error Receive from fetchSearchWeatherInfo function ${error}`);
    }
}