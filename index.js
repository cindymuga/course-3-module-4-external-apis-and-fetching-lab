// html elements
const input = document.getElementById('state-input');
const btn = document.getElementById('fetch-alerts');
const display = document.getElementById('alerts-display');
const errDiv = document.getElementById('error-message');

// listen for clicks
btn.addEventListener('click', async () => {
const state = input.value.trim().toUpperCase();

// empty check
if (!state) {
errDiv.textContent = "Please enter a state abbreviation.";
errDiv.classList.remove('hidden');
return;
}

// clear ui
input.value = '';
display.innerHTML = '';
errDiv.textContent = '';
errDiv.classList.add('hidden');

// hit the api
try {
const res = await fetch(`https://api.weather.gov/alerts/active?area=${state}`);

if (!res.ok) {
throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
}

const data = await res.json();

// update heading
const title = document.createElement('h3');
title.textContent = `${data.title}: ${data.features.length}`;
display.appendChild(title);

// zero alerts check
if (data.features.length === 0) {
const emptyMsg = document.createElement('p');
emptyMsg.textContent = 'No active alerts for this state.';
display.appendChild(emptyMsg);
return;
}

// make list
const ul = document.createElement('ul');
data.features.forEach(item => {
const li = document.createElement('li');
li.textContent = item.properties?.headline || "Weather Alert";
ul.appendChild(li);
});
display.appendChild(ul);

} catch (err) {
// catch errors
console.log(err.message);
errDiv.textContent = err.message;
errDiv.classList.remove('hidden');
}
});
