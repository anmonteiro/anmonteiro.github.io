import React from 'react';
import Link from 'gatsby-link';
import Layout from '../components/layout';

export default () => (
  <Layout>
    <div className="page">
      <h1 className="page-title">404: Page not found</h1>
      <p className="lead">
        Sorry, we've misplaced that URL or it's pointing to something that
        doesn't exist. <Link to="/">Head back home</Link> to try finding it
        again.
      </p>
    </div>
  </Layout>
);
