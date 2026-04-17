export default async function handler(req, res) {
  const { query } = req.query;

  const OMDB_API_KEY = process.env.OMDB_API_KEY;

  if (!query) {
    return res.status(400).json({ error: "Missing query" });
  }

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?s=${query}&apikey=${OMDB_API_KEY}`,
    );

    const data = await response.json();

    if (data.Response === "False") {
      return res.status(200).json({ results: [] });
    }

    const results = data.Search.map((movie) => ({
      title: movie.Title,
      year: movie.Year,
      imdbID: movie.imdbID,
      poster: movie.Poster,
    }));

    res.status(200).json({ results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
