"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.getPostContent = exports.getAllPostIds = exports.getAllTags = exports.getFinalPostsMetadataByTag = exports.getFinalPostsMetadata = exports.getDraftPostsMetadata = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var gray_matter_1 = __importDefault(require("gray-matter"));
var remark_1 = __importDefault(require("remark"));
var remark_prism_1 = __importDefault(require("remark-prism"));
var remark_html_1 = __importDefault(require("remark-html"));
var remark_strip_html_1 = __importDefault(require("remark-strip-html"));
var blog_config_json_1 = __importDefault(require("../blog-config.json"));
var postsDirectory = path_1["default"].join(process.cwd(), blog_config_json_1["default"].postsDirectory);
function allPostsMetadata() {
    // Get file names under /posts
    var fileNames = fs_1["default"].readdirSync(postsDirectory);
    var allPostsData = fileNames.map(function (fileName) {
        // Remove ".md" from file name to get id
        var id = fileName.replace(/\.md$/, '');
        // Read markdown file as string
        var fullPath = path_1["default"].join(postsDirectory, fileName);
        var fileContents = fs_1["default"].readFileSync(fullPath, 'utf8');
        // Use gray-matter to parse the post metadata section
        var matterResult = gray_matter_1["default"](fileContents);
        // Combine the data with the id
        return __assign({ id: id }, matterResult.data);
    });
    // Sort posts by date
    return allPostsData.sort(function (a, b) {
        if (a['date'] < b['date']) {
            return 1;
        }
        else {
            return -1;
        }
    });
}
function getDraftPostsMetadata() {
    return allPostsMetadata().filter(function (post) {
        return post.hasOwnProperty('draft') && post['draft'] === true;
    });
}
exports.getDraftPostsMetadata = getDraftPostsMetadata;
function getFinalPostsMetadata() {
    return allPostsMetadata().filter(function (post) {
        return !post.hasOwnProperty('draft') || (post.hasOwnProperty('draft') && post['draft'] === false);
    });
}
exports.getFinalPostsMetadata = getFinalPostsMetadata;
function getFinalPostsMetadataByTag(tag) {
    return getFinalPostsMetadata().filter(function (post) {
        return post["tags"] && post["tags"].includes(tag);
    });
}
exports.getFinalPostsMetadataByTag = getFinalPostsMetadataByTag;
function getAllTags() {
    return Array.from(new Set(getFinalPostsMetadata()
        .map(function (post) { return post["tags"]; })
        .flat()
        .filter(function (tag) { return tag !== null && tag !== undefined; })));
}
exports.getAllTags = getAllTags;
function getAllPostIds() {
    var fileNames = fs_1["default"].readdirSync(postsDirectory);
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
    return fileNames.map(function (fileName) {
        return {
            params: {
                id: fileName.replace(/\.md$/, '')
            }
        };
    });
}
exports.getAllPostIds = getAllPostIds;
function getPostContent(id) {
    var fullPath = path_1["default"].join(postsDirectory, id + ".md");
    var fileContents = fs_1["default"].readFileSync(fullPath, 'utf8');
    // Use gray-matter to parse the post metadata section
    var matterResult = gray_matter_1["default"](fileContents);
    var contentHtml = remark_1["default"]()
        .use(remark_html_1["default"])
        .use(remark_prism_1["default"])
        .processSync(matterResult.content)
        .toString();
    var plainText = String(remark_1["default"]()
        .use(remark_strip_html_1["default"])
        .processSync(contentHtml));
    var wordCount = plainText.split(/\s+/).length;
    var timeToRead = Math.ceil(wordCount / blog_config_json_1["default"].readingSpeedPerMin);
    var preview = plainText.split('\n')[0];
    // Combine the data with the id
    return __assign({ id: id,
        wordCount: wordCount,
        timeToRead: timeToRead,
        contentHtml: contentHtml,
        preview: preview }, matterResult.data);
}
exports.getPostContent = getPostContent;
