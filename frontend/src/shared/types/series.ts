import { Media } from './media';

export class Series {
  id: string;
  mediaIDList: Media[];

  constructor(data: Series) {
    this.id = data.id;
    this.mediaIDList = data.mediaIDList;
  }

  addMedia(media: Media) {
    if (this.mediaIDList.find((m) => m.id === media.id)) {
      return;
    }

    this.mediaIDList.push(media);
  }
}
