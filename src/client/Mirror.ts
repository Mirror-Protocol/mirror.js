import { AccAddress, Key, LCDClient, Coin } from '@terra-money/terra.js';
import { EmptyKey } from '../utils/EmptyKey';
import {
  MirrorAirdrop,
  MirrorCollector,
  MirrorCommunity,
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
  airdrop: AccAddress;
  collector: AccAddress;
  community: AccAddress;
  factory: AccAddress;
  gov: AccAddress;
  mint: AccAddress;
  oracle: AccAddress;
  staking: AccAddress;
  mirrorToken: AccAddress;
  terraswapFactory: AccAddress;
  assets: {
    [symbol: string]: AssetOptions;
  };
}

export const DEFAULT_MIRROR_OPTIONS: MirrorOptions = {
  lcd: new LCDClient({
    URL: 'https://lcd.terra.dev',
    chainID: 'localterra',
    gasPrices: [new Coin('ukrw', '1.8')],
    gasAdjustment: '1.2'
  }),
  key: new EmptyKey(),
  airdrop: 'terra1kalp2knjm4cs3f59ukr4hdhuuncp648eqrgshw',
  collector: 'terra1s4fllut0e6vw0k3fxsg4fs6fm2ad6hn0prqp3s',
  community: 'terra1x35fvy3sy47drd3qs288sm47fjzjnksuwpyl9k',
  factory: 'terra1mzj9nsxx0lxlaxnekleqdy8xnyw2qrh3uz6h8p',
  gov: 'terra15gwkyepfc6xgca5t5zefzwy42uts8l2m4g40k6',
  mint: 'terra1wfz7h3aqf4cjmjcvc6s8lxdhh7k30nkczyf0mj',
  oracle: 'terra1t6xe0txzywdg85n6k8c960cuwgh6l8esw6lau9',
  staking: 'terra17f7zu97865jmknk7p2glqvxzhduk78772ezac5',
  mirrorToken: 'terra15gwkyepfc6xgca5t5zefzwy42uts8l2m4g40k6',
  terraswapFactory: 'terra1ulgw0td86nvs4wtpsc80thv6xelk76ut7a7apj',
  assets: {
    MIR: {
      symbol: 'MIR',
      name: 'Mirror',
      token: 'terra15gwkyepfc6xgca5t5zefzwy42uts8l2m4g40k6',
      pair: 'terra1amv303y8kzxuegvurh0gug2xe9wkgj65enq2ux',
      lpToken: 'terra17gjf2zehfvnyjtdgua9p9ygquk6gukxe7ucgwh'
    },
    mAAPL: {
      symbol: 'mAAPL',
      name: 'Apple',
      token: 'terra1vxtwu4ehgzz77mnfwrntyrmgl64qjs75mpwqaz',
      pair: 'terra1774f8rwx76k7ruy0gqnzq25wh7lmd72eg6eqp5',
      lpToken: 'terra122asauhmv083p02rhgyp7jn7kmjjm4ksexjnks'
    },
    mGOOGL: {
      symbol: 'mGOOGL',
      name: 'Google',
      token: 'terra1h8arz2k547uvmpxctuwush3jzc8fun4s96qgwt',
      pair: 'terra1u56eamzkwzpm696hae4kl92jm6xxztar9uhkea',
      lpToken: 'terra1falkl6jy4087h4z567y2l59defm9acmwcs70ts'
    },
    mTSLA: {
      symbol: 'mTSLA',
      name: 'Tesla',
      token: 'terra14y5affaarufk3uscy2vr6pe6w6zqf2wpjzn5sh',
      pair: 'terra1pdxyk2gkykaraynmrgjfq2uu7r9pf5v8x7k4xk',
      lpToken: 'terra1ygazp9w7tx64rkx5wmevszu38y5cpg6h3fk86e'
    },
    mNFLX: {
      symbol: 'mNFLX',
      name: 'Netflix',
      token: 'terra1jsxngqasf2zynj5kyh0tgq9mj3zksa5gk35j4k',
      pair: 'terra1yppvuda72pvmxd727knemvzsuergtslj486rdq',
      lpToken: 'terra1mwu3cqzvhygqg7vrsa6kfstgg9d6yzkgs6yy3t'
    },
    mQQQ: {
      symbol: 'mQQQ',
      name: 'Invesco QQQ Trust',
      token: 'terra1csk6tc7pdmpr782w527hwhez6gfv632tyf72cp',
      pair: 'terra1dkc8075nv34k2fu6xn6wcgrqlewup2qtkr4ymu',
      lpToken: 'terra16j09nh806vaql0wujw8ktmvdj7ph8h09ltjs2r'
    },
    mTWTR: {
      symbol: 'mTWTR',
      name: 'Twitter',
      token: 'terra1cc3enj9qgchlrj34cnzhwuclc4vl2z3jl7tkqg',
      pair: 'terra1ea9js3y4l7vy0h46k4e5r5ykkk08zc3fx7v4t8',
      lpToken: 'terra1fc5a5gsxatjey9syq93c2n3xq90n06t60nkj6l'
    },
    mMSFT: {
      symbol: 'mMSFT',
      name: 'Microsfot Corporation',
      token: 'terra1227ppwxxj3jxz8cfgq00jgnxqcny7ryenvkwj6',
      pair: 'terra10ypv4vq67ns54t5ur3krkx37th7j58paev0qhd',
      lpToken: 'terra14uaqudeylx6tegamqmygh85lfq8qg2jmg7uucc'
    },
    mAMZN: {
      symbol: 'mAMZN',
      name: 'Amazon.com',
      token: 'terra165nd2qmrtszehcfrntlplzern7zl4ahtlhd5t2',
      pair: 'terra1vkvmvnmex90wanque26mjvay2mdtf0rz57fm6d',
      lpToken: 'terra1q7m2qsj3nzlz5ng25z5q5w5qcqldclfe3ljup9'
    },
    mBABA: {
      symbol: 'mBABA',
      name: 'Alibaba Group Holdings Ltd ADR',
      token: 'terra1w7zgkcyt7y4zpct9dw8mw362ywvdlydnum2awa',
      pair: 'terra1afdz4l9vsqddwmjqxmel99atu4rwscpfjm4yfp',
      lpToken: 'terra1stfeev27wdf7er2uja34gsmrv58yv397dlxmyn'
    },
    mIAU: {
      symbol: 'mIAU',
      name: 'iShares Gold Trust',
      token: 'terra15hp9pr8y4qsvqvxf3m4xeptlk7l8h60634gqec',
      pair: 'terra1q2cg4sauyedt8syvarc8hcajw6u94ah40yp342',
      lpToken: 'terra1jl4vkz3fllvj6fchnj2trrm9argtqxq6335ews'
    },
    mSLV: {
      symbol: 'mSLV',
      name: 'iShares Silver Trust',
      token: 'terra1kscs6uhrqwy6rx5kuw5lwpuqvm3t6j2d6uf2lp',
      pair: 'terra1f6d9mhrsl5t6yxqnr4rgfusjlt3gfwxdveeyuy',
      lpToken: 'terra178cf7xf4r9d3z03tj3pftewmhx0x2p77s0k6yh'
    },
    mUSO: {
      symbol: 'mUSO',
      name: 'United States Oil Fund, LP',
      token: 'terra1lvmx8fsagy70tv0fhmfzdw9h6s3sy4prz38ugf',
      pair: 'terra1zey9knmvs2frfrjnf4cfv4prc4ts3mrsefstrj',
      lpToken: 'terra1utf3tm35qk6fkft7ltcnscwml737vfz7xghwn5'
    },
    mVIXY: {
      symbol: 'mVIXY',
      name: 'ProShares VIX',
      token: 'terra1zp3a6q6q4953cz376906g5qfmxnlg77hx3te45',
      pair: 'terra1yngadscckdtd68nzw5r5va36jccjmmasm7klpp',
      lpToken: 'terra1cmrl4txa7cwd7cygpp4yzu7xu8g7c772els2y8'
    }
  }
};

