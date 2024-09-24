import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Abi from "./Token.json";

const initialState = {
  contractAddress: "0x02296aF160a7e5A697743E5CA5A0038847F0bd8F",
  contractAbi: Abi.abi,
};

export const getApiData = createAsyncThunk("callTitle", async (_, thunkAPI) => {
  try {
    const response = await fetch(
      ``
    );
    const data = await response.json();
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue("Error Fetch Channels Info");
  }
});

const datas = createSlice({
  name: "Datas",
  initialState,
  reducers: {
    setData: (state, { payload }) => {
      state.stateData.data = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getApiData.pending, (state) => {
        state.stateData.isLoading = true;
      })
      .addCase(getApiData.fulfilled, (state, { payload }) => {
        state.stateData.isLoading = false;
        state.stateData.data = payload;
      })
      .addCase(getApiData.rejected, (state) => {
        state.stateData.isLoading = false;
      });
  },
});

export const { setData } = datas.actions;
export default datas.reducer;
