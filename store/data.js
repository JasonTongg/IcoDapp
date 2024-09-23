import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  stateData: {
    data: "apaan nih",
    isLoading: true,
  },
};

export const getApiData = createAsyncThunk("callTitle", async (_, thunkAPI) => {
  try {
    const response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=UCkB_AwGXxPAKdahxGHpeC4Q&key=${api_key}`
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
