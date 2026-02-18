
import fs from 'fs';
const logPath = 'server/server_crash_log.txt';
try {
    const data = fs.readFileSync(logPath, 'utf8');
    const lines = data.split('\n');
    const output = lines.slice(-500).join('\n');
    fs.writeFileSync('temp_crash_clean.txt', output);
    console.log("Wrote 500 lines to temp_crash_clean.txt");
} catch (e) {
    console.error(e.message);
}
