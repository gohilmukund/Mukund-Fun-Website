import AboutMe from "../Pages/AboutMe"
import Achievements from "../Pages/Achievements"
import Certifications from "../Pages/Certifications"
import Contact_Feedback from "../Pages/ContactMe&Feedback"
import page404 from "../Pages/page404"
import Portfolio from "../Pages/Portfolio"
import Skills from "../Pages/Skills"

  
  const routes = [
    // {
    //   id: 1,
    //   path: '/home',
    //   name: '',
    //   component: Home
    // },
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
    // {
    //   id: 13,
    //   path: '/button-toggle',
    //   name: 'Buttons: Toggle Button',
    //   component: ToggleButtonView
    // },
    // {
    //   id: 3,
    //   path: '/card',
    //   name: 'Card',
    //   component: CardView
    // },
    // {
    //   id: 26,
    //   path: '/carousel',
    //   name: 'Carousel',
    //   component: CarouselView
    // },
    // {
    //   id: 8,
    //   path: '/checkbox',
    //   name: 'Checkbox',
    //   component: CheckboxView
    // },
    // {
    //   id: 23,
    //   path: '/chip',
    //   name: 'Chip',
    //   component: ChipView
    // },
    // {
    //   id: 15,
    //   path: '/dialog',
    //   name: 'Dialog',
    //   component: DialogView
    // },
    // {
    //   id: 15,
    //   path: '/divider',
    //   name: 'Divider',
    //   component: DividerView
    // },
    // // {
    // //   id: 18,
    // //   path: '/expansion-panel',
    // //   name: 'Expansion Panel',
    // //   component: ExpansionPanelView
    // // },
    // // {
    // //   id: 18,
    // //   path: '/form',
    // //   name: 'Form',
    // //   component: FormView
    // // },
    // {
    //   id: 31,
    //   path: '/list',
    //   name: 'List',
    //   component: ListView
    // },
    // // {
    // //   id: 30,
    // //   path: '/menu',
    // //   name: 'Menu',
    // //   component: MenuView
    // // },
    // // {
    // //   id: 29,
    // //   path: '/pagination',
    // //   name: 'Pagination',
    // //   component: PaginationView
    // // },
    // {
    //   id: 37,
    //   path: '/parallax',
    //   name: 'Parallax',
    //   component: ParallaxView
    // },
    // {
    //   id: 17,
    //   path: '/progress-circular',
    //   name: 'Progress: Circular',
    //   component: ProgressCircularView
    // },
    // {
    //   id: 16,
    //   path: '/progress-linear',
    //   name: 'Progress: Linear',
    //   component: ProgressLinearView
    // },
    // {
    //   id: 5,
    //   path: '/radio',
    //   name: 'Radio',
    //   component: RadioView
    // },
    // // {
    // //   id: 21,
    // //   path: '/Select',
    // //   name: 'Select',
    // //   component: SelectView
    // // },
    // // {
    // //   id: 21,
    // //   path: '/slider',
    // //   name: 'Slider',
    // //   component: SliderView
    // // },
    // // {
    // //   id: 7,
    // //   path: '/snackbar',
    // //   name: 'Snackbar',
    // //   component: SnackbarView
    // // },
    // {
    //   id: 28,
    //   path: '/switch',
    //   name: 'Switch',
    //   component: SwitchView
    // },
    // {
    //   id: 19,
    //   path: '/table',
    //   name: 'Table',
    //   component: TableView
    // },
    // {
    //   id: 19,
    //   path: '/tabs',
    //   name: 'Tabs',
    //   component: TabView
    // },
    // {
    //   id: 27,
    //   path: '/text-area',
    //   name: 'TextArea',
    //   component: TextareaView
    // },
    // {
    //   id: 9,
    //   path: '/text-field',
    //   name: 'TextField',
    //   component: TextFieldView
    // },
    // {
    //   id: 22,
    //   path: '/tooltip',
    //   name: 'Tooltip',
    //   component: TooltipView
    // },
    // {
    //   id: 10,
    //   path: '/typography',
    //   name: '',
    //   component: TypographyView
    // },
    // {
    //   id: 100,
    //   path: '/examples',
    //   name: '',
    //   component: Example
    // },
    {
      id: 100,
      path: '*',
      name: '',
      component: page404
    }
  ]
  
  export default routes
  