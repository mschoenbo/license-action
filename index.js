const core = require("@actions/core");
const github = require("@actions/github");
const {mkdirp} = require("mkdirp");
const checker = require("./lib/index");
const path = require("path");
const fs = require("fs");

const customFormat =
  '{"name": "","version": "","description": "","licenses": "","copyright": "","licenseModified": "no"}';

try {
  checker.init(
    {
      start: process.cwd(),
      production: core.getInput("production") === "true",
      development: core.getInput("development") === "true",
      markdown: core.getInput("markdown") === "true",
      exclude: core.getInput("exclude"),
      excludePackages: core.getInput("excludePackages"),
      excludePrivatePackages:
        core.getInput("excludePrivatePackages") === "true",
      onlyAllow: core.getInput("onlyAllow"),
      customFormat: customFormat,
    },
    function (err, packages) {
      if (err) {
        core.error("License check failed with error");
        core.setFailed(err);
      }
      core.info("All packages passed the license check");

      if (core.getInput("markdown") === "true") {
        const formattedOutput =
          checker.asMarkDown(packages, JSON.parse(customFormat)) + "\n";

        const out = "public/" + core.getInput("out");

        var dir = path.dirname(out);
        mkdirp.sync(dir);
        fs.writeFileSync(
          out,
          `Licenses \n ========== \n ${formattedOutput}`,
          "utf8"
        );
      }

      core.setOutput("licenseString", packages);
    }
  );
} catch (error) {
  core.setFailed(error.message);
}
