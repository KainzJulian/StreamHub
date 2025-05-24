import { Media } from './media';

export class Episode extends Media {
  pathMedia: string | null;

  season: number;
  episode: number;

  seriesID: string;

  durationWatched: number;
  duration: number;

  override type: string;

  constructor(data: Partial<Episode>) {
    super(data);
    this.pathMedia = data.pathMedia ?? null;
    this.season = data.season ?? 0;
    this.episode = data.episode ?? 0;
    this.seriesID = data.seriesID ?? '';
    this.type = 'Episode';
    this.durationWatched = data.durationWatched ?? 0;
    this.duration = data.duration ?? 0;
  }

  public override getMediaType(): string {
    return 'Episode';
  }
}
