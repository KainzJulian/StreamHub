import { Meta, StoryObj } from '@storybook/angular';
import { BaseButton } from './base-button';
import { fn } from 'storybook/internal/test';

const template = (classes: string[], input: string) =>
  `<base-button class="${classes}" (onClick)="onClick($event)"><p>${input}</p></base-button>`;

const p = (input: string) => ``;

const meta: Meta<BaseButton> = {
  component: BaseButton,
  title: 'atoms/BaseButton',
  args: {
    onClick: fn(),
  },

  render: (args) => ({
    props: args,
    template: template([], 'Default'),
  }),

  tags: ['atoms'],
};

export default meta;

export const Base: StoryObj<BaseButton> = {
  name: 'Default',
};

export const headerButton: StoryObj<BaseButton> = {
  name: 'HeaderButton',
  args: {},

  render: (args) => ({
    props: args,
    template: template(['header__button'], 'HeaderButton'),
  }),
};

export const width300: StoryObj<BaseButton> = {
  name: 'Width 300',
  args: {},

  render: (args) => ({
    props: args,
    template: template(['width--300'], 'Width 300'),
  }),
};

export const width150: StoryObj<BaseButton> = {
  name: 'Width 150',
  args: {},

  render: (args) => ({
    props: args,
    template: template(['width--150'], 'Width 150'),
  }),
};

export const dropdownButton: StoryObj<BaseButton> = {
  name: 'Dropdown Button',
  args: {},

  render: (args) => ({
    props: args,
    template: template(['dropdown__button'], 'Dropdown Button'),
  }),
};

export const dropdownListButton: StoryObj<BaseButton> = {
  name: 'Dropdown List Button',
  args: {},

  render: (args) => ({
    props: args,
    template: template(['dropdown__list__button'], 'Dropdown List Button'),
  }),
};

export const bannerButton: StoryObj<BaseButton> = {
  name: 'Banner Button',
  args: {},

  render: (args) => ({
    props: args,
    template: template(['banner__button'], 'Banner Button'),
  }),
};

export const mediaListButton: StoryObj<BaseButton> = {
  name: 'Media List Button',
  args: {},

  render: (args) => ({
    props: args,
    template: template(['media-list__button'], 'Media List Button'),
  }),
};
