import mockFetch from "cross-fetch";
import reducer, { getBlocksForNode } from "./blocks";
import { Node } from "../types/Node";
import initialState from "./initialState";

jest.mock("cross-fetch");

const mockedFech: jest.Mock<unknown> = mockFetch as any;

describe("Reducers::Nodes", () => {
  const getInitialState = () => {
    return initialState().blocks;
  };

  const nodeA: Node = {
    url: "http://localhost:3002",
    online: false,
    name: "Node 1",
    loading: false,
  };

  const blocks={"id":"5","type":"blocks","attributes":{"index":1,"timestamp":1530679678,"data":"The Human Car","previous-hash":"KsmmdGrKVDr43/OYlM/oFzr7oh6wHG+uM9UpRyIoVe8=","hash":"oHkxOJWOKy02vA9r4iRHVqTgqT+Afc6OYFcNYzyhGEc="}}


  it("should set initial state by default", () => {
    const action = { type: "unknown" };
    const expected = getInitialState();

    expect(reducer(undefined, action)).toEqual(expected);
  });

  it("should handle getBlocksForNode.pending", () => {
    const appState = {
        isLoading:true,
        allBlocks:null
    };
    const action = { type: getBlocksForNode.pending, meta: { arg: nodeA } };
    const expected = {
        isLoading:true,
        allBlocks:null
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle getBlocksForNode.fulfilled", () => {
    const appState = {
        isLoading:false,
        allBlocks:blocks
    };
    const action = {
      type: getBlocksForNode.fulfilled,
      meta: { arg: nodeA },
      payload: blocks,
    };
    const expected = {
        isLoading:false,
        allBlocks:blocks
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle getBlocksForNode.rejected", () => {
    const appState = {
        isLoading:false,
        allBlocks:null
    };
    const action = { type: getBlocksForNode.rejected, meta: { arg: nodeA } };
    const expected = {
        isLoading:false,
        allBlocks:null
    };

    expect(reducer(appState, action)).toEqual(expected);
  });
});

describe("Actions::Nodes", () => {
  const dispatch = jest.fn();

  afterAll(() => {
    dispatch.mockClear();
    mockedFech.mockClear();
  });

  const node: Node = {
    url: "http://localhost:3002",
    online: false,
    name: "Node 1",
    loading: false,
  };
  const blocks={"id":"5","type":"blocks","attributes":{"index":1,"timestamp":1530679678,"data":"The Human Car","previous-hash":"KsmmdGrKVDr43/OYlM/oFzr7oh6wHG+uM9UpRyIoVe8=","hash":"oHkxOJWOKy02vA9r4iRHVqTgqT+Afc6OYFcNYzyhGEc="}}


  it("should fetch the node blocks", async () => {
    mockedFech.mockReturnValueOnce(
      Promise.resolve({
        status: 200,
        json() {
          return Promise.resolve(blocks);
        },
      })
    );
    await getBlocksForNode(node)(dispatch, () => {}, {});

    const expected = expect.arrayContaining([
      expect.objectContaining({
        type: getBlocksForNode.pending.type,
        meta: expect.objectContaining({ arg: node }),
      }),
      expect.objectContaining({
        type: getBlocksForNode.fulfilled.type,
        meta: expect.objectContaining({ arg: node }),
        payload: blocks,
      }),
    ]);
    expect(dispatch.mock.calls.flat()).toEqual(expected);
  });

  it("should fail to fetch the node blocks", async () => {
    mockedFech.mockReturnValueOnce(Promise.reject(new Error("Network Error")));
    await getBlocksForNode(node)(dispatch, () => {}, {});
    const expected = expect.arrayContaining([
      expect.objectContaining({
        type: getBlocksForNode.pending.type,
        meta: expect.objectContaining({ arg: node }),
      }),
      expect.objectContaining({
        type: getBlocksForNode.rejected.type,
        meta: expect.objectContaining({ arg: node }),
        error: expect.objectContaining({ message: "Network Error" }),
      }),
    ]);

    expect(dispatch.mock.calls.flat()).toEqual(expected);
  });
});
