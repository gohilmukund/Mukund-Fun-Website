import React from 'react';
import SocialLink from './SocialLink';
import { Box, Flex, Image, Text } from 'rebass/styled-components';
import styled from 'styled-components';
import { Certification as CertificationType } from '../types';
import { BadgeCard } from './BadgeCard';

type Props = CertificationType;

const Certificate = ({
  name,
  issueDate,
  issuingOrganization,
  certificateImage,
  credentialUrl,
  badge,
  onPress
}: Props) => (
  <BadgeCard p={0}>
    <Flex style={{ height: CARD_HEIGHT }}>
      <ImageContainer  onClick={()=> onPress({name, issueDate, issuingOrganization, certificateImage, badge, credentialUrl})} >
        <Badge {...badge} />
        <Flex
          m={1}
          style={{
            top:0,
            right:0, 
            position: "absolute",
          }}
        >
          <Box mx={1} fontSize={4}>
            <SocialLink name="Certificate Link" icon="globe" url={credentialUrl} />
          </Box>
        </Flex>
      </ImageContainer>
    </Flex>
  </BadgeCard>
);

const CARD_HEIGHT = '200px';

const MEDIA_QUERY_SMALL = '@media (max-width: 400px)';

const ImageContainer = styled.button`
  margin: auto;
  width: ${CARD_HEIGHT};
  background-color: transparent;
  border-color: transparent;

  ${MEDIA_QUERY_SMALL} {
    width: calc(${CARD_HEIGHT} / 2);
  }
`;

const Badge = styled(Image)`
  width: ${CARD_HEIGHT};
  height: ${CARD_HEIGHT};
  padding: 15px;
  margin-top: 0px;

  ${MEDIA_QUERY_SMALL} {
    height: calc(${CARD_HEIGHT} / 2);
    width: calc(${CARD_HEIGHT} / 2);
    margin-top: calc(${CARD_HEIGHT} / 4);
    padding: 10px;
  }
`;

export default Certificate;
