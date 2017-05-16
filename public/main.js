let sortBy = "name";
let numResults = 20;
let page = 0;

const renderItem = (item)=>{
  return `
  <a class="item" href="http://www.ikea.com${item.url}">
    <img src="http://www.ikea.com${item.images.thumb[0]}"/>
    <h3>${item.name}</h3>
    <h4>${item.type}</h4>
    <h5>$${item.price.toFixed(2)}</h5>
  </a>
  `;
};

const update = ()=>{
  const sorted = [...database].sort((a,b)=>a[sortBy] < b[sortBy] ? 1 : -1);
  document.getElementById("results").innerHTML = sorted.slice(numResults * page,numResults * (page+1)).map(d=>"<li>"+renderItem(d)+"</li>").join("");
  document.getElementById("results").start = 1+(numResults * page);
}

document.getElementById("page-next").addEventListener("click", ()=>{
  window.scrollTo(0,0);
  page ++;
  update();
});

document.getElementById("page-prev").addEventListener("click", ()=>{
  page --;
  update();
});

update();