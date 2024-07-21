const fs = require('fs');

module.exports = {
    cfg: {
        path: '/',
        author: 'Niio-team',
    },
    on: {
        get: function (req, res) {
            res.set('content-type', 'text/html');
            res.send(`<meta name="viewport" content="width=device-width, initial-scale=1.0">${fs.readdirSync('ctrls').map(e=>require('./'+e).cfg).map(cfg=>`<li><a href="${cfg.path}${cfg.query?`?${new URLSearchParams(cfg.query).toString()}`: ''}">${cfg.path}</a></li>`).join('')}`);
        },
    },
}