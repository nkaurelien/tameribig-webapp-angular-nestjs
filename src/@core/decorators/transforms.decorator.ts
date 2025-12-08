import { Transform } from 'class-transformer';

export const Trim = () =>
  Transform(({ value }: { value: unknown }): unknown => {
    if (Array.isArray(value)) {
      return value.map((v: unknown) =>
        typeof v === 'string' ? v.trim().replace(/\s\s+/g, ' ') : v,
      );
    }
    return typeof value === 'string'
      ? value.trim().replace(/\s\s+/g, ' ')
      : value;
  });

export const ToInt = () =>
  Transform(
    ({ value }: { value: unknown }): number => {
      if (typeof value === 'number') return Math.floor(value);
      if (typeof value === 'string') return parseInt(value, 10);
      return NaN;
    },
    { toClassOnly: true },
  );

export const ToBoolean = () =>
  Transform(
    ({ value }: { value: unknown }): boolean => {
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') {
        return value === 'true' || value === '1';
      }
      return Boolean(value);
    },
    { toClassOnly: true },
  );

export const ToLowerCase = () =>
  Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.toLowerCase() : value,
  );

export const ToUpperCase = () =>
  Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.toUpperCase() : value,
  );

export const ToArray = () =>
  Transform(({ value }: { value: unknown }): unknown[] =>
    Array.isArray(value) ? value : [value],
  );
