const token = 'EAAD6V7os0gcBO7NAZBvFe4eN4aeTXzrL2aQAZBL09GsYIHookywPPXVkZAjyaOod68sf4ZCumZCg5PX6EhmOLqqz0FjoKnyXg3o7qsbxoYAco5fVZB1UDyqf9GHuL9n0Oa2s7pgp0g9yAFYchTCjaWex3vT4ZCPfYSPnfJdSEkodS3UkmAqMahQuM2OrgZDZD';
const data = {};
const get_info = id=>require('axios').get(`https://graph.facebook.com/${id}?fields=id,is_verified,cover,updated_time,work,education,likes,created_time,work,posts,hometown,username,family,timezone,link,name,locale,location,about,website,birthday,gender,relationship_status,significant_other,quotes,first_name,subscribers.limit(0)&access_token=${token}`).then(res=>(data[id] = res.data, res.data));
const html = require('fs').readFileSync('assets/fb.html', 'utf8');

module.exports = {
    cfg: {
        path: '/fb',
        author: 'teams [🎃] niiozic',
    },
    on: {
        get: async function (req, res) {
            try {
                const {
                    q,
                    uid,
                    rt,
                } = req.query;
                const id = q;

                if (isFinite(uid)) {
                    const info = data[uid] || await get_info(uid);
                    const text = html.replace("'$data'", JSON.stringify(info));

                    res.set('content-type', 'text/html');
                    return res.send(text);
                }
                if (isNaN(id)) {
                    const text = html.replace("'$data'", '{}');

                    res.set('content-type', 'text/html');
                    return res.send(text);
                };

                res.json(await get_info(id));
            } catch(e) {
                console.error(e);
                res.status(500).end();
            }
        },
    },
}