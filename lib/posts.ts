import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import headings from 'remark-autolink-headings'
import prism from 'remark-prism';
import html from 'remark-html'
import slug from 'remark-slug'
import strip from 'remark-strip-html'
import config from '../blog-config.json'

const postsDirectory = path.join(process.cwd(), config.postsDirectory)

function allPostsMetadata() {
    // Get file names under /posts
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map(fileName => {
        // Remove ".md" from file name to get id
        const id = fileName.replace(/\.md$/, '');

        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);

        // Combine the data with the id
        return {
            id,
            ...matterResult.data
        };
    })
    // Sort posts by date
    return allPostsData.sort((a, b) => {
        if (a['date'] < b['date']) {
            return 1
        } else {
            return -1
        }
    });
}

export function getDraftPostsMetadata() {
    return allPostsMetadata().filter(post => {
        return post.hasOwnProperty('draft') && post['draft'] === true;
    });
}

export function getFinalPostsMetadata() {
    return allPostsMetadata().filter(post => {
        return !post.hasOwnProperty('draft') || (post.hasOwnProperty('draft') && post['draft'] === false);
    });
}

export function getFinalPostsMetadataByTag(tag: string) {
    return getFinalPostsMetadata().filter(post => {
        return post["tags"] && post["tags"].includes(tag);
    });
}

export function getAllTags() {
    return Array.from(new Set(getFinalPostsMetadata()
        .map(post => post["tags"])
        .flat()
        .filter(tag => tag !== null && tag !== undefined)
    ));
}


export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory);

    // Returns an array that looks like this:
    // [
    //   {
    //     params: {
    //       id: 'ssg-ssr'
    //     }
    //   },
    //   {
    //     params: {
    //       id: 'pre-rendering'
    //     }
    //   }
    // ]
    return fileNames.map(fileName => {
        return {
            params: {
                id: fileName.replace(/\.md$/, '')
            }
        }
    });
}

export function getPostContent(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);
    const contentHtml = remark()
        .use(slug)
        .use(headings)
        .use(html)
        .use(prism)
        .processSync(matterResult.content)
        .toString();

    const plainText = String(remark()
        .use(strip)
        .processSync(contentHtml));
    const wordCount = plainText.split(/\s+/).length;
    const timeToRead = Math.ceil(wordCount / config.readingSpeedPerMin);
    const preview = plainText.split('\n')[0];

    // Combine the data with the id
    return {
        id,
        wordCount,
        timeToRead,
        contentHtml,
        preview,
        ...matterResult.data
    };
}
