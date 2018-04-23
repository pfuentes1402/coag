

const initialState = [];

const reducer = (state = {user : initialState }, action) => {

  console.log("entra reducer");
  switch (action.type) {
   
    default:
      return state;
  }

 
};

export default reducer;
