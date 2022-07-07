import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inputBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');

inputBox.addEventListener('input', e => {
    e.preventDefault();
    debounce(getInputValue(e.target.value), DEBOUNCE_DELAY)

});

function getInputValue(value) {
    countryList.innerHTML = '';
    let inputValue = value.trim();
    fetchCountries(inputValue)
        .then(r => {
            if (!r.ok) {
                throw new Error(Notiflix.Notify.failure('Oops, there is no country with that name'));
            }
        return r.json()
        }).then(data => isCountriesMatch(data))    
    
}
    
function markCard(country) {
    return country.reduce((total, { name, capital, population, flags, languages }) =>
        total + `<div id="search-box" class="card-country">
    <div class="card-country-info">
            <div class="card-country-info_symbols">
            <img src="${flags.svg}" alt="${name.official}" width="30px" height="30px">
            <h2 class="card-country-info-name">${name.official}</h2>
            </div>
            <p class="card-country-info-capital">Capital: ${capital[0]}</p>
            <p class="card-country-info-population">Population: ${population}</p>
            <p class="card-country-info-languages">Languages: ${Object.values(languages)[0]}</p>
        </div>
    </div>    
`
        , "")
}
        
    function isCountriesMatch(data) {
        if (data.length > 10) {
        Notiflix.Notify.success('Too many matches found. Please enter a more specific name.');
        } else if(data.length>=2 && data.length<=10){
            countryList.innerHTML = listCountry(data);
        } else if (data.length === 1) {
            countryList.innerHTML = markCard(data);       
    }
} 
   
    function listCountry(data) {
        return data.reduce((total, { name, flags }) =>
            total + `<div id="search-box" class="card-country">
    <div class="card-country-info">
            <div class="card-country-info_symbols">
            <img src="${flags.svg}" alt="${name.official}" width="30px" height="30px">
            <h2 class="card-country-info-name">${name.official}</h2>
    </div>    
`, "")
    }        
            