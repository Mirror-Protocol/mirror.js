import Mirror from './Mirror';

describe('Mirror', () => {
  it('tokens', async () => {
    const mirror = new Mirror();

    for (let i = 0; i < mirror.assets.length; i += 1) {
      const asset = mirror.assets[i];
      // eslint-disable-next-line no-await-in-loop
      const tokenInfo = await asset.token.getTokenInfo();
      expect(tokenInfo.name).toEqual(asset.name);
      expect(tokenInfo.symbol).toEqual(asset.symbol);
    }
  });
});
