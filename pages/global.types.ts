export type EventStatus = "stopped" | "playing";

export interface IEvent {
  id: number;
  status: EventStatus;
  name: string;
  duration: number;
}
