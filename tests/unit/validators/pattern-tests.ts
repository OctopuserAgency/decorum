import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import PatternValidator from '../../../src/validators/pattern';
chai.use(sinonChai);
const { expect } = chai;

describe('Pattern validator', () => {
    let validator: PatternValidator = null;

    beforeEach(() => validator = new PatternValidator(/^[0-9]+$/));

    describe('isValid', () => {
        describe('When the field does not match the pattern', () => {
            it('Should be invalid', () => {
                // Act
                let valid = validator.isValid('123A4');

                // Assert
                expect(valid).to.be.false;
            });
        });

        describe('When field matches the pattern', () => {
            it('Should be valid', () => {
                // Act
                let valid = validator.isValid('42');

                // Assert
                expect(valid).to.be.true;
            });
        });
    });
});
