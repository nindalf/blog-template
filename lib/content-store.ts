import fs from 'fs'
import * as ospath from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import headings from 'remark-autolink-headings'
import prism from 'remark-prism';
import html from 'remark-html'
import remark_slug from 'remark-slug'
import strip from 'remark-strip-html'
import config from '../blog-config.json'
import recursive from 'recursive-readdir'

interface Content {
    url: string,
    slug: string,
    section: string,
    path: string[],
    date: string,
    title: string,
    tags: string[],
    draft: boolean,
    private: boolean,
    contentHtml: string,
    contentText: string,
    wordCount: number,
    timeToRead: number,
    preview: string,
}

class ContentStore {
    contents: Record<string, Content>
    sortedContents: Content[]

    constructor() {
        this.contents = {};
        this.sortedContents = [];
    }

    async init() {
        const contentDirectory = ospath.join(process.cwd(), config.postsDirectory)
        const files = await recursive(contentDirectory);
        this.sortedContents = files
            .map(file => getContentFromFile(contentDirectory, file))
            .sort((a, b) => {
                if (a.date < b.date) {
                    return 1
                } else {
                    return -1
                }
            });

        this.contents = this.sortedContents.reduce(function (acc, cur, i) {
            acc[cur.slug] = cur;
            return acc;
        }, {});;
    }

    allPublicContent(): Content[] {
        return this.sortedContents
            .filter(content => content.draft === false && content.private === false);
    }

    allTags(): string[] {
        return Array.from(new Set(this.allPublicContent()
            .map(content => content.tags)
            .flat()
        ));
    }

    allPublicContentByTag(tag): Content[] {
        return this.allPublicContent().filter(content => {
            return content.tags.includes(tag);
        });
    }

    getContent(slug: string): Content {
        return this.contents[slug];
    }
}

function getContentFromFile(contentDirectory: string, filepath: string): Content {
    const url = ospath.relative(contentDirectory, filepath).replace(/\.md$/, '');
    const urlParts = url.split('/');

    const section = urlParts[0];
    const path = urlParts.slice(1, urlParts.length);
    const slug = urlParts[urlParts.length - 1];

    const fileContents = fs.readFileSync(filepath, 'utf8');
    const matterResult = matter(fileContents);
    const contentHtml = remark()
        .use(remark_slug)
        .use(headings)
        .use(html)
        .use(prism)
        .processSync(matterResult.content)
        .toString();

    const contentText = String(remark()
        .use(strip)
        .processSync(contentHtml));

    const wordCount = contentText.split(/\s+/).length;
    const timeToRead = Math.ceil(wordCount / config.readingSpeedPerMin);
    const preview = contentText.split('\n')[0];

    return {
        url: url,
        slug: slug,
        section: section,
        path: path,
        date: matterResult.data['date'],
        title: matterResult.data['title'],
        tags: matterResult.data['tags'] || [],
        draft: matterResult.data['draft'] || false,
        private: matterResult.data['private'] || false,
        contentHtml: contentHtml,
        contentText: contentText,
        wordCount: wordCount,
        timeToRead: timeToRead,
        preview: preview,
    }
}

const store = new ContentStore();
await store.init()
export default store;
