const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');


async function parseAssets(assetsDir, outputFile) {
    try {
        const files = await fs.readdir(assetsDir);
        const yamlFiles = files.filter(f => path.extname(f).toLowerCase() === '.yaml');

        const collected = [];
        for (const file of yamlFiles) {
            const filePath = path.join(assetsDir, file);
            try {
                const content = await fs.readFile(filePath, 'utf8');
                const data = yaml.load(content);
                collected.push(data);
                console.log(`Loaded ${file}`);
            } catch (err) {
                console.error(`Load err ${file}:`, err.message);
            }
        }

        collected.sort((a, b) => a.index > b.index ? 1 : -1);

        await fs.writeFile(outputFile, JSON.stringify(collected, null, 2), 'utf8');
        console.log(`Saved to ${outputFile}`);
    } catch (err) {
        console.error('Save err:', err.message);
    }
}

if (require.main === module) {
    const assetsDir = path.resolve(__dirname, 'assets');
    const outputFile = path.resolve(__dirname, 'assets.json');
    parseAssets(assetsDir, outputFile);
}