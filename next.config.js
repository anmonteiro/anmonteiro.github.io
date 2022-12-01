import mdx from '@next/mdx';
import tm from 'next-transpile-modules';
import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_EXPORT,
  PHASE_PRODUCTION_BUILD,
} from 'next/constants.js';
import path from 'path';

import bsconfig from './bsconfig.json' assert { type: 'json' };
import frontmatterPlugin from './src/plugins/frontmatter.js';

const isProd = process.env.NODE_ENV === 'production';

import bsDirs from './_build/default/.melange.eobjs/.sourcedirs.json' assert { type: 'json' };

const bsDependencies = async () => {
  const ps = bsDirs.pkgs.map((x) =>
    import(path.join(x[1], 'bsconfig.json'), {
      assert: { type: 'json' },
    })
  );
  const xs = await Promise.all(ps);
  return xs
    .map((x) => x['bs-dependencies'])
    .filter((x) => x)
    .flat();
};

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [frontmatterPlugin],
    rehypePlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
});

export default async (phase) => {
  const config = {
    // cssModules: true,
    reactStrictMode: true,
    // assetPrefix: isProd ? 'https://cdn.mydomain.com' : '',
    pageExtensions: ['jsx', 'tsx', 'js', 'bs.js', 'md', 'mdx'],
    env: {
      IS_DEV: !isProd,
      BASE_URL: !isProd ? 'http://localhost:3000' : 'http://localhost:9000',
    },
    trailingSlash: phase === PHASE_EXPORT,
    serverRuntimeConfig: {
      devProxy: 'http://localhost:9000',
    },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      // Webpack 5 support + symlinks (BuckleScript)
      // config.resolve.alias.process = require.resolve('process/browser');

      config.module.rules.push({
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              dimensions: false,
            },
          },
        ],
      });

      return config;
    },
  };

  const bsDeps = await bsDependencies();
  const transpileModules = ['melange'].concat(
    bsconfig['bs-dependencies'],
    bsDeps
  );
  const withTM = tm(transpileModules, {
    resolveSymlinks: !isProd,
  });

  return withMDX(withTM(config));
};
