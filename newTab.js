const NUM_COLORS = 16;

(function () {
  const onLoad = async () => {
    const wordsUrl = chrome.runtime.getURL("assets/words.json");

    const tablesUrl = chrome.runtime.getURL("assets/tables.json");

    // TODO move to workers or something
    let [wordsData, tablesData] = await Promise.all([
      fetch(wordsUrl),
      fetch(tablesUrl),
    ]);

    wordsData = await wordsData.json();
    tablesData = await tablesData.json();
    console.log({ tablesData });
    const sources = [wordsData, tablesData];
    const sourceToUse = Math.round(Math.random() * (sources.length - 1));
    console.log({ sourceToUse });
    renderDataSource(sources[sourceToUse]);
  };
  onLoad();
})();

function renderDataSource(source) {
  const wordContainer = document.getElementById("wordContainer");
  const tableContainer = document.getElementById("tableContainer");
  const isTable = Array.isArray(source); // Todo make a better data packed
  wordContainer.classList.add("hidden");
  tableContainer.classList.add("hidden");
  let colorIndex;
  if (isTable) {
    const numTables = source.length;
    const tableOfTheTab = Math.floor(Math.random() * numTables);
    colorIndex = (tableOfTheTab % NUM_COLORS) + 1;
    const { title, rows } = source[tableOfTheTab];

    const makeRows = (dataRows) => {
      const stringifiedRows = [];

      dataRows.forEach((data) => {
        if (Array.isArray(data)) {
          stringifiedRows.push(data.map((d) => `<td>${d}</td>`).join(""));
        } else {
          if (data.hasOwnProperty("header")) {
            stringifiedRows.push(
              data.header
                .map((d) => {
                  let content = d;
                  let props = "";
                  if (typeof content !== "string") {
                    content = d.text;
                    Object.entries(d).forEach(([key, value]) => {
                      if (key !== "text") {
                        props += `${key}="${value}"`;
                      }
                    });
                  }
                  return `<th ${props}>${content}</th>`;
                })
                .join("")
            );
          } else {
            console.log(`DO not know how to intepret this data`);
          }
        }
      });
      console.log({ stringifiedRows });
      return stringifiedRows;
    };
    //TODO add tbody and thead somehow
    const tableHtml = `
        <h3>${title}</h3>
        <table>
          ${makeRows(rows)
            .map((row) => `<tr>${row}</tr>`)
            .join("")}
        </table>
      `;
    console.log({ tableHtml });
    tableContainer.innerHTML = tableHtml;
    tableContainer.classList.remove("hidden");
  } else {
    const keys = Object.keys(source);
    const numWords = keys.length;
    const wordOfTheTab = Math.floor(Math.random() * numWords);
    colorIndex = (wordOfTheTab % NUM_COLORS) + 1;
    document.querySelector("#word").innerHTML = keys[wordOfTheTab];
    document.querySelector("#definition").innerHTML =
      source[keys[wordOfTheTab]];
    wordContainer.classList.remove("hidden");
  }
  document.querySelector("#mainContent").classList.add(`pallete_${colorIndex}`);
}
