const fs = require('fs');

function removeEpisodeRuntimes(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let lines = content.split('\n');
    
    let inEpisodes = false;
    
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('"episodes": [')) {
            inEpisodes = true;
        }
        if (inEpisodes && lines[i].includes(']')) {
            inEpisodes = false;
        }
        
        if (inEpisodes) {
            // Remove single line runtime: e.g. `, "runtime": 46 }`
            if (lines[i].includes(', "runtime":')) {
                lines[i] = lines[i].replace(/, "runtime": \d+/, '');
            }
            // Remove multi line runtime: e.g. `        "runtime": 45`
            if (lines[i].match(/^\s*"runtime": \d+,?$/)) {
                // Also check if previous line has a trailing comma we need to remove?
                // The previous line was title. E.g. `"title": "...",\n "runtime": 45`
                // We added the comma to the title line, so we need to remove it.
                if (i > 0 && lines[i-1].trim().endsWith(',')) {
                    lines[i-1] = lines[i-1].replace(/,$/, '');
                }
                lines[i] = null; // Mark for deletion
            }
        }
    }
    
    lines = lines.filter(l => l !== null);
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
}

removeEpisodeRuntimes('./src/data/mcuData.js');
removeEpisodeRuntimes('./src/data/animatedData.js');
console.log("Runtimes removed from episodes.");
