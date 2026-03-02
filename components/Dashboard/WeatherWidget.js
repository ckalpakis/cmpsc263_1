import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const WeatherWidget = () => {
  const [city, setCity] = useState('State College')
  const [draftCity, setDraftCity] = useState('State College')
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadWeather() {
      setIsLoading(true)
      setError('')

      try {
        const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Unable to load weather right now.')
        }

        if (isMounted) {
          setWeather(data)
        }
      } catch (requestError) {
        if (isMounted) {
          setWeather(null)
          setError(requestError.message)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadWeather()

    return () => {
      isMounted = false
    }
  }, [city])

  function handleSubmit(event) {
    event.preventDefault()
    if (draftCity.trim()) {
      setCity(draftCity.trim())
    }
  }

  return (
    <Card>
      <Header>Weather Snapshot</Header>
      <BodyText>External API: Open-Meteo geocoding + forecast.</BodyText>

      <Form onSubmit={handleSubmit}>
        <Input value={draftCity} onChange={(event) => setDraftCity(event.target.value)} />
        <SubmitButton type='submit'>Refresh</SubmitButton>
      </Form>

      {isLoading && <InfoText>Loading weather data...</InfoText>}
      {!isLoading && error && <ErrorText>{error}</ErrorText>}
      {!isLoading && weather && (
        <Stats>
          <Stat>
            <Label>Location</Label>
            <Value>{weather.location}</Value>
          </Stat>
          <Stat>
            <Label>Temperature</Label>
            <Value>{weather.temperature}°C</Value>
          </Stat>
          <Stat>
            <Label>Conditions</Label>
            <Value>{weather.condition}</Value>
          </Stat>
          <Stat>
            <Label>Wind</Label>
            <Value>{weather.windSpeed} km/h</Value>
          </Stat>
        </Stats>
      )}
    </Card>
  )
}

const Card = styled.section`
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  padding: 18px;
`

const Header = styled.h2`
  font-size: 1.08rem;
`

const BodyText = styled.p`
  margin-top: 8px;
  color: var(--muted);
  font-size: 0.94rem;
`

const Form = styled.form`
  margin-top: 14px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`

const Input = styled.input`
  flex: 1;
  min-width: 180px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--bg-soft);
  padding: 10px;
  font: inherit;
`

const SubmitButton = styled.button`
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--surface);
  padding: 10px 12px;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
`

const InfoText = styled.p`
  margin-top: 14px;
  color: var(--muted);
`

const ErrorText = styled(InfoText)`
  color: var(--danger);
`

const Stats = styled.div`
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
`

const Stat = styled.div`
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--bg-soft);
  padding: 10px;
`

const Label = styled.p`
  color: var(--muted);
  font-size: 0.8rem;
`

const Value = styled.p`
  margin-top: 4px;
  font-weight: 700;
`

export default WeatherWidget
