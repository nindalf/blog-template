import Head from 'next/head'
import config from '../blog-config.json'

export default function head(post_title: string) {
    let title = config.author;
    if (post_title) {
        title = post_title + ' · ' + config.author;
    }
    return <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>{title}</title>
        <meta name="charset" content="utf-8" />
        <meta name="title" content={title} />
        <meta name="author" content={config.author} />
        <meta name="description" content={config.description} />
    </Head>
}