import { Media } from './media';

export class Movie extends Media {
  pathMedia: string | null;

  override readonly type: string;

  constructor(data: Partial<Movie>) {
    super(data);
    this.pathMedia = data.pathMedia ?? null;
    this.type = 'Movie';
  }
}
