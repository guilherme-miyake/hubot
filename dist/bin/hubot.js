'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadScripts = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
function loadScripts(robot, options) {
    robot.load(path_1.resolve('.', 'scripts'));
    robot.load(path_1.resolve('.', 'src', 'scripts'));
    loadHubotScripts(robot, options);
    loadExternalScripts(robot, options);
    options.scripts.forEach((scriptPath) => {
        if (scriptPath[0] === '/') {
            return robot.load(scriptPath);
        }
        robot.load(path_1.resolve('.', scriptPath));
    });
}
exports.loadScripts = loadScripts;
function loadHubotScripts(robot, options) {
    const hubotScripts = path_1.resolve('.', 'hubot-scripts.json');
    let scripts;
    let scriptsPath;
    if (fs_1.existsSync(hubotScripts)) {
        let hubotScriptsWarning;
        const data = fs_1.readFileSync(hubotScripts);
        if (data.length === 0) {
            return;
        }
        try {
            scripts = data.toJSON();
            scriptsPath = path_1.resolve('node_modules', 'hubot-scripts', 'src', 'scripts');
            robot.loadHubotScripts(scriptsPath, scripts);
        }
        catch (error) {
            robot.logger.error(`Error parsing JSON data from hubot-scripts.json: ${error}`);
            process.exit(1);
        }
        hubotScriptsWarning = 'Loading scripts from hubot-scripts.json is deprecated and ' + 'will be removed in 3.0 (https://github.com/github/hubot-scripts/issues/1113) ' + 'in favor of packages for each script.\n\n';
        // @ts-ignore
        if (scripts.length === 0) {
            hubotScriptsWarning += 'Your hubot-scripts.json is empty, so you just need to remove it.';
            return robot.logger.warning(hubotScriptsWarning);
        }
        const hubotScriptsReplacements = path_1.resolve('node_modules', 'hubot-scripts', 'replacements.json');
        const replacementsData = fs_1.readFileSync(hubotScriptsReplacements);
        const replacements = replacementsData.toJSON();
        const scriptsWithoutReplacements = [];
        if (!fs_1.existsSync(hubotScriptsReplacements)) {
            hubotScriptsWarning += 'To get a list of recommended replacements, update your hubot-scripts: npm install --save hubot-scripts@latest';
            return robot.logger.warning(hubotScriptsWarning);
        }
        hubotScriptsWarning += 'The following scripts have known replacements. Follow the link for installation instructions, then remove it from hubot-scripts.json:\n';
        // @ts-ignore
        scripts.forEach((script) => {
            // @ts-ignore
            const replacement = replacements[script];
            if (replacement) {
                hubotScriptsWarning += `* ${script}: ${replacement}\n`;
            }
            else {
                scriptsWithoutReplacements.push(script);
            }
        });
        hubotScriptsWarning += '\n';
        if (scriptsWithoutReplacements.length > 0) {
            hubotScriptsWarning += 'The following scripts don’t have (known) replacements. You can try searching https://www.npmjs.com/ or http://github.com/search or your favorite search engine. You can copy the script into your local scripts directory, or consider creating a new package to maintain yourself. If you find a replacement or create a package yourself, please post on https://github.com/github/hubot-scripts/issues/1641:\n';
            hubotScriptsWarning += scriptsWithoutReplacements.map((script) => `* ${script}\n`).join('');
            hubotScriptsWarning += '\nYou an also try updating hubot-scripts to get the latest list of replacements: npm install --save hubot-scripts@latest';
        }
        robot.logger.warning(hubotScriptsWarning);
    }
}
function loadExternalScripts(robot, options) {
    const externalScripts = path_1.resolve('.', 'external-scripts.json');
    if (!fs_1.existsSync(externalScripts)) {
        return;
    }
    fs_1.readFile(externalScripts, function (error, data) {
        if (error) {
            throw error;
        }
        try {
            robot.loadExternalScripts(data.toJSON());
        }
        catch (error) {
            console.error(`Error parsing JSON data from external-scripts.json: ${error}`);
            process.exit(1);
        }
    });
}
//# sourceMappingURL=hubot.js.map