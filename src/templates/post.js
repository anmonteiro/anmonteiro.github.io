import React from 'react';
import { graphql } from 'gatsby';
import Link from 'gatsby-link';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { useScriptTag } from '../utils/dom';

function TwitterPlug({ tags }) {
  useScriptTag(
    `!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');`,
  );
  useScriptTag(
    `!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');`,
  );

  return (
    <div style={{ marginTop: '2rem', marginBottom: '1rem' }}>
      <a
        href={`https://twitter.com/share?hashtags=${tags.join(',')}`}
        className='twitter-share-button'
        data-via='_anmonteiro'
      >
        Tweet
      </a>
      <a
        href='https://twitter.com/_anmonteiro'
        className='twitter-follow-button'
        data-show-count='false'
      >
        Follow @_anmonteiro
      </a>
    </div>
  );
}

function Disqus({ url, slug }) {
  const identifierParts = slug.split('/').filter(x => x !== '');
  const identifier = identifierParts[identifierParts.length - 1].split('.')[0];
  useScriptTag(`
  var disqus_config = function () {
      this.page.url = '${url}';
      this.page.identifier = '${identifier}';
  };
  (function() {  // REQUIRED CONFIGURATION VARIABLE: EDIT THE SHORTNAME BELOW
      var d = document, s = d.createElement('script');

      s.src = '//anmonteiro.disqus.com/embed.js';  // IMPORTANT: Replace EXAMPLE with your forum shortname!

      s.setAttribute('data-timestamp', +new Date());
      (d.head || d.body).appendChild(s);
  })();
`);
  return (
    <div id='disqus_thread'>
      <noscript>
        Please enable JavaScript to view the{' '}
        <a href='https://disqus.com/?ref_noscript' rel='nofollow'>
          comments powered by Disqus.
        </a>
      </noscript>
    </div>
  );
}

export const query = graphql`
  query BlogPostQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      excerpt
      html
      fields {
        title
        date
        tags
        slug
        url
      }
    }

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

export default ({ data }) => {
  const post = data.markdownRemark;
  const { allPosts } = data;
  return (
    <Layout>
      <SEO pageData={post} />
      <div className='post'>
        <h1 className='post-title'>{post.fields.title}</h1>
        <span className='post-date'>{post.fields.date}</span>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <TwitterPlug tags={post.fields.tags} />
        <Disqus {...post.fields} />
        <RelatedPosts allPosts={allPosts.edges} currentPost={post} />
      </div>
    </Layout>
  );
};

function RelatedPosts({ allPosts, currentPost }) {
  const relatedPosts = [];
  const allPostsLength = allPosts.length;
  for (let i = 0; i < allPostsLength; i++) {
    if (relatedPosts.length === 3) {
      break;
    }
    const post = allPosts[i].node;
    const { tags } = post.fields;
    if (tags.some(tag => currentPost.fields.tags.indexOf(tag) !== -1)) {
      relatedPosts.push(post);
    }
  }

  if (relatedPosts.length < 3) {
    for (let i = 0; i < allPostsLength; i++) {
      if (relatedPosts.length === 3) {
        break;
      }
      const post = allPosts[i].node;
      const { slug } = post.fields;
      if (!relatedPosts.some(post => post.fields.slug === slug)) {
        relatedPosts.push(post);
      }
    }
  }

  return (
    <div className='related'>
      <h2>Related Posts</h2>
      <ul className='related-posts'>
        {relatedPosts.map((post, idx) => {
          const { title, slug, date } = post.fields;
          return (
            <li key={idx}>
              <h3>
                <Link to={slug}>
                  {title} <small>{date}</small>
                </Link>
              </h3>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
