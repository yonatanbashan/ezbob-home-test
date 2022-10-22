import React from "react";
import "./Container.scss";

function Container(props: { children: React.ReactNode }) {
  const { children } = props;
  return <div className="container-style">{children}</div>;
}

export default Container;
