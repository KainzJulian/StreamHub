import { Media } from './media';

export class Series extends Media {
  episodeList: Episode[] = [];

  constructor(data: Partial<Series>) {
    super(data);
    this.episodeList = data.episodeList ?? [];
  }

  getEpisodeArray(): Episode[][] {
    const array: Episode[][] = [];

    const seasons = Array.from(
      new Set(this.episodeList.map((item) => item.season))
    );

    seasons.forEach((season) => {
      array.push(
        this.episodeList.filter((episode) => episode.season == season)
      );
    });

    console.log(array);

    return array;
  }

  public override getMediaType(): string {
    return 'Series';
  }
}

export class Episode {
  id: string;
  title: string | null;
  pathMedia: string | null;

  season: number;
  episode: number;

  constructor(data: Partial<Episode>) {
    this.id = data.id ?? '';
    this.title = data.title ?? null;
    this.pathMedia = data.pathMedia ?? null;
    this.season = data.season ?? 0;
    this.episode = data.episode ?? 0;
  }
}
