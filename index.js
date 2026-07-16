// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// get html elements
const stateInput = document.getElementById('state-input');
const fetchButton = document.getElementById('fetch-alerts');
const alertsDisplay = document.getElementById('alerts-display');
const errorMessage = document.getElementById('error-message');

function fetchWeatherAlerts(state) {
  const url = `https://api.weather.gov/alerts/active?area=${state}`;

  fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
      }
      return res.json();
    })
    .then(data => {
      displayAlerts(data);
    })
    .catch(err => {
      console.log(err.message);
      showError(err);
    });
}

function displayAlerts(data) {
  alertsDisplay.innerHTML = '';

  const summaryTitle = data.title || 'Weather Alerts';
  const alertsList = data.features || [];
  const alertCount = alertsList.length;

  const summaryHeading = document.createElement('h3');
  summaryHeading.textContent = `${summaryTitle}: ${alertCount}`;
  alertsDisplay.appendChild(summaryHeading);

  if (alertCount === 0) {
    const noAlerts = document.createElement('p');
    noAlerts.textContent = 'No active alerts for this state.';
    alertsDisplay.appendChild(noAlerts);
    return;
  }

  const listElement = document.createElement('ul');

  alertsList.forEach(alert => {
    const headlineText = alert.properties?.headline || 'Weather Alert';
    const listItem = document.createElement('li');
    listItem.textContent = headlineText;
    listElement.appendChild(listItem);
  });

  alertsDisplay.appendChild(listElement);
}

function resetUI() {
  alertsDisplay.innerHTML = '';
  errorMessage.textContent = '';
  errorMessage.classList.add('hidden');
}

function showError(error) {
  errorMessage.textContent = error.message || 'Something went wrong.';
  errorMessage.classList.remove('hidden');
}

window.addEventListener('DOMContentLoaded', () => {
  fetchButton.addEventListener('click', () => {
    const stateCode = stateInput.value.trim().toUpperCase();

    if (!stateCode) {
      showError({ message: 'Please enter a state abbreviation.' });
      return;
    }

    stateInput.value = '';
    resetUI();
    fetchWeatherAlerts(stateCode);
  });
});