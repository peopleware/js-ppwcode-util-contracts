define(["dojo/_base/declare"], function(declare) {

  var _PrecontionViolationError = declare(null, {
    instance: null,
    method: null,
    condition: null,
    constructor: function(instance, method, condition) {
      this.instance = instance;
      this.method = method;
      this.condition = condition;
    },
    toString: function() {
      return "Precondition violation: " + this.condition +
        " (on " + this.instance + " in method " + this.method + ")";
    }
  });

  var _ContractMixin = declare(null, {
    _c_invar: [],

    _c_pre: function(condition) {
      if (! condition()) {
        throw new _PrecontionViolationError(this, null /* TODO method */, condition);
      }
    },

    _c_prop: function(subject, propName) {
      // summary:
      //   the property subject[propName] exists
      // description:
      //   if there is only 1 argument, subject is taken to be this
      var pName;
      var s;
      if (arguments.length < 2) {
        pName = subject
        s = this;
      }
      else {
        pName = propName;
        s = subject;
      }
      return (pName in s);
    },

    _c_prop_mandatory: function(subject, propName) {
      // summary:
      //   the property subject[propName] is mandatory (exists and not-null)
      // description:
      //   if there is only 1 argument, subject is taken to be this
      var pName;
      var s;
      if (arguments.length < 2) {
        pName = subject
        s = this;
      }
      else {
        pName = propName;
        s = subject;
      }
      return this._c_prop(s, pName) && s[pName] != null;
    },

    _c_prop_mandatory_string: function(subject, propName) {
      // summary:
      //   the property subject[propName] is a non-empty string
      // description:
      //   if there is only 1 argument, subject is taken to be this
      var pName;
      var s;
      if (arguments.length < 2) {
        pName = subject
        s = this;
      }
      else {
        pName = propName;
        s = subject;
      }
      var exists = this._c_prop_mandatory(s, pName);
      if (exists) {
        var value = s[pName];
        return typeof value === "string" && value != "";
      }
      else {
        return false;
      }
    }

  });

  return _ContractMixin;
});
