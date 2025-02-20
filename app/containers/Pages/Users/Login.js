import React from "react";
import { Helmet } from "react-helmet";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { makeStyles } from "tss-react/mui";
import { alpha } from "@mui/material/styles";
import LoginFormV2 from "../../../components/Forms/LoginFormV2";
import { Box } from "@mui/material";
import img1 from "../../../../public/images/bg-login.jpg";

const useStyles = makeStyles()((theme) => ({
  rootFull: {
    display: "flex",
    width: "100%",
    zIndex: 1,
    position: "relative",
    height: "100%",
  },
  containerSide: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
    [theme.breakpoints.down("lg")]: {
      overflow: "hidden",
    },
  },
  opening: {
    flex: 1,
    height: "100vh",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: theme.spacing(8),
    paddingTop: theme.spacing(20),
    [theme.breakpoints.down("lg")]: {
      display: "none",
    },
    "&:before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `url(${img1})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      animation: "gradient 15s ease infinite",
      opacity: 0.6,
      zIndex: 0,
      filter: "blur(4px)",
    },
    "&:after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: alpha(theme.palette.primary.main, 0.3),
      zIndex: 1,
    },
    "& > *": {
      position: "relative",
      zIndex: 2,
      maxWidth: "600px",
    },
  },
  sideFormWrap: {
    height: "100%",
    backgroundColor: "rgba(249, 250, 251, 0.95)",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    [theme.breakpoints.up("md")]: {
      width: 480,
    },
  },
}));

const LoginV2 = () => {
  const title = "HI-TECH Poultry Feeds - Login";
  const description = "HI-TECH Poultry Feeds Management System";
  const { classes } = useStyles();
  const mdDown = useMediaQuery((theme) => theme.breakpoints.down("md"));

  return (
    <div className={classes.rootFull}>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <style>
          {`
            @keyframes gradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}
        </style>
      </Helmet>

      <div className={classes.containerSide}>
        {!mdDown && (
          <div className={classes.opening}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxWidth: "540px",
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  color: "common.white",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  fontSize: {
                    md: "2rem",
                    lg: "2.5rem",
                    xl: "3rem",
                  },
                  fontWeight: 600,
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                }}
              >
                Welcome to HI-TECH Poultry Feeds
              </Typography>
              <Typography
                sx={{
                  color: "common.white",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                  fontSize: {
                    md: "0.975rem",
                    lg: "1.1rem",
                  },
                  lineHeight: 1.5,
                  opacity: 0.85,
                  fontWeight: 400,
                }}
              >
                Track feed levels and consumption patterns across all your hen
                pens in real-time. Get instant updates on pen conditions and
                performance metrics.
              </Typography>
            </Box>
          </div>
        )}

        <div className={classes.sideFormWrap}>
          <LoginFormV2 />
        </div>
      </div>
    </div>
  );
};

export default LoginV2;
