import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'

const AuthFormCard = ({
  mode,
  email,
  password,
  error,
  isSubmitting,
  helperText,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}) => {
  const isLogin = mode === 'login'

  return (
    <Shell>
      <Card>
        <Badge>{isLogin ? 'Welcome back' : 'Create account'}</Badge>
        <Header>{isLogin ? 'Sign in to StudyBuddy' : 'Create your StudyBuddy account'}</Header>
        <BodyText>{helperText}</BodyText>

        <Form onSubmit={onSubmit}>
          <Field>
            <Label>Email</Label>
            <Input
              id='email'
              type='email'
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder='student@example.com'
              required
            />
          </Field>

          <Field>
            <Label>Password</Label>
            <Input
              id='password'
              type='password'
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder='At least 6 characters'
              required
            />
          </Field>

          {error && <ErrorText>{error}</ErrorText>}

          <ButtonRow>
            <PrimaryButton type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </PrimaryButton>
            <SecondaryLink href='/dashboard'>Continue as Guest</SecondaryLink>
          </ButtonRow>
        </Form>

        <SmallText>
          {isLogin ? 'New here?' : 'Already have an account?'}{' '}
          <InlineLink href={isLogin ? '/auth/signup' : '/auth/login'}>
            {isLogin ? 'Create an account' : 'Sign in'}
          </InlineLink>
        </SmallText>
      </Card>
    </Shell>
  )
}

const Shell = styled.section`
  min-height: calc(100vh - 69px);
  display: grid;
  place-items: center;
  padding: 24px 0;
`

const Card = styled.section`
  width: min(560px, 100%);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  padding: 22px;
`

const Badge = styled.p`
  display: inline-block;
  padding: 5px 8px;
  border-radius: 999px;
  border: 1px solid var(--line);
  color: var(--muted);
  background: var(--bg-soft);
  font-size: 0.76rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

const Header = styled.h1`
  margin-top: 10px;
  font-family: 'Newsreader', Georgia, serif;
  font-size: clamp(1.95rem, 4vw, 2.5rem);
`

const BodyText = styled.p`
  margin-top: 10px;
  color: var(--muted);
`

const Form = styled.form`
  margin-top: 18px;
  display: grid;
  gap: 12px;
`

const Field = styled.label`
  display: grid;
  gap: 6px;
`

const Label = styled.span`
  font-size: 0.9rem;
  color: var(--muted);
`

const Input = styled.input`
  width: 100%;
  font: inherit;
  padding: 11px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--line);
  background: var(--bg-soft);

  &:focus {
    outline: none;
    border-color: #bdb09a;
    background: #fff;
  }
`

const ErrorText = styled.p`
  color: var(--danger);
  font-size: 0.92rem;
`

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`

const PrimaryButton = styled.button`
  border: 1px solid var(--accent);
  background: var(--accent);
  color: #fff;
  border-radius: var(--radius-sm);
  padding: 10px 13px;
  font: inherit;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }
`

const SecondaryLink = styled(Link)`
  text-decoration: none;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text);
  border-radius: var(--radius-sm);
  padding: 10px 13px;
  font-weight: 600;
`

const SmallText = styled.p`
  margin-top: 14px;
  color: var(--muted);
`

const InlineLink = styled(Link)`
  color: var(--text);
  font-weight: 600;
`

export default AuthFormCard
