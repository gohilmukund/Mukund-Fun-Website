import AboutMe from "../Pages/AboutMe"
import Achievements from "../Pages/Achievements"
import Certifications from "../Pages/Certifications"
import Contact_Feedback from "../Pages/ContactMe&Feedback"
import page404 from "../Pages/page404"
import Portfolio from "../Pages/Portfolio"
import Skills from "../Pages/Skills"

  
  const routes = [
    {
      id: 2,
      path: '/portfolio',
      name: 'Portfolio',
      component: Portfolio
    },
    {
      id: 3,
      path: '/skills',
      name: 'Skills',
      component: Skills
    },
    {
      id: 4,
      path: '/achievements',
      name: 'Achievements',
      component: Achievements
    },
    {
      id: 5,
      path: '/Certifications',
      name: 'Certifications',
      component: Certifications
    },
    {
      id: 6,
      path: '/about',
      name: 'About Me',
      component: AboutMe
    },
    {
      id: 7,
      path: '/contact',
      name: 'Contact Me',
      component: Contact_Feedback
    },
    {
      id: 100,
      path: '*',
      name: '',
      component: page404
    }
  ]
  
  export default routes
  