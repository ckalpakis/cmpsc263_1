import React from 'react'
import styled from 'styled-components'
import Navbar from '@/components/Dashboard/Navbar'

const AppLayout = ({ title, eyebrow, description, children, actions }) => {
  return (
    <PageShell>
      <Navbar />
      <Main>
        <Header>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <TitleRow>
            <Title>{title}</Title>
            {actions}
          </TitleRow>
          {description && <Description>{description}</Description>}
        </Header>
        {children}
      </Main>
    </PageShell>
  )
}

const PageShell = styled.div`
  min-height: 100vh;
`

const Main = styled.main`
  width: min(1040px, 100% - 32px);
  margin: 0 auto;
  padding: 30px 0 48px;
  animation: fadeUp 280ms ease;
`

const Header = styled.header`
  margin-bottom: 18px;
`

const Eyebrow = styled.p`
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
`

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 10px;
`

const Title = styled.h1`
  font-family: 'Newsreader', Georgia, serif;
  font-size: clamp(2rem, 4.8vw, 3rem);
  line-height: 1.05;
`

const Description = styled.p`
  margin-top: 10px;
  max-width: 760px;
  color: var(--muted);
`

export default AppLayout
