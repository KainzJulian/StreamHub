import { Routes } from '@angular/router';
import { HomePage } from '../shared/components/pages/home-page/home-page';
import { MediaPage } from '../shared/components/pages/media-page/media-page';
import { SeriesOverviewPage } from '../shared/components/pages/series-overview-page/series-overview-page';
import { MoviePage } from '../shared/components/pages/movie-page/movie-page';
import { SeriesPage } from '../shared/components/pages/series-page/series-page';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'series',
    component: MediaPage,
    data: {
      type: 'series',
    },
  },
  {
    path: 'movies',
    component: MediaPage,
    data: {
      type: 'movies',
    },
  },
  {
    path: 'series/:seriesID',
    component: SeriesOverviewPage,
  },
  {
    path: 'series/player/:id',
    component: SeriesPage,
  },
  {
    path: 'movie/player/:id',
    component: MoviePage,
  },
];
