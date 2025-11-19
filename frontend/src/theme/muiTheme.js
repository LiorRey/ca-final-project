import { createTheme } from "@mui/material/styles";
import { setGlobalTheme, token } from "@atlaskit/tokens";

setGlobalTheme({
  colorMode: "auto",
  shape: "shape",
});

const muiTheme = createTheme({});

export default muiTheme;
