type urgency = "low" | "med" | "high";
declare const log: (uni: urgency, text: string) => void;
export default log;
