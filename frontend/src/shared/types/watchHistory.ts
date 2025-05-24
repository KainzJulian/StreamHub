// ? Could possible be used for multiple users with different histories
// export class WatchHistory {
//   history: WatchHistoryItem[] | null;

//   constructor(data: Partial<WatchHistory>) {
//     this.history = data.history ?? null;
//   }
// }

// TODO: When clicking on the same movie over and over remove only save movie once in the watch history
export class WatchHistoryItem {
  // id: string | null;
  type: string;
  time: Date | null;
  id: string | null;

  constructor(data: Partial<WatchHistoryItem>) {
    this.id = data.id ?? null;
    this.type = data.type ?? '';
    this.time = data.time ?? null;
  }
}
