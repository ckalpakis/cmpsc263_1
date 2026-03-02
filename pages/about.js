/* About page summarizing the stack, architecture decisions, and rubric-aligned feature set. */
import React from 'react'
import styled from 'styled-components'
import AppLayout from '@/components/Layout/AppLayout'

const sections = [
  'Frontend: multi-page Next.js app with reusable React components, hooks, and styled-components UI.',
  'Authentication: Firebase Email/Password authentication powers signup, login, and logout.',
  'Database: Firestore-backed assignment CRUD stores data per authenticated user.',
  'External APIs: Open-Meteo weather data and Open Library study resource search are displayed on the dashboard.',
]

const About = () => {
  return (
    <AppLayout
      eyebrow='Project Overview'
      title='Built to satisfy the full-stack course rubric.'
      description='This page is presentation-ready documentation for the project. It explains the architecture choices and why the product is organized the way it is.'
    >
      <List>
        {sections.map((item) => (
          <ListItem key={item}>{item}</ListItem>
        ))}
      </List>
    </AppLayout>
  )
}

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
