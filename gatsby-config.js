module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [`PT+Serif\:400,400italic,700`, `PT+Sans\:400`],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`,
      },
    },
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        excerpt_separator: '<!--more-->',
        plugins: [
          { resolve: `gatsby-remark-prismjs` },
          { resolve: `gatsby-plugin-catch-links` },
          // { resolve: 'gatsby-remark-static-images' },
          {
            resolve: `gatsby-remark-images`,
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 590,
            },
          },
        ],
      },
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        // this base query will be merged with any queries in each feed
        query: `
        {
          site {
            siteMetadata {
              title
              description
              siteUrl: url
            }
          }
        }
      `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map((edge) => {
                return Object.assign({}, edge.node.fields, {
                  description: edge.node.excerpt,
                  date: edge.node.fields.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [{ 'content:encoded': edge.node.html }],
                });
              });
            },
            query: `
            {
              allMarkdownRemark(
                limit: 1000,
                sort: { order: DESC, fields: [fields___timestamp] },
                filter: { frontmatter: { layout: { eq: "post" } } }
              ) {
                edges {
                  node {
                    excerpt
                    html
                    fields {
                      title
                      slug
                      date
                    }
                  }
                }
              }
            }
          `,
            output: '/atom.xml',
            title: 'anmonteiro.com RSS Feed',
          },
        ],
      },
    },
  ],
};
