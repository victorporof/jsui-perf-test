import classnames from "classnames";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { Stats } from "../../../util/stats";
import { useInterval } from "../../util/hooks/useInterval";
// import { useWait } from "../../util/hooks/useWait";

const UPDATE_INTERVAL = 1000;

const stats = Stats.main();
stats.addCustomPanel("behind-stats", "#QUEUE", "#f88", "#000");
stats.addCustomPanel("ideal-stats", "%STALE", "#f88", "#000");

const Dot = (props) => {
  // Arficially long execution time.
  // useWait(1);

  const [hover, setHover] = useState(false);
  const count = props.count % 10;

  return (
    <div
      className={classnames("dot", hover && "hovered")}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover ? `*${count}*` : count}
    </div>
  );
};

const Sierpinski = (props) => {
  if (props.depth == 1) {
    return <Dot style={props.style} count={props.count} />;
  }

  return (
    <div className="sierpinski">
      <Sierpinski depth={props.depth - 1} count={props.count} />
      <Sierpinski depth={props.depth - 1} count={props.count} />
      <Sierpinski depth={props.depth - 1} count={props.count} />
    </div>
  );
};

export const App = (props) => {
  const [count, setCount] = useState(0);
  const desiredUpdates = useRef(0);
  const actualUpdates = useRef(0);
  const missedUpdates = useRef(0);

  useInterval(
    useCallback(() => {
      desiredUpdates.current++;
      setCount((count) => count + 1);
    }, []),
    UPDATE_INTERVAL
  );

  useEffect(() => {
    const desired = desiredUpdates.current;
    const actual = actualUpdates.current;
    const missed = missedUpdates.current;
    stats.updateCustomPanel(0, desired - actual, 10);
    stats.updateCustomPanel(1, 100 - (actual / (desired + missed)) * 100 || 0, 100);
    actualUpdates.current++;
    missedUpdates.current += desired - actual;
  });

  return (
    <div className="app">
      {props.children}
      <Sierpinski depth={RECURSION} count={count} />
    </div>
  );
};
