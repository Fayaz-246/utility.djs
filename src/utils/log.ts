import chalk from "chalk";

type urgency = "low" | "med" | "high";

const log = (uni: urgency, text: string): void => {
  const table: Record<urgency, (s: string) => void> = {
    low: chalk.cyan,
    med: chalk.yellow,
    high: chalk.redBright,
  };

  console.log(table[uni]("[UTILITY.DJS] ") + chalk.white.bold(`${text}`));
};

export default log;
