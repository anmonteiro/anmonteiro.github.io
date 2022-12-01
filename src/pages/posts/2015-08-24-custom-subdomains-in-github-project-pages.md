---
layout: post
title: Custom subdomains in GitHub project pages
categories: git
tags: git GitHub
---

If you host your website, blog or project pages in [GitHub Pages](https://pages.github.com/), you might already be rolling your own [custom domain](https://help.github.com/articles/setting-up-a-custom-domain-with-github-pages/). However, while there is plenty of information on how to set that up, what you might not know is that you can also set up a custom subdomain for your project pages.

<!--more-->
<p class="message"><strong>Note:</strong> when you use your own domain (e.g. <code>mydomain.com</code>) with GitHub Pages, you get your project pages under that domain for free (e.g. <code>myusername.github.io/pjname</code> will also be available under <code>mydomain.com/pjname</code>)</p>

So, if you'd like to publish your project page under `pjname.mydomain.com`, even though it will live under `mydomain.com/pjname` anyway, but you might just prefer it this way), simply follow these steps:

1. [Add a CNAME file](https://help.github.com/articles/adding-a-cname-file-to-your-repository/) to your project's repository. The content of this file must be a single line specifying the bare subdomain for your project's custom subdomain (e.g. `pjname.mydomain.com`).
2. In your DNS provider's settings, create a new CNAME record that points `pjname` to either the root (usually denoted by `@`), if you have previously set up an [apex domain](https://help.github.com/articles/about-custom-domains-for-github-pages-sites/#apex-domains), or to `myusername.github.io` if you've set up a [custom subdomain](https://help.github.com/articles/about-custom-domains-for-github-pages-sites/#subdomains). It should look something like this:

<img title="DNS CNAME records" src="https://cloud.githubusercontent.com/assets/661909/10079183/f59da364-62e8-11e5-9f48-da75657059f6.png">

And that's it! After a few moments the changes should take effect. Thanks for reading!

If you have any questions or suggestions, be sure to reach me on [Twitter](https://twitter.com/{{ site.author.twitter_username }}).
