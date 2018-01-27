import * as React from "react";

const splashStyle = {
  height: "100%",
  width: "100%",
  backgroundSize: "cover",
  backgroundImage: "url(/images/ph_splash_placeholder)"
};

export const Splash: React.StatelessComponent = ({ children }) => (
  <React.Fragment>
    <div id="splash-container" style={splashStyle}>
      {children}
    </div>
  </React.Fragment>
);
