(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("decorum", [], factory);
	else if(typeof exports === 'object')
		exports["decorum"] = factory();
	else
		root["decorum"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Mechanism for overriding validation errors to provide for custom or localized error messages.
 * @type {{IMessageHandlerMap}}
 */
let MessageHandlers = {};
exports.default = MessageHandlers;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const model_validator_1 = __webpack_require__(5);
const validation_manager_1 = __webpack_require__(3);
/**
 * Static container for convenience methods related to field validation.
 */
class Validator {
    /**
     * Creates a new model validator for the given model. Model should be a valid class that has a valid constructor
     * and a prototype.
     * @param model The model to create the validator for.
     * @returns {ModelValidator} An instance of {ModelValidator}
     */
    static new(model) {
        return new model_validator_1.default(model);
    }
    /**
     * Decorates the passed class with model validations. Use this when you do not have access to ES7 decorators.
     * The object passed should be a valid class (ES6 class or ES5 function constructor).
     * @param objectType The class to decorate.
     * @param definitions One or more field validation definitions of the form { "fieldName": [ decorators ] }.
     */
    static decorate(objectType, definitions) {
        if (!objectType) {
            throw new Error('Validator.decorate: No class passed!');
        }
        if (!objectType.prototype) {
            throw new Error('Validator.decorate: First parameter must be a valid class with a prototype!');
        }
        if (!definitions) {
            throw new Error('Validator.decorate: Definitions must be a valid map of field name to validator values');
        }
        let prototype = objectType.prototype;
        for (let field in definitions) {
            if (!definitions.hasOwnProperty(field)) {
                continue;
            }
            let decorators = definitions[field];
            for (let i = 0; i < decorators.length; i++) {
                let decorator = decorators[i];
                decorator(prototype, field);
            }
        }
    }
    /**
     * Creates an anonymous validator, immediately validates the model, and returns any validation errors on the model
     * as a result.
     * @param model The model to validate.
     */
    static validate(model) {
        return new model_validator_1.default(model).validate();
    }
    /**
     * Adds a validator to the given object prototype for the given property. Meant to be used inside of validation
     * decorators to inject the validation onto the object property.
     * @param targetPrototype A valid object prototype to add to.
     * @param property The property to add the validator for.
     * @param validator The validator to add.
     */
    static addValidator(targetPrototype, property, validator) {
        let manager = validation_manager_1.default.get(targetPrototype);
        manager.addValidator(property, validator);
    }
}
exports.default = Validator;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Base abstract class for all validators. Methods that must be overridden:
 *  getMessage(...) - Get error message to return when field is invalid.
 *  isValid(...)    - Check validity of field given proposed value and the rest of the model.
 */
class BaseValidator {
    /**
     * Initializes the {BaseValidator}
     * @param validatorKey A unique "key" by which to identify this field validator i.e. length, maxlength, required.
     * Should be a valid JS property name.
     * @param message A custom error message to return. Should be passed down from concrete class' constructors to enable
     * customizing error messages.
     */
    constructor(validatorKey, message) {
        if (!validatorKey) {
            throw new Error('Must pass validator key.');
        }
        if (!BaseValidator.KeyRegex.test(validatorKey)) {
            throw new Error('Validator key must be a valid JS property name');
        }
        this.validatorKey = validatorKey;
        this.message = message || null;
    }
    /**
     * Returns true if the validator instance was passed a custom error message.
     */
    get hasCustomMessage() {
        return !!this.message;
    }
    /**
     * Check whether this validator should process an "empty" value (i.e. null, undefined, empty string). Override
     * this in derived classes to skip validators if the field value hasn't been set. Things like email, min/max length,
     * and pattern should return false for this to ensure they don't get fired when the model is initially empty
     * before a user has had a chance to input a value. Things like required should override this to true so that
     * they are fired for empty values. Base implementation defaults to false
     * @returns {boolean}
     */
    validatesEmptyValue() {
        return false;
    }
    /**
     * Gets the custom error message set on this validator.
     * @param opts Metadata about the field such as name and friendly name.
     * @returns {string} The custom error message or null if none has been set.
     */
    getCustomMessage(opts) {
        if (typeof this.message === 'function') {
            return this.message(opts, this);
        }
        return this.message;
    }
    /**
     * Gets the unique name for this validator.
     * @returns {string} The unique name for this validator.
     */
    getKey() {
        return this.validatorKey;
    }
}
BaseValidator.KeyRegex = /^[a-z0-9_-]+$/i;
exports.default = BaseValidator;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const field_options_1 = __webpack_require__(10);
/**
 * Core class that is responsible for managing validations on class types.
 */
class ValidationManager {
    constructor() {
        this.fieldValidations = {};
    }
    /**
     * Gets the validation manager instance for the passed class. If one already exists for that class, it will return
     * the same instance. If one does not exist, a new one will be created.
     * @param targetClass A valid ES6 class or ES5 function constructor.
     * @returns {*|ValidationManager} An instance of ValidationManager tied to the passed class.
     */
    static get(targetClass) {
        return targetClass[ValidationManager.ValidationsKey] || (targetClass[ValidationManager.ValidationsKey] = new ValidationManager());
    }
    /**
     * Sets the "friendly" name of the field to be used in validation messages.
     * @param property The property to set the field name for.
     * @param newName The name to set.
     */
    setFieldName(property, newName) {
        this.getFieldOptions(property).setFriendlyName(newName);
    }
    /**
     * Add a validation for the given property to the model.
     * @param property The property to add a validation for.
     * @param validator The validator to add.
     */
    addValidator(property, validator) {
        this.getFieldOptions(property).addValidator(validator);
    }
    /**
     * Gets all the validations associated with the class type that this ValidationManager is bound to.
     * @returns {FieldValidations} A map of field name to {FieldOptions}.
     */
    getValidations() {
        return this.fieldValidations;
    }
    /**
     * Gets the field options for the given model property.
     * @param property The property to get field options for.
     * @returns {FieldOptions} An object containing the validators and other options assigned to this field.
     */
    getFieldOptions(property) {
        return this.fieldValidations[property] || (this.fieldValidations[property] = new field_options_1.default(property));
    }
}
ValidationManager.ValidationsKey = '__validations__';
exports.default = ValidationManager;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const pattern_1 = __webpack_require__(6);
const validator_1 = __webpack_require__(1);
/**
 * Validates the field against a regular expression pattern.
 * @param regex The regex to validate against. Should be a valid JavaScript {RegExp} instance.
 * @param message [Optional] Overrides the default validation error message.
 * @returns {function(Object, string): void} A field validation decorator.
 */
function Pattern(regex, message) {
    return function (targetClass, property) {
        validator_1.default.addValidator(targetClass, property, new pattern_1.default(regex, message));
    };
}
exports.default = Pattern;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const validation_manager_1 = __webpack_require__(3);
/**
 * Wraps a model to allow the consuming class to call validation methods.
 */
class ModelValidator {
    /**
     * Creates a new model validator.
     * @param model The model to validate. Should be a class that has a valid constructor function and prototype.
     */
    constructor(model) {
        if (!model) {
            throw new Error('Validator: No model passed');
        }
        if (!model.constructor) {
            throw new Error('Model has no constructor function');
        }
        if (!model.constructor.prototype) {
            throw new Error('Could not find prototype of model');
        }
        let validationManager = validation_manager_1.default.get(model.constructor.prototype);
        this.validations = validationManager.getValidations();
        this.model = model;
    }
    /**
     * Gets the validation options for the given field name.
     * @param fieldKey         The name of the field to get options for.
     * @returns {FieldOptions} The field options associated with that field or null if no validations defined
     * for the field.
     */
    getValidationOptions(fieldKey) {
        let fieldValidations = this.validations[fieldKey];
        if (!fieldValidations) {
            console.warn(`Validation attempted for field ${fieldKey}, but it was not setup`);
            return null;
        }
        return fieldValidations;
    }
    /**
     * Validates the given field on this {ModelValidator}'s model. If a proposed value is passed, validate
     * against that passed value; otherwise, use the field's current value on the model.
     * @param fieldKey      The name of the field to validate.
     * @param proposedValue [Optional] The proposed value to set on the field.
     * @returns {string[]}  An array of field validation error messages if the field is invalid; otherwise,
     * an empty array.
     */
    validateField(fieldKey, proposedValue) {
        let fieldValidations = this.getValidationOptions(fieldKey);
        if (!fieldValidations) {
            return [];
        }
        let value = arguments.length < 2 ? this.model[fieldKey] : proposedValue;
        return fieldValidations.validateValue(value, this.model);
    }
    /**
     * Validate the entire model and return a result that indicates whether the model is valid or not and any errors
     * that have occurred in an object indexed by field name on the model.
     * @returns {IValidationResult} An object that contains whether the model is valid or not and errors by field name.
     */
    validate() {
        let validations = this.validations, result = {
            isValid: true,
            errors: []
        };
        for (let fieldKey in validations) {
            if (validations.hasOwnProperty(fieldKey)) {
                let errors = this.validateField(fieldKey);
                if (errors.length) {
                    result.isValid = false;
                    result.errors.push({
                        field: fieldKey,
                        fieldName: this.getValidationOptions(fieldKey).getFriendlyName(),
                        errors: errors
                    });
                }
            }
        }
        return result;
    }
}
exports.default = ModelValidator;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const base_validator_1 = __webpack_require__(2);
const messages_1 = __webpack_require__(0);
messages_1.default['pattern'] =
    (opts) => `${opts.friendlyName} is not valid`;
/**
 * A regular expression validator.
 */
class PatternValidator extends base_validator_1.default {
    constructor(pattern, message) {
        super('pattern', message);
        this.pattern = pattern;
    }
    getMessage(opts) {
        return messages_1.default['pattern'](opts, this);
    }
    isValid(value) {
        return this.pattern.test(value);
    }
}
exports.default = PatternValidator;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var custom_validation_1 = __webpack_require__(8);
exports.Validation = custom_validation_1.default;
var email_1 = __webpack_require__(11);
exports.Email = email_1.default;
var field_name_1 = __webpack_require__(13);
exports.FieldName = field_name_1.default;
var length_1 = __webpack_require__(14);
exports.Length = length_1.default;
var max_length_1 = __webpack_require__(16);
exports.MaxLength = max_length_1.default;
var min_length_1 = __webpack_require__(18);
exports.MinLength = min_length_1.default;
var pattern_1 = __webpack_require__(4);
exports.Pattern = pattern_1.default;
var required_1 = __webpack_require__(20);
exports.Required = required_1.default;
var alpha_1 = __webpack_require__(22);
exports.Alpha = alpha_1.default;
var alpha_numeric_1 = __webpack_require__(23);
exports.AlphaNumeric = alpha_numeric_1.default;
var validator_1 = __webpack_require__(1);
exports.Validator = validator_1.default;
var model_validator_1 = __webpack_require__(5);
exports.ModelValidator = model_validator_1.default;
var messages_1 = __webpack_require__(0);
exports.Messages = messages_1.default;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const custom_1 = __webpack_require__(9);
const validator_1 = __webpack_require__(1);
/**
 * A generic custom validation. Takes a predicate that will receive the proposed value as the first parameter and the
 * current model state as the second.
 * @param message The message to display when the predicate fails.
 * @param predicate A lambda expression/function that determines if the value is valid. If it returns a falsy value, the
 * field will be considered invalid and will return the passed error message upon validation.
 * @returns {function(Object, string): void} A field validation decorator.
 */
function Validation(message, predicate) {
    return function (targetClass, property) {
        validator_1.default.addValidator(targetClass, property, new custom_1.default(predicate, message));
    };
}
exports.default = Validation;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const base_validator_1 = __webpack_require__(2);
/**
 * Custom validation class.
 */
class CustomValidator extends base_validator_1.default {
    constructor(predicate, message) {
        super(`customValidator${CustomValidator.CustomValidatorCount++}`, message);
        this.predicate = predicate;
    }
    getMessage(opts) {
        return this.getCustomMessage(opts);
    }
    isValid(value, model) {
        return this.predicate(value, model);
    }
}
CustomValidator.CustomValidatorCount = 0;
exports.default = CustomValidator;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Validation options for a given field including actual validators and meta data such as the field name.
 */
class FieldOptions {
    constructor(property) {
        this.friendlyName = 'Field';
        this.validators = [];
        this.property = property;
    }
    /**
     * Gets the "friendly" name of the field for use in validation error messages. Defaults to just "Field".
     * @returns {string}
     */
    getFriendlyName() {
        return this.friendlyName;
    }
    /**
     * Sets the "friendly" name of the field for use in validation error messages. This name will be used in the text
     * of validation errors.
     * @param name The new name to set.
     */
    setFriendlyName(name) {
        this.friendlyName = name;
    }
    /**
     * Add a validator to the list of validators for this field.
     * @param validator The validator to add. Should be a class that extends from {BaseValidator}.
     */
    addValidator(validator) {
        this.validators.push(validator);
    }
    /**
     * Gets the validators assigned to this field.
     * @returns {BaseValidator[]} The validators for this field.
     */
    getValidators() {
        return this.validators;
    }
    /**
     * Runs through all of the validators for the field given a particular value and returns any validation errors that
     * may have occurred.
     * @param value The value to validate.
     * @param model The rest of the model. Used in custom cross-field validations.
     * @returns {string[]} Any validation errors that may have occurred or an empty array if the value passed is valid
     * for the field.
     */
    validateValue(value, model) {
        let errors = [], isEmpty = typeof value === 'undefined' || value === null || (typeof value === 'string' && !value), msgOpts = {
            property: this.property,
            friendlyName: this.friendlyName,
            value: value
        };
        for (let i = 0; i < this.validators.length; i++) {
            let validator = this.validators[i];
            if (!validator.validatesEmptyValue() && isEmpty) {
                continue;
            }
            if (!validator.isValid(value, model)) {
                let message = validator.hasCustomMessage
                    ? validator.getCustomMessage(msgOpts)
                    : validator.getMessage(msgOpts);
                errors.push(message);
            }
        }
        return errors;
    }
}
exports.default = FieldOptions;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const email_1 = __webpack_require__(12);
const validator_1 = __webpack_require__(1);
/**
 * Validate's that the field is a valid email address. The format used is the same as the webkit browser's internal
 * email validation format. For looser or stricter formats, use your own validation based on the @Pattern decorator.
 * @param message [Optional] Overrides the default validation error message.
 * @returns {function(Object, string): void} A field validation decorator.
 */
function Email(message) {
    return function (targetClass, property) {
        validator_1.default.addValidator(targetClass, property, new email_1.default(message));
    };
}
exports.default = Email;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const pattern_1 = __webpack_require__(6);
const messages_1 = __webpack_require__(0);
messages_1.default['email'] = (opts) => `${opts.friendlyName} is not a valid email address`;
/**
 * An email validator.
 */
class EmailValidator extends pattern_1.default {
    constructor(message) {
        super(EmailValidator.EmailRegex, message);
    }
    getMessage(opts) {
        return messages_1.default['email'](opts, this);
    }
    getKey() {
        return 'email';
    }
}
EmailValidator.EmailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i;
exports.default = EmailValidator;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const validation_manager_1 = __webpack_require__(3);
/**
 * Sets the field's "friendly" name in validation error messages.
 * @param name The field's friendly name
 * @returns {function(Object, string): void} A field validation decorator.
 */
function FieldName(name) {
    return function (targetClass, property) {
        let manager = validation_manager_1.default.get(targetClass);
        manager.setFieldName(property, name);
    };
}
exports.default = FieldName;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const length_1 = __webpack_require__(15);
const validator_1 = __webpack_require__(1);
/**
 * Validate's a field's EXACT length. Validation fails if the field is not EXACTLY the length passed.
 * @param length The exact length the field must be.
 * @param message [Optional] Overrides the default validation error message.
 * @returns {function(Object, string): void} A field validation decorator.
 */
function Length(length, message) {
    return function (targetClass, property) {
        validator_1.default.addValidator(targetClass, property, new length_1.default(length, message));
    };
}
exports.default = Length;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const base_validator_1 = __webpack_require__(2);
const messages_1 = __webpack_require__(0);
messages_1.default['length'] =
    (opts, validator) => `${opts.friendlyName} must be ${validator.length} characters long.`;
/**
 * An exact length validator.
 */
class LengthValidator extends base_validator_1.default {
    constructor(length, message) {
        super('length', message);
        if (typeof length !== 'number' || length <= 0) {
            throw new Error('Length must be a positive integer greater than 0');
        }
        this.length = length;
    }
    getMessage(opts) {
        return messages_1.default['length'](opts, this);
    }
    isValid(value) {
        return value.length === this.length;
    }
}
exports.default = LengthValidator;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const max_length_1 = __webpack_require__(17);
const validator_1 = __webpack_require__(1);
/**
 * Validates a field's maximum length.
 * @param maxLength The field's maximum length. Must be a positive integer greater than 1.
 * @param message [Optional] Overrides the default validation error message.
 * @returns {function(Object, string): void} A field validation decorator.
 */
function MaxLength(maxLength, message) {
    return function (targetClass, property) {
        validator_1.default.addValidator(targetClass, property, new max_length_1.default(maxLength, message));
    };
}
exports.default = MaxLength;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const base_validator_1 = __webpack_require__(2);
const messages_1 = __webpack_require__(0);
messages_1.default['maxlength'] =
    (opts, validator) => `${opts.friendlyName} can not exceed ${validator.maxLength} characters in length`;
/**
 * A maximum length validator.
 */
class MaxLengthValidator extends base_validator_1.default {
    constructor(maxLength, message) {
        super('maxlength', message);
        if (typeof maxLength !== 'number' || maxLength <= 0) {
            throw new Error('Max length must be positive integer greater than 0');
        }
        this.maxLength = maxLength;
    }
    getMessage(opts) {
        return messages_1.default['maxlength'](opts, this);
    }
    isValid(value) {
        return value.length <= this.maxLength;
    }
}
exports.default = MaxLengthValidator;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const min_length_1 = __webpack_require__(19);
const validator_1 = __webpack_require__(1);
/**
 * Validates the field's minimum length.
 * @param minLength The field's minimum length. Must be a positive integer greater than 0
 * @param message [Optional] Overrides the default validation error message.
 * @returns {function(Object, string): void} A field validation decorator.
 */
function MinLength(minLength, message) {
    return function (targetClass, property) {
        validator_1.default.addValidator(targetClass, property, new min_length_1.default(minLength, message));
    };
}
exports.default = MinLength;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const base_validator_1 = __webpack_require__(2);
const messages_1 = __webpack_require__(0);
messages_1.default['minlength'] =
    (opts, validator) => `${opts.friendlyName} must be at least ${validator.minLength} characters long`;
/**
 * A minimum length validator.
 */
class MinLengthValidator extends base_validator_1.default {
    constructor(minLength, message) {
        super('minlength', message);
        if (typeof minLength !== 'number' || minLength <= 0) {
            throw new Error('Min length must be positive integer greater than 0');
        }
        this.minLength = minLength;
    }
    getMessage(opts) {
        return messages_1.default['minlength'](opts, this);
    }
    isValid(value) {
        return value.length >= this.minLength;
    }
}
exports.default = MinLengthValidator;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const required_1 = __webpack_require__(21);
const validator_1 = __webpack_require__(1);
/**
 * Marks the field as required.
 * @param message [Optional] Overrides the default validation error message.
 * @returns {function(Object, string): void} A field validation decorator.
 */
function Required(message) {
    return function (targetClass, property) {
        validator_1.default.addValidator(targetClass, property, new required_1.default(message));
    };
}
exports.default = Required;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const base_validator_1 = __webpack_require__(2);
const messages_1 = __webpack_require__(0);
messages_1.default['required'] =
    (opts) => `${opts.friendlyName} is required`;
/**
 * A field requiredness validator.
 */
class RequiredFieldValidator extends base_validator_1.default {
    constructor(message) {
        super('required', message);
    }
    validatesEmptyValue() {
        return true;
    }
    getMessage(opts) {
        return messages_1.default['required'](opts, this);
    }
    isValid(value) {
        return typeof value === 'string' && !!value.trim();
    }
}
exports.default = RequiredFieldValidator;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const pattern_1 = __webpack_require__(4);
const messages_1 = __webpack_require__(0);
messages_1.default['alpha'] = (opts) => `${opts.friendlyName} must only contain alphabetic characters`;
/**
 * Validates that a given field only contains alpha values.
 * @param message [Optional] Overrides the default validation error message.
 * @returns {function(Object, string): void} A field validation decorator.
 */
function Alpha(message) {
    return pattern_1.default(/^[a-z]+$/i, message || messages_1.default['alpha']);
}
exports.default = Alpha;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const pattern_1 = __webpack_require__(4);
const messages_1 = __webpack_require__(0);
messages_1.default['alphanumeric'] = (opts) => `${opts.friendlyName} must only contain alphanumeric characters`;
/**
 * Validates that a given field only contains alphanumeric values.
 * @param message [Optional] Overrides the default validation error message.
 * @returns {function(Object, string): void} A field validation decorator.
 */
function AlphaNumeric(message) {
    return pattern_1.default(/^[a-z0-9]+$/i, message || messages_1.default['alphanumeric']);
}
exports.default = AlphaNumeric;


/***/ })
/******/ ]);
});
//# sourceMappingURL=decorum.js.map