import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'

const Hero = ({ heading = 'Plan your academic week with clarity.', subheading = 'Stay focused with a calmer workflow built for students.' }) => {
  return (
    <Section>
      <Heading>{heading}</Heading>
      <Subheading>{subheading}</Subheading>
      <ActionLink href='/dashboard'>Open dashboard</ActionLink>
    </Section>
  )
}

const Section = styled.section`
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--surface);
  box-shadow: var(--shadow-soft);
  padding: 20px;
`

const Heading = styled.h1`
  font-family: 'Newsreader', Georgia, serif;
  font-size: clamp(2rem, 4vw, 2.6rem);
`

const Subheading = styled.p`
  margin-top: 10px;
  color: var(--muted);
`

const ActionLink = styled(Link)`
  display: inline-block;
  margin-top: 14px;
  text-decoration: none;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: var(--accent);
  color: #fff;
  font-weight: 600;
`

export default Hero
