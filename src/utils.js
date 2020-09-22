function camelCase(str) {
  return str
    .toString() // Cast to string
    .toLowerCase() // Convert the string to lowercase letters
    .normalize('NFD') // The normalize() method returns the Unicode Normalization Form of a given string.
    .trim() // Remove whitespace from both sides of a string
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/-([a-z])/g, (g) => g[1].toUpperCase()) // convert to camel case
}

function pascalCase(str) {
  return str
    .split(/(?=[A-Z])/)
    .join('_')
    .match(/[a-z]+/gi)
    .map((s) => s.charAt(0).toUpperCase() + s.substr(1).toLowerCase())
    .join('')
}

function ifElse(condition, whenTrue = '', whenFalse = '') {
  return condition ? whenTrue : whenFalse
}

const hasHyphen = (str) => {
  return str.indexOf('-') > -1
}

const fixTypeWhenHaveHyphen = (name) => {
  if (hasHyphen(name)) {
    return `"${name}"`
  }

  return name
}

const hyphenToCamelCase = (str) => {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
}

module.exports = {
  ifElse,
  camelCase,
  pascalCase,
  hasHyphen,
  fixTypeWhenHaveHyphen,
  hyphenToCamelCase,
}
