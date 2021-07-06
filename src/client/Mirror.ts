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
  MirrorCollateralOracle,
  MirrorStaking,
  MirrorLock,
  TerraswapFactory,
  TerraswapPair,
  TerraswapToken,
  MirrorShortReward
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
  collateralOracle: AccAddress;
  staking: AccAddress;
  lock: AccAddress;
  mirrorToken: AccAddress;
  terraswapFactory: AccAddress;
  shortReward: AccAddress;
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
  gov: 'terra1wh39swv7nq36pnefnupttm2nr96kz7jjddyt2x',
  mint: 'terra1wfz7h3aqf4cjmjcvc6s8lxdhh7k30nkczyf0mj',
  oracle: 'terra1t6xe0txzywdg85n6k8c960cuwgh6l8esw6lau9',
  collateralOracle: 'terra00',
  staking: 'terra17f7zu97865jmknk7p2glqvxzhduk78772ezac5',
  lock: 'terra00',
  mirrorToken: 'terra15gwkyepfc6xgca5t5zefzwy42uts8l2m4g40k6',
  terraswapFactory: 'terra1ulgw0td86nvs4wtpsc80thv6xelk76ut7a7apj',
  shortReward: 'terra00',
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
      name: 'Apple Inc.',
      token: 'terra1vxtwu4ehgzz77mnfwrntyrmgl64qjs75mpwqaz',
      pair: 'terra1774f8rwx76k7ruy0gqnzq25wh7lmd72eg6eqp5',
      lpToken: 'terra122asauhmv083p02rhgyp7jn7kmjjm4ksexjnks'
    },
    mABNB: {
      symbol: 'mABNB',
      name: 'Airbnb Inc.',
      token: 'terra1g4x2pzmkc9z3mseewxf758rllg08z3797xly0n',
      pair: 'terra1gq7lq389w4dxqtkxj03wp0fvz0cemj0ek5wwmm',
      lpToken: 'terra1jmauv302lfvpdfau5nhzy06q0j2f9te4hy2d07'
    },
    mAMC: {
      symbol: 'mAMC',
      name: 'AMC Entertainment Holdings Inc.',
      token: 'terra1qelfthdanju7wavc5tq0k5r0rhsyzyyrsn09qy',
      pair: 'terra1uenpalqlmfaf4efgtqsvzpa3gh898d9h2a232g',
      lpToken: 'terra1mtvslkm2tgsmh908dsfksnqu7r7lulh24a6knv'
    },
    mAMZN: {
      symbol: 'mAMZN',
      name: 'Amazon.com, Inc.',
      token: 'terra165nd2qmrtszehcfrntlplzern7zl4ahtlhd5t2',
      pair: 'terra1vkvmvnmex90wanque26mjvay2mdtf0rz57fm6d',
      lpToken: 'terra1q7m2qsj3nzlz5ng25z5q5w5qcqldclfe3ljup9'
    },
    mBABA: {
      symbol: 'mBABA',
      name: 'Alibaba Group Holding Limited',
      token: 'terra1w7zgkcyt7y4zpct9dw8mw362ywvdlydnum2awa',
      pair: 'terra1afdz4l9vsqddwmjqxmel99atu4rwscpfjm4yfp',
      lpToken: 'terra1stfeev27wdf7er2uja34gsmrv58yv397dlxmyn'
    },
    mBTC: {
      symbol: 'mBTC',
      name: 'Bitcoin',
      token: 'terra1rhhvx8nzfrx5fufkuft06q5marfkucdqwq5sjw',
      pair: 'terra1prfcyujt9nsn5kfj5n925sfd737r2n8tk5lmpv',
      lpToken: 'terra1d34edutzwcz6jgecgk26mpyynqh74j3emdsnq5'
    },
    mETH: {
      symbol: 'mETH',
      name: 'Ether',
      token: 'terra1dk3g53js3034x4v5c3vavhj2738une880yu6kx',
      pair: 'terra14fyt2g3umeatsr4j4g2rs8ca0jceu3k0mcs7ry',
      lpToken: 'terra16auz7uhnuxrj2dzrynz2elthx5zpps5gs6tyln'
    },
    mFB: {
      symbol: 'mFB',
      name: 'Facebook Inc.',
      token: 'terra1mqsjugsugfprn3cvgxsrr8akkvdxv2pzc74us7',
      pair: 'terra1yl2atgxw422qxahm02p364wtgu7gmeya237pcs',
      lpToken: 'terra1jh2dh4g65hptsrwjv53nhsnkwlw8jdrxaxrca0'
    },
    mGME: {
      symbol: 'mGME',
      name: 'GameStop Corp',
      token: 'terra1m6j6j9gw728n82k78s0j9kq8l5p6ne0xcc820p',
      pair: 'terra17eakdtane6d2y7y6v0s79drq7gnhzqan48kxw7',
      lpToken: 'terra1azk43zydh3sdxelg3h4csv4a4uef7fmjy0hu20'
    },
    mGOOGL: {
      symbol: 'mGOOGL',
      name: 'Alphabet Inc.',
      token: 'terra1h8arz2k547uvmpxctuwush3jzc8fun4s96qgwt',
      pair: 'terra1u56eamzkwzpm696hae4kl92jm6xxztar9uhkea',
      lpToken: 'terra1falkl6jy4087h4z567y2l59defm9acmwcs70ts'
    },
    mGS: {
      symbol: 'mGS',
      name: 'Goldman Sachs Group Inc.',
      token: 'terra137drsu8gce5thf6jr5mxlfghw36rpljt3zj73v',
      pair: 'terra108ukjf6ekezuc52t9keernlqxtmzpj4wf7rx0h',
      lpToken: 'terra17smg3rl9vdpawwpe7ex4ea4xm6q038gp2chge5'
    },
    mIAU: {
      symbol: 'mIAU',
      name: 'iShares Gold Trust',
      token: 'terra15hp9pr8y4qsvqvxf3m4xeptlk7l8h60634gqec',
      pair: 'terra1q2cg4sauyedt8syvarc8hcajw6u94ah40yp342',
      lpToken: 'terra1jl4vkz3fllvj6fchnj2trrm9argtqxq6335ews'
    },
    mMSFT: {
      symbol: 'mMSFT',
      name: 'Microsoft Corporation',
      token: 'terra1227ppwxxj3jxz8cfgq00jgnxqcny7ryenvkwj6',
      pair: 'terra10ypv4vq67ns54t5ur3krkx37th7j58paev0qhd',
      lpToken: 'terra14uaqudeylx6tegamqmygh85lfq8qg2jmg7uucc'
    },
    mNFLX: {
      symbol: 'mNFLX',
      name: 'Netflix, Inc.',
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
    mSLV: {
      symbol: 'mSLV',
      name: 'iShares Silver Trust',
      token: 'terra1kscs6uhrqwy6rx5kuw5lwpuqvm3t6j2d6uf2lp',
      pair: 'terra1f6d9mhrsl5t6yxqnr4rgfusjlt3gfwxdveeyuy',
      lpToken: 'terra178cf7xf4r9d3z03tj3pftewmhx0x2p77s0k6yh'
    },
    mTSLA: {
      symbol: 'mTSLA',
      name: 'Tesla, Inc.',
      token: 'terra14y5affaarufk3uscy2vr6pe6w6zqf2wpjzn5sh',
      pair: 'terra1pdxyk2gkykaraynmrgjfq2uu7r9pf5v8x7k4xk',
      lpToken: 'terra1ygazp9w7tx64rkx5wmevszu38y5cpg6h3fk86e'
    },
    mTWTR: {
      symbol: 'mTWTR',
      name: 'Twitter, Inc.',
      token: 'terra1cc3enj9qgchlrj34cnzhwuclc4vl2z3jl7tkqg',
      pair: 'terra1ea9js3y4l7vy0h46k4e5r5ykkk08zc3fx7v4t8',
      lpToken: 'terra1fc5a5gsxatjey9syq93c2n3xq90n06t60nkj6l'
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
      name: 'ProShares VIX Short-Term Futures ETF',
      token: 'terra1zp3a6q6q4953cz376906g5qfmxnlg77hx3te45',
      pair: 'terra1yngadscckdtd68nzw5r5va36jccjmmasm7klpp',
      lpToken: 'terra1cmrl4txa7cwd7cygpp4yzu7xu8g7c772els2y8'
    },
    mSPY: {
      symbol: 'mSPY',
      name: 'SPDR S&P 500',
      token: 'terra1aa00lpfexyycedfg5k2p60l9djcmw0ue5l8fhc',
      pair: 'terra14hklnm2ssaexjwkcfhyyyzvpmhpwx6x6lpy39s',
      lpToken: 'terra1jqqegd35rg2gjde54adpj3t6ecu0khfeaarzy9'
    },
    mCOIN: {
      symbol: 'mCOIN',
      name: 'Coinbase Global, Inc.',
      token: 'terra18wayjpyq28gd970qzgjfmsjj7dmgdk039duhph',
      pair: 'terra1h7t2yq00rxs8a78nyrnhlvp0ewu8vnfnx5efsl',
      lpToken: 'terra1ktckr8v7judrr6wkwv476pwsv8mht0zqzw2t0h'
    }
  }
};

