"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var fs_1 = __importDefault(require("fs"));
var posts_1 = require("./posts");
var blog_config_json_1 = __importDefault(require("../blog-config.json"));
var date_fns_1 = require("date-fns");
function writeFeedToDisk() {
    var feed = generateRSSFeed();
    fs_1["default"].writeFileSync('./out/index.xml', feed);
}
function generateRSSFeed() {
    var items = generateRSSItems();
    var lastBuildDate = getLastBuildDate();
    var url = blog_config_json_1["default"].baseUrl.replace(/\/+$/, '');
    return "<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\"?>\n<rss version=\"2.0\" xmlns:atom=\"http://www.w3.org/2005/Atom\">\n    <channel>\n        <title>" + blog_config_json_1["default"].description + "</title>\n        <link>" + url + "</link>\n        <description>Recent content on " + blog_config_json_1["default"].description + "</description>\n        <language>en-us</language>\n        <lastBuildDate>" + lastBuildDate + "</lastBuildDate>\n        <atom:link href=\"" + url + "/index.xml\" rel=\"self\" type=\"application/rss+xml\" />\n        " + items + "\n    </channel>\n</rss>\n";
}
function generateRSSItems() {
    var posts = posts_1.getFinalPostsMetadata();
    return posts.map(function (post) {
        var postData = posts_1.getPostContent(post.id);
        var url = blog_config_json_1["default"].baseUrl.replace(/\/+$/, '') + '/posts/' + post.id;
        return "\n        <item>\n            <title>" + post['title'] + "</title>\n            <link>" + url + "</link>\n            <pubDate>" + convertDate(post['date']) + "</pubDate>\n            <guid>" + url + "</guid>\n            <description>" + postData.preview + "</description>\n        </item>";
    }).join('\n');
}
function getLastBuildDate() {
    var posts = posts_1.getFinalPostsMetadata();
    return convertDate(posts[0]['date']);
}
function convertDate(dateString) {
    var date = date_fns_1.parseISO(dateString);
    // formate from https://cyber.harvard.edu/rss/rss.html#optionalChannelElements
    return date_fns_1.format(date, 'iii, dd LLL yyyy HH:mm:ss xx');
}
writeFeedToDisk();
