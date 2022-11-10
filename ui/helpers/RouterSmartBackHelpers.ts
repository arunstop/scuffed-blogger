import { NextRouter } from "next/router";

export function smartBack(router: NextRouter, history: string[]) {
    // IF history is not empty and if the last entry of history is not the same as the current url
    // then go to that last entry of history
    // OTHERWISE go to home
  if (history.length && history[history.length - 1] !== router.asPath)
    return router.replace(history[history.length - 1]);
  return router.push("/");
}
