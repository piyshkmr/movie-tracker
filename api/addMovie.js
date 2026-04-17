export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const { imdbID } = req.body;

  const OMDB_API_KEY = process.env.OMDB_API_KEY;
  const NOTION_API_KEY = process.env.NOTION_API_KEY;
  const DATABASE_ID = process.env.DATABASE_ID;

  try {
    // Fetch movie
    const omdbRes = await fetch(
      `https://www.omdbapi.com/?i=${imdbID}&apikey=${OMDB_API_KEY}`,
    );
    const movie = await omdbRes.json();

    // Send to Notion
    const notionRes = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_API_KEY}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        parent: { database_id: DATABASE_ID },
        properties: {
          Name: {
            title: [{ text: { content: movie.Title } }],
          },
          Year: {
            rich_text: [{ text: { content: movie.Year } }],
          },
          "IMDB ID": {
            rich_text: [{ text: { content: movie.imdbID } }],
          },
          Poster: {
            url: movie.Poster,
          },
        },
      }),
    });

    const text = await notionRes.text();

    // 🔥 THIS WILL SHOW REAL ERROR
    return res.status(notionRes.status).send(text);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
