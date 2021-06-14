export function formatTime(time: number): string {
  if (!time) {
    time = 0;
  }
  time = Math.round(time);
  const seconds: number = time % 60;
  time -= seconds;
  const minutes: number = (time % (60 * 60)) / 60;
  time -= time % (60 * 60);
  const hours: number = time / (60 * 60);
  return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function* parseTextTrackList(textTrackList: TextTrackList): Generator<TextTrack, void, unknown> {
  for (let index = 0; ; index++) {
    const videoTrack: TextTrack = textTrackList[index];
    if (!videoTrack) {
      break;
    }
    yield videoTrack;
  }
}
