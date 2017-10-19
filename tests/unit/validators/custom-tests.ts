import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import CustomValidator from '../../../src/validators/custom';
chai.use(sinonChai);
const { expect } = chai;

describe('Custom validator', () => {
    class MyModel {
        ssn = '';
    }

    let validator: CustomValidator<MyModel> = null;
    let model: MyModel = null;

    beforeEach(() => {
        validator = new CustomValidator<MyModel>((proposeValue: any, m: MyModel) => m.ssn !== proposeValue, "Don't do that");
        model = new MyModel();
    });

    describe('isValid', () => {
        describe('When the predicate returns false', () => {
            it('Should be invalid', () => {
                // Arrange
                model.ssn = '999-99-9999';

                // Act
                let valid = validator.isValid('999-99-9999', model);

                // Assert
                expect(valid).to.be.false;
            });
        });

        describe('When the predicate returns true', () => {
            it('Should be valid', () => {
                // Arrange
                model.ssn = '999-99-9999';

                // Act
                let valid = validator.isValid('foo', model);

                // Assert
                expect(valid).to.be.true;
            });
        });
    });
});
