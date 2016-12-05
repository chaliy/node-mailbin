# Mailbin client

NodeJS client for http://mailb.in

## Installation

```
$ npm install express
```

## Usage

```
const nodemailer = require('nodemailer');
const mailbin = require('mailbin');

const smtp = nodemailer.createTransport('smtps://username%40gmail.com:password@smtp.gmail.com');

describe('send', function(){
  this.timeout(5000);

  let bin = mailbin.nextBin('test');

  it('should send', () => {
    return smtp
      .sendMail({
        from: 'username@gmail.com',
        to: bin.email,
        subject: 'Hello!',
        text: 'Hello!',
        html: '<b>Hello!</b>'
      })
      .then(() => bin.fetchMessage())
      .then(message => {
        expect(message.subject).to.be.eql('Hello!');
      });
  });
});

```

## License

MIT
