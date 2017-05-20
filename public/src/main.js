import store from "./state/store";
import Renderer from "./view/renderer";
import Grid from "./view/grid";

const initialState = store.getState();

const mainRenderer = new Renderer(document.body, window.innerWidth, window.innerHeight);
const grid = new Grid(mainRenderer.scene, initialState.getIn(["grid", "width"]), initialState.getIn(["grid", "depth"]));

mainRenderer.run();

window.addEventListener("resize", ()=>{
  mainRenderer.setDimensions(window.innerWidth, window.innerHeight);
});

window.addEventListener("mousemove", evt => grid.updateCursor(evt, mainRenderer.camera));

store.subscribe((...args)=>{
  const state = store.getState();
});

store.dispatch({type: "test"});
