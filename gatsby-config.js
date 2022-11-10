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
