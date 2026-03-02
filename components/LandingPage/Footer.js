import React from 'react'
import styled from 'styled-components'

const Footer = () => {
  return (
    <FooterSection>
      <FooterContainer>
        <span>© {new Date().getFullYear()} StudyBuddy</span>
        <span>Built for student planning and deadline management.</span>
      </FooterContainer>
    </FooterSection>
  )
}

const FooterSection = styled.footer`
  border-top: 1px solid var(--line);
  margin-top: 32px;
`

const FooterContainer = styled.div`
  width: min(1040px, 100% - 32px);
  margin: 0 auto;
  padding: 18px 0 28px;
  color: var(--muted);
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`

export default Footer
