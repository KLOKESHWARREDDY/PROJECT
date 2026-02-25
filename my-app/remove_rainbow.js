const fs = require('fs');
const path = require('path');

const RAINBOW_BG = 'linear-gradient(135deg, #FF6B6B, #FFB86B, #FFE66D, #6BCB77, #4D96FF, #9D4EDD)';
const RAINBOW_BTN = 'linear-gradient(90deg, #FF512F, #F09819, #1FD1F9, #B621FE)';
const RAINBOW_BTN_HOVER = 'linear-gradient(90deg, #FF7155, #F2A633, #4DDDF9, #C34BFE)';
const CARD_BG_LIGHT = 'rgba(255, 255, 255, 0.9)';
const CARD_BG_DARK = 'rgba(30, 41, 59, 0.9)';

const replacements = [
    // 1. App Backgrounds (Converting background back to backgroundColor)
    { search: `background: tempTheme === 'dark' ? '#0f172a' : '${RAINBOW_BG}'`, replace: `backgroundColor: tempTheme === 'dark' ? '#0f172a' : '#EFF6FF'` },
    { search: `background: isDark ? '#0f172a' : '${RAINBOW_BG}'`, replace: `backgroundColor: isDark ? '#0f172a' : '#EFF6FF'` },
    { search: `background: isDark ? '#1e293b' : '${RAINBOW_BG}'`, replace: `backgroundColor: isDark ? '#1e293b' : '#EFF6FF'` },
    { search: `background: '${RAINBOW_BG}'`, replace: `backgroundColor: '#EFF6FF'` },
    { search: `background: "${RAINBOW_BG}"`, replace: `backgroundColor: '#EFF6FF'` },

    // 2. Card Backgrounds with Glassmorphism
    { search: `backgroundColor: isDark ? '${CARD_BG_DARK}' : '${CARD_BG_LIGHT}', backdropFilter: 'blur(10px)'`, replace: `backgroundColor: isDark ? '#1e293b' : '#ffffff'` },
    { search: `backgroundColor: '${CARD_BG_LIGHT}', backdropFilter: 'blur(10px)'`, replace: `backgroundColor: '#ffffff'` },
    { search: `background: '${CARD_BG_LIGHT}', backdropFilter: 'blur(10px)'`, replace: `backgroundColor: '#ffffff'` },

    // 3. Primary Buttons & Highlights
    { search: `background: '${RAINBOW_BTN}'`, replace: `backgroundColor: '#2563EB'` },
    { search: `background: isActive ? '${RAINBOW_BTN}'`, replace: `backgroundColor: isActive ? '#2563EB'` },

    // 4. Hover states & Dark Blue replacements
    { search: `background: '${RAINBOW_BTN_HOVER}'`, replace: `backgroundColor: '#1E3A8A'` },

    // 5. Borders and Text Colors
    { search: `color: '#B621FE'`, replace: `color: '#2563EB'` },
    { search: `color: "#B621FE"`, replace: `color: "#2563EB"` },
    { search: `color: '#FF512F'`, replace: `color: '#1E3A8A'` },
    { search: `borderColor: isActive ? '#1FD1F9'`, replace: `borderColor: isActive ? '#2563EB'` },
    { search: `border: '2px solid #1FD1F9'`, replace: `border: '2px solid #2563EB'` },
    { search: `border: '1px solid #1FD1F9'`, replace: `border: '1px solid #2563EB'` },
    { search: `borderTop: '4px solid #B621FE'`, replace: `borderTop: '4px solid #2563EB'` },

    // 6. Fix residual shades
    { search: /#FFE66D/g, replace: '#93C5FD' },
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
