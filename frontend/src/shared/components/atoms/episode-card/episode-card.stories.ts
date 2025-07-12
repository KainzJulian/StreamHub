import { Meta, StoryObj } from '@storybook/angular';
import { EpisodeCard } from './episode-card';
import { Episode } from '../../../types/seriesEpisode';
import { MediaRouterService } from '../../../services/media-router.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { fn } from 'storybook/internal/test';
import { MediaGenre } from '../../../types/genre';

const episode = new Episode({
  title: 'Test Title',
  duration: 100,
  durationWatched: 50,
  episode: 1,
  season: 1,
  rating: 99,
  isComplete: false,
  watched: false,
  type: 'Episode',
  description: 'This is a test Description',
  id: '1234',
  seriesID: 'ABCD',
  genreList: [MediaGenre.ACTION, MediaGenre.ADVENTURE],
});

const meta: Meta<EpisodeCard> = {
  component: EpisodeCard,
  title: 'atoms/EpisodeCard',

  args: {
    episode: episode,
    isSelected: false,
  },
  render: (args) => ({
    props: args,
    template: `<episode-card (onClick)="onClick($event)" [episode]="episode" [isSelected]="isSelected"></episode-card>`,
    moduleMetadata: {
      imports: [HttpClientModule, RouterTestingModule],
      providers: [
        {
          provide: MediaRouterService,
          useValue: {
            openSeriesPlayer: (seriesID: string, episodeID: string) => {},
          },
        },
        HttpClient,
        Router,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => 'mock-series-id',
              },
            },
          },
        },
      ],
    },
  }),
  tags: ['atoms'],
};

export default meta;

export const base: StoryObj<EpisodeCard> = {
  name: 'Base',
};
