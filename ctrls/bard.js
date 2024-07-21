module.exports = {
    cfg: {
        path: '/bard',
        query: [['ask', 'content'], ['image', 'URI']],
        author: 'Niio-team',
    },
    on: {
        get: async function (req, res) {
            try {
                if (!this.bard) {
                    const Bard = (await import('bard-ai')).default;

                    this.bard = new Bard('fAiJEx0-PrUF9Gx1_NfpIZdDGas6kOhi-_0Po7venTy9b5uw7YSVFx5s4TLqtchS1a2gxQ.').createChat()
                };

                const opt = {};

                opt.format = 'json';

                if (/^https:\/\//.test(req.query.image))opt.image = new Uint8Array((await require('axios')({
                    url: req.query.image,
                    responseType: 'arraybuffer',
                })).data).buffer;
                const ans = await this.bard.ask(req.query.ask, opt);

                delete ans.ids;

                res.json(ans);
            } catch(e) {
                console.error(e);
                res.status(500).end();
            }
        },
    },
}