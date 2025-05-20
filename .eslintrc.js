module.exports = {
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "./tsconfig.json",
        "sourceType": "module"
    },
    "plugins": ["@typescript-eslint"],
    overrides: [
        {
            files: ['src/store/api/apiSlice.ts'],
            rules: {
                'eslint-disable': 'off',
            }
        }
    ],
};