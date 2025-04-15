export default async function handler(req, res) {
  const category = req.query.category || 'general';

  const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=9f91cfc4ce914ab1beae98de322e052c`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'ok') {
      return res.status(500).json({ error: 'News API error', details: data });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong', message: err.message });
  }
}



