const initialState = () => ({
  nodes: {
    list: [
      {
        url: "https://thawing-springs-53971.herokuapp.com",
        online: false,
        name: "Node 1",
        loading: false,
      },
      {
        url: "https://secret-lowlands-62331.herokuapp.com",
        online: false,
        name: "Node 2",
        loading: false,
      },
      {
        url: "https://ancient-headland-67857.herokuapp.com", // Deployed local Server
        online: false,
        name: "Demo Node",
        loading: false,
      },
      {
        url: "http://localhost:3002", // Local server
        online: false,
        name: "Node 4",
        loading: false,
      },
    ],
  },
  blocks:{
    isLoading:false,
    allBlocks:null
  }
});
export default initialState;
