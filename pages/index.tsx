import { getFinalPostsData } from '../lib/posts'
import Link from 'next/link'
import Date from '../components/date'
import Layout from '../components/layout'
import head from '../components/head'
import styles from '../styles/utils.module.css'

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      {head(null)}
      <section className={`${styles.headingMd}`}>
        <ul className={styles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={styles.listItem} key={id}>
              <Link href="/posts/[id]" as={`/posts/${id}`}>
                {title}
              </Link>
              <br />
              <small className={styles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}


export async function getStaticProps() {
  const allPostsData = getFinalPostsData()
  return {
    props: {
      allPostsData
    }
  }
}
