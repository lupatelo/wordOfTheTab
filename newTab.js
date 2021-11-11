const NUM_COLORS = 16;

(function () {
  const onLoad = async () => {
    /**
     * Get the datas
     */
    const sources = await getDataSources();
    /**
     *Chooses the data soruce to use
     */
    const sourceToUse = Math.round(Math.random() * (sources.length - 1));
    renderDataSource(sources[sourceToUse]);
  };
  onLoad();
})();

function renderDataSource(source) {
  const wordContainer = document.getElementById("wordContainer");
  const tableContainer = document.getElementById("tableContainer");
  const isTable = Array.isArray(source); // Todo make a better data packet
  wordContainer.classList.add("hidden");
  tableContainer.classList.add("hidden");
  if (isTable) {
    buildTable(source);
  } else {
    buildDictionary(source);
  }
}
/**
 * Gets the data sources from assets
 * @returns
 */
async function getDataSources() {
  const urls = ["assets/de-en/words.json", "assets/de-en/tables.json"];

  const sources = [];
  for (const url of urls) {
    const data = await fetch(url).catch(() => null);
    if (data) {
      const jsonData = await data.json();
      sources.push(jsonData);
    }
  }
  return sources;
}

/**
 * Builds the table given a specific data source
 */
function buildTable(source) {
  const numTables = source.length;
  const tableOfTheTab = Math.floor(Math.random() * numTables);
  const colorIndex = (tableOfTheTab % NUM_COLORS) + 1;
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
          console.error(`DO not know how to intepret this data`);
        }
      }
    });
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
  tableContainer.innerHTML = tableHtml;
  tableContainer.classList.remove("hidden");
  document.querySelector("#mainContent").classList.add(`pallete_${colorIndex}`);
}
/**
 * Chooses a random word from the source, adds the word and the definition
 */
function buildDictionary(source) {
  const keys = Object.keys(source);
  const numWords = keys.length;
  const wordOfTheTab = Math.floor(Math.random() * numWords);
  const colorIndex = (wordOfTheTab % NUM_COLORS) + 1;
  document.querySelector("#word").innerHTML = keys[wordOfTheTab];
  document.querySelector("#definition").innerHTML = source[keys[wordOfTheTab]];
  wordContainer.classList.remove("hidden");
  document.querySelector("#mainContent").classList.add(`pallete_${colorIndex}`);
}
