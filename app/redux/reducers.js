/**
 * Combine all reducers in this file and export the combined reducers.
 */
import { combineSlices } from "@reduxjs/toolkit";
import language from "containers/LanguageProvider/reducer";
import uiReducer from "./modules/ui";
import farmsReducer from "./modules/farmSlice";

export default combineSlices({
  language,
  ui: uiReducer,
  farms: farmsReducer,
});
