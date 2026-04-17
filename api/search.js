const results = await Promise.all(
  data.Search.slice(0, 5).map(async (movie) => {
    const detailRes = await fetch(
      `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${OMDB_API_KEY}`,
    );
    const full = await detailRes.json();

    return {
      title: full.Title,
      year: full.Year,
      imdbID: full.imdbID,
      poster: full.Poster,
      plot: full.Plot,
      genre: full.Genre,
      actors: full.Actors,
      rating: full.imdbRating,
    };
  }),
);
