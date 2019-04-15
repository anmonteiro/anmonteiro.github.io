import React from 'react';
import { graphql } from 'gatsby';
import Link from 'gatsby-link';
import Layout from '../components/layout';
import SEO from '../components/seo';
import classnames from 'classnames';

const NavLink = ({ className, test, text, url }) => {
  const classes = classnames('pagination-item', className);
  if (!test) {
    return (
      <Link to={url} className={classes}>
        {text}
      </Link>
    );
  } else {
    return <span className={classes}>{text}</span>;
  }
};

export const query = graphql`
  query($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { fields: [fileAbsolutePath], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      totalCount
      edges {
        node {
          frontmatter {
            title
          }
          fields {
            title
            date
            slug
          }
          excerpt(format: HTML)
        }
      }
    }
  }
`;

export default ({ data, pageContext }) => {
  const { index, first, last } = pageContext;
  const previousUrl = index - 1 === 1 ? '' : `page${index - 1}`;
  const nextUrl = `page${index + 1}`;

  return (
    <Layout>
      <SEO pageData={{}} />
      <div className='posts'>
        {data.allMarkdownRemark.edges.map(({ node }, idx) => (
          <div key={idx} className='post'>
            <h1 className='post-title'>
              <Link to={node.fields.slug} className='post-title'>
                {node.fields.title}
              </Link>
            </h1>

            <span className='post-date'>{node.fields.date}</span>

            <div dangerouslySetInnerHTML={{ __html: node.excerpt }} />
            <p>
              <Link to={node.fields.slug} className='post-title'>
                Read more &nbsp;&#10137;
              </Link>
            </p>
          </div>
        ))}
      </div>
      <div className='pagination'>
        <NavLink test={last} url={nextUrl} text='Older' className='older' />
        <NavLink
          test={first}
          url={previousUrl}
          text='Newer'
          className='newer'
        />
      </div>
    </Layout>
  );
};
