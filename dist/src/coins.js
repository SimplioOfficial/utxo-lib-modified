"use strict";
exports.__esModule = true;
exports.DOGE = exports.DGB = exports.ZEC = exports.LTC = exports.DASH = exports.BTG = exports.BTC = exports.BSV = exports.BCH = exports.isValidNetwork = exports.isZcash = exports.isLitecoin = exports.isDash = exports.isBitcoinSV = exports.isBitcoinGold = exports.isBitcoinCash = exports.isBitcoin = exports.getTestnet = exports.isSameCoin = exports.isTestnet = exports.isMainnet = exports.getMainnet = exports.getNetworkName = exports.getNetworkList = void 0;
/**
 * @prettier
 */
var networks = require("./networks");
var networkTypes_1 = require("./networkTypes");
var typeforce = require('typeforce');
/**
 * @returns {Network[]} all known networks as array
 */
function getNetworkList() {
    return Object.keys(networks).map(function (n) { return networks[n]; });
}
exports.getNetworkList = getNetworkList;
/**
 * @param {Network} network
 * @returns {string} the name of the network. Returns undefined if network is not a value
 *                   of `networks`
 */
function getNetworkName(network) {
    return Object.keys(networks).find(function (n) { return networks[n] === network; });
}
exports.getNetworkName = getNetworkName;
/**
 * @param {Network} network
 * @returns {Object} the mainnet corresponding to a testnet
 */
function getMainnet(network) {
    switch (network) {
        case networks.bitcoin:
        case networks.testnet:
            return networks.bitcoin;
        case networks.bitcoincash:
        case networks.bitcoincashTestnet:
            return networks.bitcoincash;
        case networks.bitcoingold:
        case networks.bitcoingoldTestnet:
            return networks.bitcoingold;
        case networks.bitcoinsv:
        case networks.bitcoinsvTestnet:
            return networks.bitcoinsv;
        case networks.dash:
        case networks.dashTest:
            return networks.dash;
        case networks.litecoin:
        case networks.litecoinTest:
            return networks.litecoin;
        case networks.zcash:
        case networks.zcashTest:
            return networks.zcash;
        case networks.digibyte:
            return networks.digibyte;
        case networks.dogecoin:
            return networks.dogecoin;
    }
    throw new TypeError("invalid network");
}
exports.getMainnet = getMainnet;
/**
 * @param {Network} network
 * @returns {boolean} true iff network is a mainnet
 */
function isMainnet(network) {
    return getMainnet(network) === network;
}
exports.isMainnet = isMainnet;
/**
 * @param {Network} network
 * @returns {boolean} true iff network is a testnet
 */
function isTestnet(network) {
    return getMainnet(network) !== network;
}
exports.isTestnet = isTestnet;
/**
 *
 * @param {Network} network
 * @param {Network} otherNetwork
 * @returns {boolean} true iff both networks are for the same coin
 */
function isSameCoin(network, otherNetwork) {
    return getMainnet(network) === getMainnet(otherNetwork);
}
exports.isSameCoin = isSameCoin;
var mainnets = getNetworkList().filter(isMainnet);
var testnets = getNetworkList().filter(isTestnet);
/**
 * Map where keys are mainnet networks and values are testnet networks
 * @type {Map<Network, Network[]>}
 */
var mainnetTestnetPairs = new Map(mainnets.map(function (m) { return [m, testnets.filter(function (t) { return getMainnet(t) === m; })]; }));
/**
 * @param {Network} network
 * @returns {Network|undefined} - The testnet corresponding to a mainnet.
 *                               Returns undefined if a network has no testnet.
 */
function getTestnet(network) {
    if (isTestnet(network)) {
        return network;
    }
    var testnets = mainnetTestnetPairs.get(network);
    if (testnets === undefined) {
        throw new Error("invalid argument");
    }
    if (testnets.length === 0) {
        return;
    }
    if (testnets.length === 1) {
        return testnets[0];
    }
    throw new Error("more than one testnet for " + getNetworkName(network));
}
exports.getTestnet = getTestnet;
/**
 * @param {Network} network
 * @returns {boolean} true iff network bitcoin or testnet
 */
function isBitcoin(network) {
    return getMainnet(network) === networks.bitcoin;
}
exports.isBitcoin = isBitcoin;
/**
 * @param {Network} network
 * @returns {boolean} true iff network is bitcoincash or bitcoincashTestnet
 */
function isBitcoinCash(network) {
    return getMainnet(network) === networks.bitcoincash;
}
exports.isBitcoinCash = isBitcoinCash;
/**
 * @param {Network} network
 * @returns {boolean} true iff network is bitcoingold
 */
function isBitcoinGold(network) {
    return getMainnet(network) === networks.bitcoingold;
}
exports.isBitcoinGold = isBitcoinGold;
/**
 * @param {Network} network
 * @returns {boolean} true iff network is bitcoinsv or bitcoinsvTestnet
 */
function isBitcoinSV(network) {
    return getMainnet(network) === networks.bitcoinsv;
}
exports.isBitcoinSV = isBitcoinSV;
/**
 * @param {Network} network
 * @returns {boolean} true iff network is dash or dashTest
 */
function isDash(network) {
    return getMainnet(network) === networks.dash;
}
exports.isDash = isDash;
/**
 * @param {Network} network
 * @returns {boolean} true iff network is litecoin or litecoinTest
 */
function isLitecoin(network) {
    return getMainnet(network) === networks.litecoin;
}
exports.isLitecoin = isLitecoin;
/**
 * @param {Network} network
 * @returns {boolean} true iff network is zcash or zcashTest
 */
function isZcash(network) {
    return getMainnet(network) === networks.zcash;
}
exports.isZcash = isZcash;
/**
 * @param {Network} network
 * @returns {boolean} returns true iff network is any of the network stated in the argument
 */
function isDigibyte(network) {
    return getMainnet(network) === networks.digibyte;
}
/**
 * @param {Network} network
 * @returns {boolean} returns true iff network is any of the network stated in the argument
 */
function isDogeCoin(network) {
    return getMainnet(network) === networks.dogecoin;
}
/**
 * @param {Network} network
 * @returns {boolean} returns true iff network is any of the network stated in the argument
 */
exports.isValidNetwork = typeforce.oneOf(isBitcoin, isBitcoinCash, isBitcoinGold, isBitcoinSV, isDash, isLitecoin, isZcash, isDigibyte, isDogeCoin);
/** @deprecated */
exports.BCH = networkTypes_1.coins.BCH;
/** @deprecated */
exports.BSV = networkTypes_1.coins.BSV;
/** @deprecated */
exports.BTC = networkTypes_1.coins.BTC;
/** @deprecated */
exports.BTG = networkTypes_1.coins.BTG;
/** @deprecated */
exports.DASH = networkTypes_1.coins.DASH;
/** @deprecated */
exports.LTC = networkTypes_1.coins.LTC;
/** @deprecated */
exports.ZEC = networkTypes_1.coins.ZEC;
exports.DGB = networkTypes_1.coins.DGB;
exports.DOGE = networkTypes_1.coins.DOGE;
