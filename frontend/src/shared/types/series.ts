import { Media } from './media';
import { Episode } from './seriesEpisode';

// TODO update sort to sort the episodes and seasons of series correctly

export class Series extends Media {
  episodeList: Episode[] = [];

  override type: string;

  constructor(data: Partial<Series>) {
    super(data);
    this.episodeList = data.episodeList ?? [];
    this.type = 'Series';
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
