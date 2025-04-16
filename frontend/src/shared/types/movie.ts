import { Media } from './media';

export class Movie extends Media {
  duration: number | null;
  pathMedia: string | null;

  constructor(data: Partial<Movie>) {
    super(data);
    this.duration = data.duration ?? null;
    this.pathMedia = data.pathMedia ?? null;
  }

  public override getMediaType(): string {
    return 'Movie';
  }
}
