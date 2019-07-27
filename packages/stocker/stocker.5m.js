#!/usr/bin/env /usr/local/bin/node
// <bitbar.title>Stocker</bitbar.title>
// <bitbar.version>1.0</bitbar.version>
// <bitbar.author>Franklin Henderson</bitbar.author>
// <bitbar.author.github>fhwrdh</bitbar.author.github>
// <bitbar.desc>Provides a stock ticker in your menu bar, with color, percentage changes, configurable with portfolio</bitbar.desc>
// <bitbar.dependencies>node.js</bitbar.dependencies>
// <bitbar.image></bitbar.image>
// <bitbar.abouturl>https://github.com/fhwrdh</bitbar.abouturl>
//   based on https://getbitbar.com/plugins/Finance/stock-ticker.30s.py
//   by Robert Kanter https://github.com/rkanter
const bitbar = require('bitbar');
const fetch = require('node-fetch');
const sprintf = require('sprintf-js').sprintf;
const R = require('ramda');
const path = require('path');

const {api_token, portfolio, primary} = require(path.resolve(
  __dirname + '/config.js',
));

const getShares = ({symbol}) =>
  R.prop('shares', R.find(R.propEq('symbol', symbol))(portfolio));

const getPrice = q => sprintf('%7.2f', q.latestPrice);
const getChange = q => sprintf('%+7.2f', q.change);
const getValueChange = (q, shares) => sprintf('%+9.2f', q.change * shares);
const getValue = (q, shares) => sprintf('%9.2f', q.latestPrice * shares);
const stockUp = json => json[primary].quote.change > 0;

const formatData = R.pipe(
  R.map(({quote: q}) => ({
    text: `${sprintf('%5s', q.symbol)} ${getPrice(q)} ${getChange(
      q,
    )} ${getValueChange(q, getShares(q))} ${getValue(q, getShares(q))}`,
    color: q.change > 0 ? 'green' : 'red',
    font: 'Monaco',
  })),
  R.values,
);

(async () => {
  const symbols = R.pluck('symbol', portfolio).join(',');
  const response = await fetch(
    `https://cloud.iexapis.com/stable/stock/market/batch?symbols=${symbols}&types=quote&filter=symbol,latestPrice,change,changePercent&displayPercent=true&token=${api_token}`,
  );
  const json = await response.json();
  const data = formatData(json);

  bitbar([
    {
      text: getChange(json[primary].quote),
      color: stockUp(json) ? 'green' : 'red',
      dropdown: false,
    },
    bitbar.separator,
    ...data,
    // bitbar.separator,
    // JSON.stringify(json, null, 1),
  ]);
})();
