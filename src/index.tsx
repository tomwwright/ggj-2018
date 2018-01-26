import * as React from "react";
import * as ReactDOM from "react-dom";
import "typeface-roboto";
import { Provider } from "mobx-react";

import { Root } from "./containers/root";

ReactDOM.render(<Root />, document.getElementById("react-container"));
