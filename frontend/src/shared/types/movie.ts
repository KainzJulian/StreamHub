import { Media } from './media';

export class Movie extends Media {
  duration: number;
  pathMedia: string | null;
  durationWatched: number;

  override type: string;

  constructor(data: Partial<Movie>) {
    super(data);
    this.duration = data.duration ?? 0;
    this.pathMedia = data.pathMedia ?? null;
    this.durationWatched = data.durationWatched ?? 0;
    this.type = 'Movie';
  }

  public override getMediaType(): string {
    return 'Movie';
  }
}
