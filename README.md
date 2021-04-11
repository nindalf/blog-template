# [Next.js](https://nextjs.org/) Blog template

This template generates a blog backed by static content. I currently use it to generate [my blog](https://blog.nindalf.com). If you'd looking for a simple template that you can customise to suit your needs, this is a strong candidate.

## Getting started

This template can be used in two ways

1. Fork this repo. Add posts in the posts directory. Fill in the config in `blog-config.json`. `npm install && npm run build` generates static HTML files in the `out` directory. 
2. If you already have a repo containing content in markdown files, pull this repo in as a git submodule, similar to [this example](https://github.com/nindalf/blog-template-example). `./deploy.sh` generates the same static HTML files.

You can serve this with nginx, Apache or any CDN like Cloudflare. 

## Acknowledgements

* This basic structure comes from [this tutorial](https://nextjs.org/learn/basics/), where the end result looks like [this](https://next-learn-starter.now.sh)
* CSS from [Sakura](https://github.com/oxalorg/sakura)
