import { AnyAction, configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { ThunkMiddleware } from "redux-thunk";
import { BlocksState, getBlocksForNode } from "../reducers/blocks";
import nodesReducer, { checkNodeStatus, NodesState } from "../reducers/nodes";
import blocksReducer from "../reducers/blocks";

describe("Store", () => {
  const nodes = {
    list: [
      { url: "a.com", online: false, name: "", loading: false },
      { url: "b.com", online: false, name: "", loading: false },
      { url: "c.com", online: false, name: "", loading: false },
      { url: "d.com", online: false, name: "", loading: false },
    ],
  };

  const blockData={"id":"5","type":"blocks","attributes":{"index":1,"timestamp":1530679678,"data":"The Human Car","previous-hash":"KsmmdGrKVDr43/OYlM/oFzr7oh6wHG+uM9UpRyIoVe8=","hash":"oHkxOJWOKy02vA9r4iRHVqTgqT+Afc6OYFcNYzyhGEc="}}
  const blocks={
    isLoading:false,
    allBlocks:null
  }

  let store: EnhancedStore<
    { nodes: NodesState,
      blocks:BlocksState
     },
    AnyAction,
    [
      | ThunkMiddleware<{ nodes: NodesState }, AnyAction, null>
      | ThunkMiddleware<{ nodes: NodesState }, AnyAction, undefined>
      | ThunkMiddleware<{ blocks: BlocksState }, AnyAction, null>
      | ThunkMiddleware<{ blocks: BlocksState }, AnyAction, undefined>
    ]
  >;

  beforeAll(() => {
    store = configureStore({
      reducer: {
        nodes: nodesReducer,
        blocks: blocksReducer,
      },
      preloadedState: { nodes,blocks },
    });
  });
  afterAll(() => {});

  it("should display results when necessary data is provided", () => {
    const actions = [
      {
        type: checkNodeStatus.fulfilled.type,
        meta: { arg: nodes.list[0] },
        payload: { node_name: "alpha" },
      },
      {
        type: checkNodeStatus.fulfilled.type,
        meta: { arg: nodes.list[1] },
        payload: { node_name: "beta" },
      },
      {
        type: checkNodeStatus.fulfilled.type,
        meta: { arg: nodes.list[0] },
        payload: { node_name: "gamma" },
      },
      {
        type: checkNodeStatus.fulfilled.type,
        meta: { arg: nodes.list[2] },
        payload: { node_name: "delta" },
      },
      {
        type: checkNodeStatus.fulfilled.type,
        meta: { arg: nodes.list[1] },
        payload: { node_name: "epsilon" },
      },
      {
        type: checkNodeStatus.fulfilled.type,
        meta: { arg: nodes.list[0] },
        payload: { node_name: "zeta" },
      },
      {
        type: checkNodeStatus.fulfilled.type,
        meta: { arg: nodes.list[0] },
        payload: { node_name: "eta" },
      },
      {
        type: checkNodeStatus.fulfilled.type,
        meta: { arg: nodes.list[0] },
        payload: { node_name: "theta" },
      },
      {
        type: getBlocksForNode.fulfilled.type,
        meta: { arg: nodes },
        payload: blockData,
      },
    ];
    actions.forEach((action) => store.dispatch(action));

    const actual = store.getState();
    const expected = {nodes:{
      list: [
        { url: "a.com", online: true, name: "theta", loading: false },
        { url: "b.com", online: true, name: "epsilon", loading: false },
        { url: "c.com", online: true, name: "delta", loading: false },
        { url: "d.com", online: false, name: "", loading: false },
      ],
    },
    blocks:{
      isLoading:false,
      allBlocks:blockData
    }
  };

    expect(actual).toEqual(expected);
  });
});
