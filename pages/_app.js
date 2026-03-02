import Head from 'next/head'
import { StateContext } from '@/context/StateContext'
import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Newsreader:opsz,wght@6..72,500&display=swap');

  :root {
    --bg: #f6f3ec;
    --bg-soft: #fbfaf7;
    --surface: #ffffff;
    --line: #e5ded2;
    --text: #2f2d28;
    --muted: #6c685f;
    --accent: #2f3437;
    --accent-soft: #4a4f53;
    --success: #256f48;
    --danger: #b43f3f;
    --radius-lg: 16px;
    --radius-md: 12px;
    --radius-sm: 8px;
    --shadow-soft: 0 1px 2px rgba(21, 20, 17, 0.06), 0 8px 24px rgba(21, 20, 17, 0.05);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html,
  body,
  #__next {
    min-height: 100%;
  }

  body {
    font-family: 'Instrument Sans', 'Segoe UI', sans-serif;
    color: var(--text);
    background:
      radial-gradient(circle at 12% 8%, rgba(255, 255, 255, 0.78), transparent 34%),
      radial-gradient(circle at 92% 2%, rgba(245, 242, 233, 0.8), transparent 28%),
      linear-gradient(180deg, #f8f6f1 0%, var(--bg) 100%);
    line-height: 1.55;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  a {
    color: inherit;
  }

  button,
  input,
  textarea {
    font: inherit;
  }

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>StudyBuddy</title>
        <meta name='description' content='StudyBuddy helps students organize work and stay on top of deadlines.' />
        <meta name='robots' content='index, follow' />
        <meta name='theme-color' content='#f6f3ec' />
      </Head>

      <GlobalStyle />

      <StateContext>
        <Component {...pageProps} />
      </StateContext>
    </>
  )
}
