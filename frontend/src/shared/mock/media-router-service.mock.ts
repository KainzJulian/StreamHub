import { MediaRouterService } from '../services/media-router.service';
import { LibraryListType } from '../types/libraryListType';
import { Media } from '../types/media';

export class MediaRouterServiceMock extends MediaRouterService {
  override openEditPage(id: string): void {
    console.log('id', id);
  }

  override openLibraryPage(type: LibraryListType): void {
    console.log('type', type);
  }

  override openMoviePlayer(id: string): void {
    console.log('id', id);
  }

  override openSearch(input: string): void {
    console.log('input', input);
  }

  override openMediaPlayer(media: Media): void {
    console.log('media', media);
  }

  override openSeriesPlayer(seriesID: string, id: string): void {
    console.log('seriesID', seriesID, 'id', id);
  }
}
