const httpError = require('../models/http-error');

async function verifyGSTIN(GSTIN, next) {
    const url = `https://cleartax.in/f/compliance-report/${GSTIN}/`;
    let tradeName;
    try {
        const response = await fetch(url);
        const data = await response.json();
        tradeName = data.taxpayerInfo.tradeNam || null; // Use optional chaining and fix typo
        if (!tradeName) {
            throw new Error('Trade name not found');
        }
    } catch (err) {
        console.log(err);
        const error = new httpError('invalid GSTIN', 500);
        return next(error);
    }
    return tradeName;
}

module.exports = verifyGSTIN ;