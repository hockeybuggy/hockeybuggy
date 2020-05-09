import * as React from "react";
import { PageProps, graphql } from "gatsby";
import Link from "gatsby-link";

import { BaseLayout } from "../layouts";

import { BlogIndexPageQuery } from "../../graphql-types";

const BlogIndex = ({ data }: PageProps<BlogIndexPageQuery>): JSX.Element => {
  // TODO use this in layout
  // const siteTitle = data.site!.siteMetadata!.title;
  const posts = data.allBlogPosts.edges;

  return (
    <BaseLayout>
      <h1>Blog Posts</h1>
      {posts.map(({ node }) => {
        const frontmatter = node!.frontmatter!;
        const slug = frontmatter.slug!;
        const year = frontmatter.year!;
        const month = frontmatter.month!;
        const title = frontmatter.title || slug;
        return (
          <article key={slug}>
            <header>
              <small>{frontmatter.date}</small>
              <h3 style={{ margin: 0, marginBottom: "1.8rem" }}>
                <Link to={`/blog/${year}/${month}/${slug}`}>{title}</Link>
              </h3>
            </header>
            <hr />
          </article>
        );
      })}
    </BaseLayout>
  );
};

export const pageQuery = graphql`
  query BlogIndexPage {
    site {
      siteMetadata {
        title
      }
    }
    allBlogPosts: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            slug
            year: date(formatString: "YYYY")
            month: date(formatString: "MM")
          }
        }
      }
    }
  }
`;

export default BlogIndex;