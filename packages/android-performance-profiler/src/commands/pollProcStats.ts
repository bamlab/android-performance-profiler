import { getCpuClockTick } from "./cpu/getCpuClockTick";
import { execLoopCommand } from "./shell";

const SYSTEM_TICK_IN_ONE_SECOND = 100 || getCpuClockTick();

export const pollProcStats = (pid: string) => {
  const TIME_INTERVAL_S = 1;
  let previousTotalCpuTime: number | null = null;
  execLoopCommand(
    `adb shell cat /proc/${pid}/stat | awk '{print $14,$15,$16,$17,$22}'`,
    TIME_INTERVAL_S,
    function (data) {
      // 5th columns is starttime
      const [utime, stime, cutime, cstime] = data
        .replace("\n", "")
        .split(" ")
        .map((x: string) => parseInt(x, 10));
      const totalCpuTime = utime + stime + cutime + cstime;

      const TICKS_FOR_TIME_INTERVAL =
        SYSTEM_TICK_IN_ONE_SECOND * TIME_INTERVAL_S;

      if (previousTotalCpuTime) {
        console.log(
          (100 * (totalCpuTime - previousTotalCpuTime)) /
            TICKS_FOR_TIME_INTERVAL
        );
      }
      previousTotalCpuTime = totalCpuTime;
    }
  );
};
