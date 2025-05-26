var plugins = [{
      name: 'gatsby-plugin-fontawesome-css',
      plugin: require('C:/Project/Github/Mukund-Fun-Website/node_modules/gatsby-plugin-fontawesome-css/gatsby-ssr.js'),
      options: {"plugins":[]},
    },{
      name: 'gatsby-plugin-react-helmet',
      plugin: require('C:/Project/Github/Mukund-Fun-Website/node_modules/gatsby-plugin-react-helmet/gatsby-ssr.js'),
      options: {"plugins":[]},
    },{
      name: 'gatsby-plugin-styled-components',
      plugin: require('C:/Project/Github/Mukund-Fun-Website/node_modules/gatsby-plugin-styled-components/gatsby-ssr.js'),
      options: {"plugins":[],"displayName":true,"fileName":true,"minify":true,"namespace":"","transpileTemplateLiterals":true,"topLevelImportPaths":[],"pure":false,"disableVendorPrefixes":false},
    },{
      name: 'gatsby-plugin-image',
      plugin: require('C:/Project/Github/Mukund-Fun-Website/node_modules/gatsby-plugin-image/gatsby-ssr.js'),
      options: {"plugins":[]},
    },{
      name: 'gatsby-plugin-manifest',
      plugin: require('C:/Project/Github/Mukund-Fun-Website/node_modules/gatsby-theme-mate/node_modules/gatsby-plugin-manifest/gatsby-ssr.js'),
      options: {"plugins":[],"name":"Mate Portfolio","short_name":"Mate","start_url":"/","background_color":"#FFFFFF","theme_color_in_head":false,"display":"minimal-ui","icon":"icon.png","legacy":true,"cache_busting_mode":"query","crossOrigin":"anonymous","include_favicon":true,"cacheDigest":"c565385b61006d035833f32cb663bb51"},
    },{
      name: 'gatsby-plugin-manifest',
      plugin: require('C:/Project/Github/Mukund-Fun-Website/node_modules/gatsby-plugin-manifest/gatsby-ssr.js'),
      options: {"plugins":[],"name":"Mukund's Portfolio","short_name":"MK-Portfolio","start_url":"/","background_color":"#f7f0eb","theme_color":"#a2466c","display":"standalone","icons":[{"src":"/public/icons/icon-48x48.png","sizes":"48x48","type":"image/png"},{"src":"/public/icons/icon-72x72.png","sizes":"72x72","type":"image/png"},{"src":"/public/icons/icon-96x96.png","sizes":"96x96","type":"image/png"},{"src":"/public/icons/icon-144x144.png","sizes":"144x144","type":"image/png"},{"src":"/public/icons/icon-192x192.png","sizes":"192x192","type":"image/png"},{"src":"/public/icons/icon-256x256.png","sizes":"256x256","type":"image/png"},{"src":"/public/icons/icon-384x384.png","sizes":"384x384","type":"image/png"},{"src":"/public/icons/icon-512x512.png","sizes":"512x512","type":"image/png"}],"legacy":true,"theme_color_in_head":true,"cache_busting_mode":"query","crossOrigin":"anonymous","include_favicon":true,"cacheDigest":null},
    },{
      name: 'gatsby-plugin-offline',
      plugin: require('C:/Project/Github/Mukund-Fun-Website/node_modules/gatsby-plugin-offline/gatsby-ssr.js'),
      options: {"plugins":[]},
    },{
      name: 'gatsby-plugin-google-tagmanager',
      plugin: require('C:/Project/Github/Mukund-Fun-Website/node_modules/gatsby-plugin-google-tagmanager/gatsby-ssr.js'),
      options: {"plugins":[],"id":"G-B56FJSCQWW","defaultDataLayer":{"type":"function","value":"function () {\r\n        return {\r\n          pageType: window.pageType,\r\n          platform: \"gatsby\"\r\n        }\r\n      }"},"includeInDevelopment":false,"routeChangeEventName":"gatsby-route-change","enableWebVitalsTracking":false,"selfHostedOrigin":"https://www.googletagmanager.com"},
    },{
      name: 'partytown',
      plugin: require('C:/Project/Github/Mukund-Fun-Website/node_modules/gatsby/dist/internal-plugins/partytown/gatsby-ssr.js'),
      options: {"plugins":[]},
    }]
/* global plugins */
// During bootstrap, we write requires at top of this file which looks like:
// var plugins = [
//   {
//     plugin: require("/path/to/plugin1/gatsby-ssr.js"),
//     options: { ... },
//   },
//   {
//     plugin: require("/path/to/plugin2/gatsby-ssr.js"),
//     options: { ... },
//   },
// ]

const apis = require(`./api-ssr-docs`)

function augmentErrorWithPlugin(plugin, err) {
  if (plugin.name !== `default-site-plugin`) {
    // default-site-plugin is user code and will print proper stack trace,
    // so no point in annotating error message pointing out which plugin is root of the problem
    err.message += ` (from plugin: ${plugin.name})`
  }

  throw err
}

export function apiRunner(api, args, defaultReturn, argTransform) {
  if (!apis[api]) {
    console.log(`This API doesn't exist`, api)
  }

  const results = []
  plugins.forEach(plugin => {
    const apiFn = plugin.plugin[api]
    if (!apiFn) {
      return
    }

    try {
      const result = apiFn(args, plugin.options)

      if (result && argTransform) {
        args = argTransform({ args, result })
      }

      // This if case keeps behaviour as before, we should allow undefined here as the api is defined
      // TODO V4
      if (typeof result !== `undefined`) {
        results.push(result)
      }
    } catch (e) {
      augmentErrorWithPlugin(plugin, e)
    }
  })

  return results.length ? results : [defaultReturn]
}

export async function apiRunnerAsync(api, args, defaultReturn, argTransform) {
  if (!apis[api]) {
    console.log(`This API doesn't exist`, api)
  }

  const results = []
  for (const plugin of plugins) {
    const apiFn = plugin.plugin[api]
    if (!apiFn) {
      continue
    }

    try {
      const result = await apiFn(args, plugin.options)

      if (result && argTransform) {
        args = argTransform({ args, result })
      }

      // This if case keeps behaviour as before, we should allow undefined here as the api is defined
      // TODO V4
      if (typeof result !== `undefined`) {
        results.push(result)
      }
    } catch (e) {
      augmentErrorWithPlugin(plugin, e)
    }
  }

  return results.length ? results : [defaultReturn]
}
