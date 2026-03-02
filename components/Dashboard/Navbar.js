import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { logOut } from '@/backend/Auth'
import { useStateContext } from '@/context/StateContext'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/assignments', label: 'Assignments' },
  { href: '/about', label: 'About' },
]

const Navbar = () => {
  const router = useRouter()
  const { user, setUser } = useStateContext()

  async function handleLogout() {
    try {
      await logOut(setUser)
      router.push('/')
    } catch (error) {
      console.error('Unable to log out', error)
    }
  }

  return (
    <Shell>
      <Nav>
        <Brand href='/'>StudyBuddy</Brand>

        <LinkRow>
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href} $active={router.pathname === item.href}>
              {item.label}
            </NavLink>
          ))}
        </LinkRow>

        <RightSide>
          {user ? (
            <>
              <UserChip>{user.email}</UserChip>
              <ActionButton type='button' onClick={handleLogout}>
                Log Out
              </ActionButton>
            </>
          ) : (
            <>
              <ActionLink href='/auth/login'>Log In</ActionLink>
              <PrimaryLink href='/auth/signup'>Sign Up</PrimaryLink>
            </>
          )}
        </RightSide>
      </Nav>
    </Shell>
  )
}

const Shell = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(6px);
  background: rgba(248, 246, 241, 0.9);
  border-bottom: 1px solid var(--line);
`

const Nav = styled.nav`
  width: min(1120px, 100% - 32px);
  margin: 0 auto;
  min-height: 68px;
  display: flex;
  align-items: center;
  gap: 12px;
`

const Brand = styled(Link)`
  text-decoration: none;
  font-size: 1.08rem;
  font-weight: 700;
  color: var(--text);
  margin-right: 4px;
`

const LinkRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 0;

  &::-webkit-scrollbar {
    display: none;
  }
`

const NavLink = styled(Link)`
  text-decoration: none;
  white-space: nowrap;
  font-size: 0.92rem;
  color: ${({ $active }) => ($active ? 'var(--text)' : 'var(--muted)')};
  background: ${({ $active }) => ($active ? 'var(--surface)' : 'transparent')};
  border: 1px solid ${({ $active }) => ($active ? 'var(--line)' : 'transparent')};
  border-radius: var(--radius-sm);
  padding: 8px 10px;

  &:hover {
    background: var(--surface);
    border-color: var(--line);
    color: var(--text);
  }
`

const RightSide = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
`

const UserChip = styled.span`
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.85rem;
  color: var(--muted);
`

const BaseAction = `
  text-decoration: none;
  border-radius: var(--radius-sm);
  padding: 8px 11px;
  font-size: 0.9rem;
  font-weight: 600;
`

const ActionLink = styled(Link)`
  ${BaseAction}
  color: var(--text);
  border: 1px solid var(--line);
  background: var(--surface);
`

const PrimaryLink = styled(Link)`
  ${BaseAction}
  color: #fff;
  border: 1px solid var(--accent);
  background: var(--accent);
`

const ActionButton = styled.button`
  ${BaseAction}
  color: #fff;
  border: 1px solid var(--accent);
  background: var(--accent);
  cursor: pointer;
`

export default Navbar
