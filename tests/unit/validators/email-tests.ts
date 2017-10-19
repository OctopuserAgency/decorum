import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import EmailValidator from '../../../src/validators/email';
chai.use(sinonChai);
const { expect } = chai;

describe('Email validator', () => {
    let validator: EmailValidator = null;

    beforeEach(() => validator = new EmailValidator());

    describe('isValid', () => {
        describe('When the field is not a valid email address', () => {
            it('Should be invalid', () => {
                // Act
                let valid = validator.isValid('foo@b.');

                // Assert
                expect(valid).to.be.false;
            });
        });

        describe('When field is a valid email', () => {
            it('Should be valid', () => {
                // Act
                let valid = validator.isValid('bob@gmail.com');

                // Assert
                expect(valid).to.be.true;
            });
        });
    });
});
