import React, { createElement } from 'react'
import Icon from '@mdi/react'
import {
  mdiFacebook,
  mdiMenu,
  mdiGithub,
  mdiLightbulb,
  mdiLightbulbOutline,
  mdiInstagram,
  mdiYoutube,
  mdiTwitter,
  mdiLinkedin,
  mdiGoogleCloud
} from '@mdi/js'

import { H2, H6, Card, IconButton, ToggleButton } from 'ui-neumorphism'
import { DARKMODE } from './Router'


const githubUrl = 'https://github.com/gohilmukund/'
const fbUrl = 'https://www.facebook.com/mukund.gohil/'
const instaUrl = 'https://www.instagram.com/gohil.mukund/'
const twitter = 'https://twitter.com/mukund_gohil'
const youtubeUrl = 'https://www.youtube.com/channel/UCkqi-mT29ZEmAr2pVN5jN0A'
const linkedInUrl = 'https://www.linkedin.com/in/mukund-gohil/'
const qwiklabUrl = 'https://www.qwiklabs.com/public_profiles/9a632212-841f-4600-90b7-8e2f048a8e36'

class Topbar extends React.Component {
  open(url) {
    window.open(url, '_blank')
  }

  render() {
    const { dark, onClick, onMenuClick, size } = this.props
    const isSmall = size === 'sm' || size === 'xs'
    const menuButton = isSmall ? (
      <IconButton onClick={onMenuClick}>
        <Icon path={mdiMenu} size={1} />
      </IconButton>
    ) : null

    const title = createElement(
      isSmall ? H6 : H2,
      { dark: DARKMODE, style: { color: DARKMODE ? 'var(--secondary-dark)' : 'var(--primary-light)' },  className: 'topbar-title'},
      'Mukund Gohil'
    )

    return (
      <Card flat dark={DARKMODE} className={`main-topbar`} style={{width:'100%', 
      display: 'flex', 
      flexDirection:'row', 
      alignItems: 'center', 
      paddingLeft:'2vh',
      paddingRight:'2vh',
      justifyContent:'space-between' }}>
        <Card flat className='d-flex align-center topbar-headline'>
          {menuButton}
          {title}
        </Card>

        <Card flat className='d-flex align-center topbar-actions'>  

            <IconButton className='topbar-action' onClick={() => this.open(fbUrl)}> <Icon path={mdiFacebook} size={1} /> </IconButton>
            <IconButton className='topbar-action' onClick={() => this.open(instaUrl)}> <Icon path={mdiInstagram} size={1} /> </IconButton>
            <IconButton className='topbar-action' onClick={() => this.open(youtubeUrl)}> <Icon path={mdiYoutube} size={1} /> </IconButton>
            <IconButton className='topbar-action' onClick={() => this.open(twitter)}> <Icon path={mdiTwitter} size={1} /> </IconButton>
            <IconButton className='topbar-action' onClick={() => this.open(linkedInUrl)}> <Icon path={mdiLinkedin} size={1} /> </IconButton>
            <IconButton className='topbar-action' onClick={() => this.open(qwiklabUrl)}> <Icon path={mdiGoogleCloud} size={1} /> </IconButton>
            <IconButton className='topbar-action' onClick={() => this.open(githubUrl)}> <Icon path={mdiGithub} size={1} /> </IconButton>
            <ToggleButton className='topbar-action' onChange={onClick} > <Icon path={dark ? mdiLightbulbOutline : mdiLightbulb} size={1} /> </ToggleButton>
          
        </Card>
      </Card>
    )
  }
}

export default Topbar