/**
 * Mirror Tequila Contracts
 * @see {@link https://github.com/Mirror-Protocol/whitelist/blob/master/tequila.json}
 */
export const DEFAULT_TEQUILA_MIRROR_OPTIONS: MirrorOptions = {
  lcd: new LCDClient({
    URL: 'https://tequila-lcd.terra.dev',
    chainID: 'tequila-0004',
    gasPrices: [
      new Coin('uluna', '0.15'),
      new Coin('usdr', '0.1018'),
      new Coin('uusd', '0.15'),
      new Coin('ukrw', '178.05'),
      new Coin('umnt', '431.6259')
    ],
    gasAdjustment: '1.2'
  }),
  key: new EmptyKey(),
  collector: 'terra1v046ktavwzlyct5gh8ls767fh7hc4gxc95grxy',
  community: 'terra10qm80sfht0zhh3gaeej7sd4f92tswc44fn000q',
  factory: 'terra10l9xc9eyrpxd5tqjgy6uxrw7dd9cv897cw8wdr',
  gov: 'terra12r5ghc6ppewcdcs3hkewrz24ey6xl7mmpk478s',
  mint: 'terra1s9ehcjv0dqj2gsl72xrpp0ga5fql7fj7y3kq3w',
  oracle: 'terra1uvxhec74deupp47enh7z5pk55f3cvcz8nj4ww9',
  collateralOracle: 'terra00',
  staking: 'terra1a06dgl27rhujjphsn4drl242ufws267qxypptx',
  lock: 'terra00',
  mirrorToken: 'terra10llyp6v3j3her8u3ce66ragytu45kcmd9asj3u',
  terraswapFactory: 'terra18qpjm4zkvqnpjpw0zn0tdr8gdzvt8au35v45xf',
  airdrop: 'terra1p6nvyw7vz3fgpy4nyh3q3vc09e65sr97ejxn2p',
  shortReward: 'terra00',
  assets: {
    MIR: {
      symbol: 'MIR',
      name: 'Mirror',
      token: 'terra10llyp6v3j3her8u3ce66ragytu45kcmd9asj3u',
      pair: 'terra1cz6qp8lfwht83fh9xm9n94kj04qc35ulga5dl0',
      lpToken: 'terra1zrryfhlrpg49quz37u90ck6f396l4xdjs5s08j'
    },
    mAAPL: {
      symbol: 'mAAPL',
      name: 'Apple Inc.',
      token: 'terra16vfxm98rxlc8erj4g0sj5932dvylgmdufnugk0',
      pair: 'terra1yj892rl8edvk0y2ayf3h36t6uf89lzxg8jea4a',
      lpToken: 'terra1vth958fsn8zawllaqcdzswksjkv3dz2sqqmcu4'
    },
    mABNB: {
      symbol: 'mABNB',
      name: 'Airbnb Inc.',
      token: 'terra1avryzxnsn2denq7p2d7ukm6nkck9s0rz2llgnc',
      pair: 'terra13009wwv5flguch7kmwcgq8zz4r7asam3vmxkn6',
      lpToken: 'terra1d7xlu53sx9anwdqvxeya0tmhr7xzepd9agyvft'
    },
    mAMC: {
      symbol: 'mAMC',
      name: 'AMC Entertainment Holdings Inc.',
      token: 'terra1zeyfhurlrun6sgytqfue555e6vw2ndxt2j7jhd',
      pair: 'terra1nvevc6ff7vlmrd50ucuefa95xd2gzmy6lugqsm',
      lpToken: 'terra1d8mk480l4sp3j095apcpqckrxyxqrsq6zapfzy'
    },
    mAMZN: {
      symbol: 'mAMZN',
      name: 'Amazon.com, Inc.',
      token: 'terra12saaecsqwxj04fn0jsv4jmdyp6gylptf5tksge',
      pair: 'terra1xs3vy9zs8agmnzyn7z9s7kqk392uu2h3x3l6er',
      lpToken: 'terra1kgvcrtupc8y4dgc9n08ud99ckdxp08j59zgccf'
    },
    mBABA: {
      symbol: 'mBABA',
      name: 'Alibaba Group Holding Limited',
      token: 'terra15dr4ah3kha68kam7a907pje9w6z2lpjpnrkd06',
      pair: 'terra15qq59h2canrr2pf8ny7rw57nx3mcvw97tp3xj4',
      lpToken: 'terra1px2ya3e07aprfgc76e57r3nuvy3czssrvcxg9t'
    },
    mBTC: {
      symbol: 'mBTC',
      name: 'Bitcoin',
      token: 'terra1csr22xvxs6r3gkjsl7pmjkmpt39mwjsrm0e2r8',
      pair: 'terra134jl4dt20mqfryhnmhauryr754vuw7990jdell',
      lpToken: 'terra186m890y8hzhyhp8emgsy2a8jqvsgluznc688xf'
    },
    mETH: {
      symbol: 'mETH',
      name: 'Ether',
      token: 'terra1ys4dwwzaenjg2gy02mslmc96f267xvpsjat7gx',
      pair: 'terra1j4urgdl38ezrrs59fn403cxgr34u3yd0tv4ypn',
      lpToken: 'terra1lgxdj5wag4ug7le6arda5pd7z9xlpstgc2ue8t'
    },
    mFB: {
      symbol: 'mFB',
      name: 'Facebook Inc.',
      token: 'terra14gq9wj0tt6vu0m4ec2tkkv4ln3qrtl58lgdl2c',
      pair: 'terra19jp7wqla5qrdusrcqest6rrc33wyvs0fumwd7v',
      lpToken: 'terra1l8c87av89cczj20mguxy0hmp6k6hesr0yjthkm'
    },
    mGME: {
      symbol: 'mGME',
      name: 'GameStop Corp',
      token: 'terra104tgj4gc3pp5s240a0mzqkhd3jzkn8v0u07hlf',
      pair: 'terra1q9qtdudqasdcgqmklw2hsnju09zcjhrhr8ntsa',
      lpToken: 'terra1kkpe6has6g55nhyqp6vkw0wk8z3u3nq6fz6znc'
    },
    mGOOGL: {
      symbol: 'mGOOGL',
      name: 'Alphabet Inc.',
      token: 'terra1qg9ugndl25567u03jrr79xur2yk9d632fke3h2',
      pair: 'terra1z2734asgwhma8ma2fq4yu7ce2l3mrvj4qnz6ws',
      lpToken: 'terra1qxurxcgl30eu4ar34ltr5e9tqc2gjl4atspvy3'
    },
    mGS: {
      symbol: 'mGS',
      name: 'Goldman Sachs Group Inc.',
      token: 'terra13myzfjdmvqkama2tt3v5f7quh75rv78w8kq6u6',
      pair: 'terra1h73gdv74gw03gc5rfyc0y6s8advl9y2453zgcw',
      lpToken: 'terra1xwk2x2pyrhlshjgnlv3ql5q8r8r8vyrdf6u2mj'
    },
    mIAU: {
      symbol: 'mIAU',
      name: 'iShares Gold Trust',
      token: 'terra19dl29dpykvzej8rg86mjqg8h63s9cqvkknpclr',
      pair: 'terra1tq6w7rl4ryrk458k57dstelx54eylph5zwnpf9',
      lpToken: 'terra193c2xvuzswct8qtsg4e6qhe3hyt3l6fac9cy79'
    },
    mMSFT: {
      symbol: 'mMSFT',
      name: 'Microsoft Corporation',
      token: 'terra12s2h8vlztjwu440khpc0063p34vm7nhu25w4p9',
      pair: 'terra1dt7ne6gwv23wg6chl89q95yj6999alagc6rqd9',
      lpToken: 'terra1f7azmktepw5rq35e2m6r6smtwl8wdrxp0dsvar'
    },
    mNFLX: {
      symbol: 'mNFLX',
      name: 'Netflix, Inc.',
      token: 'terra1djnlav60utj06kk9dl7defsv8xql5qpryzvm3h',
      pair: 'terra18yl0z6wntjkustt9cckc9ptp7l5qh7kr0xrmav',
      lpToken: 'terra1e0njrqcsehxpt9due62x9zsxl7h9htl0xqdujv'
    },
    mQQQ: {
      symbol: 'mQQQ',
      name: 'Invesco QQQ Trust',
      token: 'terra18yx7ff8knc98p07pdkhm3u36wufaeacv47fuha',
      pair: 'terra1epxv8z6tzxezjfgw7tveytw5n3fuf6wvg6w8f5',
      lpToken: 'terra1h52zc9qmndczgru9vp2cvuwfclyykl5yt3qjk8'
    },
    mSLV: {
      symbol: 'mSLV',
      name: 'iShares Silver Trust',
      token: 'terra1fdkfhgk433tar72t4edh6p6y9rmjulzc83ljuw',
      pair: 'terra1tyzsl0dw4pltlqey5v6g646hm22pql8vy3yh2g',
      lpToken: 'terra16cn5cgwaktrzczda0c6ux0e2quudh4vn3t8jjm'
    },
    mTSLA: {
      symbol: 'mTSLA',
      name: 'Tesla, Inc.',
      token: 'terra1nslem9lgwx53rvgqwd8hgq7pepsry6yr3wsen4',
      pair: 'terra1tsln42kfeq8edwscmw8njgter5dp8evn40znn9',
      lpToken: 'terra1utf7qw0uce42vqsh255hxgd3pvuzfvp6jcayk5'
    },
    mTWTR: {
      symbol: 'mTWTR',
      name: 'Twitter, Inc.',
      token: 'terra1ax7mhqahj6vcqnnl675nqq2g9wghzuecy923vy',
      pair: 'terra1jv937296dy5c5dxglrzf05h0jlaaxp55tqlyh6',
      lpToken: 'terra10cugucjwn4hdtvavl0n2sh2ke64nx93luhj49k'
    },
    mUSO: {
      symbol: 'mUSO',
      name: 'United States Oil Fund, LP',
      token: 'terra1fucmfp8x4mpzsydjaxyv26hrkdg4vpdzdvf647',
      pair: 'terra1llk7ycwwlj2zs2l2dvnvmsxrsrnucqwaltstcf',
      lpToken: 'terra1rag9w5ch0jrdxjffr6napqz0zsrpm6uz2zezmj'
    },
    mVIXY: {
      symbol: 'mVIXY',
      name: 'ProShares VIX Short-Term Futures ETF',
      token: 'terra1z0k7nx0vl85hwpv3e3hu2cyfkwq07fl7nqchvd',
      pair: 'terra1xg2393l4s7n4z2r0cnu4rr55mkpp942f4d3qzr',
      lpToken: 'terra1ud750vcv39hd467sj2kk6s6nn8zf5xhgggf7uq'
    },
    mSPY: {
      symbol: 'mSPY',
      name: 'SPDR S&P 500',
      token: 'terra15t9afkpj0wnh8m74n8n2f8tspkn7r65vnru45s',
      pair: 'terra10q4qsd2sfl4wc6nv0d77zud4ur40ygf5602pzd',
      lpToken: 'terra1pef9fz8lkqajzuwp6ff6t33s86ndpkm3728cgc'
    },
    mCOIN: {
      symbol: 'mCOIN',
      name: 'Coinbase Global, Inc.',
      token: 'terra1qre9crlfnulcg0m68qqywqqstplgvrzywsg3am',
      pair: 'terra13qzses7zpsyrufx38h0kc3p87523cjgwmenj44',
      lpToken: 'terra1gdglgpm84pdzuedc924wurhsqd0vs4nv4tpmh8'
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

  public collateralOracle: MirrorCollateralOracle;

  public staking: MirrorStaking;

  public lock: MirrorLock;

  public mirrorToken: TerraswapToken;

  public terraswapFactory: TerraswapFactory;

  public shortReward: MirrorShortReward;

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
      collateralOracle,
      staking,
      lock,
      mirrorToken,
      terraswapFactory,
      assets,
      shortReward
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
    this.collateralOracle = new MirrorCollateralOracle({
      contractAddress: collateralOracle,
      lcd,
      key
    });
    this.staking = new MirrorStaking({
      contractAddress: staking,
      lcd,
      key
    });
    this.lock = new MirrorLock({
      contractAddress: lock,
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

    this.shortReward = new MirrorShortReward({
      contractAddress: shortReward,
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
