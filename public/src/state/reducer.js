import {Map, fromJS} from "immutable";
import {combineReducers} from "redux-immutable";

const test = (state=fromJS({
  grid: {
    width: 32,
    height: 32,
    markerSize: 0.1
  },
}), {type})=>{
  switch (type) {
    default:
      return state;
  }
}

export default combineReducers({
  test
});

