export const isNumber = (value: any): boolean => {
  return (
    typeof value === 'number' ||
    (isObjectLike(value) && baseGetTag(value) === numberTag)
  );
};

// Helper function to check if a value is object-like
function isObjectLike(value: any): boolean {
  return value != null && typeof value === 'object';
}

// Helper function to get the internal [[Class]] tag
function baseGetTag(value: any): string {
  return Object.prototype.toString.call(value);
}

// Constant for the number tag
const numberTag = '[object Number]';
