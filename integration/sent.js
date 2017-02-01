const expect = require('chai').expect;

const nodemailer = require('nodemailer');
const mailbin = require('..');

const INTEGRATION_SMTP_CONNECTION = process.env.INTEGRATION_SMTP_CONNECTION;
const INTEGRATION_EMAIL_ADDRESS = process.env.INTEGRATION_EMAIL_ADDRESS;

const smtp = nodemailer.createTransport(INTEGRATION_SMTP_CONNECTION);

describe('send', function(){
  this.timeout(5000);

  let bin = mailbin.nextBin('test');

  it('should send', () => {
    return smtp
      .sendMail({
        from: INTEGRATION_EMAIL_ADDRESS,
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
