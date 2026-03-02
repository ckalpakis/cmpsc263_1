import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const ResourceWidget = () => {
  const [query, setQuery] = useState('time management')
  const [draftQuery, setDraftQuery] = useState('time management')
  const [resources, setResources] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadResources() {
      setIsLoading(true)
      setError('')

      try {
        const response = await fetch(`/api/study-resources?q=${encodeURIComponent(query)}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Unable to load study resources right now.')
        }

        if (isMounted) {
          setResources(data.resources || [])
        }
      } catch (requestError) {
        if (isMounted) {
          setResources([])
          setError(requestError.message)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadResources()

    return () => {
      isMounted = false
    }
  }, [query])

  function handleSubmit(event) {
    event.preventDefault()
    if (draftQuery.trim()) {
      setQuery(draftQuery.trim())
    }
  }

  return (
    <Card>
      <Header>Study Resources</Header>
      <BodyText>External API: Open Library search recommendations.</BodyText>

      <Form onSubmit={handleSubmit}>
        <Input value={draftQuery} onChange={(event) => setDraftQuery(event.target.value)} />
        <SubmitButton type='submit'>Search</SubmitButton>
      </Form>

      {isLoading && <InfoText>Loading resources...</InfoText>}
      {!isLoading && error && <ErrorText>{error}</ErrorText>}
      {!isLoading && !error && (
        <List>
          {resources.map((resource) => (
            <ResourceItem key={resource.key}>
              <a href={resource.url} target='_blank' rel='noreferrer'>
                {resource.title}
              </a>
              <p>{resource.authorLine}</p>
            </ResourceItem>
          ))}
        </List>
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

const List = styled.div`
  margin-top: 14px;
  display: grid;
  gap: 10px;
`

const ResourceItem = styled.article`
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--bg-soft);
  padding: 10px;

  a {
    color: var(--text);
    font-weight: 700;
    text-decoration: none;
  }

  p {
    margin-top: 4px;
    color: var(--muted);
    font-size: 0.92rem;
  }
`

export default ResourceWidget
