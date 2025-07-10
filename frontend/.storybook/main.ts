import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-onboarding', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/angular',
    options: {},
  },

  webpackFinal: async (config) => {
    // Sass alias support
    config.resolve = {
      ...config.resolve,
      alias: {
        ...(config.resolve?.alias || {}),
        '@styles': 'src/styles',
      },
    };

    return config;
  },
};
export default config;
