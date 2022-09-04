/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable curly */
/* eslint-disable prefer-const */
/* eslint-disable no-else-return */
/* eslint-disable camelcase */
const { getBIP44AddressKeyDeriver } = require('@metamask/key-tree');
const { ethers, Wallet } = require('ethers');

async function getSigner(provider) {
  const ethereumNode = await wallet.request({
    method: 'snap_getBip44Entropy_60',
  });
  const deriveEthereumAccount = getBIP44AddressKeyDeriver(ethereumNode);
  const mainAccountKey = deriveEthereumAccount(0).slice(0, 32);
  return new Wallet(mainAccountKey, provider);
}

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

const TWO_HOURS = 7200000;

async function setupSnapshot(userAPI, start, amount, dest, isSend) {
  let counter = 0;
  let startingTime = start;

  const provider = new ethers.providers.Web3Provider(wallet);
  const signer = await getSigner(provider);

  const shouldContinue = await wallet.request({
    method: 'snap_confirm',
    params: [
      {
        prompt: 'Do you want to use this account?',
        textAreaContent: `Do you want to use the account "${signer.address}" for sending txn?`,
      },
    ],
  });

  if (!shouldContinue) {
    throw new Error("User didn't confirm");
  }

  while (true) {
    const result = await fetch(userAPI);
    const { asset_events } = await result.json();
    const mostRecentEvent = asset_events[0];
    // used opensea for demo
    const eventTime =
      new Date(mostRecentEvent.event_timestamp).getTime() + TWO_HOURS;
    const bidAmount = Number(mostRecentEvent.bid_amount);

    if (!asset_events) throw new Error('no asset_events');
    if (!mostRecentEvent) throw new Error('no mostRecentEvent');
    if (!eventTime) throw new Error('no eventTime');
    if (!bidAmount) throw new Error('no bit amount');

    if (eventTime > startingTime) {
      if (bidAmount > amount) {
        wallet.request({
          method: 'snap_notify',
          params: [
            {
              type: 'inApp',
              message: `Snapshot: A bid for ${formatWei(
                bidAmount,
              )}ETH was made on ${formatAddress(contract)}!`,
            },
          ],
        });
        wallet.request({
          method: 'snap_notify',
          params: [
            {
              type: 'native',
              message: `Bid for ${formatWei(
                bidAmount,
              )}ETH made on ${formatAddress(contract)}!`,
            },
          ],
        });
        return Promise.resolve('hi');
      } else {
        wallet.request({
          method: 'snap_notify',
          params: [
            {
              type: 'native',
              message: `Bid received for ${formatWei(bidAmount)}!`,
            },
          ],
        });
        if (isSend) {
          const tx = {
            from: '0xD07b84827096306B01a2EF3193026Ed6A6BF8Fb8',
            to: dest,
            value: ethers.utils.parseEther('0.001'),
          };
          signer.sendTransaction(tx).then((transaction) => {
            console.dir(transaction);
            wallet.request({
              method: 'snap_notify',
              params: [
                {
                  type: 'native',
                  message: `Send finished!`,
                },
              ],
            });
          });
        }
      }
      startingTime = eventTime;
    }

    if (counter === 120) {
      wallet.request({
        method: 'snap_notify',
        params: [
          {
            type: 'native',
            message: `Terminating after ${Date.now() - startingTime}ms`,
          },
        ],
      });
      return Promise.resolve('hi');
    }

    counter += 1;
    await delay(1000);
  }
}

module.exports.onRpcRequest = async ({ origin, request }) => {
  const userAPI = request.api;
  const amount = request.amount;
  const dest = request.dest;
  const isSend = request.isSend;

  if (request.method === 'setup') {
    const currentDate = new Date();
    let startingTime = currentDate.getTime();

    wallet.request({
      method: 'snap_notify',
      params: [
        {
          type: 'inApp',
          message: `Snapshot Setup Successful!`,
        },
      ],
    });
    return await setupSnapshot(userAPI, startingTime, amount, dest, isSend);
  }

  switch (request.method) {
    case 'inApp':
      return wallet.request({
        method: 'snap_notify',
        params: [
          {
            type: 'inApp',
            message: `Hello, ${origin}!`,
          },
        ],
      });
    case 'native':
      return wallet.request({
        method: 'snap_notify',
        params: [
          {
            type: 'native',
            message: `Hello, ${origin}!`,
          },
        ],
      });
  }
};
