import { DirNode, FsNode, Content, constructTree, FileNode } from './filesystem'

class ContentStore {

    urlToNode: Record<string, FsNode>
    rootNode: DirNode

    constructor() {
        this.rootNode = constructTree();
        this.urlToNode = flattenDirectory(this.rootNode);
    }

    getAllTags(): string[] {
        return Array.from(new Set(Object.values(this.urlToNode)
            .map(node => {
                if (node.kind === 'file') {
                    return node.content.tags;
                }
                return [];
            })
            .flat()
        ));
    }


    getAllUrls(): string[] {
        return Object.keys(this.urlToNode);
    }

    getNodesByTag(tag: string): FileNode[] {
        return Object.values(this.urlToNode)
            .map(node => {
                if (node.kind === 'file') {
                    return node;
                }
                return null;
            })
            .filter(node => node !== null);
    }

    getNode(url: string): FsNode {
        return this.urlToNode[url];
    }

    getFileChildren(url: string): FileNode[] {
        const root = this.urlToNode[url]
        if (root.kind === "dir") {
            return root.children.map(node => {
                if (node.kind === 'file') {
                    return node;
                }
                return null;
            })
                .filter(node => node !== null);
        }
        return [];
    }
}


function flattenDirectory(root: FsNode): Record<string, FsNode> {
    const result = {};
    result[root.url] = root;
    if (root.kind === "dir" && root.children) {
        root.children.map(child => {
            const flattened = flattenDirectory(child);
            Object.assign(result, flattened);
        })
    }
    return result;
}


export let store: ContentStore = null;
if (!store) {
    store = new ContentStore();
}
