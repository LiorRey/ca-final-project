import { createTheme } from "@mui/material/styles";
import { setGlobalTheme, token } from "@atlaskit/tokens";

setGlobalTheme({
  colorMode: "auto",
  shape: "shape",
  typography: "typography",
  elevation: "elevation",
});

const FONT_FALLBACK =
  'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif';

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

  /**
   * Shape Configuration
   *
   * Uses ADS radius.small as the default border radius.
   * This provides a consistent 4px (0.25rem) border radius across components.
   *
   * Larger components can override to radius.medium or radius.large in styleOverrides.
   */
  shape: {
    borderRadius: token("radius.small", "0.25rem"),
  },

  /**
   * Typography Configuration
   *
   * Maps MUI typography variants to ADS font scales.
   * - Uses token() for fontFamily and fontWeight (CSS variables)
   * - fontSize and lineHeight are hardcoded rem values based on ADS scales
   *   (ADS doesn't provide separate fontSize/lineHeight tokens)
   *
   * ADS Font Scale Mapping:
   * h1 → font.heading.xxlarge (35px/500)
   * h2 → font.heading.xlarge  (29px/600)
   * h3 → font.heading.large   (24px/500)
   * h4 → font.heading.medium  (20px/500)
   * h5 → font.heading.small   (16px/600)
   * h6 → font.heading.xsmall  (14px/600)
   * body1 → font.body         (14px/400)
   * body2 → font.body.small   (11px/400)
   */
  typography: {
    fontFamily: token("font.family.body", FONT_FALLBACK),
    fontWeightLight: 300,
    fontWeightRegular: token("font.weight.regular", "400"),
    fontWeightMedium: token("font.weight.medium", "500"),
    fontWeightBold: token("font.weight.bold", "700"),

    h1: {
      fontFamily: token("font.family.heading", FONT_FALLBACK),
      fontSize: "2.1875rem",
      lineHeight: "2.5rem",
      fontWeight: token("font.weight.medium", "500"),
    },
    h2: {
      fontFamily: token("font.family.heading", FONT_FALLBACK),
      fontSize: "1.8125rem",
      lineHeight: "2rem",
      fontWeight: token("font.weight.semibold", "600"),
    },
    h3: {
      fontFamily: token("font.family.heading", FONT_FALLBACK),
      fontSize: "1.5rem",
      lineHeight: "1.75rem",
      fontWeight: token("font.weight.medium", "500"),
    },
    h4: {
      fontFamily: token("font.family.heading", FONT_FALLBACK),
      fontSize: "1.25rem",
      lineHeight: "1.5rem",
      fontWeight: token("font.weight.medium", "500"),
    },
    h5: {
      fontFamily: token("font.family.heading", FONT_FALLBACK),
      fontSize: "1rem",
      lineHeight: "1.25rem",
      fontWeight: token("font.weight.semibold", "600"),
    },
    h6: {
      fontFamily: token("font.family.heading", FONT_FALLBACK),
      fontSize: "0.875rem",
      lineHeight: "1rem",
      fontWeight: token("font.weight.semibold", "600"),
    },
    body1: {
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      fontWeight: token("font.weight.regular", "400"),
    },
    body2: {
      fontSize: "0.6875rem",
      lineHeight: "1rem",
      fontWeight: token("font.weight.regular", "400"),
    },
    button: {
      fontSize: "0.875rem",
      fontWeight: token("font.weight.medium", "500"),
      textTransform: "none",
    },
    caption: {
      fontSize: "0.6875rem",
      lineHeight: "1rem",
      fontWeight: token("font.weight.regular", "400"),
    },
    overline: {
      fontSize: "0.6875rem",
      lineHeight: "1rem",
      fontWeight: token("font.weight.regular", "400"),
      textTransform: "uppercase",
    },
  },

  /**
   * Shadows Configuration (Elevation)
   *
   * Maps MUI shadow levels to ADS elevation tokens.
   * MUI expects an array of 25 shadow values (0-24).
   *
   * ADS provides 3 shadow levels:
   * - elevation.shadow.raised (subtle)
   * - elevation.shadow.overflow (medium)
   * - elevation.shadow.overlay (strong)
   *
   * Mapping:
   * 0: none
   * 1: raised
   * 2: overflow
   * 3-24: overlay (repeated for remaining indices)
   */
  shadows: [
    "none",
    token(
      "elevation.shadow.raised",
      "0px 1px 1px rgba(30, 31, 33, 0.25), 0px 0px 1px rgba(30, 31, 33, 0.31)"
    ),
    token(
      "elevation.shadow.overflow",
      "0px 0px 8px rgba(30, 31, 33, 0.16), 0px 0px 1px rgba(30, 31, 33, 0.12)"
    ),
    ...Array(22).fill(
      token(
        "elevation.shadow.overlay",
        "0px 8px 12px rgba(30, 31, 33, 0.15), 0px 0px 1px rgba(30, 31, 33, 0.31)"
      )
    ), // Indices 3-24 (22 elements)
  ],
});

export default muiTheme;
