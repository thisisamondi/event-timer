export const timerChannel = new BroadcastChannel("clockd-timer");

export function broadcastTimer(state: any) {
  timerChannel.postMessage(state);
}
