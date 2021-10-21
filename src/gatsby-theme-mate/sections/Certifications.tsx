import React, { useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import Section from '../components/Section';
import { CardContainer } from '../components/Card';
import Triangle from '../components/Triangle';
import { SECTION } from '../utils/constants';
import Certificate from '../components/Certificate';
import { useCertificatesQuery } from '../queries/useCertificatesQuery';
import { Dialog } from "@reach/dialog"
import "@reach/dialog/styles.css"
import { Box, Flex, Image, Link, Text } from 'rebass/styled-components';
import styled from 'styled-components';
import IconButton from '../components/IconButton';
import { BadgeContainer } from '../components/BadgeCard';

const Certifications = () => {
  const certificates = useCertificatesQuery();
  const [ showLightbox, setShowLightbox ] = useState(false);
  const [ currentCertificate, setCurrentCertificate ] = useState({});

  const onPressHandle = (certificate) => {
    setCurrentCertificate(certificate);
    setShowLightbox(true);
  }

  return (
    <Section.Container id={SECTION.certifications} Background={Background}>
      <Section.Header name={SECTION.certifications} icon="🌟" label="cards" />

      <BadgeContainer minWidth="180px">
        <Fade direction="down" cascade damping={0.5} triggerOnce>
          {certificates.map((p, i) => (
            <Certificate {...p} key={i} onPress={onPressHandle} />
          ))}
        </Fade>
        { showLightbox && 
          <Dialog style={{padding:5, borderRadius:20, width:'95%'}}>
            <Flex
              m={1}
              style={{
                top:0,
                right:0,
                justifyContent: 'flex-end', 
                position: "relative",
              }}
            >
              <Box mx={1} fontSize={4}>
                <IconButton name="Close" icon="times-circle"  onPress={()=>setShowLightbox(false)} url={'#'}/>
              </Box>
            </Flex>

            <Flex
              m={1}
              style={{
                top:0,
                justifyContent:'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <CertificateCard {...currentCertificate.certificateImage} /> 
              <Text style={{textAlign:'center',}}>
                <h1 style={{padding:0, margin:0 }}> {currentCertificate?.name} </h1>
                {currentCertificate?.issuingOrganization} <br /> 
                <Link href={currentCertificate?.credentialUrl}> {currentCertificate?.credentialUrl} </Link>
              </Text>
            </Flex>
            
          </Dialog>
        }
      </BadgeContainer>
    </Section.Container>
  );
};

const CARD_HEIGHT = '600px';

const MEDIA_QUERY_SMALL = '@media (max-width: 400px)';

const CertificateCard = styled(Image)`
  width: '100%';
  height: ${CARD_HEIGHT};
  padding: 5px;
  margin-top: 0px;

  ${MEDIA_QUERY_SMALL} {
    height: 50vh;
    width: '100%';
    margin-top: 0;
    resize: both;
    overflow: auto;
    // padding: 10px;
  }
`;

const Background = () => (
  <>
    <Triangle
      color="secondary"
      height={['80vh', '80vh']}
      width={['100vw', '100vw']}
      position="top-right"
    />

    <Triangle
      color="background"
      height={['50vh', '20vh']}
      width={['50vw', '50vw']}
      position="top-right"
    />

    <Triangle
      color="primary"
      height={['25vh', '40vh']}
      width={['75vw', '60vw']}
      position="bottom-right"
    />

    <Triangle
      color="muted"
      height={['25vh', '20vh']}
      width={['100vw', '100vw']}
      position="bottom-right"
    />
  </>
);

export default Certifications;
