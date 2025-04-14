import { Genre } from './genre';

export class Media {
  id: string | null;
  title: string | null;
  description: string | null;
  duration: number | null;
  genreList: Genre[] | null;
  pathMedia: string | null;

  isComplete: boolean = false;

  rating: number | null;

  isSeries: boolean | null;
  season: number | null;
  episode: number | null;

  constructor(data: Partial<Media>) {
    this.id = data.id ?? null;
    this.title = data.title ?? null;
    this.description = data.description ?? null;
    this.duration = data.duration ?? null;
    this.genreList = data.genreList ?? null;
    this.pathMedia = data.pathMedia ?? null;
    this.rating = data.rating ?? null;

    this.isSeries = data.isSeries ?? null;
    this.season = data.season ?? null;
    this.episode = data.episode ?? null;
    this.isComplete = data.isComplete ?? false;
  }

  public getMediaType(): string {
    return this.isSeries ? 'Series' : 'Movie';
  }
}
