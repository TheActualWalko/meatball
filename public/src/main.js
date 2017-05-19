import store from "./state/store";
import Renderer from "./view/renderer";
import Grid from "./view/grid";

const renderer = new Renderer(document.body, window.innerWidth, window.innerHeight);
const grid = new Grid(renderer.scene);

renderer.run();

window.addEventListener("resize", ()=>{
  renderer.setDimensions(window.innerWidth, window.innerHeight);
})

store.subscribe((...args)=>{
  const state = store.getState();
  grid.update(state);
});

store.dispatch({type: "test"});
