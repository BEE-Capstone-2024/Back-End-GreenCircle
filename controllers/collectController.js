require('dotenv').config()
const { get } = require('mongoose');
const Collect = require('../models/Collect')

const jwt = require('jsonwebtoken')

const createCollect = async (req, res, next) => {
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const eventId = req.params.eventId;

    const { collection } = req.body;
    const { plastic, tobacco, metal, glass, fabric, paper } = collection;

    try {
        const collect = new Collect({
            user: userId,
            eventId,
            collect: {
                plastic,
                tobacco,
                metal,
                glass,
                fabric,
                paper,
            }
        });

        const savedCollect = await collect.save();

        res.status(200).json({
            success: true,
            savedCollect,
        });

    } catch (error) {
        console.log(error);
        return next(error);
    }
}

module.exports = {
    createCollect,
}
