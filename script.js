const apiCountries = 'https://restcountries.eu/rest/v2/all';

/* Variáveis de estado da aplicação */
let tabCountries = null;
let tabFavorites = null;

let allCountries = [];
let favoriteCountries = [];

let countCountries = 0;
let countFavorites = 0;

let totalPopulationList = 0;
let totalPopulationFavorites = 0;

let numberformat = null;

window.addEventListener('load', () => {
  tabCountries = document.querySelector('#tabCountries');
  tabFavorites = document.querySelector('#tabFavorites');

  countCountries = document.querySelector('#countCountries');
  countFavorites = document.querySelector('#countFavorites');

  totalPopulationList = document.querySelector('#totalPopulationList');
  totalPopulationFavorites = document.querySelector(
    '#totalPopulationFavorites'
  );

  numberFormat = Intl.NumberFormat('pt-BR');

  fetchCountries();
});

async function fetchCountries() {
  const res = await fetch(apiCountries);
  const json = await res.json();
  allCountries = json.map((country) => {
    const { numericCode, translations, population, flag } = country;
    return {
      id: numericCode,
      name: translations.pt,
      population: population,
      formattedPopulation: formatNumber(population),
      flag: flag,
    };
  });

  render();
}

function render() {
  renderCountryList();
  renderFavorites();
  renderSummary();
  handleCountryButtons();
}

function renderCountryList() {
  let countriesHTML = '<div>';

  allCountries.forEach((country) => {
    const { name, flag, id, population, formattedPopulation } = country;

    const countryHTML = `
      <div class='country'>  
        <button id="${id}" class="buttonAdd"> + </button>  
        <div>
         <img class="imageFlag" src="${flag}" />
        </div>
        <div>
          <ul>
            <li> Country Name: ${name}</li>
            <li> Population: ${formattedPopulation}</li>
          </ul>
        </div>
      </div>
    `;
    countriesHTML += countryHTML;
  });

  countriesHTML += '</div>';
  tabCountries.innerHTML = countriesHTML;
}

function renderFavorites() {
  let favoritesHTML = '<div>';

  favoriteCountries.forEach((country) => {
    const { name, flag, id, formattedPopulation } = country;

    const favoriteCountryHTML = `
      <div class='country'>  
        <button id="${id}" class="buttonSubtract"> - </button>  
        <div>
         <img class="imageFlag" src="${flag}" />
        </div>
        <div>
          <ul>
            <li>Country Name: ${name}</li>
            <li> Population: ${formattedPopulation}</li>
          </ul>
        </div>
      </div>
    `;
    favoritesHTML += favoriteCountryHTML;
  });

  favoritesHTML += '</div>';
  tabFavorites.innerHTML = favoritesHTML;
}

function renderSummary() {
  // Qtd de países em cada coluna
  countCountries.textContent = allCountries.length;
  countFavorites.textContent = favoriteCountries.length;

  // população total
  const totalPopulation = allCountries.reduce((acc, curr) => {
    return acc + curr.population;
  }, 0);

  const totalFavorites = favoriteCountries.reduce((acc, curr) => {
    return acc + curr.population;
  }, 0);

  totalPopulationList.textContent = formatNumber(totalPopulation);
  totalPopulationFavorites.textContent = formatNumber(totalFavorites);
}

function handleCountryButtons() {
  const countryButtons = Array.from(
    tabCountries.querySelectorAll('.buttonAdd')
  );

  const favoriteButtons = Array.from(
    tabFavorites.querySelectorAll('.buttonSubtract')
  );

  countryButtons.forEach((button) => {
    button.addEventListener('click', () => addToFavorites(button.id));
  });

  favoriteButtons.forEach((button) => {
    button.addEventListener('click', () => removeFromFavorites(button.id));
  });
}

function addToFavorites(id) {
  const countryToAdd = allCountries.find((button) => button.id === id);

  favoriteCountries = [...favoriteCountries, countryToAdd];

  sortCountries(allCountries);

  allCountries = allCountries.filter((country) => country.id !== id);
  sortCountries(favoriteCountries);

  render();
}

function removeFromFavorites(id) {
  const countryToRemove = favoriteCountries.find((button) => button.id === id);

  allCountries = [...allCountries, countryToRemove];
  sortCountries(allCountries);

  favoriteCountries = favoriteCountries.filter((country) => country.id !== id);
  sortCountries(favoriteCountries);
  render();
}

function sortCountries(countries) {
  return countries.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
}

function formatNumber(number) {
  return numberFormat.format(number);
}
