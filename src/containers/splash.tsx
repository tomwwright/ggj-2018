import * as React from "react";
import { PacmanLoader } from "halogenium";

const splashStyle = {
  height: "100%",
  width: "100%",
  backgroundSize: "cover",
  backgroundImage: "url(/sky_bg.png)",
  textAlign: "center"
};

type SplashProps = {
  spinner?: boolean;
};

const Splash: React.StatelessComponent<SplashProps> = props => {
  if (props.spinner) {
    console.log("spinner!!!");
    return (
      <React.Fragment>
        <div id="splash-container" style={splashStyle}>
          <PacmanLoader color="white" style={{ marginTop: "125%" }} />
          {props.children}
        </div>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <div id="splash-container" style={splashStyle}>
          {props.children}
        </div>
      </React.Fragment>
    );
  }
};

export { Splash };
