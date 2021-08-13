var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var typeforce = require('typeforce');
var types = require('../../types');
var version = require('./version');
var _a = require('../../bufferutils'), BufferReader = _a.BufferReader, BufferWriter = _a.BufferWriter;
var NUM_JOINSPLITS_INPUTS = 2;
var NUM_JOINSPLITS_OUTPUTS = 2;
var NOTECIPHERTEXT_SIZE = 1 + 8 + 32 + 32 + 512 + 16;
var G1_PREFIX_MASK = 0x02;
var G2_PREFIX_MASK = 0x0a;
var ZcashBufferReader = /** @class */ (function (_super) {
    __extends(ZcashBufferReader, _super);
    function ZcashBufferReader(buffer, offset, txVersion) {
        var _this = _super.call(this, buffer, offset) || this;
        typeforce(types.maybe(types.Int32), txVersion);
        _this.txVersion = txVersion;
        return _this;
    }
    ZcashBufferReader.prototype.readInt64 = function () {
        var a = this.buffer.readUInt32LE(this.offset);
        var b = this.buffer.readInt32LE(this.offset + 4);
        b *= 0x100000000;
        this.offset += 8;
        return b + a;
    };
    ZcashBufferReader.prototype.readCompressedG1 = function () {
        var yLsb = this.readUInt8() & 1;
        var x = this.readSlice(32);
        return {
            x: x,
            yLsb: yLsb
        };
    };
    ZcashBufferReader.prototype.readCompressedG2 = function () {
        var yLsb = this.readUInt8() & 1;
        var x = this.readSlice(64);
        return {
            x: x,
            yLsb: yLsb
        };
    };
    ZcashBufferReader.prototype.readZKProof = function () {
        var zkproof;
        if (this.txVersion >= version.SAPLING) {
            zkproof = {
                sA: this.readSlice(48),
                sB: this.readSlice(96),
                sC: this.readSlice(48)
            };
        }
        else {
            zkproof = {
                gA: this.readCompressedG1(),
                gAPrime: this.readCompressedG1(),
                gB: this.readCompressedG2(),
                gBPrime: this.readCompressedG1(),
                gC: this.readCompressedG1(),
                gCPrime: this.readCompressedG1(),
                gK: this.readCompressedG1(),
                gH: this.readCompressedG1()
            };
        }
        return zkproof;
    };
    ZcashBufferReader.prototype.readJoinSplit = function () {
        var vpubOld = this.readUInt64();
        var vpubNew = this.readUInt64();
        var anchor = this.readSlice(32);
        var nullifiers = [];
        for (var j = 0; j < NUM_JOINSPLITS_INPUTS; j++) {
            nullifiers.push(this.readSlice(32));
        }
        var commitments = [];
        for (j = 0; j < NUM_JOINSPLITS_OUTPUTS; j++) {
            commitments.push(this.readSlice(32));
        }
        var ephemeralKey = this.readSlice(32);
        var randomSeed = this.readSlice(32);
        var macs = [];
        for (j = 0; j < NUM_JOINSPLITS_INPUTS; j++) {
            macs.push(this.readSlice(32));
        }
        var zkproof = this.readZKProof();
        var ciphertexts = [];
        for (j = 0; j < NUM_JOINSPLITS_OUTPUTS; j++) {
            ciphertexts.push(this.readSlice(NOTECIPHERTEXT_SIZE));
        }
        return {
            vpubOld: vpubOld,
            vpubNew: vpubNew,
            anchor: anchor,
            nullifiers: nullifiers,
            commitments: commitments,
            ephemeralKey: ephemeralKey,
            randomSeed: randomSeed,
            macs: macs,
            zkproof: zkproof,
            ciphertexts: ciphertexts
        };
    };
    ZcashBufferReader.prototype.readShieldedSpend = function () {
        var cv = this.readSlice(32);
        var anchor = this.readSlice(32);
        var nullifier = this.readSlice(32);
        var rk = this.readSlice(32);
        var zkproof = this.readZKProof();
        var spendAuthSig = this.readSlice(64);
        return {
            cv: cv,
            anchor: anchor,
            nullifier: nullifier,
            rk: rk,
            zkproof: zkproof,
            spendAuthSig: spendAuthSig
        };
    };
    ZcashBufferReader.prototype.readShieldedOutput = function () {
        var cv = this.readSlice(32);
        var cmu = this.readSlice(32);
        var ephemeralKey = this.readSlice(32);
        var encCiphertext = this.readSlice(580);
        var outCiphertext = this.readSlice(80);
        var zkproof = this.readZKProof();
        return {
            cv: cv,
            cmu: cmu,
            ephemeralKey: ephemeralKey,
            encCiphertext: encCiphertext,
            outCiphertext: outCiphertext,
            zkproof: zkproof
        };
    };
    return ZcashBufferReader;
}(BufferReader));
var ZcashBufferWriter = /** @class */ (function (_super) {
    __extends(ZcashBufferWriter, _super);
    function ZcashBufferWriter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ZcashBufferWriter.prototype.writeCompressedG1 = function (i) {
        this.writeUInt8(G1_PREFIX_MASK | i.yLsb);
        this.writeSlice(i.x);
    };
    ZcashBufferWriter.prototype.writeCompressedG2 = function (i) {
        this.writeUInt8(G2_PREFIX_MASK | i.yLsb);
        this.writeSlice(i.x);
    };
    return ZcashBufferWriter;
}(BufferWriter));
module.exports = { ZcashBufferReader: ZcashBufferReader, ZcashBufferWriter: ZcashBufferWriter };
