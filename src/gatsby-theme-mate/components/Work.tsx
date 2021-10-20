import React from 'react';
import SocialLink from './SocialLink';
import ImageLabel from './ImageLabel';
import Hide from './Hide';
import { Box, Flex, Image, Text } from 'rebass/styled-components';
import styled from 'styled-components';
import { WorkExperience as WorkType } from '../types';
import { Card } from './Card';

type Props = WorkType;

const Work = ({
  name,
  description,
  homepage,
  position,
  joiningDate,
  leavingDate,
  logo,
}: Props) => { 
  let desc = JSON.parse(JSON.stringify(eval("(" + description.raw+ ")"))).content[0]?.content[0]?.value
  console.log(String(desc).replace(/\ng/,'\n'))
  return(  
  <Card p={0}>
    <Flex style={{ height: CARD_HEIGHT }}>
      <TextContainer>
        <span>
          <Title my={2} pb={1} color="text">
            {position}
          </Title>
        </span>
        <Text width={[1]} style={{ overflow: 'auto' }} color="text">
          {desc}
        </Text>
      </TextContainer>

      <ImageContainer>
        <ProjectImage  />
        <ProjectTag>
          <Flex
            m={1}
            style={{
              float: 'right',
            }}
          >
            <Box mx={1} fontSize={4}>
              <SocialLink name="Homepage" icon="globe" url={homepage} />
            </Box>
          </Flex>
          <ImageLabel
            bg="muted"
            color="background"
            position="bottom-right"
            round
          >
            {/* {name} */}
            <LogoImage {...logo} />
          </ImageLabel>
          <Hide query="md">
            <ImageLabel bg="muted" color="primary">
              {joiningDate}
            </ImageLabel>
          </Hide>
        </ProjectTag>
      </ImageContainer>
    </Flex>
  </Card>
)};

const CARD_HEIGHT = '250px';

const MEDIA_QUERY_SMALL = '@media (max-width: 400px)';

const Title = styled(Text)`
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  display: table;
  border-bottom: ${({ theme }) => theme.colors.primary} 5px solid;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: 100%;
  width: calc(100% - ${CARD_HEIGHT}/4);

  ${MEDIA_QUERY_SMALL} {
    width: calc(100% - (${CARD_HEIGHT} / 2));
  }
`;

const ImageContainer = styled.div`
  margin: auto;
  width: ${CARD_HEIGHT}/3;

  ${MEDIA_QUERY_SMALL} {
    width: calc(${CARD_HEIGHT} / 2);
  }
`;

const ProjectImage = styled(Image)`
  width: ${CARD_HEIGHT}/2;
  height: ${CARD_HEIGHT}/2;
  padding: 40px;
  margin-top: 0px;

  ${MEDIA_QUERY_SMALL} {
    height: calc(${CARD_HEIGHT} / 2);
    width: calc(${CARD_HEIGHT} / 2);
    margin-top: calc(${CARD_HEIGHT} / 4);
    padding: 10px;
  }
`;

const LogoImage = styled(Image)`
  width: 40px;
  height: 40px;
  // filter: sepia(100%) saturate(300%) brightness(100%) hue-rotate(180deg);

  ${MEDIA_QUERY_SMALL} {
    height: 40px;
    width: 40px;
  }
`;

const ProjectTag = styled.div`
  position: relative;
  height: ${CARD_HEIGHT};
  top: calc(
    -${CARD_HEIGHT} - 3.5px
  ); /*don't know why I have to add 3.5px here ... */

  ${MEDIA_QUERY_SMALL} {
    top: calc(-${CARD_HEIGHT} - 3.5px + (${CARD_HEIGHT} / 4));
  }
`;

export default Work;
