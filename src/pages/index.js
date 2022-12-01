import classnames from 'classnames';
import Link from 'next/link';
import React from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';

const NavLink = ({ className, test, text, url }) => {
  const classes = classnames('pagination-item', className);
  if (!test) {
    return (
      <Link href={url} className={classes}>
        {text}
      </Link>
    );
  } else {
    return <span className={classes}>{text}</span>;
  }
};

export default () => {
  // const { index, first, last } = pageContext;
  // const previousUrl = index - 1 === 1 ? '' : `page${index - 1}`;
  // const nextUrl = `page${index + 1}`;

  return (
    <>
      <SEO pageData={{}} />
      <div className="posts">
        {[].map(({ node }, idx) => (
          <div key={idx} className="post">
            <h1 className="post-title">
              <Link href={node.fields.slug} className="post-title">
                {node.fields.title}
              </Link>
            </h1>

            <span className="post-date">{node.fields.date}</span>

            <div dangerouslySetInnerHTML={{ __html: node.excerpt }} />
            <p>
              <Link href={node.fields.slug} className="post-title">
                Read more &nbsp;&#10137;
              </Link>
            </p>
          </div>
        ))}
      </div>
      <div className="pagination">
        <NavLink
          test={true}
          // url={nextUrl}
          text="Older"
          className="older"
        />
        <NavLink
          test={true}
          /* url={previousUrl} */ text="Newer"
          className="newer"
        />{' '}
      </div>
    </>
  );
};
