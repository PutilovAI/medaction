'use strict';
const getClientEnvironment = require('./env');
const publicUrl = '';
const env = getClientEnvironment(publicUrl);

const Theme = require(`./themes/theme_${env.raw.THEME}`);

module.exports = {
    postcss: [
        require('postcss-smart-import'),
        require('postcss-mixins'),
        require('postcss-nested'),

        require('postcss-for'),
        /*  Обычный postcss-each работет некоректно с (ключ,значение) */
        require('postcss-sass-each'),
        require('postcss-simple-vars'),


        require('postcss-custom-properties')({
          variables: Theme
        }),
        require('postcss-color-function'),
        require('postcss-math'),

        require('postcss-media-minmax'),
        require('postcss-custom-media'),
        require('postcss-cssnext')({
            autoprefixer: {
                browsers: [
                '>1%',
                'last 4 versions',
                'Firefox ESR',
                'not ie < 9', // React doesn't support IE8 anyway
                ],
                flexbox: 'no-2009',
            },
        }),
        require('lost'),

        require('postcss-image-sizes')
    ],
    theme: Theme,
    apiUrl:{
        dev: 'http://lvh.me:16040',
        prod: Theme.API_HOST,
    }
}
