import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
const theme = extendTheme({
  initialColorMode: "light",
  // fonts: {
  //   body: `Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`,
  //   // body: `Helvetica, sans-serif`
  // },
  colors: {
    brand1: {
      "50": "#ECF0F9",
      "100": "#C9D6ED",
      "200": "#A7BCE2",
      "300": "#84A2D7",
      "400": "#6188CC",
      "500": "#3F6DC0",
      "600": "#32579A",
      "700": "#264273",
      "800": "#192C4D",
      "900": "#0D1626"
    }
  },
  fontWeights: {
    normal: 400,
    medium: 600,
    bold: 700,
    xBold: 900,
  },
  styles: {
    global: (props) => ({
      "*": {
        "&::-webkit-scrollbar": {
          width: "10px",
          backgroundColor: "rgb(255,255,255,0.0)",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#A0AEC0",
          borderRadius: "10px",
          border: "2px solid #F7FAFC",
        },
      },
      body: {
        bg: mode("gray.50", "gray.800")(props),
        fontFamily: 'Helvetica, sans-serif'
      },
      html: {
        fontFamily: 'Helvetica, sans-serif'
      }
    }),
  },
});

export default theme;