const cfg_ip = {
    // max 10 request / 5s
    max: ([10, 1000*5]),

    // neu ip bi cam se mo cam sau 1 tieng
    unlock_ms: 1000*60*60,
};

(async function () {
    const fs = require('fs');
    const express = require('express');
    const chalk = (await import('chalk')).default;

    const logc = (...text)=>console.log(...[new Date().toLocaleString('vi', {
        timeZone: 'Asia/Ho_Chi_Minh', hour12: false,
    }), chalk.hex(utils.random.color())('»'), ...text].map(e=>chalk.hex(utils.random.color())(e)));
    const port = process.env.PORT || 3000;
    const app = express();
    const path = 'IP.json'; !fs.existsSync(path) && fs.writeFileSync(path, '{}');
    const data = JSON.parse(fs.readFileSync(path));

    app.use(require('cors')());
    app.use('/static', express.static('assets/static/'));
    app.use(express.json());
    app.set('json spaces', 4);
    app.use(function (req, res, next) {
        if (/^\/static\//.test(req.url))next();
        const IP = req.headers['x-forwarded-for'].split(',')[0] || req.connection.remoteAddress;
        let ip = data[IP];

        if (!ip)ip = data[IP] = {
            count: 0,
            last: Date.now(),
        };
        if (ip.blocked === true) {
            if (Date.now()-ip.last >= ip.unlock_ms)(ip.count = 0, ip.last = Date.now(), ip.blocked = false);
            else res.end();
        };
        if (ip.blocked !== true) {
            if (ip.count <= cfg_ip.max[0] && Date.now()-ip.last >= cfg_ip.max[1])(ip.count = 0, ip.last = Date.now());
            if (++ip.count > cfg_ip.max[0]) res.end();
        };

        logc(IP, req.method, req.url);
        !res.finished && next();
        fs.writeFileSync(path, JSON.stringify(data, 0, 4));
    });
  
    fs.readdirSync('ctrls').map(file=>require('./ctrls/'+file)).map(ctrl=>Object.entries(ctrl.on).map(e=>app[e[0]](ctrl.cfg.path, e[1])));
    app.listen(port, _=>logc(`listening on port ${port}`));
})();