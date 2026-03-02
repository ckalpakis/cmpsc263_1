export default async function handler(req, res) {
  const query = String(req.query.q || 'time management').trim()

  if (!query) {
    return res.status(400).json({ error: 'A search query is required.' })
  }

  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5`
    )
    const data = await response.json()

    if (!response.ok) {
      return res.status(502).json({ error: 'Resource service unavailable.' })
    }

    const resources = (data.docs || []).slice(0, 5).map((item, index) => ({
      key: item.key || `${item.title}-${index}`,
      title: item.title || 'Untitled resource',
      authorLine: item.author_name?.join(', ') || 'Author not listed',
      url: `https://openlibrary.org${item.key || ''}`,
    }))

    return res.status(200).json({ resources })
  } catch (error) {
    console.error('Study resources API error', error)
    return res.status(500).json({ error: 'Unable to fetch resources right now.' })
  }
}
