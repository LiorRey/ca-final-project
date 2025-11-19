import { createTheme } from "@mui/material/styles";
import { setGlobalTheme, token } from "@atlaskit/tokens";

setGlobalTheme({
  colorMode: "auto",
  shape: "shape",
});

const muiTheme = createTheme({
  /**
   * Spacing System - Complete ADS Token Mapping
   *
   * Maps MUI spacing factors to all available ADS space tokens.
   * ADS provides tokens from space.0 (0rem) to space.1000 (5rem).
   *
   * Usage: spacing(2) → var(--ds-space-200, 1rem)
   */
  spacing: factor => {
    const spacingMap = {
      0: token("space.0", "0rem"), // 0px
      0.25: token("space.025", "0.125rem"), // 2px
      0.5: token("space.050", "0.25rem"), // 4px
      0.75: token("space.075", "0.375rem"), // 6px
      1: token("space.100", "0.5rem"), // 8px
      1.5: token("space.150", "0.75rem"), // 12px
      2: token("space.200", "1rem"), // 16px
      2.5: token("space.250", "1.25rem"), // 20px
      3: token("space.300", "1.5rem"), // 24px
      4: token("space.400", "2rem"), // 32px
      5: token("space.500", "2.5rem"), // 40px
      6: token("space.600", "3rem"), // 48px
      8: token("space.800", "4rem"), // 64px
      10: token("space.1000", "5rem"), // 80px
    };

    return spacingMap[factor] ?? `${factor * 0.5}rem`;
  },
});

export default muiTheme;
