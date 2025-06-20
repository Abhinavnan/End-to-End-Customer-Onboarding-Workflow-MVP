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
        throw new httpError('Invalid GSTIN, please try again', 401);
    }
    return tradeName;
}

module.exports = verifyGSTIN ;