(function () {
  let currentSettings = {};
  const onLoad = async () => {
    currentSettings = await loadSettings();
    initializeForms();
  };

  /**
   * Adds event listeners to the form elements
   */
  function initializeForms() {
    const checkboxes = document.querySelectorAll(
      "input[type=checkbox][name=dataSources]"
    );
    checkboxes.forEach((checkbox) => {
      if (currentSettings.sourceFolders.includes(checkbox.value)) {
        checkbox.checked = true;
      }
      checkbox.addEventListener("change", () => {
        const sourceFolders = (enabledSettings = Array.from(checkboxes)
          .filter((i) => i.checked)
          .map((i) => i.value));
        saveSettings({ sourceFolders });
      });
    });
  }

  function saveSettings(settings) {
    currentSettings = settings;
    chrome.storage.sync.set(settings, (err) => {});
  }

  async function loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(null, async (settings) => {
        if (isObjectEmpty(settings)) {
          settings = { sourceFolders: ["de-en"] };
        }
        resolve(settings);
      });
    });
  }

  onLoad();
})();
