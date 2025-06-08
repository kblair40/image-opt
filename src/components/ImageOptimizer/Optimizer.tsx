import React from "react";
import { unstable_ViewTransition as ViewTransition } from "react";

type Props = {};

const Optimizer = (props: Props) => {
  return (
    <ViewTransition>
      <div className="h-full centered">Optimizer</div>
    </ViewTransition>
  );
};

export default Optimizer;
