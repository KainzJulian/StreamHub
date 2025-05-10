import { Media } from './media';

// TODO update sort to sort the episodes and seasons of series correctly

export class Series extends Media {
  episodeList: Episode[] = [];

  constructor(data: Partial<Series>) {
    super(data);
    this.episodeList = data.episodeList ?? [];
  }

  getSeasons(): number[] {
    return Array.from(new Set(this.episodeList.map((item) => item.season)));
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

    return array;
  }

  public override getMediaType(): string {
    return 'Series';
  }

  getFirstEpisodeOfSeason(season: number): Episode {
    const episodeArray = this.getEpisodeArray();

    return episodeArray[season - 1][0];
  }
}

export class Episode extends Media {
  pathMedia: string | null;

  season: number;
  episode: number;

  constructor(data: Partial<Episode>) {
    super(data);
    this.pathMedia = data.pathMedia ?? null;
    this.season = data.season ?? 0;
    this.episode = data.episode ?? 0;
  }

  public override getMediaType(): string {
    return 'Episode';
  }
}
