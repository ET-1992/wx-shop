module.exports = function (api) {
    api.cache(true);
    const presets = [
        [
            '@babel/preset-env',
            {
                'forceAllTransforms': true
            }
        ]
    ];
    const plugins = [
        ['import', {
            'libraryName': 'peanut-all',
            'camel2UnderlineComponentName': false,
            'camel2DashComponentName': false
        }],
        'lodash',
        ['module-resolver', {
            'root': ['./src'],
        }],
        [
            '@babel/transform-runtime', {
                'helpers': false,
                'regenerator': true
            }
        ]
    ];
    return {
        presets,
        plugins
    };
};