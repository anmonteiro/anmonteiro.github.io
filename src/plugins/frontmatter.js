import path from 'path';
import matter from 'gray-matter';
import stringifyObject from 'stringify-object';

export default () => (tree, file) => {
  const { consent, data } = matter(file.value);
  const filename = file.history[0];
  if (data.publishDate == null) {
    data.publishDate = path.basename(filename).substr(0, 10);
  }
  console.log('got it', filename, data);
  // Step 2: Remove frontmatter after converting it into JS object
  if (tree.children[0].type === 'thematicBreak') {
    const firstHeadingIndex = tree.children.findIndex(
      (t) => t.type === 'heading'
    );
    if (firstHeadingIndex !== -1) {
      tree.children.splice(0, firstHeadingIndex + 1);
    }
  }

  // Step 3: Insert JSX to pass frontmatter to parent component
  tree.children.unshift(
    {
      type: 'import',
      value: `
      import Documentation from '../files/documentation'

    `,
    },
    {
      type: 'jsx',
      value: `

    <Documentation
      title={frontMatter.title}
      author={frontMatter.author}
      lastUpdated={frontMatter.lastUpdated}
    >

    `,
    }
  );

  // Step 4: Close JSX parent component
  tree.children.push({
    type: 'jsx',
    value: `

    </Documentation>
    `,
  });

  // Step 1: Convert frontmatter to JS object and push to document tree
  tree.children.push({
    type: 'export',
    value: `
    export const frontMatter = ${stringifyObject(data)}
    `,
  });
};
