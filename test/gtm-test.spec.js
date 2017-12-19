import { default as assert } from 'assert';
import { describe, it } from 'mocha';

describe('GtmTest', function() {
    describe('placeholder', function() {
        it('should work', function(done) {
            assert.equal(1, 1);
            done();
        });
    });
});
