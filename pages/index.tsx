import store from '../lib/content-store'
import Link from 'next/link'
import Date from '../components/date'
import Layout from '../components/layout'
import head from '../components/head'
import styles from '../styles/utils.module.css'

export default function Home({ content }) {
  return (
    <Layout home>
      {head(null)}
      <section className={`${styles.headingMd}`}>
        <ul className={styles.list}>
          {content.map((content) => (
            <li className={styles.listItem} key={content.slug}>
              <Link href={content.url}>
                <a>{content.title}</a>
              </Link>
              <br />
              <small className={styles.lightText}>
                <Date dateString={content.date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}


export async function getStaticProps() {
  const content = store.allPublicContent()
  return {
    props: {
      content
    }
  }
}
