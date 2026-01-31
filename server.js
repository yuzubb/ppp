const http = require('http');
const httpProxy = require('http-proxy');

// プロキシサーバーの作成
const proxy = httpProxy.createProxyServer({
    target: 'https://mangafire.to',
    changeOrigin: true,
    ssl: { rejectUnauthorized: false }
});

const server = http.createServer((req, res) => {
    // 画像サーバーへのリクエストを判定
    if (req.url.startsWith('/static-assets/')) {
        req.url = req.url.replace('/static-assets/', '/');
        proxy.web(req, res, { target: 'https://static.mangafire.to' });
        return;
    }

    // 通常のリクエスト
    proxy.web(req, res, { target: 'https://mangafire.to' });
});

// エラー時の処理（Network unreachable対策）
proxy.on('error', (err, req, res) => {
    console.error('Proxy Error:', err);
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Something went wrong. (Server blocked or unreachable)');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
