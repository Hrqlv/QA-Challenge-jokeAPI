function isUnique(array) {
    return new Set(array).size === array.length;
  }
  
  module.exports = { isUnique };
  