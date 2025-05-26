module.exports = [{
      plugin: require('../node_modules/gatsby-plugin-fontawesome-css/gatsby-browser.js'),
      options: {"plugins":[]},
    },{
      plugin: require('../node_modules/gatsby-plugin-styled-components/gatsby-browser.js'),
      options: {"plugins":[],"displayName":true,"fileName":true,"minify":true,"namespace":"","transpileTemplateLiterals":true,"topLevelImportPaths":[],"pure":false,"disableVendorPrefixes":false},
    },{
      plugin: require('../node_modules/gatsby-theme-mate/node_modules/gatsby-plugin-manifest/gatsby-browser.js'),
      options: {"plugins":[],"name":"Mate Portfolio","short_name":"Mate","start_url":"/","background_color":"#FFFFFF","theme_color_in_head":false,"display":"minimal-ui","icon":"icon.png","legacy":true,"cache_busting_mode":"query","crossOrigin":"anonymous","include_favicon":true,"cacheDigest":"c565385b61006d035833f32cb663bb51"},
    },{
      plugin: require('../node_modules/gatsby-theme-mate/gatsby-browser.js'),
      options: {"plugins":[],"accessToken":"ym_MYTGHNxBgH7ZENgkQ6158vaDkZ9sBVaPB0I8IXRc","spaceId":"lvsph0h3pwj7"},
    },{
      plugin: require('../node_modules/gatsby-plugin-manifest/gatsby-browser.js'),
      options: {"plugins":[],"name":"Mukund's Portfolio","short_name":"MK-Portfolio","start_url":"/","background_color":"#f7f0eb","theme_color":"#a2466c","display":"standalone","icons":[{"src":"/public/icons/icon-48x48.png","sizes":"48x48","type":"image/png"},{"src":"/public/icons/icon-72x72.png","sizes":"72x72","type":"image/png"},{"src":"/public/icons/icon-96x96.png","sizes":"96x96","type":"image/png"},{"src":"/public/icons/icon-144x144.png","sizes":"144x144","type":"image/png"},{"src":"/public/icons/icon-192x192.png","sizes":"192x192","type":"image/png"},{"src":"/public/icons/icon-256x256.png","sizes":"256x256","type":"image/png"},{"src":"/public/icons/icon-384x384.png","sizes":"384x384","type":"image/png"},{"src":"/public/icons/icon-512x512.png","sizes":"512x512","type":"image/png"}],"legacy":true,"theme_color_in_head":true,"cache_busting_mode":"query","crossOrigin":"anonymous","include_favicon":true,"cacheDigest":null},
    },{
      plugin: require('../node_modules/gatsby-plugin-offline/gatsby-browser.js'),
      options: {"plugins":[]},
    },{
      plugin: require('../node_modules/gatsby-plugin-google-tagmanager/gatsby-browser.js'),
      options: {"plugins":[],"id":"G-B56FJSCQWW","defaultDataLayer":{"type":"function","value":"function () {\r\n        return {\r\n          pageType: window.pageType,\r\n          platform: \"gatsby\"\r\n        }\r\n      }"},"includeInDevelopment":false,"routeChangeEventName":"gatsby-route-change","enableWebVitalsTracking":false,"selfHostedOrigin":"https://www.googletagmanager.com"},
    },{
      plugin: require('../node_modules/gatsby/dist/internal-plugins/partytown/gatsby-browser.js'),
      options: {"plugins":[]},
    }]