export class Mirror {
  public lcd?: LCDClient;

  public key: Key;

  public airdrop: MirrorAirdrop;

  public collector: MirrorCollector;

  public community: MirrorCommunity;

  public factory: MirrorFactory;

  public gov: MirrorGov;

  public mint: MirrorMint;

  public oracle: MirrorOracle;

  public staking: MirrorStaking;

  public mirrorToken: TerraswapToken;

  public terraswapFactory: TerraswapFactory;

  public assets: {
    [symbol: string]: {
      name: string;
      symbol: string;
      token: TerraswapToken;
      lpToken: TerraswapToken;
      pair: TerraswapPair;
    };
  };

  constructor(options: Partial<MirrorOptions> = DEFAULT_MIRROR_OPTIONS) {
    const mirrorOptions = { ...DEFAULT_MIRROR_OPTIONS, ...options };
    const {
      lcd,
      key,
      airdrop,
      collector,
      community,
      factory,
      gov,
      mint,
      oracle,
      staking,
      mirrorToken,
      terraswapFactory,
      assets
    } = mirrorOptions;

    this.lcd = lcd;
    this.key = key;

    this.airdrop = new MirrorAirdrop({
      contractAddress: airdrop,
      lcd,
      key
    });
    this.collector = new MirrorCollector({
      contractAddress: collector,
      lcd,
      key
    });
    this.community = new MirrorCommunity({
      contractAddress: community,
      lcd,
      key
    });
    this.factory = new MirrorFactory({
      contractAddress: factory,
      lcd,
      key
    });
    this.gov = new MirrorGov({
      contractAddress: gov,
      lcd,
      key
    });
    this.mint = new MirrorMint({
      contractAddress: mint,
      lcd,
      key
    });
    this.oracle = new MirrorOracle({
      contractAddress: oracle,
      lcd,
      key
    });
    this.staking = new MirrorStaking({
      contractAddress: staking,
      lcd,
      key
    });
    this.mirrorToken = new TerraswapToken({
      contractAddress: mirrorToken,
      lcd,
      key
    });

    this.terraswapFactory = new TerraswapFactory({
      contractAddress: terraswapFactory,
      lcd,
      key
    });

    this.assets = {};
    Object.entries(assets).forEach((keyval) => {
      const assetSymbol = keyval[0];
      const asset = keyval[1];

      this.assets[assetSymbol] = {
        name: asset.name,
        symbol: asset.symbol,
        token: new TerraswapToken({
          contractAddress: asset.token,
          lcd,
          key
        }),
        lpToken: new TerraswapToken({
          contractAddress: asset.lpToken,
          lcd,
          key
        }),
        pair: new TerraswapPair({
          contractAddress: asset.pair,
          lcd,
          key
        })
      };
    });
  }
}
