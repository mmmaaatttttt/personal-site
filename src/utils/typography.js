import Typography from "typography";
import altonTheme from "typography-theme-alton";

altonTheme.baseFontSize = "20px";
altonTheme.baseLineHeight = 1.8;
altonTheme.overrideThemeStyles = ({ rhythm }, options) => ({
  iframe: {
    display: "block",
    border: "none",
    margin: `0 auto ${rhythm(1)}`
  }
});

const typography = new Typography(altonTheme);

export default typography;
