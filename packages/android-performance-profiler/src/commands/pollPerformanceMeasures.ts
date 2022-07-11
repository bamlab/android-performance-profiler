import { Measure } from "@performance-profiler/types";
import { CpuMeasureAggregator } from "./cpu/CpuMeasureAggregator";
import {
  getCommand as getCpuCommand,
  processOutput,
} from "./cpu/getCpuStatsByProcess";
import {
  getCommand as getRamCommand,
  processOutput as processRamOutput,
} from "./ram/pollRamUsage";
import { execLoopCommands } from "./shellNext";

const TIME_INTERVAL_S = 0.5;
export const pollPerformanceMeasures = (
  pid: string,
  dataCallback: (data: Measure) => void
) => {
  let isFirstMeasure = true;

  const cpuMeasuresAggregator = new CpuMeasureAggregator(TIME_INTERVAL_S);

  return execLoopCommands(
    [
      {
        id: "CPU_STATS",
        command: getCpuCommand(pid),
      },
      { id: "RAM", command: getRamCommand(pid) },
    ],
    TIME_INTERVAL_S,
    ({ CPU_STATS, RAM }) => {
      const subProcessesStats = processOutput(CPU_STATS);
      const cpuMeasures = cpuMeasuresAggregator.process(subProcessesStats);

      const ram = processRamOutput(RAM);

      if (!isFirstMeasure) {
        dataCallback({ cpu: cpuMeasures, ram });
      }
      isFirstMeasure = false;
    }
  );
};
