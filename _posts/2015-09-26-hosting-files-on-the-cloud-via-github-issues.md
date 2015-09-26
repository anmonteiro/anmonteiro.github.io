---
layout: post
title: Hosting files on the cloud via GitHub Issues
tags: git GitHub
---

Ever wanted to host pictures or other files on GitHub without storing them in a repository? Here's a simple hack which allows us to host our files directly on GitHub's cloud.

<!--more-->

To use this simple approach, we first have to open an issue on any GitHub repository of our choice. Once the issue is open, we simply have to drag a file of our choosing to the comment box, just like in the picture below.

![Drag file to comment box][link1]
[link1]: https://cloud.githubusercontent.com/assets/661909/10117392/c12a9ab0-6455-11e5-96b2-720f8e77759b.png

The file will now be uploaded. While that happens, we get feedback that it is in fact being uploaded via the following message:

![Waiting for upload][link2]
[link2]: https://cloud.githubusercontent.com/assets/661909/10117456/cbc13590-6457-11e5-8b8b-2423d099d38c.png

Then, once the file has finished uploading to GitHub's cloud, the comment box will have updated with either an HTML `img` tag containing the link to an uploaded picture, or a [Markdown link](https://help.github.com/articles/markdown-basics/#links) to the uploaded file (for files other than images). This is how it looks:

![File uploaded][link3]
[link3]:
https://cloud.githubusercontent.com/assets/661909/10117484/c128a37e-6458-11e5-8c63-9fb3444e80ed.png

And that's all. We can now link to our uploaded file from anywhere we want.

Thanks for reading!
