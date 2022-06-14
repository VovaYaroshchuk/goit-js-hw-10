import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const input = document.getElementById('search-box');
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');

input.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));

function cleanMarkup(ref) {
  ref.innerHTML = '';
}

function handleInput(e) { 
    const inputValue = e.target.value.trim();

    if (!inputValue) {
        cleanMarkup(list);
        cleanMarkup(info);
        
      }
    
      fetchCountries(inputValue)
        .then(data => {
          console.log(data);
          if (data.length > 10) {
            Notify.info('Too many matches found. Please enter a more specific name');
            return;
          }
          renderMarkup(data);
        })
        .catch(err => {
          cleanMarkup(list);
          cleanMarkup(info);
          Notify.failure('Oops, there is no country with that name');
        });
    }


function createListMarkup(data) {
  return data
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.svg}" alt="${name.official}" width="60" height="40" >${name.official}</li>`,
    )
    .join('');
}

function createInfoMarkup(data) {
    return data.map(
        ({ name, capital, population, flags, languages }) =>
        `<h1><img src="${flags.svg}" alt="${name.official}" width="60" height="40">${
            name.official
        }</h1>
        <p>Capital: ${capital}</p>
        <p>Population: ${population}</p>
        <p>Languages: ${Object.values(languages)}</p>`,
    );
}

function renderMarkup(data) {
    if (data.length === 1) {
      cleanMarkup(list);
      const markupInfo = createInfoMarkup(data);
      info.innerHTML = markupInfo;
    }
    else { 
      cleanMarkup(info);
      const markupList = createListMarkup(data);
      list.innerHTML = markupList;
    }
}
