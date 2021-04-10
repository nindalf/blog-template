import { getAllPostIds, getPostData } from '../../lib/posts'
import Date from '../../components/date'
import head from '../../components/head'
import Layout from '../../components/layout'
import utilStyles from '../../styles/utils.module.css'

export default function Post({ postData }) {
    return (
        <Layout home={false}>
            {head(postData.title)}
            <article>
                <h1>{postData.title}</h1>
                <div className={utilStyles.lightText}>
                    <Date dateString={postData.date} /> <div>{postData.timeToRead} min read</div>
                </div>
                <div dangerouslySetInnerHTML={{ __html: postData.contentHtml}} />
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
    const postData = await getPostData(params.id)
    return {
        props: {
            postData
        }
    }
}