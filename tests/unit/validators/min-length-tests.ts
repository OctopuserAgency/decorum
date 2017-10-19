import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import MinLengthValidator from '../../../src/validators/min-length';
chai.use(sinonChai);
const { expect } = chai;

describe('MinLength validator', () => {
    let validator: MinLengthValidator = null;

    beforeEach(() => validator = new MinLengthValidator(3));

    describe('isValid', () => {
        describe('When the field length is less than the min length', () => {
            it('Should be invalid', () => {
                // Act
                let valid = validator.isValid('12');

                // Assert
                expect(valid).to.be.false;
            });
        });

        describe('When field length is equal to the min length', () => {
            it('Should be valid', () => {
                // Act
                let valid = validator.isValid('123');

                // Assert
                expect(valid).to.be.true;
            });
        });

        describe('When field length is greater than the min length', () => {
            it('Should be invalid', () => {
                // Act
                let valid = validator.isValid('1234');

                // Assert
                expect(valid).to.be.true;
            });
        });
    });
});
