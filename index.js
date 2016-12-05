'use strict';
const uuid = require('uuid').v4;
const fetch = require('node-fetch');
const sleep = t => new Promise((resolve, reject) => {
  setTimeout(resolve(), t);
});
const retry = (factory) => {
  let attemptCount = 0;
  const attempt = () => {
    attemptCount++;
    if (attemptCount >= 10) throw new Error(`All attempts failed`);
    return factory()
      .catch(err => {
        return sleep(1000)
          .then(() => attempt());
      });
  };

  return attempt();
}

const client = (options) => {
  options = Object.assign({
    api: 'https://nnh6uke7m5.execute-api.eu-west-1.amazonaws.com/production/',
    domain: 'mailb.in'
  }, options);

  const fetchMessages = bin => fetch(`${options.api}/email/${bin}`)
                            .then(res => res.json());

  const fetchMessage = bin => {

    return retry(() => {
      return fetchMessages(bin)
        .then(inbox => {
          if (inbox.length === 0){
            throw new Error(`Inbox ${bin} doesn't yet have messages`);
          }
          return inbox[0];
        });
    });
  };

  const address = bin => `${bin}@mailb.in`;

  return {
    fetchMessages,
    fetchMessage,
    address
  }
}

const nextBin = (client, slug) => {
  let bin = slug ? `${slug}+${uuid()}` : uuid();

  return {
    bin,
    email: client.address(bin),
    fetchMessages: () => client.fetchMessages(bin),
    fetchMessage: () => client.fetchMessage(bin)
  }
}


module.exports = options => {
  let c = client(options);
  return {
    nextBin: slug => nextBin(c, slug),
    fetchMessages: slug => fetchMessages(c, bin),
    fetchMessages: slug => fetchMessages(c, bin),
  }
};

let cachedClient;
const ensureClient = () => cachedClient = cachedClient || client();
module.exports.nextBin = (slug) => nextBin(ensureClient(), slug);
module.exports.fetchMessages = (slug) => fetchMessages(ensureClient(), bin);
module.exports.fetchMessage = (slug) => fetchMessage(ensureClient(), bin);
