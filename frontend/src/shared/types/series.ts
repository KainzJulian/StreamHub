import { Media } from './media';

export class Series extends Media {
  episodeList: Episode[][] = [];

  constructor(data: Partial<Series>) {
    super(data);
    this.episodeList = data.episodeList ?? [];
  }

  public override getMediaType(): string {
    return 'Series';
  }
}

export class Episode {
  title: string | null;
  pathMedia: string | null;

  constructor(data: Partial<Episode>) {
    this.title = data.title ?? null;
    this.pathMedia = data.pathMedia ?? null;
  }
}
