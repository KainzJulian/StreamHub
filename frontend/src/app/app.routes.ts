import { Routes } from '@angular/router';
import { HomePage } from '../shared/components/pages/home-page/home-page';
import { MediaPage } from '../shared/components/pages/media-page/media-page';
import { SeriesOverviewPage } from '../shared/components/pages/series-overview-page/series-overview-page';
import { MoviePage } from '../shared/components/pages/movie-page/movie-page';
import { SeriesPage } from '../shared/components/pages/series-page/series-page';
import { SearchPage } from '../shared/components/pages/search-page/search-page';
import { EditPage } from '../shared/components/pages/edit-page/edit-page';
import { MediaLibrary } from '../shared/components/pages/media-library/media-library';

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
    path: 'series/:seriesID/player/:episodeID',
    component: SeriesPage,
  },
  {
    path: 'movie/player/:id',
    component: MoviePage,
  },
  {
    path: 'search/:input',
    component: SearchPage,
  },
  {
    path: 'search',
    component: SearchPage,
  },
  {
    path: 'edit/:id',
    component: EditPage,
  },
  {
    path: 'library/:type',
    component: MediaLibrary,
  },
];
