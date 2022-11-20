import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import initialState from "./initialState";
import { Node } from "../types/Node";
import { RootState } from "../store/configureStore";
import fetch from "cross-fetch";

export interface BlocksState {
    isLoading:Boolean,
    allBlocks:any
}

export const getBlocksForNode = createAsyncThunk(
  "nodes/getBlocksForNode",
  async (node: Node) => {
    const response = await fetch(`${node.url}/api/v1/blocks`);
    const data = await response.json();
    return data;
  }
);


export const blocksSlice = createSlice({
  name: "blocks",
  initialState: {
    isLoading:false,
    allBlocks:null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBlocksForNode.pending, (state, action) => {
        state.isLoading=true;
        state.allBlocks=null
    });
    builder.addCase(getBlocksForNode.fulfilled, (state, action) => {
        state.isLoading=false;
        state.allBlocks=action.payload

    });
    builder.addCase(getBlocksForNode.rejected, (state, action) => {
        state.isLoading=false;
    });
  },
});

export const selectNodes = (state: RootState) => state.nodes.list;
export default blocksSlice.reducer;
