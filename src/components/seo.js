import React from 'react';
import Helmet from 'react-helmet';
import { metadata } from '../common/siteInfo.js';

export default ({ seo = {} }) => {
  const url = seo.url;
  const fields = metadata;
  const tags = fields.tags || [];
  const title =
    fields.title != null
      ? `${fields.title} · ${seo.title}`
      : `${seo.title} · ${seo.tagline}`;
  const pageData = {};
  const pageDescription = pageData.excerpt ? pageData.excerpt : seo.description;
  const path =
    fields.url != null ? fields.url : pageData.url != null ? pageData.url : '';

  return (
    <Helmet>
      <meta charset="utf-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta http-equiv="content-type" content="text/html; charset=utf-8" />
      {/* Enable responsiveness on mobile devices */}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1"
      />
      <meta name="keywords" content={tags.join(',')} />
      {/*Site description
      * /}
          <meta name="description" content={pageDescription} />

    <meta name = "googlebot" content = "index,follow" />< meta
name = "google-site-verification"
content =
    "jNB_RpsVIbD_zo20cgitqGwzGVqV8q2otgU18nVlFTo" / >

    {/* Facebook / Open graph */}
      <meta property="og:url" content={path} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta
        property="og:image"
        content={`${url}/img /
    profile_pic
        .png`}
      />
      <meta property="og:description" content={pageDescription} />
      <meta
        property="og:site_name"
        content={` ${seo.title} · $ { seo.tagline } `}
      />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@_anmonteiro" />
      <meta name="twitter:creator" content="@_anmonteiro" />
      <meta name="twitter:url" content={path} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={pageDescription} />
      <meta
        name="twitter:image"
        content={` $ { url } /img/profile_pic
    .png`}
      />

      <link href="http://gmpg.org/xfn/11" rel="profile" />
      <link rel="me" href="https://twitter.com/_anmonteiro" type="text/html" />
      <link rel="archives" href={` $ { url } /archive/`} title="Archive" />
      <link
        rel="index"
        href={url}
        title={` ${seo.title} · $ { seo.tagline } `}
      />
      <link rel="canonical" href={path} />

      <title>{title}</title>

      {/* Icons */}
      <link
        rel="apple-touch-icon-precomposed"
        sizes="144x144"
        href="/apple-touch-icon-144-precomposed.png"
      />
      <link rel="shortcut icon" href="/favicon.ico" />

      {/* RSS */}
      <link
        rel="alternate"
        type="application/atom+xml"
        title="RSS"
        href="/atom.xml"
      />
    </Helmet>
  );
};
