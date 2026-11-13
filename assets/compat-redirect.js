// Backward compatibility. The docs used to be published under a version prefix
// (/latest/ and /0.2/) and now live at the site root. Links in already-sent
// emails, the portal and elsewhere still point at /latest/..., which now lands on
// the GitHub Pages 404 page - and that page loads this script. Strip the version
// prefix and send the visitor to the same page at the root. On any normal page the
// path does not start with a version prefix, so this is a no-op.
(function () {
  var m = location.pathname.match(/^\/(?:latest|0\.2)\/(.*)$/);
  if (m) {
    location.replace("/" + m[1] + location.search + location.hash);
  }
})();
