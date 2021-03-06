import chalk from "chalk";

const info = chalk.blue;
const success = chalk.bold.green;
const warn = chalk.hex("#FFA500");

export enum LogLevel {
  WARN,
  SUCCESS,
  INFO,
  DEBUG,
}

let logLevel = LogLevel.INFO;

export const Logger = {
  setLogLevel: (level: LogLevel) => {
    logLevel = level;
  },
  debug: (message: string) => {
    if (logLevel < LogLevel.DEBUG) return;

    const time = performance.now();
    console.log(`đ§  ${Math.floor(time)}: ${message}`);
  },
  info: (message: string) => {
    if (logLevel < LogLevel.INFO) return;

    console.log(info(`âšī¸  ${message}`));
  },
  success: (message: string) => {
    if (logLevel < LogLevel.SUCCESS) return;

    console.log(success(`â  ${message}`));
  },
  warn: (message: string) => {
    if (logLevel < LogLevel.WARN) return;

    console.log(warn(`â ī¸  ${message}`));
  },
};
