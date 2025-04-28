import { Media } from './media';

export class Movie extends Media {
  duration: number | null;
  pathMedia: string | null;
  durationWatched: number;

  constructor(data: Partial<Movie>) {
    super(data);
    this.duration = data.duration ?? null;
    this.pathMedia = data.pathMedia ?? null;
    this.durationWatched = data.durationWatched ?? 0;
  }

  public override getMediaType(): string {
    return 'Movie';
  }
}
