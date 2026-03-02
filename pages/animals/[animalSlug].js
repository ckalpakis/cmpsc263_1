/* Dynamic demo page showing API routing and loading a selected animal profile from a Next.js endpoint. */
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Navbar from '@/components/Dashboard/Navbar'

const AnimalPage = () => {
  const router = useRouter()
  const { animalSlug } = router.query

  const [animalData, setAnimalData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!animalSlug) {
      return
    }

    setError('')
    fetch('/api/animals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ animal: animalSlug }),
    })
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data?.error || 'Could not load animal data.')
        }
        return data
      })
      .then((data) => setAnimalData(data))
      .catch((requestError) => {
        setAnimalData(null)
        setError(requestError.message)
      })
  }, [animalSlug])

  return (
    <>
      <Navbar />
      <Main>
        <Card>
          <Title>Animal Info</Title>

          {error && <ErrorText>{error}</ErrorText>}

          {!error && !animalData && <BodyText>Loading animal profile...</BodyText>}

          {animalData && (
            <Content>
              <h2>{animalData.name}</h2>
              <p>
                <strong>Habitat:</strong> {animalData.habitat}
              </p>
              <p>
                <strong>Diet:</strong> {animalData.diet}
              </p>
            </Content>
          )}

          <BackLink href='/'>Back to Home</BackLink>
        </Card>
      </Main>
    </>
  )
}

const Main = styled.main`
  min-height: calc(100vh - 69px);
  display: grid;
  place-items: start center;
  padding: 30px 16px;
`

const Card = styled.section`
  width: min(700px, 100%);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--surface);
  box-shadow: var(--shadow-soft);
  padding: 20px;
  animation: fadeUp 300ms ease;
`

const Title = styled.h1`
  font-family: 'Newsreader', Georgia, serif;
  font-size: clamp(1.8rem, 4vw, 2.2rem);
`

const Content = styled.div`
  margin-top: 12px;
  display: grid;
  gap: 6px;

  h2 {
    font-size: 1.3rem;
  }

  p {
    color: var(--muted);
  }
`

const BodyText = styled.p`
  margin-top: 12px;
  color: var(--muted);
`

const ErrorText = styled.p`
  margin-top: 12px;
  color: var(--danger);
`

const BackLink = styled(Link)`
  display: inline-block;
  margin-top: 18px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  padding: 8px 10px;
  text-decoration: none;
  color: var(--text);
  font-weight: 600;

  &:hover {
    background: var(--bg-soft);
  }
`

export default AnimalPage
