import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import MaxLengthValidator from '../../../src/validators/max-length';
chai.use(sinonChai);
const { expect } = chai;

describe('Length validator', () => {
    let validator: MaxLengthValidator = null;

    beforeEach(() => validator = new MaxLengthValidator(4));

    describe('isValid', () => {
        describe('When the field length is greater than the max length', () => {
            it('Should be invalid', () => {
                // Act
                let valid = validator.isValid('12345');

                // Assert
                expect(valid).to.be.false;
            });
        });

        describe('When field length is equal to the max length', () => {
            it('Should be valid', () => {
                // Act
                let valid = validator.isValid('1234');

                // Assert
                expect(valid).to.be.true;
            });
        });

        describe('When field length is less than the max length', () => {
            it('Should be valid', () => {
                // Act
                let valid = validator.isValid('123');

                // Assert
                expect(valid).to.be.true;
            });
        });
    });
});
