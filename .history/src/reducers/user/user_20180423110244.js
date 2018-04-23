const initialState = { name: "userName", config: "useConfig" };

const reducer = (state = { user: initialState }, action) => {
  console.log("entra reducer");
  switch (action.type) {
    default:
      return state;
  }
};

export default reducer;
