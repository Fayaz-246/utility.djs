import chalk from "chalk";

const utilog = (data, type) => {
  if (!data) throw TypeError("NO DATA");
  if (!type) throw TypeError("NO type");

  if (type === "red") return `${chalk.red("[UTILITY.DJS]")} || ${data}`;
  else if (type === "green")
    return `${chalk.green("[UTILITY.DJS]")} || ${data}`;
  else if (type === "yellow")
    return `${chalk.yellow("[UTILITY.DJS]")} || ${data}`;
  else throw TypeError("INVALID TYPE");
};

export { utilog };
