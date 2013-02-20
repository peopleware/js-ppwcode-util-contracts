define(["dojo/_base/declare", "dojo/_base/lang"], function(declare, lang) {

  var _PreconditionViolationError = declare(null, {
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
      if (! condition.apply(this)) {
        throw new _PreconditionViolationError(this, null /* TODO method */, condition);
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
        pName = subject;
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
        pName = subject;
        s = this;
      }
      else {
        pName = propName;
        s = subject;
      }
      return this._c_prop(s, pName) && s[pName] !== null;
    },

    _c_prop_mandatory_string: function(subject, propName) {
      // summary:
      //   the property subject[propName] is a non-empty string
      // description:
      //   if there is only 1 argument, subject is taken to be this
      var pName;
      var s;
      if (arguments.length < 2) {
        pName = subject;
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
    },

    _c_prop_bool: function(subject, propName) {
      // summary:
      //   the property subject[propName] is defined, and if it is not-null, it is a bool
      // description:
      //   if there is only 1 argument, subject is taken to be this
      var pName;
      var s;
      if (arguments.length < 2) {
        pName = subject;
        s = this;
      }
      else {
        pName = propName;
        s = subject;
      }
      var exists = this._c_prop(s, pName);
      if (exists) {
        var value = s[pName];
        return value == null || typeof value === "boolean";
      }
      else {
        return false;
      }
    },

    _c_prop_string: function(subject, propName) {
      // summary:
      //   the property subject[propName] is defined, and if it is not-null, it is a string
      // description:
      //   if there is only 1 argument, subject is taken to be this
      var pName;
      var s;
      if (arguments.length < 2) {
        pName = subject;
        s = this;
      }
      else {
        pName = propName;
        s = subject;
      }
      var exists = this._c_prop(s, pName);
      if (exists) {
        var value = s[pName];
        return value == null || lang.isString(value);
      }
      else {
        return false;
      }
    },

    _c_prop_array: function(subject, propName) {
      // summary:
      //   the property subject[propName] is defined, and if it is not-null, it is an Array
      // description:
      //   if there is only 1 argument, subject is taken to be this
      var pName;
      var s;
      if (arguments.length < 2) {
        pName = subject;
        s = this;
      }
      else {
        pName = propName;
        s = subject;
      }
      var exists = this._c_prop(s, pName);
      if (exists) {
        var value = s[pName];
        return value == null || lang.isArray(value);
      }
      else {
        return false;
      }
    },

    _c_prop_function: function(subject, propName) {
      // summary:
      //   the property subject[propName] is defined, and if it is not-null, it is a Function
      // description:
      //   if there is only 1 argument, subject is taken to be this
      var pName;
      var s;
      if (arguments.length < 2) {
        pName = subject;
        s = this;
      }
      else {
        pName = propName;
        s = subject;
      }
      var exists = this._c_prop(s, pName);
      if (exists) {
        var value = s[pName];
        return value == null || lang.isFunction(value);
      }
      else {
        return false;
      }
    },

    _c_ABSTRACT: function() {
      // summary:
      //   use this to annotate a function as abstract
      // description:
      //   This method throws an exception "ABSTRACT".
      //
      //   An abstract method should be mentioned, to have a hook for documentation.
      //   Yet, an meaningful implementation is not possible.
      //   To detect errors early, and to avoid code inspection warnings, you
      //   can call this body in the abstract method. Because the method should
      //   be overwritten for every concrete subclass, this code should never be called.
      //
      //   Often, abstract methods also have parameters. These will not be used in the
      //   body of the abstract method declaration (the hook for the documentation),
      //   which will trigger code inspection warnings. To avoid these, you should
      //   add those parameters as arguments to this call.
      throw "ABSTRACT";
    },

    _c_NOP: function() {
      // summary:
      //   use this to annotate a function as having no body whatsoever
      // description:
      //   This method does NOP.
      //
      //   Methods like this must sometimes be mentioned, as a NOP implementation
      //   of an abstract method in some subclass, or in other circumstances.
      //   Using this method instead of a comment helps in avoiding unnecessary
      //   code inspection warnings.
      //
      //   Often, such NOP methods also have parameters. These will not be used in the
      //   empty body, which will trigger code inspection warnings. To avoid these, you
      //   should add those parameters as arguments to this call.
    }

  });

  return _ContractMixin;
});
