const fs = require('fs');
const path = require('path');

const replacements = [
    // Page backgrounds (safeguarded)
    { search: "? '#0f172a' : '#ffffff'", replace: "? '#0f172a' : '#EFF6FF'" },
    { search: "? '#1e293b' : '#ffffff'", replace: "? '#1e293b' : '#EFF6FF'" },

    // Replace primary theme colors
    { search: /#7c3aed/gi, replace: '#2563EB' },
    { search: /#6366f1/gi, replace: '#2563EB' },

    // Old Hover/Darker
    { search: /#6d28d9/gi, replace: '#1E3A8A' },
    { search: /#4338ca/gi, replace: '#1E3A8A' },
    { search: /#4f46e5/gi, replace: '#1D4ED8' },

    // Old Light Tints
    { search: /#f3e8ff/gi, replace: '#EFF6FF' },
    { search: /#e0e7ff/gi, replace: '#EFF6FF' },

    // Secondary
    { search: /#a78bfa/gi, replace: '#93C5FD' },
    { search: /#c7d2fe/gi, replace: '#93C5FD' },

    // RGBA variations
    { search: /rgba\(\s*124\s*,\s*58\s*,\s*237/gi, replace: 'rgba(37, 99, 235' }
];

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
    });
}

let modifiedFiles = 0;
walkDir('src', function (filePath) {
    if (filePath.endsWith('.jsx') || filePath.endsWith('.js') || filePath.endsWith('.css')) {
        let originalText = fs.readFileSync(filePath, 'utf8');
        let newContent = originalText;

        replacements.forEach(rule => {
            if (typeof rule.search === 'string') {
                newContent = newContent.split(rule.search).join(rule.replace);
            } else {
                newContent = newContent.replace(rule.search, rule.replace);
            }
        });

        if (originalText !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log('Updated: ' + filePath);
            modifiedFiles++;
        }
    }
});
console.log('Total files modified: ' + modifiedFiles);
