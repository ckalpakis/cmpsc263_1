/* Dashboard page showing account status, task summary, and live external API widgets. */
import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import Link from 'next/link'
import AppLayout from '@/components/Layout/AppLayout'
import WeatherWidget from '@/components/Dashboard/WeatherWidget'
import ResourceWidget from '@/components/Dashboard/ResourceWidget'
import { useStateContext } from '@/context/StateContext'
import { getAssignments } from '@/backend/Database'

const Dashboard = () => {
  const router = useRouter()
  const { user, authReady } = useStateContext()
  const [assignments, setAssignments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authReady) {
      return
    }

    if (!user) {
      router.replace('/auth/login')
      return
    }

    let isMounted = true

    async function loadAssignments() {
      setIsLoading(true)
      try {
        const records = await getAssignments(user.uid)
        if (isMounted) {
          setAssignments(records)
        }
      } catch (error) {
        if (isMounted) {
          setAssignments([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadAssignments()

    return () => {
      isMounted = false
    }
  }, [authReady, router, user])

  if (!authReady || !user) {
    return null
  }

  const stats = useMemo(() => {
    const completed = assignments.filter((item) => item.completed).length
    const upcoming = assignments.filter((item) => !item.completed).length

    return [
      { label: 'Assignments', value: isLoading ? '...' : String(assignments.length) },
      { label: 'Open tasks', value: isLoading ? '...' : String(upcoming) },
      { label: 'Completed', value: isLoading ? '...' : String(completed) },
      { label: 'Storage', value: 'Firestore' },
    ]
  }, [assignments, isLoading])

  return (
    <AppLayout
      eyebrow='Dashboard'
      title='A daily command center for your workload.'
      description='Track assignment volume, check live planning signals, and move directly into task management. This page demonstrates React hooks, shared components, and external API integrations.'
    >
      <StatsGrid>
        {stats.map((item) => (
          <StatCard key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </StatCard>
        ))}
      </StatsGrid>

      <Callout>
        <div>
          <h2>Keep momentum visible</h2>
          <p>Use assignments to capture work, then return here for live context and progress snapshots.</p>
        </div>
        <CalloutLink href='/assignments'>Open Assignments</CalloutLink>
      </Callout>

      <WidgetGrid>
        <WeatherWidget />
        <ResourceWidget />
      </WidgetGrid>
    </AppLayout>
  )
}

const StatsGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
`

const StatCard = styled.article`
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  padding: 16px;

  span {
    display: block;
    color: var(--muted);
    font-size: 0.84rem;
  }

  strong {
    display: block;
    margin-top: 7px;
    font-size: 1.55rem;
  }
`

const Callout = styled.section`
  margin-top: 14px;
  background: linear-gradient(135deg, #fdfbf6 0%, #f5efe5 100%);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  padding: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;

  h2 {
    font-size: 1.05rem;
  }

  p {
    margin-top: 6px;
    color: var(--muted);
  }
`

const CalloutLink = styled(Link)`
  text-decoration: none;
  border: 1px solid var(--accent);
  border-radius: var(--radius-sm);
  background: var(--accent);
  color: #fff;
  padding: 10px 12px;
  font-weight: 600;
`

const WidgetGrid = styled.section`
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 12px;
`

export default Dashboard
