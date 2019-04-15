import React from 'react';
import { graphql } from 'gatsby';
import Link from 'gatsby-link';
import Layout from '../components/layout';
import SEO from '../components/seo';
import moment from 'moment';

export const query = graphql`
  {
    allPosts: allMarkdownRemark(
      sort: { fields: [fileAbsolutePath], order: DESC }
      filter: { frontmatter: { layout: { eq: "post" } } }
      limit: 1000
    ) {
      edges {
        node {
          fields {
            title
            slug
            tags
            date
          }
        }
      }
    }
  }
`;

export default ({ data, location }) => {
  let year = null;
  const postsPerYear = data.allPosts.edges.reduce((acc, { node }) => {
    const postYear = moment(node.fields.date, 'DD MMM YYYY').year();
    if (postYear !== year) {
      year = postYear;
      acc.push([node]);
    } else {
      acc[acc.length - 1].push(node);
    }

    return acc;
  }, []);

  return (
    <Layout>
      <SEO pageData={{ url: location.pathname }} />
      <div className='page'>
        <h1 className='page-title'>Archive</h1>
        {postsPerYear.map((posts, idx) => {
          const year = moment(posts[0].fields.date, 'DD MMM YYYY').year();

          return (
            <React.Fragment key={idx}>
              <h2 style={{ fontWeight: 'bold' }}>{year}</h2>
              <ul className='archive-year'>
                {posts.map((post, idx) => (
                  <li key={idx}>
                    <span className='item-date'>{post.fields.date}</span>
                    {' » '}
                    <Link to={post.fields.slug}>{post.fields.title}</Link>
                  </li>
                ))}
              </ul>
            </React.Fragment>
          );
        })}
      </div>
    </Layout>
  );
};
