import type { Preview } from '@storybook/angular';
import { setCompodocJson } from '@storybook/addon-docs/angular';
import { themes, ensure } from 'storybook/theming';

import docJson from '../documentation.json';
setCompodocJson(docJson);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: { theme: themes.dark },
  },
  tags: ['autodocs'],
};

export default preview;
