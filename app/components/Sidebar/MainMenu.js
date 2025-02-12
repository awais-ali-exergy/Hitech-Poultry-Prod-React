import React from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Collapse from "@mui/material/Collapse";
import Chip from "@mui/material/Chip";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { alpha } from "@mui/material/styles";

const DRAWER_OPEN_WIDTH = 240;
const DRAWER_CLOSED_WIDTH = 64;

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: "6px 0",
  width: "100%",
  borderRadius: `0 ${theme.spacing(3)} ${theme.spacing(3)} 0`,
  borderLeft: "4px solid transparent",
  transition: theme.transitions.create(["background-color", "border-color"], {
    duration: theme.transitions.duration.shorter,
  }),
  "&.active:not(.rootPath)": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? alpha(theme.palette.primary.main, 0.24)
        : alpha(theme.palette.primary.main, 0.3),
    borderLeftColor: theme.palette.primary.main,
    "& .MuiListItemIcon-root": {
      color: theme.palette.primary.main,
    },
    "& .MuiListItemText-primary": {
      color:
        theme.palette.mode === "dark"
          ? theme.palette.common.white
          : theme.palette.primary.dark,
    },
  },
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: theme.spacing(6),
  color: theme.palette.text.secondary,
  marginLeft: theme.spacing(2),
  "& svg": {
    fontSize: 24,
  },
}));

const StyledSubheader = styled(ListSubheader)(({ theme }) => ({
  fontSize: 10,
  width: "100%",
  textTransform: "uppercase",
  paddingLeft: theme.spacing(7),
  marginTop: theme.spacing(3),
  color: theme.palette.secondary.main,
  lineHeight: "28px",
  fontWeight: "bold",
  backgroundColor: "transparent",
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  height: "auto",
  padding: theme.spacing(0.5),
  marginLeft: theme.spacing(1),
}));

const StyledCollapse = styled(Collapse)(({ theme }) => ({
  "& .MuiList-root": {
    "& .MuiListItem-root": {
      paddingLeft: theme.spacing(3),
    },
  },
}));

function MainMenu({ dataMenu, toggleDrawerOpen, loadTransition }) {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.ui.subMenuOpen);
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const location = useLocation();

  const handleTransition = () => {
    toggleDrawerOpen();
    loadTransition(false);
  };

  const handleOpenMenu = (key, keyParent) => {
    dispatch(openAction({ key, keyParent }));
  };

  const getMenus = (menuArray, paddingLevel = 0) =>
    menuArray.map((item, index) => {
      const IconComponent = item.icon;

      if (item.child || item.linkParent) {
        return (
          <div key={index.toString()}>
            <StyledListItem
              button
              onClick={() => handleOpenMenu(item.key, item.keyParent)}
              sx={{
                ml: !item.icon ? paddingLevel * 2 : 0,
              }}
              className={open.indexOf(item.key) > -1 ? "opened" : ""}
            >
              {IconComponent && (
                <StyledListItemIcon>
                  <IconComponent />
                </StyledListItemIcon>
              )}
              <ListItemText
                primary={item.name}
                sx={{
                  "& .MuiListItemText-primary": {
                    whiteSpace: "nowrap",
                  },
                }}
              />
              {!item.linkParent &&
                (open.indexOf(item.key) > -1 ? <ExpandLess /> : <ExpandMore />)}
            </StyledListItem>
            {!item.linkParent && (
              <StyledCollapse
                in={open.indexOf(item.key) > -1 && sidebarOpen}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {getMenus(item.child, paddingLevel + 1)}
                </List>
              </StyledCollapse>
            )}
          </div>
        );
      }

      if (item.title) {
        return sidebarOpen ? (
          <StyledSubheader key={index.toString()} disableSticky component="div">
            {item.name}
          </StyledSubheader>
        ) : null;
      }

      return (
        <StyledListItem
          key={index.toString()}
          button
          component={NavLink}
          to={item.link}
          onClick={handleTransition}
          sx={{
            pl: paddingLevel * 2,
          }}
        >
          {IconComponent && (
            <StyledListItemIcon>
              <IconComponent />
            </StyledListItemIcon>
          )}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ListItemText
              primary={item.name}
              sx={{
                "& .MuiListItemText-primary": {
                  whiteSpace: "nowrap",
                },
              }}
            />
            {item.badge && (
              <StyledChip color="primary" label={item.badge} size="small" />
            )}
          </Box>
        </StyledListItem>
      );
    });

  return (
    <Box
      sx={{
        // width: sidebarOpen ? DRAWER_OPEN_WIDTH : DRAWER_CLOSED_WIDTH,
        transition: (t) =>
          t.transitions.create("width", {
            easing: t.transitions.easing.sharp,
            duration: t.transitions.duration.standard,
          }),
        overflow: "hidden",
        // "&:hover": {
        //   width: DRAWER_OPEN_WIDTH,
        // },
      }}
    >
      {getMenus(dataMenu)}
    </Box>
  );
}

MainMenu.propTypes = {
  toggleDrawerOpen: PropTypes.func.isRequired,
  loadTransition: PropTypes.func.isRequired,
  dataMenu: PropTypes.array.isRequired,
};

export default MainMenu;
