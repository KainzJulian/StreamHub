import { Genre } from './genre';

export abstract class Media {
  id: string = '';
  title: string | null;
  description: string | null;
  genreList: Genre[] | null;

  isComplete: boolean = false;

  rating: number | null;

  constructor(data: Partial<Media>) {
    this.id = data.id ?? '';
    this.title = data.title ?? null;
    this.description = data.description ?? null;
    this.genreList = data.genreList ?? null;
    this.rating = data.rating ?? null;
    this.isComplete = data.isComplete ?? false;
  }

  public abstract getMediaType(): string;
}
