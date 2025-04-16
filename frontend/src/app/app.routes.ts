import { Routes } from '@angular/router';
import { HomePage } from '../shared/components/pages/home-page/home-page';
import { MediaPage } from '../shared/components/pages/media-page/media-page';
import { VideoPage } from '../shared/components/pages/video-page/video-page';
import { SeriesOverviewPage } from '../shared/components/pages/series-overview-page/series-overview-page';

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
    path: 'player/:videoID',
    component: VideoPage,
  },
  {
    path: 'series/:seriesID',
    component: SeriesOverviewPage,
  },
];
