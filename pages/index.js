/* Landing page introducing the StudyBuddy product, primary navigation, and feature highlights. */
import Link from 'next/link'
import styled from 'styled-components'
import AppLayout from '@/components/Layout/AppLayout'
import { useStateContext } from '@/context/StateContext'

const features = [
  {
    title: 'Planner-first UX',
    text: 'Designed for deadlines, study sessions, and class planning instead of generic docs.',
  },
  {
    title: 'Real auth flow',
    text: 'Users sign up and sign in with Firebase Authentication for a real account experience.',
  },
  {
    title: 'Persistent assignments',
    text: 'Assignments are stored in Cloud Firestore so work stays tied to each signed-in user.',
  },
  {
    title: 'Live API widgets',
    text: 'The dashboard pulls in weather and study resources from external APIs to support planning decisions.',
  },
]

export default function Home() {
  const { user } = useStateContext()

  return (
    <AppLayout
      eyebrow='Student productivity workspace'
      title='A focused planner for classes, deadlines, and daily execution.'
      description='StudyBuddy is a full-stack student planning app built with Next.js, React, Node, and Firebase services. It combines account management, live data, and task tracking in one clean workspace.'
    >
      <HeroSection>
        <ButtonRow>
          <PrimaryLink href='/dashboard'>Open Dashboard</PrimaryLink>
          <SecondaryLink href='/assignments'>Manage Assignments</SecondaryLink>
          {!user && <SecondaryLink href='/auth/signup'>Create Account</SecondaryLink>}
        </ButtonRow>
      </HeroSection>

      <Grid>
        {features.map((feature, index) => (
          <FeatureCard key={feature.title} style={{ animationDelay: `${index * 70}ms` }}>
            <h2>{feature.title}</h2>
            <p>{feature.text}</p>
          </FeatureCard>
        ))}
      </Grid>
    </AppLayout>
  )
}

const HeroSection = styled.section`
  margin-top: 8px;
`

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`

const BaseLink = styled(Link)`
  text-decoration: none;
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  font-weight: 600;
`

const PrimaryLink = styled(BaseLink)`
  background: var(--accent);
  border: 1px solid var(--accent);
  color: #fff;
`

const SecondaryLink = styled(BaseLink)`
  background: var(--surface);
  border: 1px solid var(--line);
  color: var(--text);
`

const Grid = styled.section`
  margin-top: 22px;
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`

const FeatureCard = styled.article`
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  padding: 18px;
  animation: fadeUp 320ms ease both;

  h2 {
    font-size: 1.02rem;
  }

  p {
    margin-top: 8px;
    color: var(--muted);
    font-size: 0.95rem;
  }
`
