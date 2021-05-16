import { store } from '../lib/content-store'

import Date from '../components/date'
import head from '../components/head'
import Layout from '../components/layout'
import styles from '../styles/utils.module.css'
import Home from '.'

export default function Post({ node }) {
    if (node.kind === "file") {
        return (
            <Layout home={false}>
                {head(node.content.title)}
                <article>
                    <h1>{node.content.title}</h1>
                    <div className={styles.lightText}>
                        <Date dateString={node.content.date} /> <div>{node.content.timeToRead} min read</div>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: node.content.contentHtml }} />
                </article>
            </Layout>
        )
    }
    if (node.kind === "dir") {
        return <Home root={node} />;
    }
}



export async function getStaticPaths() {
    const urls = store.getAllUrls();
    urls.shift()
    const paths = urls.map(url => {
        return {
            params: {
                path: url.split('/'),
                url: url
            }
        }
    });
    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({ params }) {
    const url = params.path.join("/") + "/";
    const node = store.getNode(url);
    return {
        props: {
            node
        }
    }
}