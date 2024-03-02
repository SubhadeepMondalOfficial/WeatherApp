let API_key = "aa2a85e8547982f6c61fb1713cb32878";

let cityName = "goa";

async function fetchWeatherDetails() {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_key}&units=metric`
  );
  const data = await response.json();
  // console.log(`${data?.main?.temp.toFixed(2)} °C`);
  renderDataUI(data);
}

function renderDataUI(data) {
  let newPara = document.createElement("p");
  newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`;
  document.body.appendChild(newPara);
}

let latitude = 38.8951;
let longitude = -77.0364;

async function getCustomWeatherDetails() {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_key}&units=metric`
    );
    const data = await response.json();
    console.log(data);
    
    renderDataUI(data);

  } catch (error) {
    console.log('Error Found', error)
  }
}
