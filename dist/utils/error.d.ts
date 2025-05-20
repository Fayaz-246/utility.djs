export type Urgency = "low" | "med" | "high";
declare const error: (level: Urgency, text: string) => never;
export default error;
