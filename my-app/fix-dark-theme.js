const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(filePath));
        } else {
            if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
                results.push(filePath);
            }
        }
    });
    return results;
}

const files = walkDir(directoryPath);
const searchString = "const isDark = theme === 'dark';";
const searchString2 = 'const isDark = theme === "dark";';
const replaceString = "const isDark = ['dark', 'purple-gradient', 'blue-ocean', 'midnight-dark', 'emerald-dark', 'cherry-dark', 'slate-minimal'].includes(theme);";

let modifiedCount = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content.replace(searchString, replaceString).replace(searchString2, replaceString);
    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        modifiedCount++;
        console.log('Modified:', file);
    }
});

console.log('Total modified files:', modifiedCount);
