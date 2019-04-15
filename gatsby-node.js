const path = require('path');
const moment = require('moment');
const { createFilePath } = require('gatsby-source-filesystem');

function generateSlug(filename) {
  const parts = filename
    .replace(new RegExp(`${path.extname(filename)}$`, 'g'), '')
    .split('-');
  const [year, month] = parts.splice(0, 3);
  const dashedTitle = parts.join('-');
  return `${year}/${month}/${dashedTitle}`;
}

function transformPostURLs(template) {
  return template.replace(/{%\s*post_url\s+(.+?)\s*%}/gm, (foo, bar) =>
    generateSlug(bar)
  );
}

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === 'MarkdownRemark') {
    let basePath = 'posts';
    if (node.frontmatter.layout === 'page') {
      basePath = 'pages';
    }
    let slug = createFilePath({ node, getNode, basePath });
    let title = node.frontmatter.title;
    let date = node.frontmatter.date;
    if (title === '' || date == null) {
      let nameArr = slug.replace(/\//g, '').split('-');
      date = nameArr.splice(0, 3).join('-');

      if (title == '') {
        title = nameArr.join(' ').replace('.md', '');
      }
    }
    const rawMd = node.rawMarkdownBody;
    node.rawMarkdownBody = transformPostURLs(rawMd);
    const excerpt = node.excerpt;
    node.excerpt = transformPostURLs(excerpt);
    const content = node.internal.content;
    node.internal.content = transformPostURLs(content);

    if (node.frontmatter.layout === 'post') {
      slug = generateSlug(slug);
    }

    createNodeField({
      node,
      name: 'title',
      value: title
    });
    createNodeField({
      node,
      name: 'slug',
      value: slug
    });

    if (node.frontmatter.layout === 'post') {
      const momentDate = moment(date);
      createNodeField({
        node,
        name: 'timestamp',
        value: momentDate.valueOf()
      });
      createNodeField({
        node,
        name: 'date',
        value: momentDate.format('DD MMM YYYY')
      });
      createNodeField({
        node,
        name: 'url',
        value: 'https://anmonteiro.com' + slug
      });
      const tags = node.frontmatter.tags || [];
      createNodeField({
        node,
        name: 'tags',
        value: tags.split(/,|\s+/g)
      });
    }
  }
};

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  return new Promise((resolve, reject) => {
    graphql(`
      fragment RemarkEdges on MarkdownRemarkConnection {
        edges {
          node {
            fields {
              title
              slug
            }
          }
        }
      }
      query {
        posts: allMarkdownRemark(
          sort: { fields: [fileAbsolutePath], order: DESC }
          filter: { frontmatter: { layout: { eq: "post" } } }
          limit: 1000
        ) {
          ...RemarkEdges
        }
        pages: allMarkdownRemark(
          sort: { fields: [fileAbsolutePath], order: DESC }
          filter: { frontmatter: { layout: { eq: "page" } } }
        ) {
          ...RemarkEdges
        }
      }
    `).then(result => {
      const posts = result.data.posts.edges;
      const postsPerPage = 5;
      const numPages = Math.ceil(posts.length / postsPerPage);
      Array.from({ length: numPages }).forEach((_, i) => {
        createPage({
          path: i === 0 ? `/` : `/page${i + 1}`,
          component: path.resolve('./src/templates/homepage.js'),
          context: {
            limit: postsPerPage,
            skip: i * postsPerPage,
            index: i + 1,
            first: i === 0,
            last: i === numPages - 1
          }
        });
      });

      posts.map(({ node }) => {
        createPage({
          path: node.fields.slug,
          component: path.resolve('./src/templates/post.js'),
          context: {
            // Data passed to context is available in page queries as GraphQL variables.
            slug: node.fields.slug
          }
        });
      });

      const pages = result.data.pages.edges;
      pages.map(({ node }) => {
        createPage({
          path: node.fields.slug,
          component: path.resolve('./src/templates/page.js'),
          context: {
            // Data passed to context is available in page queries as GraphQL variables.
            slug: node.fields.slug
          }
        });
      });

      resolve();
    });
  });
};
