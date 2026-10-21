// Meta CSP cannot set frame-ancestors, so refuse to render inside a frame.
if (window.top !== window.self) {
  window.top.location = window.self.location.href;
}
