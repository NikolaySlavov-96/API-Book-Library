module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    root: true,
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['prettier', '@typescript-eslint'],
    rules: {
        // 'linebreak-style': ['error', 'unix', 'windows'],
        // 'no-explicit-any': 'error', // For future
        'no-unused-vars': 'error',
        'eqeqeq': 'error',
        'no-console': 'warn',
        'indent': ['error', 4, { SwitchCase: 1, }],
        'semi-spacing': 'error',
        'consistent-return': 'error',
        'object-curly-spacing': ['error', 'always', { 'arraysInObjects': true, }],
        'space-before-blocks': 'error',
        'space-before-function-paren': ['error', {
            'anonymous': 'always',
            'named': 'never',
            'asyncArrow': 'always',
        }],
        'array-type': ['error', 'array'],
        'key-spacing': ['error', { 'afterColon': true, }],
        'keyword-spacing': ['error', { 'before': true, }],
        'no-useless-empty-export': 'error',
        'no-floating-promises': 'error',
        'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true, }],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'arrow-parens': ['error', 'always'],
        'brace-style': ['error', '1tbs', { 'allowSingleLine': true, }],
        'comma-dangle': ['error',
            {
                'functions': 'never',
                'arrays': 'never',
                'imports': 'always',
                'exports': 'always',
                'objects': 'always',
            }],
        'no-multiple-empty-lines': [
            'error',
            {
                max: 2,
            }
        ],
        'no-require-imports': 'error',
        'block-spacing': 'error',
        'comma-spacing': [
            'error',
            {
                before: false,
                after: true,
            }
        ],
        'max-len': [
            'error',
            {
                code: 120,
                tabWidth: 2,
            }
        ],
    },
    ignorePatterns: ['node_modules', 'build', 'dist', 'public'],
};