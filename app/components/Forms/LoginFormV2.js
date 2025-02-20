import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import { useFormik } from "formik";
import * as yup from "yup";
import logo from "dan-images/logo.svg";
import useStyles from "./user-jss";
import { useDispatch, useSelector } from "react-redux";
import { Stack } from "@mui/material";
import {
  loginUser,
  selectError,
  selectLoading,
} from "../../redux/modules/userSlice";
import AlertMessage from "../alertMessage/AlertMessage";

// validation schema
const validationSchema = yup.object({
  username: yup.string("Enter your username").required("Username is required"),
  password: yup.string("Enter your password").required("Password is required"),
});

const LinkBtn = React.forwardRef(function LinkBtn(props, ref) {
  return <NavLink to={props.to} {...props} />;
});

function LoginFormV2() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const deco = useSelector((state) => state.ui.decoration);

  // Alert state
  const [alert, setAlert] = useState({
    open: false,
    severity: "",
    message: "",
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const result = await dispatch(loginUser(values)).unwrap();
        setAlert({
          open: true,
          severity: "success",
          message: "Login successful!",
        });
        navigate("/app");
      } catch (err) {
        console.log(err);
        setAlert({
          open: true,
          severity: "error",
          message: err.message || "Login failed. Please try again.",
        });
      }
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const { classes, cx } = useStyles();

  return (
    <>
      <AlertMessage
        open={alert.open}
        setAlert={setAlert}
        severity={alert.severity}
        message={alert.message}
        autoHideDuration={3000}
      />

      <Paper className={cx(classes.sideWrap, deco && classes.petal)}>
        <Stack justifyContent={"center"} sx={{ height: "100%", width: "100%" }}>
          <div className={classes.topBar}>
            <NavLink to="/" className={classes.brand}>
              <img src={logo} alt="HI-TECH Poultry Feeds" />
              HI-TECH Poultry Feeds
            </NavLink>
          </div>
          <Typography
            variant="h4"
            sx={{ mt: 5 }}
            className={classes.title}
            gutterBottom
          >
            Sign In
          </Typography>
          <Typography
            variant="caption"
            className={classes.subtitle}
            gutterBottom
            align="center"
          >
            Welcome to HI-TECH Poultry Feeds Management System
          </Typography>
          <section>
            <form onSubmit={formik.handleSubmit}>
              <div>
                <FormControl variant="standard" className={classes.formControl}>
                  <TextField
                    id="username"
                    name="username"
                    label="Your Username"
                    variant="standard"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.username && Boolean(formik.errors.username)
                    }
                    helperText={
                      formik.touched.username && formik.errors.username
                    }
                    className={classes.field}
                  />
                </FormControl>
              </div>
              <div>
                <FormControl variant="standard" className={classes.formControl}>
                  <TextField
                    id="password"
                    name="password"
                    label="Your Password"
                    type={showPassword ? "text" : "password"}
                    variant="standard"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                    className={classes.field}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            size="large"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
              </div>
              <div className={classes.optArea}>
                <FormControlLabel
                  className={classes.label}
                  control={<Checkbox name="checkbox" />}
                  label="Remember"
                />
                <Button
                  size="small"
                  component={LinkBtn}
                  to="/reset-password"
                  className={classes.buttonLink}
                >
                  Forgot Password
                </Button>
              </div>
              <div className={classes.btnArea}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  type="submit"
                  disabled={loading || formik.isSubmitting}
                >
                  {loading ? "Signing in..." : "Continue"}
                  <ArrowForward
                    className={cx(classes.rightIcon, classes.iconSmall)}
                  />
                </Button>
              </div>
            </form>
          </section>
        </Stack>
      </Paper>
    </>
  );
}

export default LoginFormV2;
