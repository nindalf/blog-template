import store from '../lib/content-store'
import Link from 'next/link'
import Date from '../components/date'
import Layout from '../components/layout'
import head from '../components/head'
import styles from '../styles/utils.module.css'
import { DirNode, FileNode } from '../lib/filesystem'
import config from '../blog-config.json'

export default function Home({ root }) {
  return (
    <Layout home>
      {head(null)}
      <section className={`${styles.headingMd}`}>
        <ul className={styles.list}>
          {Directory(root)}
        </ul>
      </section>
    </Layout>
  )
}

export function Directory(root: DirNode) {
  return (
    <div>
      {root.children.map(child => {
        if (child.kind === "dir") {
          const urlParts = child.url.split("/");
          const dirName = urlParts[urlParts.length - 2];
          return <li key={child.url}>
            <details>
              <summary className={styles.listItem}>{dirName}</summary>
              <div className={styles.indent}>
                {Directory(child)}
              </div>
            </details>
          </li>;
        }
        if (child.kind === "file") {
          return StoryListItem(child);
        }
      })}
    </div>
  )
}

export function StoryListItem(item: FileNode) {
  return <li className={styles.listItem} key={item.url}>
    <Link href={item.url}>
      <a>{item.content.title}</a>
    </Link>
    <br />
    <small className={styles.lightText}>
      <Date dateString={item.content.date} />
    </small>
  </li>;
}


export async function getStaticProps() {
  const root = store.getNode(config.root);
  return {
    props: {
      root
    }
  }
}
