import Head from 'next/head'
import config from '../blog-config.json'

export default function head(post_title: string) {
    const title = post_title ? post_title : config.author;
    const rss_link = config.baseUrl.replace(/\/+$/, '') + "/index.xml"
    
    return <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>{title}</title>
        <meta name="charset" content="utf-8" />
        <meta name="author" content={config.author} />
        <meta name="description" content={config.description} />

        <link href={rss_link} rel="alternate" type="application/rss+xml" title={config.description} />
    </Head>
}