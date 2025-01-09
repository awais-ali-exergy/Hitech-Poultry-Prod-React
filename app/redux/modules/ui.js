import { createSlice } from "@reduxjs/toolkit";
import menuContent from "dan-api/ui/menu";

const initialState = {
  /* Settings for Themes and layout */
  theme: "orangeTheme",
  direction: "ltr",
  type: "light", // light or dark
  gradient: true, // true or false
  decoration: true, // true or false
  bgPosition: "header", // half, header, full
  layout: "left-sidebar", // big-sidebar, left-sidebar, top-navigation, mega-menu
  /* End settings */
  palette: [
    { name: "Ocean Sky", value: "skyBlueTheme" },
    { name: "Purple", value: "purpleRedTheme" },
    { name: "Rose Gold", value: "magentaTheme" },
    { name: "Leaf", value: "cyanTheme" },
    { name: "Mint", value: "blueCyanTheme" },
    { name: "Ubuntu", value: "orangeTheme" },
    { name: "Ultra Violet", value: "purpleTheme" },
    { name: "Vintage", value: "yellowCyanTheme" },
    { name: "Fruit", value: "greenOrangeTheme" },
    { name: "Botani", value: "pinkGreenTheme" },
    { name: "Deep Ocean", value: "blueTheme" },
    { name: "School", value: "yellowBlueTheme" },
    { name: "Queen", value: "pinkBlueTheme" },
    { name: "Joker", value: "greenPurpleTheme" },
    { name: "Ruby", value: "redTheme" },
    { name: "Sultan", value: "goldTheme" },
    { name: "Monochrome", value: "greyTheme" },
  ],
  sidebarOpen: true,
  pageLoaded: false,
  subMenuOpen: [],
};

const getMenus = (menuArray) =>
  menuArray.map((item) => {
    if (item.child) {
      return item.child;
    }
    return false;
  });

const setNavCollapse = (arr, curRoute) => {
  let headMenu = "not found";
  for (let i = 0; i < arr.length; i += 1) {
    for (let j = 0; j < arr[i].length; j += 1) {
      if (arr[i][j].link === curRoute) {
        headMenu = menuContent[i].key;
      }
    }
  }
  return headMenu;
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleAction: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    openMenuAction: (state) => {
      state.sidebarOpen = true;
    },
    closeMenuAction: (state) => {
      state.sidebarOpen = false;
      state.subMenuOpen = [];
    },
    openAction: (state, action) => {
      const { initialLocation, key } = action.payload;
      // Set initial open parent menu
      const activeParent = setNavCollapse(
        getMenus(menuContent),
        initialLocation
      );
      // Once page loaded will expand the parent menu
      if (initialLocation) {
        state.subMenuOpen = [activeParent];
        return;
      }
      // Expand / Collapse parent menu
      const menuList = state.subMenuOpen;
      if (menuList.indexOf(key) > -1) {
        const index = state.subMenuOpen.findIndex((obj) => obj === key);
        state.subMenuOpen.splice(index, 1);
      } else {
        state.subMenuOpen = [key];
      }
    },
    changeThemeAction: (state, action) => {
      state.theme = action.payload;
    },
    changeRandomThemeAction: (state) => {
      const paletteArray = initialState.palette;
      const random =
        paletteArray[Math.floor(Math.random() * paletteArray.length)];
      state.theme = random.value;
    },
    changeModeAction: (state, action) => {
      state.type = action.payload;
    },
    changeGradientAction: (state, action) => {
      state.gradient = action.payload;
    },
    changeDecoAction: (state, action) => {
      state.decoration = action.payload;
    },
    changeLayoutAction: (state, action) => {
      state.layout = action.payload;
    },
    changeBgPositionAction: (state, action) => {
      state.bgPosition = action.payload;
    },
    changeDirectionAction: (state, action) => {
      state.direction = action.payload;
    },
    playTransitionAction: (state, action) => {
      state.pageLoaded = action.payload;
    },
  },
});

export const {
  toggleAction,
  openMenuAction,
  closeMenuAction,
  openAction,
  changeThemeAction,
  changeRandomThemeAction,
  changeModeAction,
  changeGradientAction,
  changeDecoAction,
  changeLayoutAction,
  changeBgPositionAction,
  changeDirectionAction,
  playTransitionAction,
} = uiSlice.actions;

export default uiSlice.reducer;
