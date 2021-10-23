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
  function NewlineText(props) {
    const text = props.text;
    return text.split('\n').map(str => <p>{str}</p>);
  }
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
          <NewlineText text={description}/>
        </Text>
        
      </TextContainer>
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
            <LogoImage {...logo} />
          </ImageLabel>
          <Hide query="md">
            <ImageLabel bg="muted" color="primary">
              {joiningDate} - {leavingDate?leavingDate:"PRESENT"}
            </ImageLabel>
          </Hide>
        </ProjectTag>
    </Flex>
  </Card>
)};

const CARD_HEIGHT = '400px';

const MEDIA_QUERY_SMALL = '@media (max-width: 400px)';

const Title = styled(Text)`
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  display: table;
  margin-top: 40px;
  border-bottom: ${({ theme }) => theme.colors.primary} 5px solid;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: 100%;
  width: calc(100%);

  ${MEDIA_QUERY_SMALL} {
    width: calc(100%);
  }
`;

const LogoImage = styled(Image)`
  width: 40px;
  height: 40px;

  ${MEDIA_QUERY_SMALL} {
    height: 40px;
    width: 40px;
  }
`;

const ProjectTag = styled.div`
  position: absolute;
  height: ${CARD_HEIGHT};
  width: 100%;
  top: 0

  ${MEDIA_QUERY_SMALL} {
    top: calc(-${CARD_HEIGHT} - 3.5px + (${CARD_HEIGHT} / 4));
  }
`;

export default Work;
