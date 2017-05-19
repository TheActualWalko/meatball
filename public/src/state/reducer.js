import {Map, fromJS} from "immutable";
import {combineReducers} from "redux-immutable";

const grid = (state=fromJS({
  width: 32,
  height: 32,
  markerSize: 0.1
}), {type})=>{
  switch (type) {
    default:
      return state;
  }
};

export default combineReducers({
  grid
});
