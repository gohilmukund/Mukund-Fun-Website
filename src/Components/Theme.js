export function theme(type) {
    switch (type) {

        case themeIndex[0].name: return  themeIndex[0].themeColor;
        case themeIndex[1].name: return  themeIndex[1].themeColor;
        case themeIndex[2].name: return  themeIndex[2].themeColor;
        case themeIndex[3].name: return  themeIndex[3].themeColor;
        case themeIndex[4].name: return  themeIndex[4].themeColor;
        case themeIndex[5].name: return  themeIndex[5].themeColor;

        
        default: return themeIndex[5].themeColor;
    }
    
}


export const themeIndex = [
    {
        name: 'theme1',
        light: '#D6DDFB',
        dark: '#3E3D42',
        themeColor: {                
            '--light-bg': '#D6DDFB',
            '--light-bg-dark-shadow': '#abb1c9',
            '--light-bg-light-shadow': '#ffffff',
            '--primary': '#9c27b0',
            '--primary-dark': '#6a1b9a',
            '--primary-light': '#ce93d8',             
            '--dark-bg': '#3E3D42',
            '--dark-bg-dark-shadow': '#323135',
            '--dark-bg-light-shadow': '#4a494f'
        }
    },
    {
        name: 'theme2',
        light: '#E4EBF5',
        dark: '#444444',
        themeColor: {
            '--light-bg': '#E4EBF5',
            '--light-bg-dark-shadow': '#bec8e4',
            '--light-bg-light-shadow': '#ffffff',
            '--dark-bg': '#444444',
            '--dark-bg-dark-shadow': '#363636',
            '--dark-bg-light-shadow': '#525252',
            '--primary': '#2979ff',
            '--primary-dark': '#2962ff',
            '--primary-light': '#82b1ff',
            '--secondary': '#2979ff',
            '--secondary-dark': '#2962ff',
            '--secondary-light': '#82b1ff'
        }
    },
    {
        name: 'theme3',
        light: '#E9B7B9',
        dark: '#515568',
        themeColor: {
            '--light-bg': '#E9B7B9',
            '--light-bg-dark-shadow': '#ba9294',
            '--light-bg-light-shadow': '#ffdcde',
            '--primary': '#ff1744',
            '--primary-dark': '#d50000',
            '--primary-light': '#ff8a80',                
            '--dark-bg': '#515568',
            '--dark-bg-dark-shadow': '#414453',
            '--dark-bg-light-shadow': '#61667d'
        }
    },
    {
        name: 'theme4',
        light: '#B9D7D2',
        dark: '#243441',
        themeColor: {
            '--light-bg': '#B9D7D2',
            '--light-bg-dark-shadow': '#94aca8',
            '--light-bg-light-shadow': '#defffc',
            '--primary': '#009688',
            '--primary-dark': '#00695c',
            '--primary-light': '#80cbc4',
            '--dark-bg': '#243441',
            '--dark-bg-dark-shadow': '#1d2a34',
            '--dark-bg-light-shadow': '#2b3e4e'
        }
    },
    {
        name: 'theme5',
        light: '#cccccc',
        dark: '#292E35',
        themeColor: {
            '--light-bg': '#cccccc',
            '--light-bg-dark-shadow': '#a3a3a3',
            '--light-bg-light-shadow': '#f5f5f5',
            '--dark-bg': '#292E35',
            '--dark-bg-dark-shadow': '#21252a',
            '--dark-bg-light-shadow': '#313740',
            '--primary': '#8672FB',
            '--primary-dark': '#4526f9',
            '--primary-light': '#c7befd'
        }
    },
    {
        name: 'christmas',
        light: '#e13d37',
        dark: '#235E6F',
        themeColor: {
            '--light-bg': '#e13d37',
            '--light-bg-dark-shadow': '#cc231e',
            '--light-bg-light-shadow': '#e4534e',
            '--dark-bg': '#235E6F',
            '--dark-bg-dark-shadow': '#18424e',
            '--dark-bg-light-shadow': '#2b7488',
            '--primary': '#34A65F',
            '--primary-dark': '#51c87e',
            '--primary-light': '#257443'
        }
    },
    
]