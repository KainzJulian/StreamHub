import { Media } from './media';

export class CurrentMedia {
  currentMedia: Media | null;
  timestamp: number;

  constructor(data: Partial<CurrentMedia>) {
    this.currentMedia = data.currentMedia || null;
    this.timestamp = data.timestamp || 0;
  }
}
