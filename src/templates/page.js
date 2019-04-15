import React from 'react';
import { graphql } from 'gatsby';
import SEO from '../components/seo';
import Layout from '../components/layout';
import '../css/anmonteiro.css';

export default ({ data }) => {
  const page = data.markdownRemark;
  return (
    <Layout>
      <SEO pageData={page} />
      <div className='page'>
        <h1 className='page-title'>{page.fields.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: page.html }} />
      </div>
    </Layout>
  );
};

export const query = graphql`
  query PageQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      fields {
        title
      }
    }
  }
`;
