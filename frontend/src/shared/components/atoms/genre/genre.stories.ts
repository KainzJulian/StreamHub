import type { Meta, StoryObj } from '@storybook/angular';
import { Genre } from './genre';

const meta: Meta<Genre> = {
  component: Genre,
  args: {
    genre: 'Action',
  },
};

export default meta;

export const Primary: StoryObj<Genre> = {
  args: {
    genre: 'Action',
  },

  // render: (args) => ({
  //   props: args,
  //   template: `<genre />`,
  // }),

  parameters: {
    test: {
      test: 'hi',
      test2: 'hi2',
    },
  },

  name: 'Genre',
};
