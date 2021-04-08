import Head from 'next/head'
import styles from './layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'

const name = 'Krishna Sundarram'
export const siteTitle = 'Next.js Sample Blog'

export default function Layout({ children, home }) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header className={styles.header}>
        {home ? (
          <>
            <img
              src="/images/profile.jpg"
              className={`${styles.headerHomeImage} ${utilStyles.borderCircle}`}
              alt={name}
            />
            <h1 className={utilStyles.heading2Xl}>{name}</h1>
          </>
        ) : (
          <>
            <ul className={utilStyles.headingLg}>
              <li className={utilStyles.headingLg}><Link href="/">
                <a className={utilStyles.colorInherit}>Home</a>
              </Link></li>
              <li className={utilStyles.headingLg}><Link href="/about">
                <a className={utilStyles.colorInherit}>About</a>
              </Link></li>
            </ul>
          </>
        )}
      </header>
      <main>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">
            <a>← Home</a>
          </Link>
        </div>
      )}
    </div>
  )
}
