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

const baseDirectory = ospath.join(process.cwd(), config.postsDirectory)

export function constructTree(): DirNode {
    let root: DirNode = {
        kind: "dir",
        url: "/",
        children: []
    };
    root.children = fetchDirectoryDetails(baseDirectory);
    return root;
}

export type FsNode = DirNode | FileNode;

export interface DirNode {
    kind: "dir";
    url: string;
    children: FsNode[];
}

export interface FileNode {
    kind: "file";
    url: string;
    content: Content;
}

export interface Content {
    date: string,
    title: string,
    tags: string[],
    draft: boolean,
    private: boolean,
    skip_byline: boolean,
    contentHtml: string,
    contentText: string,
    wordCount: number,
    timeToRead: number,
    preview: string,
}

function createDirectoryNode(url: string, path: string): DirNode {
    const node: DirNode = {
        kind: "dir",
        url: url,
        children: [],
    }
    node.children = fetchDirectoryDetails(path);
    if (node.children.length === 0) {
        return null
    }
    return node;
}

function fetchDirectoryDetails(path: string): FsNode[] {
    const children = fs.readdirSync(path)
        .map(item => ospath.join(path, item))
        .map(path => {
            const url = ospath.relative(baseDirectory, path).replace(/\.md$/, '') + ospath.sep;
            const stat = fs.statSync(path)
            if (stat.isFile() && path.endsWith(".md")) {
                return createFileNode(url, path);
            }
            if (stat.isDirectory()) {
                return createDirectoryNode(url, path);
            }
            return null;
        })
        .filter(node => node !== null);
    children
        .sort((a: FsNode, b: FsNode) => {
            if (a.kind === "dir" && b.kind === "dir") {
                return a.url.localeCompare(b.url)
            }
            if (a.kind === "dir") {
                return 1;
            }
            if (b.kind === "dir") {
                return -1;
            }
            if (a.kind === "file" && b.kind === "file") {
                return b.content.date.localeCompare(a.content.date);
            }
            return 0;
        });
    return children;
}

function createFileNode(url: string, path: string): FileNode {
    const node: FileNode = {
        kind: "file",
        url: url,
        content: null,
    }
    node.content = fetchFileDetails(path);
    if (node.content.draft || node.content.private || !node.content.date) {
        return null;
    }
    return node;
}

function fetchFileDetails(path: string): Content {
    const fileContents = fs.readFileSync(path, 'utf8');
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
        date: matterResult.data['date'],
        title: matterResult.data['title'],
        tags: matterResult.data['tags'] || [],
        draft: matterResult.data['draft'] || false,
        private: matterResult.data['private'] || false,
        skip_byline: matterResult.data['skip_byline'] || false,
        contentHtml: contentHtml,
        contentText: contentText,
        wordCount: wordCount,
        timeToRead: timeToRead,
        preview: preview,
    }
}
