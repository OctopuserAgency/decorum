// Generated by dts-bundle v0.3.0

declare module 'decorum' {
    export { default as Validation } from '__decorum/decorators/custom-validation';
    export { default as Email } from '__decorum/decorators/email';
    export { default as FieldName } from '__decorum/decorators/field-name';
    export { default as Length } from '__decorum/decorators/length';
    export { default as MaxLength } from '__decorum/decorators/max-length';
    export { default as MinLength } from '__decorum/decorators/min-length';
    export { default as Pattern } from '__decorum/decorators/pattern';
    export { default as Required } from '__decorum/decorators/required';
    export { default as Validator } from '__decorum/validator';
    export { default as ModelValidator } from '__decorum/model-validator';
    export { default as Messages } from '__decorum/messages';
}

declare module '__decorum/decorators/custom-validation' {
    export default function Validation<TModel>(message: string, predicate: (value: any, model: TModel) => boolean): PropertyDecorator;
}

declare module '__decorum/decorators/email' {
    export default function Email(message?: string): PropertyDecorator;
}

declare module '__decorum/decorators/field-name' {
    export default function FieldName(name: string): PropertyDecorator;
}

declare module '__decorum/decorators/length' {
    export default function Length(length: number, message?: string): PropertyDecorator;
}

declare module '__decorum/decorators/max-length' {
    export default function MaxLength(maxLength: number, message?: string): PropertyDecorator;
}

declare module '__decorum/decorators/min-length' {
    export default function MinLength(minLength: number, message?: string): PropertyDecorator;
}

declare module '__decorum/decorators/pattern' {
    export default function Pattern(regex: RegExp, message?: string): PropertyDecorator;
}

declare module '__decorum/decorators/required' {
    export default function Required(message?: string): PropertyDecorator;
}

declare module '__decorum/validator' {
    import ModelValidator from '__decorum/model-validator';
    import { IValidationResult } from '__decorum/model-validator';
    export type ValidationDefinitions = {
        [field: string]: PropertyDecorator[];
    };
    export default class Validator {
        static new(model: any): ModelValidator;
        static decorate(objectType: any, definitions: ValidationDefinitions): void;
        static validate(model: any): IValidationResult;
    }
}

declare module '__decorum/model-validator' {
    import FieldOptions from '__decorum/field-options';
    export interface IFieldValidationError {
        field: string;
        fieldName: string;
        errors: string[];
    }
    export interface IValidationResult {
        isValid: boolean;
        errors: IFieldValidationError[];
    }
    export default class ModelValidator {
        constructor(model: any);
        getValidationOptions(fieldKey: string): FieldOptions;
        validateField(fieldKey: string, proposedValue?: any): string[];
        validate(): IValidationResult;
    }
}

declare module '__decorum/messages' {
    export type MessageHandler = (fieldName: string, fieldValue: any, ...args: any[]) => string;
    export interface IMessageHandlerMap {
        [key: string]: MessageHandler;
    }
    let MessageHandlers: IMessageHandlerMap;
    export default MessageHandlers;
}

declare module '__decorum/field-options' {
    import BaseValidator from '__decorum/validators/base-validator';
    export default class FieldOptions {
        getFieldName(): string;
        setFieldName(name: string): void;
        addValidator(validator: BaseValidator): void;
        getValidators(): BaseValidator[];
        validateValue(value: any, model: any): string[];
    }
}

declare module '__decorum/validators/base-validator' {
    abstract class BaseValidator {
        constructor(validatorKey: string, message: string);
        hasCustomMessage: boolean;
        validatesEmptyValue(): boolean;
        getCustomMessage(): string;
        getKey(): string;
        abstract getMessage(fieldName: string, fieldValue: any): string;
        abstract isValid(value: any, model: any): boolean;
    }
    export default BaseValidator;
}

