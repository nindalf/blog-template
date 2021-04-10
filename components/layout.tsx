import styles from '../styles/utils.module.css'
import Link from 'next/link'

export default function Layout({ children, home }) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <>
          <ul className={styles.headingLg}>
            <li className={styles.headingLg}>
              <Link href="/">
                <a>Home</a>
              </Link>
            </li>
            <li className={styles.headingLg}>
              <Link href="/about">
                <a>About</a>
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
