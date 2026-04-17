let lastRequestTime = 0;

export default async function handler(req, res) {
  const { query } = req.query;
  const OMDB_API_KEY = process.env.OMDB_API_KEY;

  if (!query) {
    return res.status(400).json({ error: "Missing query" });
  }

  // 🛡️ Basic rate limit (1 req/sec)
  const now = Date.now();
  if (now - lastRequestTime < 1000) {
    return res.status(429).json({ error: "Too many requests" });
  }
  lastRequestTime = now;

  try {
    const searchRes = await fetch(
      `https://www.omdbapi.com/?s=${query}&apikey=${OMDB_API_KEY}`,
    );
    const searchData = await searchRes.json();

    if (searchData.Response === "False") {
      return res.status(200).json({ results: [] });
    }

    const limited = searchData.Search.slice(0, 5);

    const results = [];

    for (let movie of limited) {
      try {
        const detailRes = await fetch(
          `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${OMDB_API_KEY}`,
        );
        const full = await detailRes.json();

        results.push({
          title: full.Title,
          year: full.Year,
          imdbID: full.imdbID,
          poster: full.Poster,
          plot: full.Plot,
          genre: full.Genre,
          actors: full.Actors,
          rating: full.imdbRating,
        });
      } catch (e) {
        console.log("Error fetching details");
      }
    }

    res.status(200).json({ results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
