import { getAllPostIds, getPostContent } from '../../lib/posts'
import Date from '../../components/date'
import head from '../../components/head'
import Layout from '../../components/layout'
import styles from '../../styles/utils.module.css'

export default function Post({ postData }) {
    return (
        <Layout home={false}>
            {head(postData.title)}
            <article>
                <h1>{postData.title}</h1>
                <div className={styles.lightText}>
                    <Date dateString={postData.date} /> <div>{postData.timeToRead} min read</div>
                </div>
                <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
            </article>
        </Layout>
    )
}

export async function getStaticPaths() {
    const paths = getAllPostIds()
    return {
        paths,
        fallback: false
    }
}


export async function getStaticProps({ params }) {
    const postData = await getPostContent(params.id)
    return {
        props: {
            postData
        }
    }
}