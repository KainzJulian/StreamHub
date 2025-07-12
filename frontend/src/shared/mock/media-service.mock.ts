import { MediaService } from '../services/media.service';
import { Media } from '../types/media';

export class MediaServiceMock extends MediaService {
  public override addToWatchHistory(media: Media): void {}
}
