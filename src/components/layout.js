import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import Link from 'gatsby-link';
import Sidebar from './sidebar';
import { useGoogleAnalytics } from '../utils/dom';
import '../css/poole.css';
import '../css/lanyon.css';
import '../css/anmonteiro.css';
import '../css/fontello.css';
import 'prismjs/themes/prism-tomorrow.css';

function useSidebar() {
  return React.useEffect(() => {
    var toggle = document.querySelector('.sidebar-toggle');
    var sidebar = document.querySelector('#sidebar');
    var checkbox = document.querySelector('#sidebar-checkbox');
    const handleClick = ({ target }) => {
      if (
        !checkbox.checked ||
        sidebar.contains(target) ||
        (target === checkbox || target === toggle)
      ) {
        return;
      }

      checkbox.checked = false;
    };
    document.addEventListener('click', handleClick, false);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
}

export default ({ children }) => {
  useSidebar();
  useGoogleAnalytics();

  return (
    <StaticQuery
      query={graphql`
        {
          site {
            siteMetadata {
              title
              description
              tagline
            }
          }
          allMarkdownRemark(
            sort: { fields: [frontmatter___title] }
            filter: { frontmatter: { layout: { eq: "page" } } }
          ) {
            edges {
              node {
                fields {
                  title
                  slug
                }
              }
            }
          }
        }
      `}
      render={({ site, allMarkdownRemark: pages }) => {
        const { tagline, ...siteMetadata } = site.siteMetadata;

        return (
          <div className="theme-base-0f">
            <Sidebar siteMetadata={siteMetadata} pagesInfo={pages.edges} />
            {/* Wrap is the content to shift when toggling the sidebar. We wrap the
              content to avoid any CSS collisions with our real content. */}
            <div className="wrap">
              <div className="masthead">
                <div className="container">
                  <h3 className="masthead-title">
                    <Link to={''} title={'Home'}>
                      {siteMetadata.title}
                    </Link>
                    <small> {tagline}</small>
                  </h3>
                  <div className="masthead-feed">
                    <a href={'/atom.xml'}>
                      <span className="icon-rss" />{' '}
                    </a>
                  </div>
                  <div className="clearfix" />
                </div>
              </div>

              <div className="content container">{children}</div>
            </div>
            <label htmlFor="sidebar-checkbox" className="sidebar-toggle" />
          </div>
        );
      }}
    />
  );
};
