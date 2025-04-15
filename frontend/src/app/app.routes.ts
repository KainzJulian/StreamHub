import { Routes } from '@angular/router';
import { HomePage } from '../shared/components/pages/home-page/home-page';
import { MediaPage } from '../shared/components/pages/media-page/media-page';

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
];
