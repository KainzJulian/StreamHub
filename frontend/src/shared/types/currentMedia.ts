export class CurrentMedia {
  mediaID: string;

  constructor(data: Partial<CurrentMedia>) {
    this.mediaID = data.mediaID ?? '';
  }
}
