import store from '../../lib/content-store'
import Home from '../index'

export default function HomeByTag({ contents }) {
    return <Home content={contents} />
}


export async function getStaticPaths() {
    const paths = store.allTags().map(tag => {
        return {
            params: {
                tag: tag
            }
        };
    });
    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({ params }) {
    const contents = store.allPublicContentByTag(params.tag)
    return {
        props: {
            contents
        }
    }
}
