const core = require("@actions/core");
const github = require("@actions/github");
const {mkdirp} = require("mkdirp");
const checker = require("./lib/index");
const path = require("path");
const fs = require("fs");

try {
  core.info(process.cwd());

  fs.readdir("./", function (err, items) {
    core.info(JSON.stringify(items));

    for (var i = 0; i < items.length; i++) {
      core.info(items[i]);
    }
  });
  checker.init(
    {
      start: process.cwd(),
      production: core.getInput("production"),
      development: core.getInput("development"),
      markdown: core.getInput("markdown"),
      exclude: core.getInput("exclude"),
      excludePackages: core.getInput("excludePackages"),
      excludePrivatePackages: core.getInput("excludePrivatePackages"),
      onlyAllow: core.getInput("onlyAllow"),
    },
    function (err, packages) {
      if (err) {
        core.error("License check failed with error");
        core.setFailed(err);
      }
      core.info("All packages passed the license check");
      core.info(packages);

      const formattedOutput = checker.asMarkDown(packages) + "\n";
      core.info(formattedOutput);

      const out = "public/" + core.getInput("out");

      var dir = path.dirname(out);
      mkdirp.sync(dir);
      fs.writeFileSync(
        out,
        `<html><body><pre><code>${formattedOutput}</code></pre></body></html>`,
        "utf8"
      );

      core.setOutput("licenseString", formattedOutput);
    }
  );
} catch (error) {
  core.setFailed(error.message);
}
