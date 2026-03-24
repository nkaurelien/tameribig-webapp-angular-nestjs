import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsPassword(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object: object, propertyName: string | symbol) => {
    registerDecorator({
      propertyName: String(propertyName),
      name: 'isPassword',
      target: object.constructor,
      constraints: [],
      options: {
        message: 'Password must contain only letters, numbers, and !@#$%^&*',
        ...validationOptions,
      },
      validator: {
        validate(value: string): boolean {
          return /^[a-zA-Z0-9!@#$%^&*]*$/.test(value);
        },
      },
    });
  };
}

export function IsStrongPassword(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object: object, propertyName: string | symbol) => {
    registerDecorator({
      propertyName: String(propertyName),
      name: 'isStrongPassword',
      target: object.constructor,
      constraints: [],
      options: {
        message:
          'Password must be at least 8 characters with uppercase, lowercase, number and special character',
        ...validationOptions,
      },
      validator: {
        validate(value: string): boolean {
          return (
            typeof value === 'string' &&
            value.length >= 8 &&
            /[A-Z]/.test(value) &&
            /[a-z]/.test(value) &&
            /[0-9]/.test(value) &&
            /[!@#$%^&*]/.test(value)
          );
        },
      },
    });
  };
}

export function Match(
  property: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object: object, propertyName: string | symbol) => {
    registerDecorator({
      propertyName: String(propertyName),
      name: 'match',
      target: object.constructor,
      constraints: [property],
      options: {
        message: `${String(propertyName)} must match ${property}`,
        ...validationOptions,
      },
      validator: {
        validate(value: unknown, args: ValidationArguments): boolean {
          const relatedPropertyName = args.constraints[0] as string;
          const relatedValue = (args.object as Record<string, unknown>)[
            relatedPropertyName
          ];
          return value === relatedValue;
        },
      },
    });
  };
}
