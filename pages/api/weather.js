const weatherCodes = {
  0: 'Clear sky',
  1: 'Mostly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Dense drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  80: 'Rain showers',
  81: 'Rain showers',
  82: 'Heavy showers',
  95: 'Thunderstorm',
}

export default async function handler(req, res) {
  const city = String(req.query.city || 'State College').trim()

  if (!city) {
    return res.status(400).json({ error: 'A city is required.' })
  }

  try {
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    )
    const geoData = await geoResponse.json()
    const firstResult = geoData?.results?.[0]

    if (!geoResponse.ok || !firstResult) {
      return res.status(404).json({ error: 'City not found.' })
    }

    const forecastResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${firstResult.latitude}&longitude=${firstResult.longitude}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`
    )
    const forecastData = await forecastResponse.json()

    if (!forecastResponse.ok || !forecastData?.current) {
      return res.status(502).json({ error: 'Weather service unavailable.' })
    }

    return res.status(200).json({
      location: `${firstResult.name}${firstResult.admin1 ? `, ${firstResult.admin1}` : ''}`,
      temperature: forecastData.current.temperature_2m,
      windSpeed: forecastData.current.wind_speed_10m,
      condition: weatherCodes[forecastData.current.weather_code] || 'Current conditions unavailable',
    })
  } catch (error) {
    console.error('Weather API error', error)
    return res.status(500).json({ error: 'Unable to fetch weather right now.' })
  }
}
