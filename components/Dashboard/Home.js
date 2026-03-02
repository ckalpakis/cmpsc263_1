import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'

const HomeShortcut = () => {
  return <Shortcut href='/dashboard'>Go to dashboard</Shortcut>
}

const Shortcut = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text);
  text-decoration: none;
  font-weight: 600;
`

export default HomeShortcut
