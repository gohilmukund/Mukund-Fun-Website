import { graphql, useStaticQuery } from 'gatsby';
import { AboutMe } from '../types';

export type QueryResponse = {
  contentfulAbout: {
    aboutMe: {
      childMarkdownRemark: {
        rawMarkdownBody: string;
      };
    };
    profile: {
      title: string;
      image: {
        src: string;
      };
    };
  };
};

export const useAboutMeQueryMK = (): AboutMe => {
  const {
    contentfulAbout: { aboutMe, profile },
  } = useStaticQuery<QueryResponse>(graphql`
    query AboutMeQueryMK {
      contentfulAbout {
        aboutMe {
          childMarkdownRemark {
            rawMarkdownBody
          }
        }
        profile {
          title
          image: resize(width: 450, quality: 100) {
            src
          }
        }
      }
    }
  `);

  return {
    markdown: aboutMe.childMarkdownRemark.rawMarkdownBody,
    profile: {
      alt: profile.title,
      src: profile.image.src,
    },
  };
};
