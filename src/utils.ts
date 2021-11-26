import { EventStatus, IEvent } from "./global.types";

export const withStatus = (events: IEvent[], status: EventStatus): IEvent[] => {
  return events.map((e) => {
    return { ...e, status };
  });
};

export const formatTime = (duration: number): string => {
  const seconds = Math.floor((duration % 60000) / 1000);
  const minutes = Math.floor(duration / 60000);
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};
