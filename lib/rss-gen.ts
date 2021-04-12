import fs from 'fs'
import { getFinalPostsMetaata, getPostContent } from './posts'
import config from '../blog-config.json'
import { parseISO, format } from 'date-fns'

function writeFeedToDisk() {
    const feed = generateRSSFeed();
    fs.writeFileSync('./out/index.xml', feed);
}

function generateRSSFeed() {
    const items = generateRSSItems();
    const lastBuildDate = getLastBuildDate();
    const url = config.baseUrl.replace(/\/+$/, '');
    return `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>${config.description}</title>
        <link>${url}</link>
        <description>Recent content on ${config.description}</description>
        <language>en-us</language>
        <lastBuildDate>${lastBuildDate}</lastBuildDate>
        <atom:link href="${url}/index.xml" rel="self" type="application/rss+xml" />
        ${items}
    </channel>
</rss>
`;

}

function generateRSSItems() {
    const posts = getFinalPostsMetaata();
    return posts.map(post => {
        const postData = getPostContent(post.id);
        const url = config.baseUrl.replace(/\/+$/, '') + '/posts/' + post.id;
        return `
        <item>
            <title>${post['title']}</title>
            <link>${url}</link>
            <pubDate>${convertDate(post['date'])}</pubDate>
            <guid>${url}</guid>
            <description>${postData.preview}</description>
        </item>`;
    }).join('\n');
}

function getLastBuildDate() {
    const posts = getFinalPostsMetaata();
    return convertDate(posts[0]['date']);
}

function convertDate(dateString: string) {
    const date = parseISO(dateString);
    // formate from https://cyber.harvard.edu/rss/rss.html#optionalChannelElements
    return format(date, 'iii, dd LLL yyyy HH:mm:ss xx')
}

writeFeedToDisk();