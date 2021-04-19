import { getFinalPostsMetadataByTag, getAllTags } from '../../lib/posts'
import Home from '../index'

export default function HomeByTag({ allPostsData }) {
    return <Home allPostsData={allPostsData} />
}


export async function getStaticPaths() {
    const paths = getAllTags().map(tag => {
        return { 'params': { 'id': tag } };
    });
    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({ params }) {
    const allPostsData = getFinalPostsMetadataByTag(params.id)
    return {
        props: {
            allPostsData
        }
    }
}
