var should = require('should');
var liquid = require('../');

describe('advRender', function () {
  
  it('#advRender', function (done) {
    
    var models = {
      'title':    function (env, callback) {
        setTimeout(function () {
          return callback(null, '����');
        }, 50);
      },
      'man.name':    function (env, callback) {
        var name = env.fullname ? '������' : '����';
        setTimeout(function () {
          return callback(null, name);
        }, 100);
      },
      'man.age':    function (env, callback) {
        var age = isNaN(env.times) ? 23 : 23 * env.times;
        setTimeout(function () {
          return callback(null, age);
        }, 50);
      },
      'error':    function (callback) {
        throw Error();
      }
    };
    
    var fn = liquid.compile('{{ title }}: ����:{{ man.name }}, ����:{{ man.age }}');
    liquid.advRender(fn, models, {env: {times: 5}}, function (err, text) { 
      should.not.exist(err);
      text.should.equal('����: ����:����, ����:115');
      
      liquid.advRender(fn, models, {env: {fullname: true}}, function (err, text) {
        should.not.exist(err);
        text.should.equal('����: ����:������, ����:23');
      
        var fn = liquid.compile('{{ title }}: {{ error }}');
        liquid.advRender(fn, models, {}, function (err, text) { 
          should.exist(err);
          
          done();
        });
      });
    });
  });
  
});