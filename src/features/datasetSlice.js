import { createSlice } from "@reduxjs/toolkit";
import { dataList } from "../utils/constants";

const initialDatasetState = {
  name: "COPERNICUS/S1_GRD",
  cloud: "15",
  feature: "VH",
  composite: "median",
  composite_days: '15',
  ascd: false,
  desc: true,
  boundary: "Thanjavur",
  cropType:"paddy",
  boundary_file: null,
  use_crop_mask: false,
  // crop_mask: "projects/testee-319020/assets/terai_agri_mask",

  // phenology_start_date: "2019-01-01",
  // phenology_end_date: "2020-01-01",
};

export const datasetSlice = createSlice({
  name: "dataset",
  initialState: initialDatasetState,
  reducers: {
    update: (state, action) => ({ ...state, ...action.payload }),
    changeDataSource: (state, action) => {
      let name = action.payload
      state.name = name
      if (name in dataList.radar) {
        state.feature = 'VH'
      } else if (name in dataList.optical) {
        state.feature = 'NDVI'
        state.cloud = "15"
      }
      return state
    }
  },
});

export const { update, changeDataSource } = datasetSlice.actions;

export default datasetSlice.reducer;
