import { useGlobals } from "storybook/internal/manager-api";

const useBreakpoints = (currentWidth: number) => {
  const [globals] = useGlobals();
  const breakpoints = globals?.breakpoints;
  let currentBreakpoint = "";
  if (breakpoints) {
    const bpArray = Object.entries(breakpoints);
    const bpAmount = bpArray.length;
    for (let i = bpAmount - 1; i >= 0; i--) {
      console.log(i);
      const bpLowerBoundary = bpArray[i][1] as number;
      if (currentWidth >= bpLowerBoundary) {
        currentBreakpoint = bpArray[i][0];
        break;
      }
    }
    return currentBreakpoint;
  }
};

export default useBreakpoints;
