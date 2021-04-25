(function () {
  const NUM_COLORS = 16;
  const onLoad = async () => {
    const wordsUrl = chrome.runtime.getURL("assets/words.json");
    let data = await fetch(wordsUrl);
    data = await data.json();
    const keys = Object.keys(data);
    const numWords = keys.length;
    const wordOfTheTab = Math.floor(Math.random() * numWords);
    const colorIndex = (wordOfTheTab % NUM_COLORS) + 1;
    document.querySelector("#word").innerHTML = keys[wordOfTheTab];
    document.querySelector("#definition").innerHTML = data[keys[wordOfTheTab]];
    document
      .querySelector("#mainContent")
      .classList.add(`pallete_${colorIndex}`);
  };
  onLoad();
})();
