const { ACCESS_TOKEN, SPACE_ID, ANALYTICS_ID, GOOGLE_TAGMANAGER_ID } = process.env;

const plugins = [
  {
    resolve: `gatsby-theme-mate`,
    options: {
      accessToken: ACCESS_TOKEN,
      spaceId: SPACE_ID,
    },
  },
  {
    resolve: `gatsby-plugin-manifest`,
    options: {
      name: `Mukund's Portfolio`,
      short_name: `MK-Portfolio`,
      start_url: `/`,
      background_color: `#f7f0eb`,
      theme_color: `#a2466c`,
      display: `standalone`,
      icons: [
        {
          src: `/public/icons/icon-48x48.png`,
          sizes: `48x48`,
          type: `image/png`,
        },
        {
          src: `/public/icons/icon-72x72.png`,
          sizes: `72x72`,
          type: `image/png`,
        },
        {
          src: `/public/icons/icon-96x96.png`,
          sizes: `96x96`,
          type: `image/png`,
        },
        {
          src: `/public/icons/icon-144x144.png`,
          sizes: `144x144`,
          type: `image/png`,
        },
        {
          src: `/public/icons/icon-192x192.png`,
          sizes: `192x192`,
          type: `image/png`,
        },
        {
          src: `/public/icons/icon-256x256.png`,
          sizes: `256x256`,
          type: `image/png`,
        },
        {
          src: `/public/icons/icon-384x384.png`,
          sizes: `384x384`,
          type: `image/png`,
        },
        {
          src: `/public/icons/icon-512x512.png`,
          sizes: `512x512`,
          type: `image/png`,
        },
      ]
    },
  },
  `gatsby-plugin-styled-components`,
  `gatsby-plugin-offline`,  
];

if (ANALYTICS_ID) {
  plugins.push({
    resolve: 'gatsby-plugin-google-analytics',
    options: {
      trackingId: ANALYTICS_ID,
    },
  });
}

if (GOOGLE_TAGMANAGER_ID) {
  plugins.push({
    resolve: 'gatsby-plugin-google-tagmanager',
    options: {
      id: GOOGLE_TAGMANAGER_ID,
      defaultDataLayer: function () {
        return {
          pageType: window.pageType,
          platform: "gatsby"
        }
      },
    },
  });
}

module.exports = {
  plugins,
};
