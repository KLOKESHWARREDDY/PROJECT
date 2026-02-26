const fs = require('fs');
const path = require('path');

const brokenMediaRegex = /@media\s*\(\s*\/\*\s*removed by global cleanup script:\s*(.*?)\s*\*\/\s*\)/g;

function processDirectory(dir) {
    fs.readdir(dir, (err, files) => {
        if (err) throw err;

        files.forEach(file => {
            const filePath = path.join(dir, file);
            fs.stat(filePath, (err, stats) => {
                if (err) throw err;

                if (stats.isDirectory()) {
                    processDirectory(filePath);
                } else if (filePath.endsWith('.css')) {
                    fs.readFile(filePath, 'utf8', (err, data) => {
                        if (err) throw err;

                        if (brokenMediaRegex.test(data)) {
                            const updatedData = data.replace(brokenMediaRegex, '@media ($1)');
                            fs.writeFile(filePath, updatedData, 'utf8', (err) => {
                                if (err) throw err;
                                console.log(`Fixed multiline media queries in ${filePath}`);
                            });
                        }
                    });
                }
            });
        });
    });
}

// Target both standard source CSS directories
const targetDirs = [
    path.join(__dirname, 'src', 'pages'),
    path.join(__dirname, 'src', 'components'),
    path.join(__dirname, 'src')
];

targetDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        processDirectory(dir);
    }
});
