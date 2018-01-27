import * as React from "react";

export const Splash: React.StatelessComponent = ({ children }) => (
  <React.Fragment>
    <p>You splashin', bruh.</p>
    {children}
  </React.Fragment>
);
