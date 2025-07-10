import type { Meta, StoryObj } from '@storybook/angular';
import { Genre } from './genre';

const meta: Meta<Genre> = {
  component: Genre,
};

export default meta;

type Story = StoryObj<Genre>;

export const Primary: Story = {
  args: {
    genre: 'Action',
  },
  render: (args) => ({
    props: args,
    template: `<genre />`,
  }),
  name: 'I am the primary',
};
