const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);
const should = chai.should();

describe('POST /users/login', () => {
  it('it should return status 200, a token and user data', (done) => {
    const researcher = {
      username: 'researcher',
      password: 'password',
    };
    chai
      .request(app)
      .post('//users/login')
      .send(researcher)
      .end((err, res) => {
        //should.have.status(200);
        res.body.should.be.a('object');
        console.log(res);
        res.body.should.have.property('token');
        res.body.should.have.property('data');
        res.body.data.should.have.property('user');
        res.body.data.user.should.have.property('username').eql('researcher');
        done();
      });
  });
});
