const fs = require('fs');
const path = require('path');

const cssRegex = /(margin\s*:\s*0\s+auto\s*;?|max-width\s*:\s*\d+(?:px|vw|rem|em|%)\s*;?)/g;

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

                        // Let's not run this blanket on App.css or index.css directly now that we did them manually
                        if (file === 'index.css' || file === 'App.css') return;

                        if (cssRegex.test(data)) {
                            const updatedData = data.replace(cssRegex, '/* removed by global cleanup script: $1 */');

                            fs.writeFile(filePath, updatedData, 'utf8', (err) => {
                                if (err) throw err;
                                console.log(`Cleaned up constraints in ${filePath}`);
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
