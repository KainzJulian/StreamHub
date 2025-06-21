import { MediaGenre } from './genre';

export abstract class Media {
  id: string = '';
  title: string | null;
  description: string | null;
  genreList: MediaGenre[] | null;

  isComplete: boolean;

  rating: number | null;
  watched: boolean;

  durationWatched: number;
  duration: number;

  abstract type: string;

  constructor(data: Partial<Media>) {
    this.id = data.id ?? '';
    this.title = data.title ?? null;
    this.description = data.description ?? null;
    this.genreList = data.genreList ?? null;
    this.rating = data.rating ?? null;
    this.isComplete = data.isComplete ?? true;
    this.watched = data.watched ?? false;
    this.duration = data.duration ?? 0;
    this.durationWatched = data.durationWatched ?? 0;
  }

  public abstract getMediaType(): string;
}
