const notionRes = await fetch("https://api.notion.com/v1/pages", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${NOTION_API_KEY}`,
    "Content-Type": "application/json",
    "Notion-Version": "2022-06-28",
  },
  body: JSON.stringify({
    parent: { database_id: DATABASE_ID },

    // ✅ ADD COVER IMAGE
    cover:
      movie.Poster !== "N/A"
        ? {
            external: { url: movie.Poster },
          }
        : undefined,

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
      Plot: {
        rich_text: [{ text: { content: movie.Plot || "" } }],
      },
      Genre: {
        rich_text: [{ text: { content: movie.Genre || "" } }],
      },
      Actors: {
        rich_text: [{ text: { content: movie.Actors || "" } }],
      },
      "IMDb Rating": {
        rich_text: [{ text: { content: movie.imdbRating || "" } }],
      },
    },
  }),
});
