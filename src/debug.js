let _enabled = false;
function setEnabled(v) {
  _enabled = !!v;
}
function enabled() {
  return _enabled;
}
function debug(...args) {
  if (!_enabled) return;
  try {
    console.error(...args);
  } catch (e) { }
}
module.exports = { setEnabled, enabled, debug };
