import axios from 'axios'
export function debounce(func, delay = 1000) {
  let timeoutId;
  return function (...args) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
}
export const fetchData = async (searchTerm) => {
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
};

let leftMovie;
let rightMovie;
export async function onMovieSelect(movie, summaryElement, side) {
  const response = await axios.get("http://www.omdbapi.com", {
    params: {
      apiKey: "145ec40e",
      i: movie.imdbID,
    },
  });
  summaryElement.innerHTML = movieTemplate(response.data);
  if (side === "left") {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
}

export function runComparison() {
  const leftSideStats = document.querySelectorAll(
    "#left-summary .notification"
  );
  const rightSideStats = document.querySelectorAll(
    "#right-summary .notification"
  );
  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];
    const rightSideValue = rightStat.dataset.value;
    const leftSideValue = leftStat.dataset.value;
    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove("is-primary");
      leftStat.classList.add("is-warning");
    } else {
      rightStat.classList.remove("is-primary");
      rightStat.classList.add("is-warning");
    }
  });
}

export function movieTemplate(movieDetails) {
  const dollars = parseInt(movieDetails.BoxOffice.replace(/[\$,]/g, ""));
  const metaScore = parseInt(movieDetails.Metascore);
  const imdbRating = parseFloat(movieDetails.imdbRating);
  const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g, ""));
  const awards = movieDetails.Awards.split(" ").reduce((prev, word) => {
    const value = parseInt(word);
    if (isNaN(value)) {
      return prev;
    } else {
      return prev + value;
    }
  }, 0);
  return `
    <article class="media">
      <figure class="media-left">
        <p class="image"><img src="${movieDetails.Poster}" alt="movie poster" /></p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetails.Title}</h1> 
          <h4>${movieDetails.Genre}</h4>
          <p>${movieDetails.Plot}</p>
        </div> 
      </div>
    </article>
    <article data-value=${awards} class="notification is-primary">
      <p class="title">${movieDetails.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
<article data-value=${dollars} class="notification is-primary">
      <p class="title">${movieDetails.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
<article data-value=${metaScore} class="notification is-primary">
      <p class="title">${movieDetails.Metascore}</p>
    </article>
<article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieDetails.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetails.imdbVotes}</p>
      <p class="subtitle">IMDB Votes </p>
    </article>
  `;
}
