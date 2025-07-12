import type { Meta, StoryObj } from '@storybook/angular';
import { Genre } from './genre';
import { fn } from 'storybook/internal/test';

const meta: Meta<Genre> = {
  component: Genre,
  title: 'atoms/Genre',
  args: {
    genre: 'Science-Fiction',
    onClick: fn(),
  },

  render: (args) => ({
    props: args,
    template: `<genre [genre]="genre" (onClick)="onClick($event)"/>`,
  }),
  tags: ['atoms'],
};

export default meta;

export const base: StoryObj<Genre> = {
  name: 'Base',
};

export const hover: StoryObj<Genre> = {
  name: 'Hover',
  render: (args) => ({
    props: args,
    template: `<genre class="hover-effect" [genre]="genre" (onClick)="onClick($event)"/>`,
  }),
};

export const active: StoryObj<Genre> = {
  name: 'Active',
  render: (args) => ({
    props: args,
    template: `<genre class="active" [genre]="genre" (onClick)="onClick($event)"/>`,
  }),
};
