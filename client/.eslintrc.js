module.exports = {
  parser: '@typescript-eslint/parser', // add the TypeScript parser
  plugins: [
    'svelte3',
    '@typescript-eslint' // add the TypeScript plugin
  ],
  ignorePatterns: ['GlobalStyles.svelte'],
  env: {
    es6: true,
    browser: true
  },
  globals: {
    gapi: 'readonly'
  },
  overrides: [
    // this stays the same
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3'
    }
  ],
  settings: {
    'svelte3/typescript': () => require('typescript') // pass the TypeScript package to the Svelte plugin
  },
  parserOptions: {
    // add these parser options
    ecmaVersion: 2019,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
    extraFileExtensions: ['.svelte']
  },
  extends: [
    // then, enable whichever type-aware rules you want to use
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
    'plugin:import/errors',
    'plugin:import/typescript'
  ],
  rules: {
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { vars: 'all', varsIgnorePattern: '^_', args: 'all', argsIgnorePattern: '^_', caughtErrors: 'none' }
    ],
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/quotes': ['error', 'single', { avoidEscape: true }],
    'comma-dangle': ['error', 'never'],
    '@typescript-eslint/comma-spacing': [2, { before: false, after: true }],
    'max-len': ['error', { code: 120, ignoreStrings: true, ignoreRegExpLiterals: true }],
    'max-lines': ['error', 1050],
    'no-empty': ['error'],
    eqeqeq: ['error'],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-empty-interface': ['error'],
    curly: ['error'],
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/typedef': [
      'error',
      {
        arrayDestructuring: false,
        arrowParameter: false,
        memberVariableDeclaration: true,
        objectDestructuring: false,
        parameter: true,
        propertyDeclaration: true
      }
    ],
    '@typescript-eslint/explicit-member-accessibility': ['error'],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-types': ['error', { types: { object: false } }]
  }
};
