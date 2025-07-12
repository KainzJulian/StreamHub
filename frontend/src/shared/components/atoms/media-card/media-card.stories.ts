import { Meta, StoryObj } from '@storybook/angular';
import { MediaCard } from './media-card';
import { HttpClientModule } from '@angular/common/http';
import { MediaRouterService } from '../../../services/media-router.service';
import { MediaRouterServiceMock } from '../../../mock/media-router-service.mock';
import { MediaService } from '../../../services/media.service';
import { SimpleChanges } from '@angular/core';
import { fn } from 'storybook/internal/test';

const template = `<media-card></media-card>`;

const meta: Meta<MediaCard> = {
  component: MediaCard,
  title: 'atoms/MediaCard',
  args: {
    ngOnChanges: (changes: SimpleChanges) => {},
    openPlayer: fn(),
  },

  render: (args) => ({
    props: args,
    template: template,
    moduleMetadata: {
      imports: [HttpClientModule],
      providers: [
        {
          provide: MediaRouterService,
          useClass: MediaRouterServiceMock,
        },
        {
          provide: MediaService,
        },
      ],
    },
  }),
  tags: ['atoms'],
};

export default meta;

export const defaultMediaCard: StoryObj<MediaCard> = {
  name: 'default',
  args: {},
};
