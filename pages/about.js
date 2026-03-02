/* About page summarizing the stack, architecture decisions, and rubric-aligned feature set. */
import React from 'react'
import styled from 'styled-components'
import AppLayout from '@/components/Layout/AppLayout'
import { useStateContext } from '@/context/StateContext'

const sections = [
  'Frontend: multi-page Next.js app with reusable React components, hooks, and styled-components UI.',
  'Authentication: Firebase Auth when configured, with a built-in demo fallback for local demos and grading.',
  'Database: Firestore-backed assignment CRUD with a local persistence fallback to keep the workflow working.',
  'External APIs: Open-Meteo weather data and Open Library study resource search are displayed on the dashboard.',
]

const About = () => {
  const { authMode } = useStateContext()

  return (
    <AppLayout
      eyebrow='Project Overview'
      title='Built to satisfy the full-stack course rubric.'
      description='This page is presentation-ready documentation for the project. It explains the architecture choices and why the product is organized the way it is.'
      actions={<ModePill>{authMode === 'firebase' ? 'Firebase active' : 'Demo-safe fallback enabled'}</ModePill>}
    >
      <List>
        {sections.map((item) => (
          <ListItem key={item}>{item}</ListItem>
        ))}
      </List>
    </AppLayout>
  )
}

const ModePill = styled.span`
  border: 1px solid var(--line);
  background: var(--bg-soft);
  color: var(--muted);
  border-radius: 999px;
  padding: 7px 10px;
  font-size: 0.8rem;
`

const List = styled.section`
  display: grid;
  gap: 12px;
`

const ListItem = styled.article`
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  padding: 16px;
  color: var(--text);
`

export default About
