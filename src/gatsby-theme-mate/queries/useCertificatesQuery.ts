import { graphql, useStaticQuery } from 'gatsby';
import { Certification } from '../types';

export type QueryResponse = {
  contentfulAbout: {
    certifications: {
      id: string;
      name: string;
      credentialUrl: string;
      issueDate: string;
      issuingOrganization: string;
      certificatePicture: {
        title: string;
        image: {
          src: string;
        };
      };
      certificateBadge: {
        title: string;
        image: {
          src: string;
        };
      };
    }[];
  };
};

export const useCertificatesQuery = (): Certification[] => {
  const { contentfulAbout } = useStaticQuery<QueryResponse>(graphql`
    {
      contentfulAbout {
        certifications {
          id
          name
          credentialUrl
          certificatePicture {
            title
            image: resize(width: 800, quality: 100) {
              src
            }
          }
          certificateBadge {
            title
            image: resize(width: 200, quality: 100) {
              src
            }
          }
          issuingOrganization
          issueDate(formatString: "DD-MMM-YYYY")
        }
      }
    }
  `);

  return contentfulAbout.certifications.map(({ certificatePicture, certificateBadge, ...rest }) => ({
    ...rest,
    badge: {
      alt: certificateBadge?.title,
      src: certificateBadge?.image.src,
    },
    certificateImage: {
      alt: certificatePicture?.title,
      src: certificatePicture?.image.src,
    },
  }));
};
