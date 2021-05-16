import store from '../../lib/content-store'
import Date from '../../components/date'
import head from '../../components/head'
import Layout from '../../components/layout'
import styles from '../../styles/utils.module.css'

export default function Post({ content }) {
    return (
        <Layout home={false}>
            {head(content.title)}
            <article>
                <h1>{content.title}</h1>
                <div className={styles.lightText}>
                    <Date dateString={content.date} /> <div>{content.timeToRead} min read</div>
                </div>
                <div dangerouslySetInnerHTML={{ __html: content.contentHtml }} />
            </article>
        </Layout>
    )
}



export async function getStaticPaths() {
    const paths = store.allPublicContent().map(content => {
        return {
            params: {
                path: content.path,
                section: content.section
            }
        }
    });
    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({ params }) {
    const slug = params.path[params.path.length - 1]
    const content = await store.getContent(slug)
    return {
        props: {
            content
        }
    }
}