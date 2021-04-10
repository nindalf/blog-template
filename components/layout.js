import styles from './layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'

export const siteTitle = 'Next.js Sample Blog'

export default function Layout({ children, home }) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
          <>
            <ul className={utilStyles.headingLg}>
              <li className={utilStyles.headingLg}>
                <Link href="/">
                  <a className={utilStyles.colorInherit}>Home</a>
                </Link>
              </li>
              <li className={utilStyles.headingLg}>
                <Link href="/about">
                  <a className={utilStyles.colorInherit}>About</a>
                </Link>
              </li>
            </ul>
          </>
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
