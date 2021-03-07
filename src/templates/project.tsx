import React from "react";
import { PageProps, graphql } from "gatsby";
import Link from "gatsby-link";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";

import { BaseLayout } from "../layouts";
import SEO from "../components/seo";
import Icon from "../components/icon";

import { ProjectBySlugQuery } from "../../graphql-types";

const ProjectTemplate = ({
  data,
}: PageProps<ProjectBySlugQuery>): JSX.Element => {
  const projectImages = data.projectImages.edges;

  console.log(projectImages);
  const projectImagesByPath: Record<
    string,
    IGatsbyImageData
  > = projectImages.reduce((accum: Record<string, IGatsbyImageData>, edge) => {
    const path = `${edge.node!.relativeDirectory}/${edge.node!.base}`;
    accum[path] = edge.node!.childImageSharp!;
    return accum;
  }, {});

  const { title, bannerImageName, github } = data.projectBySlug!.frontmatter!;
  const excerpt = data.projectBySlug!.excerpt!;
  const html = data.projectBySlug!.html!;
  const bannerImage = projectImagesByPath[bannerImageName!];

  return (
    <BaseLayout className="project">
      <SEO title={`Project: ${title!}`} description={excerpt} />

      <article>
        <div className="header-row">
          <header>
            <h1 className="project-title">{title}</h1>
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

        {bannerImage ? <GatsbyImage alt="" image={bannerImage} /> : null}
        <section dangerouslySetInnerHTML={{ __html: html }} />
      </article>

      <hr />

      <Link to={`/projects/`}>◄ Back to projects</Link>
    </BaseLayout>
  );
};

export const pageQuery = graphql`
  query ProjectBySlug($slug: String!, $imagesSlug: String!) {
    projectBySlug: markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        github
        bannerImageName
      }
    }
    projectImages: allFile(
      filter: { relativeDirectory: { glob: $imagesSlug } }
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

export default ProjectTemplate;
