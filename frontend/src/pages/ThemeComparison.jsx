import { useState } from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  createTheme,
  Grid,
  Paper,
  Stack,
  TextField,
  ThemeProvider,
  Tooltip,
  Typography,
} from "@mui/material";
import { muiTheme } from "../theme/muiTheme";

// Default MUI theme for comparison
const defaultTheme = createTheme();

// Shared component section that's rendered identically on both sides
const ComponentShowcase = () => (
  <>
    {/* Typography Section */}
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Typography
      </Typography>
      <Stack spacing={2}>
        <Typography variant="h1">Heading 1</Typography>
        <Typography variant="h2">Heading 2</Typography>
        <Typography variant="h3">Heading 3</Typography>
        <Typography variant="h4">Heading 4</Typography>
        <Typography variant="h5">Heading 5</Typography>
        <Typography variant="h6">Heading 6</Typography>
        <Typography variant="body1">
          Body 1: The quick brown fox jumps over the lazy dog
        </Typography>
        <Typography variant="body2">
          Body 2: The quick brown fox jumps over the lazy dog
        </Typography>
        <Typography variant="button">Button Text</Typography>
        <Typography variant="caption">Caption text</Typography>
        <Typography variant="overline">Overline text</Typography>
      </Stack>
    </Box>

    {/* Spacing Section */}
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Spacing
      </Typography>
      <Stack spacing={2}>
        {[0, 1, 2, 3, 4, 5, 6, 8].map(factor => (
          <Box
            key={factor}
            sx={{
              p: factor,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              display: "inline-block",
            }}
          >
            spacing({factor})
          </Box>
        ))}
      </Stack>
    </Box>

    {/* Elevation Section */}
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Elevation / Shadows
      </Typography>
      <Grid container spacing={2}>
        {[0, 1, 2, 3, 8, 24].map(elevation => (
          <Grid item xs={6} sm={4} key={elevation}>
            <Paper
              elevation={elevation}
              sx={{
                p: 2,
                textAlign: "center",
                height: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="body2">Elevation {elevation}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>

    {/* Components Section */}
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Components
      </Typography>

      <Stack spacing={3}>
        {/* Buttons */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Buttons
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Button variant="contained">Contained</Button>
            <Button variant="outlined">Outlined</Button>
            <Button variant="text">Text</Button>
            <Button variant="contained" color="secondary">
              Secondary
            </Button>
            <Button variant="contained" disabled>
              Disabled
            </Button>
          </Stack>
        </Box>

        {/* Text Fields */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Text Fields
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <TextField label="Outlined" variant="outlined" />
            <TextField label="Filled" variant="filled" />
            <TextField label="Standard" variant="standard" />
          </Stack>
        </Box>

        {/* Cards */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Cards
          </Typography>
          <Grid container spacing={2}>
            {[1, 2, 3].map(i => (
              <Grid item xs={12} sm={4} key={i}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Card {i}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This is a sample card with content to demonstrate styling.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Learn More</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Chips */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Chips
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip label="Default" />
            <Chip label="Primary" color="primary" />
            <Chip label="Secondary" color="secondary" />
            <Chip label="Success" color="success" />
            <Chip label="Error" color="error" />
            <Chip label="Deletable" onDelete={() => {}} />
          </Stack>
        </Box>

        {/* Badges & Tooltips */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Badges & Tooltips
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Badge badgeContent={4} color="primary">
              <Button variant="outlined">Messages</Button>
            </Badge>
            <Badge badgeContent={100} color="secondary">
              <Button variant="outlined">Notifications</Button>
            </Badge>
            <Tooltip title="This is a tooltip">
              <Button variant="outlined">Hover me</Button>
            </Tooltip>
          </Stack>
        </Box>
      </Stack>
    </Box>
  </>
);

export function ThemeComparison() {
  const [activeTheme, setActiveTheme] = useState("split");

  // Single theme view
  if (activeTheme !== "split") {
    const theme = activeTheme === "default" ? defaultTheme : muiTheme;
    const themeName = activeTheme === "default" ? "Default MUI" : "ADS";

    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 3,
              bgcolor: "background.paper",
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Typography variant="h4" align="center" gutterBottom>
              Theme Comparison Demo
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              gutterBottom
            >
              Viewing: {themeName} Theme
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              flexWrap="wrap"
              useFlexGap
              sx={{ mt: 2 }}
            >
              <Button
                variant={activeTheme === "default" ? "contained" : "outlined"}
                onClick={() => setActiveTheme("default")}
              >
                Default MUI
              </Button>
              <Button
                variant={activeTheme === "ads" ? "contained" : "outlined"}
                onClick={() => setActiveTheme("ads")}
              >
                ADS Theme
              </Button>
              <Button
                variant={activeTheme === "split" ? "contained" : "outlined"}
                onClick={() => setActiveTheme("split")}
              >
                Split View
              </Button>
            </Stack>
          </Box>

          {/* Scrollable Content */}
          <Box
            sx={{ flex: 1, overflow: "auto", bgcolor: "background.default" }}
          >
            <Container maxWidth="lg" sx={{ py: 4 }}>
              <ComponentShowcase />
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  // Split view
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Fixed Header */}
      <Box
        sx={{
          bgcolor: "white",
          borderBottom: 1,
          borderColor: "divider",
          py: 2,
          px: 2,
          flexShrink: 0,
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="h5" align="center" gutterBottom>
            Theme Comparison Demo
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            gutterBottom
          >
            Compare Default MUI Theme vs Custom ADS-Integrated Theme
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            flexWrap="wrap"
            useFlexGap
            sx={{ mt: 1 }}
          >
            <Button
              size="small"
              variant={activeTheme === "default" ? "contained" : "outlined"}
              onClick={() => setActiveTheme("default")}
            >
              Default MUI Only
            </Button>
            <Button
              size="small"
              variant={activeTheme === "ads" ? "contained" : "outlined"}
              onClick={() => setActiveTheme("ads")}
            >
              ADS Theme Only
            </Button>
            <Button
              size="small"
              variant={activeTheme === "split" ? "contained" : "outlined"}
              onClick={() => setActiveTheme("split")}
            >
              Split View
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Scrollable Content Area with Split View */}
      <Box sx={{ flex: 1, overflow: "auto", bgcolor: "#f5f5f5", p: 2 }}>
        <Box sx={{ display: "flex", gap: 2, minHeight: "100%" }}>
          {/* Default MUI Theme Column */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Paper
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  p: 2,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  flexShrink: 0,
                }}
              >
                <Typography variant="h6" align="center">
                  Default MUI Theme
                </Typography>
              </Box>
              <Box sx={{ p: 3, overflow: "auto" }}>
                <ThemeProvider theme={defaultTheme}>
                  <ComponentShowcase />
                </ThemeProvider>
              </Box>
            </Paper>
          </Box>

          {/* ADS Theme Column */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Paper
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                bgcolor: "#fafbfc",
              }}
            >
              <Box
                sx={{
                  p: 2,
                  bgcolor: "secondary.main",
                  color: "secondary.contrastText",
                  flexShrink: 0,
                }}
              >
                <Typography variant="h6" align="center">
                  ADS Theme
                </Typography>
              </Box>
              <Box sx={{ p: 3, overflow: "auto" }}>
                <ThemeProvider theme={muiTheme}>
                  <ComponentShowcase />
                </ThemeProvider>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
