var profile = (function() {
  return {
    resourceTags: {
      test: function(filename, mid) {
        return filename == "doh.js";
      },

      copyOnly: function(filename, mid) {
        return false;
      },

      amd: function(filename, mid) {
        return filename != "doh.js" && /\.js$/.test(filename);
      }
    }
  };
})();
