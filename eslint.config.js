// ESLint 9 flat config — API (Node.js / TypeScript / ESM)
// Prettier runs INSIDE ESLint (eslint-plugin-prettier), so `npm run lint`
// covers both code quality AND formatting.
//
// ⚡ TYPE-AWARE linting is enabled (projectService) — allows rules that
// use type information (no-floating-promises, etc.). Slower, but catches
// real async bugs. If it becomes heavy in the editor: swap `recommended-type-checked`
// with `recommended` and remove the type-aware rules block below.
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default [
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            'build/**',
            'public/**',
            'uploads/**',
            'ai-blueprint/**',
            '.eslintrc.cjs',
            '.github/**',
            '.vscode/**',
            '.idea/**',
            '.zed/**',
            '.claude/**',
            'bash/**',
            'templates/**',
            '**/*.yml',
            '**/*.yaml',
            '**/*.md',
            '**/*.json',
        ],
    },

    js.configs.recommended,

    // ── TypeScript source (type-aware) ──
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
            globals: {
                ...globals.node,
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            'simple-import-sort': simpleImportSort,
        },
        rules: {
            ...tsPlugin.configs['recommended-type-checked'].rules,

            // TS already covers undefined names and unused vars
            'no-undef': 'off',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' },
            ],

            // ── noisy with strict:false + any → disabled to avoid flooding the code ──
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/restrict-template-expressions': 'off',
            '@typescript-eslint/no-redundant-type-constituents': 'off',

            // ── async safety (because of 45 catch / 7 await-in-loop) ⭐ ──
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/await-thenable': 'error',
            '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
            '@typescript-eslint/require-await': 'warn',
            '@typescript-eslint/return-await': ['error', 'in-try-catch'],
            'no-await-in-loop': 'warn',
            '@typescript-eslint/only-throw-error': 'warn',

            // ── cleanliness / consistency ──
            '@typescript-eslint/consistent-type-imports': [
                'warn',
                { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
            ],
            '@typescript-eslint/no-non-null-assertion': 'warn',
            'no-shadow': 'off',
            '@typescript-eslint/no-shadow': 'warn',
            'no-unused-expressions': 'off',
            '@typescript-eslint/no-unused-expressions': 'error',

            // ── code quality (inherited from the old .eslintrc.cjs) ──
            eqeqeq: ['error', 'always'],
            'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
            'consistent-return': 'error',
            'no-var': 'error',
            'prefer-const': 'error',
            'object-shorthand': ['warn', 'always'],

            // ── object destructuring ──
            'prefer-destructuring': [
                'warn',
                {
                    VariableDeclarator: { array: false, object: true },
                    AssignmentExpression: { array: false, object: false },
                },
                { enforceForRenamedProperties: false },
            ],

            // ── import ordering (generic: external → internal → relative) ──
            'simple-import-sort/imports': [
                'warn',
                {
                    groups: [
                        ['^node:', '^@?\\w'], // Node builtins + external libraries
                        ['^'], // absolute internal
                        ['^\\.\\.'], // parent relative (../)
                        ['^\\.'], // same folder (./)
                    ],
                },
            ],
            'simple-import-sort/exports': 'warn',
        },
    },

    // ── JS / config files (vite-like, without type-aware) ──
    {
        files: ['**/*.{js,cjs,mjs}'],
        languageOptions: {
            globals: { ...globals.node },
        },
    },

    // IMPORTANT: last — disables formatting rules that conflict with Prettier,
    // and activates `prettier/prettier`.
    prettierRecommended,
];
