import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3000;

http.createServer((req, res) => {
    let filePath = '.' + (req.url === '/' ? '/index.html' : req.url);
    const ext = path.extname(filePath);
    const contentType = ext === '.json' ? 'application/json' : ext === '.js' ? 'text/javascript' : 'text/html';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end("Fichier non trouvé");
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
}).listen(PORT, () => {
    console.log(`🚀 Serveur prêt : http://localhost:${PORT}`);
});