const fs = require("fs");
const {execSync } = require("child_process");
const core = require("@actions/core");

const excalidrawDir = `${__dirname}/../src/packages/excalidraw`;
const excalidrawPackage = `${excalidrawDir}/package.json`;
const pkg = require(excalidrawPackage);


const publish = () => {
  const tag ="preview";

  try {
    execSync(`yarn  --frozen-lockfile`);
    execSync(`yarn --frozen-lockfile`, { cwd: excalidrawDir });
    try {
      execSync(`yarn run build:umd`, { cwd: excalidrawDir });
    } catch (error) {
      console.error('Error executing `yarn run build:umd`:');
      console.error(error.stdout && error.stdout.toString());  // Outputs stdout (if any)
      console.error(error.stderr && error.stderr.toString());  // Outputs the error message
    }
    execSync(`yarn --cwd ${excalidrawDir} publish --tag ${tag}`,{ env: { ...process.env} });
    console.info(`Published ${pkg.name}@${tag}🎉`);
    core.setOutput(
      "result",
      `**Preview version has been shipped** :rocket:
    You can use [@excalidraw/excalidraw@${pkg.version}](https://www.npmjs.com/package/@excalidraw/excalidraw/v/${pkg.version}) for testing!`,
    );
  } catch (error) {
    core.setOutput("result", "package couldn't be published :warning:!");
    console.error(error);
    process.exit(1);
  }
};


let version = `${pkg.version}-${process.argv.slice(2)[0]}`;

pkg.version = version;

fs.writeFileSync(excalidrawPackage, JSON.stringify(pkg, null, 2), "utf8");

console.info("Publish in progress...");
publish();
