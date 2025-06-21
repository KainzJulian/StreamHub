import { Media } from './media';

export class Movie extends Media {
  pathMedia: string | null;

  override type: string;

  constructor(data: Partial<Movie>) {
    super(data);
    this.pathMedia = data.pathMedia ?? null;
    this.type = 'Movie';
  }

  public override getMediaType(): string {
    return 'Movie';
  }
}
