import './styles/style.css';
import axios from 'axios';
import createAutoComplete from "./autocomplete.js";
import { onMovieSelect } from "./utils.js";
const config = {
  renderOption(movie) {
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
      <img src="${imgSrc}" alt="movie poster" />
      <h1>${movie.Title} (${movie.Year})</h1>
    `;
  },
  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm) {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "145ec40e",
        s: searchTerm,
      },
    });
    if (response.data.Error) {
      return [];
    }
    return response.data.Search;
  },
};
createAutoComplete({
  ...config,
  root: document.querySelector("#left-autocomplete"),

  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#left-summary"), "left");
  },
});
// some movie
createAutoComplete({
  ...config,
  root: document.querySelector("#right-autocomplete"),

  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#right-summary"), "right");
  },
});
