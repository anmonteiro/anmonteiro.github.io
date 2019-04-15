import React from 'react';
import Link from 'gatsby-link';
import classNames from 'classnames';
import moment from 'moment';

export default ({ siteMetadata, pagesInfo }) => {
  const { title, description } = siteMetadata;
  return (
    // Target for toggling the sidebar `.sidebar-checkbox` is for regular
    // styles, `#sidebar-checkbox` for behavior.
    <>
      <input
        type='checkbox'
        className='sidebar-checkbox'
        id='sidebar-checkbox'
      />

      {/* Toggleable sidebar */}
      <div className='sidebar' id='sidebar'>
        <div className='sidebar-item description'>
          <p>{description}</p>
        </div>

        <nav className='sidebar-nav'>
          <Link
            key='00'
            className={classNames(
              'sidebar-nav-item',
              title === 'Home' ? 'active' : null,
            )}
            to='/'
          >
            Home
          </Link>
          <Link
            key='01'
            className={classNames(
              'sidebar-nav-item',
              'Archive' === title ? 'active' : null,
            )}
            to='/archive'
          >
            Archive
          </Link>

          {/* The code below dynamically generates a sidebar nav of pages with
      `layout: page` in the front-matter. See readme for usage. */}
          {pagesInfo.map(({ node }, idx) => {
            const pageTitle = node.fields.title;
            return (
              <Link
                key={idx}
                className={classNames(
                  'sidebar-nav-item',
                  pageTitle === title ? 'active' : null,
                )}
                to={node.fields.slug}
              >
                {pageTitle}
              </Link>
            );
          })}

          <a className='sidebar-nav-item' href='http://github.com/anmonteiro'>
            GitHub (anmonteiro)
          </a>
        </nav>

        <div className='sidebar-item'>
          <p>&copy; {moment().year()}. All rights reserved.</p>
        </div>
      </div>
    </>
  );
};
