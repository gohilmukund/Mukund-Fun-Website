import React, { useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import Section from '../components/Section';
import { CardContainer } from '../components/Card';
import Triangle from '../components/Triangle';
import { SECTION } from '../utils/constants';
import { useWorkExperienceQuery } from '../queries/useWorkExperienceQuery';
import Work from '../components/Work';
import {Dialog} from '@reach/dialog';
import "@reach/dialog/styles.css"
import { Box, Flex, Image, Link, Text } from 'rebass/styled-components';
import styled from 'styled-components';
import IconButton from '../components/IconButton';

const WorkExperience = () => {
  const job = useWorkExperienceQuery();
  const [ showModal, setShowModal ] = useState(false);
  const [ currentItem, setCurrentItem ] = useState({});

  const onPressHandle = (item) => {
    setCurrentItem(item);
    setShowModal(true);
  }

  return (
    <Section.Container id={SECTION.workExperience} Background={Background}>
      <Section.Header name={SECTION.workExperience} icon="♟" label="chesspawn" />

      <CardContainer minWidth="350px">
        <Fade direction="down" cascade damping={0.5} triggerOnce>
          {job.map((p, i) => (
            <Work {...p} key={i} onPress={onPressHandle} />
          ))}
        </Fade>
        { showModal && <ModalView currentItem={currentItem} setShowModal={setShowModal}/>}
      </CardContainer>
    </Section.Container>
  );
};

const ModalView = ({currentItem, setShowModal}) => {
  function NewlineText(props) {
    const text = props.text;
    return text.split('\n').map(str => <p style={{ textAlign: 'left'}}>{str}</p>);
  }
  return(
    <Dialog style={{padding:5, borderRadius:20, width:'55%'}}>
      <Flex
        m={1}
        style={{
          top:0,
          right:0,
          justifyContent: 'flex-end', 
          position: "relative",
        }}>
        <Box mx={1} fontSize={4}>
          <IconButton name="Close" icon="times-circle"  onPress={()=>setShowModal(false)} url={'#'}/>
        </Box>
      </Flex>
      <Flex
        m={1}
        style={{
          top:0,
          justifyContent:'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}> 
        <Text style={{textAlign:'center'}}>
          <LogoImage {...currentItem.logo} />
          <br />
          <h3> {currentItem?.position} </h3>
          <NewlineText text={currentItem?.description}/>
        </Text>
      </Flex>      
    </Dialog>
  )
}

const MEDIA_QUERY_SMALL = '@media (max-width: 400px)';

const LogoImage = styled(Image)`
  width: 100px;
  height: 100px;
  max-width: 20%;

  ${MEDIA_QUERY_SMALL} {
    height: 40px;
    width: 40px;
  }
`;

const Background = () => (
  <>
    <Triangle
      color="secondary"
      height={['50vh', '20vh']}
      width={['50vw', '50vw']}
      position="bottom-left"
    />

    <Triangle
      color="primary"
      height={['20vh', '40vh']}
      width={['75vw', '70vw']}
      position="top-right"
    />

    <Triangle
      color="muted"
      height={['25vh', '20vh']}
      width={['100vw', '100vw']}
    />
  </>
);

export default WorkExperience;
