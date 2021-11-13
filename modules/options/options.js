(function () {
  const onLoad = async () => {
    addFormListeners();
  };
  onLoad();
})();

/**
 * Adds event listeners to the form elements
 */
function addFormListeners() {
  const checkboxes = document.querySelectorAll(
    "input[type=checkbox][name=dataSources]"
  );
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const sourceFolders = (enabledSettings = Array.from(checkboxes)
        .filter((i) => i.checked)
        .map((i) => i.value));
      saveSettings({ sourceFolders });
    });
  });
}

function saveSettings(settings) {
  chrome.storage.sync.set(settings, (err) => {});
}
