import { AccAddress, Key, LCDClient, Coin } from '@terra-money/terra.js';
import { EmptyKey } from '../utils/EmptyKey';
import {
  MirrorCollector,
  MirrorFactory,
  MirrorGov,
  MirrorMint,
  MirrorOracle,
  MirrorStaking,
  TerraswapFactory,
  TerraswapPair,
  TerraswapToken
} from '../contracts/index';

export interface AssetOptions {
  symbol: string;
  name: string;
  token: AccAddress;
  pair: AccAddress;
  lpToken: AccAddress;
}

export interface MirrorOptions {
  lcd: LCDClient;
  key: Key;
  collector: AccAddress;
  factory: AccAddress;
  gov: AccAddress;
  mint: AccAddress;
  oracle: AccAddress;
  staking: AccAddress;
  mirrorToken: AccAddress;
  terraswapFactory: AccAddress;
  assets: Array<AssetOptions>;

  collectorCodeID: number;
  factoryCodeID: number;
  govCodeID: number;
  mintCodeID: number;
  oracleCodeID: number;
  stakingCodeID: number;
  terraswapFactoryCodeID: number;
  terraswapPairCodeID: number;
  terraswapTokenCodeID: number;
}

export const DEFAULT_MIRROR_OPTIONS: MirrorOptions = {
  lcd: new LCDClient({
    URL: 'https://moonshine-lcd.terra.dev',
    chainID: 'localterra',
    gasPrices: [new Coin('ukrw', '1.8')],
    gasAdjustment: '1.2'
  }),
  key: new EmptyKey(),
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
  ],

  collectorCodeID: 59,
  factoryCodeID: 60,
  govCodeID: 71,
  mintCodeID: 70,
  oracleCodeID: 63,
  stakingCodeID: 64,
  terraswapFactoryCodeID: 65,
  terraswapPairCodeID: 66,
  terraswapTokenCodeID: 67
};

export default class Mirror {
  public collector: MirrorCollector;

  public factory: MirrorFactory;

  public gov: MirrorGov;

  public mint: MirrorMint;

  public oracle: MirrorOracle;

  public staking: MirrorStaking;

  public terraswapFactory: TerraswapFactory;

  public assets: Array<{
    name: string;
    symbol: string;
    token: TerraswapToken;
    lpToken: TerraswapToken;
    pair: TerraswapPair;
  }>;

  constructor(options: Partial<MirrorOptions> = DEFAULT_MIRROR_OPTIONS) {
    const mirrorOptions = { ...options, ...DEFAULT_MIRROR_OPTIONS };
    const {
      lcd,
      key,
      collector,
      factory,
      gov,
      mint,
      oracle,
      staking,
      terraswapFactory,
      assets,
      collectorCodeID,
      factoryCodeID,
      govCodeID,
      mintCodeID,
      oracleCodeID,
      stakingCodeID,
      terraswapFactoryCodeID,
      terraswapPairCodeID,
      terraswapTokenCodeID
    } = mirrorOptions;

    this.collector = new MirrorCollector(collector, collectorCodeID, lcd, key);
    this.factory = new MirrorFactory(factory, factoryCodeID, lcd, key);
    this.gov = new MirrorGov(gov, govCodeID, lcd, key);
    this.mint = new MirrorMint(mint, mintCodeID, lcd, key);
    this.oracle = new MirrorOracle(oracle, oracleCodeID, lcd, key);
    this.staking = new MirrorStaking(staking, stakingCodeID, lcd, key);
    this.terraswapFactory = new TerraswapFactory(
      terraswapFactory,
      terraswapFactoryCodeID,
      lcd,
      key
    );

    this.assets = [];

    assets.forEach((asset) => {
      this.assets.push({
        name: asset.name,
        symbol: asset.symbol,
        token: new TerraswapToken(asset.token, terraswapTokenCodeID, lcd, key),
        lpToken: new TerraswapToken(
          asset.lpToken,
          terraswapTokenCodeID,
          lcd,
          key
        ),
        pair: new TerraswapPair(asset.pair, terraswapPairCodeID, lcd, key)
      });
    });
  }
}
