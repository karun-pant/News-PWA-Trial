const apiKey = "aa1ce3da5bc2451ea182db3a0fe9d02b";
const main = document.querySelector("main");
const sourceSelector = document.querySelector("#sourceSelector");
const defaultSource = "all-headlines";
const additionalSource = {
  id: "all-headlines",
  name: "Top News",
  description: "All News",
  url: "",
  category: "",
  language: "en",
  country: "us"
};

window.addEventListener("load", async e => {
  await updateSources();
  sourceSelector.value = defaultSource;
  updateNews();
  sourceSelector.addEventListener("change", e => {
    updateNews(e.target.value);
  });
  if ("serviceWorker" in navigator) {
    try {
      navigator.serviceWorker.register("sw.js");
    } catch (error) {}
  }
});

async function updateSources() {
  const sources = await fetch(
    `https://newsapi.org/v2/sources?apiKey=${apiKey}`
  );
  const json = await sources.json();
  var sourcesArr = Object.keys(json.sources).map(i => json.sources[i]);
  sourcesArr.splice(0, 0, additionalSource);
  sourceSelector.innerHTML = sourcesArr
    .map(source => `<option value=${source.id}>${source.name}</option>`)
    .join("\n");
}

async function updateNews(source = defaultSource) {
  var url =
    source === defaultSource
      ? `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`
      : createURL(source);
  const result = await fetch(url);
  const json = await result.json();
  main.innerHTML = json.articles.map(createArticle).join("\n");
}

function createURL(source) {
  return `https://newsapi.org/v2/everything?sources=${source}&apiKey=${apiKey}`;
}
function createArticle(article) {
  return `
    <div class= "article">
        <a href= ${article.url}>
            <h2>${article.title}</h2>
            <img src= "${article.urlToImage}" crossorigin='anonymous/>
            <p>${article.description}</p>
        </a>
    </div>`;
}
