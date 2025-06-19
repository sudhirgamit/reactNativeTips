import {isNumber} from './isNumber';

export const isEmpty = (value: any): boolean => {
  if (value == null) {
    return true;
  }

  if (
    isArrayLike(value) &&
    (Array.isArray(value) ||
      typeof value === 'string' ||
      typeof value.splice === 'function' ||
      isBuffer(value) ||
      isTypedArray(value) ||
      isArguments(value))
  ) {
    return value.length === 0;
  }

  const tag = getTag(value);
  if (tag === mapTag || tag === setTag) {
    return value.size === 0;
  }

  if (isPrototype(value)) {
    return baseKeys(value).length === 0;
  }

  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  if (isNumber(value)) {
    return false;
  }
  return true;
};

// Helper function type signatures
function isArrayLike(value: any): boolean {
  return value != null && typeof value.length === 'number';
}

function isBuffer(value: any): boolean {
  return value instanceof Buffer;
}

function isTypedArray(value: any): boolean {
  return ArrayBuffer.isView(value) && !(value instanceof DataView);
}

function isArguments(value: any): boolean {
  return Object.prototype.toString.call(value) === '[object Arguments]';
}

function getTag(value: any): string {
  return Object.prototype.toString.call(value);
}

function isPrototype(value: any): boolean {
  const prototype = Object.getPrototypeOf(value);
  return prototype && prototype.constructor.prototype === value;
}

function baseKeys(value: any): string[] {
  return Object.keys(value);
}

// Tag constants
const mapTag = '[object Map]';
const setTag = '[object Set]';
