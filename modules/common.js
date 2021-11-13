function isObjectEmpty(obj) {
  return (
    !obj ||
    (obj &&
      Object.keys(obj).length === 0 &&
      Object.getPrototypeOf(obj) === Object.prototype)
  );
}
