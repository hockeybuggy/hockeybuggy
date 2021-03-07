import * as React from "react";
import { PageProps, graphql } from "gatsby";
import Link from "gatsby-link";
import { getImage, GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";

import { BaseLayout } from "../../layouts";
import SEO from "../../components/seo";
import Icon from "../../components/icon";

import { ProjectsIndexPageQuery } from "../../../graphql-types";

const ProjectsIndex = ({
  data,
}: PageProps<ProjectsIndexPageQuery>): JSX.Element => {
  const projects = data.allProjects.edges;

  const projectImages = data.allProjectImages.edges;
  const projectImagesByPath: Record<
    string,
    IGatsbyImageData
  > = projectImages.reduce((accum: Record<string, IGatsbyImageData>, edge) => {
    const path = `${edge.node!.relativeDirectory}/${edge.node!.base}`;
    accum[path] = getImage(
      edge.node as { childImageSharp: { gatsbyImageData: IGatsbyImageData } }
    )!;
    return accum;
  }, {});

  return (
    <BaseLayout className="projects" pathname={"/projects/"}>
      <SEO title={"Projects"} />

      <h1>Projects</h1>
      {projects.map(({ node }) => {
        const frontmatter = node!.frontmatter!;
        const excerpt = node!.excerpt!;
        const slug = frontmatter.slug!;
        const github = frontmatter.github;
        const bannerImageName = frontmatter.bannerImageName!;
        const bannerImage = projectImagesByPath[bannerImageName];

        const title = frontmatter.title || slug;

        return (
          <article key={slug}>
            <div className="header-row">
              <header>
                <h3>{title}</h3>
              </header>
              {github ? (
                <div className="github-link">
                  <a aria-label="Project's GitHub page" href={github}>
                    <Icon
                      name={Icon.Names.GitHub}
                      aria-hidden="true"
                      label=""
                      size={Icon.Sizes.Large}
                    />
                  </a>
                </div>
              ) : null}
            </div>
            {bannerImage ? (
              <Link to={`/project/${slug}`}>
                <GatsbyImage alt="" image={bannerImage} />
              </Link>
            ) : null}
            <section className="excerpt">
              <p>{excerpt}</p>
            </section>
            <div className="read-more">
              <Link to={`/project/${slug}`}>Read more</Link>
            </div>
          </article>
        );
      })}
    </BaseLayout>
  );
};

export const pageQuery = graphql`
  query ProjectsIndexPage {
    site {
      siteMetadata {
        title
      }
    }
    allProjects: allMarkdownRemark(
      filter: { fileAbsolutePath: { glob: "**/content/projects/*" } }
      sort: { fields: [frontmatter___order], order: ASC }
    ) {
      edges {
        node {
          excerpt(pruneLength: 280)
          frontmatter {
            title
            github
            slug
            bannerImageName
          }
        }
      }
    }
    allProjectImages: allFile(
      filter: { relativeDirectory: { glob: "projects/**" } }
    ) {
      edges {
        node {
          base
          relativeDirectory
          childImageSharp {
            gatsbyImageData(placeholder: BLURRED, layout: FULL_WIDTH)
          }
        }
      }
    }
  }
`;

export default ProjectsIndex;
