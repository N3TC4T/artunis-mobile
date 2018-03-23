const blacklist = require('metro/src/blacklist');

module.exports = {
    getProjectRoots() {
        return [__dirname];
    },

    getAssetExts() {
        return [];
    },

    getPlatforms() {
        return [];
    },

    getBlacklistRE() {
        const additionalBlacklist = [
            /ignore-this-directory\/.*/
        ];
        return blacklist(additionalBlacklist);
    },

    getTransformModulePath() {
        return require.resolve('./transformer');
    }
};
