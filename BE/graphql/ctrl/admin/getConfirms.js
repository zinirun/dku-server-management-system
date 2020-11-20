const models = require('../../../models');
const moment = require('moment');
module.exports = async () => {
    return await models.reservation
        .findAll({
            include: [
                {
                    model: models.user,
                    attributes: ['department', 'name'],
                },
            ],
            attributes: ['id', 'serverId', 'start', 'end', 'applyOk', 'createdAt'],
            where: { applyOk: 0 },
            raw: true,
        })
        .then((result) =>
            result.map((r) => {
                return {
                    id: r.id,
                    serverId: r.serverId,
                    start: r.start,
                    end: r.end,
                    applyOk: parseInt(r.applyOk),
                    createdAt: moment(r.createdAt).format('YYYY-MM-DD'),
                    userName: r['user.name'],
                    userDepartment: r['user.department'],
                };
            }),
        )
        .catch((err) => err);
};