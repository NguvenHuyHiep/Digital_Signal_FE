const proxyConfig = [{
  context: '/api',
  target: 'https://Digital Signage.vn',
  changeOrigin: true,
  logLevel: 'debug'
}, {
  context: '/Document-API',
  target: 'https://Digital Signage.vn',
  changeOrigin: true,
  logLevel: 'debug'
}];

function setupForCorporateProxy(proxyConfig) {
  // var agent = new HttpsProxyAgent(proxyConfigTarget);
  // console.log('Using corporate proxy server: ' + proxyConfigTarget);
  // proxyConfig.forEach(function (entry) {
  //   console.log('entry', entry, agent);
  //   entry.agent = agent;
  // });
  return proxyConfig;
}

module.exports = setupForCorporateProxy(proxyConfig);
