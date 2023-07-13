const traverse = require("traverse");
const get = require("lodash.get");
const difference = require("lodash.difference");

function removeComponents(oas, unused) {
  oas = traverse(oas).clone();
  return traverse(oas).forEach(function (x) {
    const path = this.path.join(".");
    if (unused.includes(path)) {
      this.remove();
      if (Object.keys(this.parent.node).length === 0) {
        this.parent.remove();
      }
    }
  });
}

function getReferencedComponents(oas) {
  return traverse(oas).reduce(function (acc, x) {
    if (this.isLeaf && this.key == "$ref") {
      acc.push(x.replace("#/", "").replace(/\//g, "."));
    }
    return acc;
  }, []);
}

function getDefinedComponents(oas) {
  return traverse(oas).reduce(function (acc, x) {
    if (this.path[0] !== "components") {
      return acc;
    }

    // We're at a schema definition
    if (this.path.length == 3) {
      acc.push(this.path.join("."));
    }

    return acc;
  }, []);
}

function getUnusedComponents(all, referenced) {
  return difference(all, referenced);
}

module.exports = {
  getReferencedComponents,
  getDefinedComponents,
  getUnusedComponents,
  removeComponents,
};
