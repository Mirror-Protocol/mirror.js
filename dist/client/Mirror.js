"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mirror = exports.DEFAULT_MIRROR_OPTIONS = void 0;
var terra_js_1 = require("@terra-money/terra.js");
var EmptyKey_1 = require("../utils/EmptyKey");
var index_1 = require("../contracts/index");
exports.DEFAULT_MIRROR_OPTIONS = {
    lcd: new terra_js_1.LCDClient({
        URL: 'https://moonshine-lcd.terra.dev',
        chainID: 'localterra',
        gasPrices: [new terra_js_1.Coin('ukrw', '1.8')],
        gasAdjustment: '1.2'
    }),
    key: new EmptyKey_1.EmptyKey(),
    collector: 'terra1jmj39n0tfg6qu852fx0kr46gn4sewq6uyqyu8t',
    factory: 'terra1ndzjhjszw4pp8dkkt864drgmwhc59padjfccxg',
    gov: 'terra12pf2c9k7m2ag2893aa6sv75nmytr9uuxzv8vgx',
    mint: 'terra1ycsd7mlffq2ksmqdr20y4drtf6ctw3n8fmup5g',
    oracle: 'terra14nh9jzg6gx3qp2jnlg5lvkmky40uxu7w9mgevz',
    staking: 'terra1xxqqw7vysmh2wnq3y6hgh7d2ytmgazw62f28hh',
    mirrorToken: 'terra16y2ew6rmnehu9fn45jj55w4g37d62xgjz8zsx9',
    terraswapFactory: 'terra10w3rtrs8fmgwy6rsh2xwq6x27ym4kpz3698dr4',
    assets: [
        {
            symbol: 'MIR',
            name: 'Mirror',
            token: 'terra16y2ew6rmnehu9fn45jj55w4g37d62xgjz8zsx9',
            pair: 'terra1ck0ky4ad0ecmz7sksacejxf3rek8922n2302lh',
            lpToken: 'terra1xfm4k6qj3ryhpef4t4p9zgww6e3zuw6c0eqd05'
        },
        {
            symbol: 'mAAPL',
            name: 'Apple',
            token: 'terra17c3tsywm5h95j3z7hy62mvmyjct4euly4gj3kp',
            pair: 'terra1d6548cmpmugndjg650k0k66fhnvkeqxavv0z07',
            lpToken: 'terra1msdk05534hqupfed4v5q04f5y883ezqm0uukn7'
        },
        {
            symbol: 'mGOOGL',
            name: 'Google',
            token: 'terra1tz0c9uy0wwaaq4p57v8qzfx0g08l3zr3zcdtgl',
            pair: 'terra1t8m4cs4f32zqgsktu4pucwnlkz47dgql8crywn',
            lpToken: 'terra1wxh3lw9u3k7psmvqzraxpmscmpgp329kzg834m'
        },
        {
            symbol: 'mTSLA',
            name: 'Tesla',
            token: 'terra13fkuw7gh8r0mjswj8ckyt87m84azq43q3qldmj',
            pair: 'terra1uf29lrmpsmww4k3c9jcxdzet75c2pt353mx4tq',
            lpToken: 'terra1zccwcq7shh4yj8j2ynecd7pyyftxlhdd77fpu3'
        },
        {
            symbol: 'mNFLX',
            name: 'Netflix',
            token: 'terra1f9pk063a99g27l5nu83pd55x6rs649s3ax7pw3',
            pair: 'terra1t033f2r5phvuvysu50x2lj5ctshakcf45szn49',
            lpToken: 'terra1ch6d5kdenshk2zktap2s05arytpn8xhdffarvc'
        },
        {
            symbol: 'mQQQ',
            name: 'Invesco QQQ Trust',
            token: 'terra1hu7u866jla3vgckf4sd6vjdfxzuqvzvu0ekpc9',
            pair: 'terra19ujpfl5djdrp6w4w30vtx9cremz25gkg9nzcfa',
            lpToken: 'terra1cj8rcff3djz86rarg3uw3nzgdy2trgvj5egvdl'
        },
        {
            symbol: 'mTWTR',
            name: 'Twitter',
            token: 'terra1ua295n83qqm7kncn6g704d2a3hpmtjyx7f07u7',
            pair: 'terra14q8szcr0gy5pzksve5sp7e94kqqa0xlc3g2y9u',
            lpToken: 'terra1wunltsvvl2gfsnpwc4hf9pdxt6tnp7rt877ny8'
        },
        {
            symbol: 'mBABA',
            name: 'Alibaba Group Holdings Ltd ADR',
            token: 'terra1vekqnp3tgukt90lqfumu5467jw9jy4eewzn2fu',
            pair: 'terra1q5gyld4cjr59fdk2rjuuzs200ks28lp08fudnt',
            lpToken: 'terra1vrkjzhs26qlg6863s7rcnkqlmp3ftsxfdc6l5r'
        },
        {
            symbol: 'mIAU',
            name: 'iShares Gold Trust',
            token: 'terra1cyrhd8m2hhvvrn3mrn29d4h6unzyp6deay6g2y',
            pair: 'terra1ygeltj9hg4tsshhx2m4et4nmhn2sqpmu2cv8qk',
            lpToken: 'terra1whql3f3vukrtu3qs363vj5a67xccydjz9lpg6t'
        },
        {
            symbol: 'mSLV',
            name: 'iShares Silver Trust',
            token: 'terra17szfxhpttyp6w5p8llpqcr72yegxtaqy6uarye',
            pair: 'terra1vh4e69jq20tdzldc49wwuz22qe4pdr0zlwpvsg',
            lpToken: 'terra1d2ujj007l2tp5r6mgp78hr0ecrtq4q9afvmlwh'
        },
        {
            symbol: 'mUSO',
            name: 'United States Oil Fund, LP',
            token: 'terra19sf42kkwn85dj8hzffcytvw6jx4g8g3nxfnrdu',
            pair: 'terra1yde9tsacetgrdzdm56s5dng2uc53wpnyf9dyds',
            lpToken: 'terra1pkv2skq9pqzpfe483dn6q2dskadrhyrqg2f5ya'
        },
        {
            symbol: 'mVIXY',
            name: 'ProShares VIX',
            token: 'terra1kmt8vekwu4aq6l9y50n8hg9zcdzd3tqdp8lgdr',
            pair: 'terra195fcntnznx4f676gf383g02yguhync2fsuk03x',
            lpToken: 'terra1svhet09r7ulhyr4vs4fl6j6lnam94q6natumck'
        }
    ]
};
var Mirror = /** @class */ (function () {
    function Mirror(options) {
        var _this = this;
        if (options === void 0) { options = exports.DEFAULT_MIRROR_OPTIONS; }
        var mirrorOptions = __assign(__assign({}, exports.DEFAULT_MIRROR_OPTIONS), options);
        var lcd = mirrorOptions.lcd, key = mirrorOptions.key, collector = mirrorOptions.collector, factory = mirrorOptions.factory, gov = mirrorOptions.gov, mint = mirrorOptions.mint, oracle = mirrorOptions.oracle, staking = mirrorOptions.staking, mirrorToken = mirrorOptions.mirrorToken, terraswapFactory = mirrorOptions.terraswapFactory, assets = mirrorOptions.assets;
        this.collector = new index_1.MirrorCollector({
            contractAddress: collector,
            lcd: lcd,
            key: key
        });
        this.factory = new index_1.MirrorFactory({
            contractAddress: factory,
            lcd: lcd,
            key: key
        });
        this.gov = new index_1.MirrorGov({
            contractAddress: gov,
            lcd: lcd,
            key: key
        });
        this.mint = new index_1.MirrorMint({
            contractAddress: mint,
            lcd: lcd,
            key: key
        });
        this.oracle = new index_1.MirrorOracle({
            contractAddress: oracle,
            lcd: lcd,
            key: key
        });
        this.staking = new index_1.MirrorStaking({
            contractAddress: staking,
            lcd: lcd,
            key: key
        });
        this.mirrorToken = new index_1.TerraswapToken({
            contractAddress: mirrorToken,
            lcd: lcd,
            key: key
        });
        this.terraswapFactory = new index_1.TerraswapFactory({
            contractAddress: terraswapFactory,
            lcd: lcd,
            key: key
        });
        this.assets = [];
        assets.forEach(function (asset) {
            _this.assets.push({
                name: asset.name,
                symbol: asset.symbol,
                token: new index_1.TerraswapToken({
                    contractAddress: asset.token,
                    lcd: lcd,
                    key: key
                }),
                lpToken: new index_1.TerraswapToken({
                    contractAddress: asset.lpToken,
                    lcd: lcd,
                    key: key
                }),
                pair: new index_1.TerraswapPair({
                    contractAddress: asset.pair,
                    lcd: lcd,
                    key: key
                })
            });
        });
    }
    return Mirror;
}());
exports.Mirror = Mirror;
//# sourceMappingURL=Mirror.js.map