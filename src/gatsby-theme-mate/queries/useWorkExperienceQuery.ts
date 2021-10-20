import { graphql, useStaticQuery } from 'gatsby';
import { WorkExperience } from '../types';

export type QueryResponse = {
  contentfulAbout: {
    workExperience: {
      id: string;
      name: string;
      description: {
        raw: string;
      }
      homepage: string;
      joiningDate: string;
      leavingDate: string;
      position: string;
      logo: {
        title: string;
        image: {
          src: string;
        };
      };
    }[];
  };
};

export const useWorkExperienceQuery = (): WorkExperience[] => {
  const { contentfulAbout } = useStaticQuery<QueryResponse>(graphql`
    query WorkExperienceQuery {
      contentfulAbout {
        workExperience {
          id
          name
          homepage: companyUrl
          position
          description {
            raw
          }
          joiningDate(formatString: "MMM-YYYY")
          # leavingDate(formatString: "MMM-YYYY")
          logo {
            title
            image: resize(width: 200, quality: 100) {
              src
            }
          }
        }
      }
    }
  `);

  return contentfulAbout.workExperience.map(({ logo, ...rest }) => ({
    ...rest,
    logo: {
      alt: logo.title,
      src: logo.image.src,
    },
  }));
};
