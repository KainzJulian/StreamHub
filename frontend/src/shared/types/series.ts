import { Media } from './media';
import { Episode } from './seriesEpisode';

export class Series extends Media {
  episodeList: Episode[] = [];

  override readonly type: string;

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

  getFirstEpisodeOfSeason(season: number): Episode {
    const episodeArray = this.getEpisodeArray();

    return episodeArray[season - 1][0];
  }
}
