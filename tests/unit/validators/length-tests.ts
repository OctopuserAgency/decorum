import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import LengthValidator from '../../../src/validators/length';
chai.use(sinonChai);
const { expect } = chai;

describe('Length validator', () => {
    let validator: LengthValidator = null;

    beforeEach(() => validator = new LengthValidator(5, null));

    describe('isValid', () => {
        describe('When the field length is not the passed length', () => {
            it('Should be invalid', () => {
                // Act
                let valid = validator.isValid('1234567');

                // Assert
                expect(valid).to.be.false;
            });
        });

        describe('When field length is equal to the passed length', () => {
            it('Should be valid', () => {
                // Act
                let valid = validator.isValid('12345');

                // Assert
                expect(valid).to.be.true;
            });
        });
    });
});
