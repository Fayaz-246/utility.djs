import chalk from "chalk";

export type Urgency = "low" | "med" | "high";

const error = (level: Urgency, text: string): never => {
  const colorMap: Record<Urgency, (s: string) => string> = {
    low: chalk.cyanBright,
    med: chalk.yellowBright,
    high: chalk.redBright,
  };

  const message = `[UTILITY.DJS] ERROR: ${text}`;
  // Print the colored message to stderr for errors
  process.stderr.write(colorMap[level](message) + "\n");
  throw new Error(message);
};

export default error;
