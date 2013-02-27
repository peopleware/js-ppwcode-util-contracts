define(["dojo/_base/declare", "doh/main",
        "dojo/has", "dojo/_base/config", "dojo/_base/lang"],
  function(declare, doh,
           has, config, lang) {

    // has and config setup

    has.add("running-doh", 1, true, true);
    has.add("dojo-debug-messages", 1, true, true);
    has.add("running-from-localhost", function(global) {
      return (global.location.hostname === "localhost" || global.location.hostname === "127.0.0.1"
        || global.location.hostname === "ecachim.local");
    });
    has.add("remote-use-server", function(global) {
      return ! has("running-from-localhost");
    });

    config.isDebug = true;





    var InvariantViolationError = declare(null, {
      instance: null,
      invariant: null,
      constructor: function(instance, invariant) {
        this.instance = instance;
        this.invariant = invariant;
      }
    });

    doh._flattenInvars = function(context, /*Array*/ a, /*Array*/ acc) {
      doh.isNot(null, context);
      doh.isNot(null, a);
      doh.t(a instanceof Array);
      doh.isNot(null, acc);
      doh.t(acc instanceof Array);

      for (var i = 0; i < a.length; i++) {
        var el = a[i];
        if (el instanceof Function) {
          acc.push({
            testMethodForPrint: el.toString(),
            testMethodInContext: lang.hitch(context, el)
          });
        }
        else {
          // we expect an object {condition: /*Function (optional)*/, objectSelector: /*Function*/, invars: /*Array*/ of /*Function*/
          if (el.hasOwnProperty("condition")) {
            var conditionResult = el.condition.call(context);
            if (conditionResult) {
              var selection = el.selector.call(context);
              if (selection instanceof Array) {
                // for all elements
                for (var j = 0; j < selection.length; j++) {
                  doh._flattenInvars(selection[j], el.invars, acc);
                }
              }
              else {
                // selection is Object
                for (var propName in selection) {
                  if (selection.hasOwnProperty(propName)) {
                    doh._flattenInvars(selection[propName], el.invars, acc);
                  }
                  //else NOP
                }
              }
            }
          }
        }
      }
    };

    doh.validateInvariants = function(subject) {
      // TODO subject is a _Mixin (duck typing)
      doh.isNot(null, subject);
      doh.t("_c_invar" in subject);
      doh.isNot(null, subject._c_invar);
      doh.t(subject._c_invar instanceof Array);

      var invars = [];
      this._flattenInvars(subject, subject._c_invar, invars);

      for (var i = 0; i < invars.length; i++) {
        var invar = invars[i];
        doh.isNot(null, invar);
        doh.t(invar.testMethodInContext instanceof Function);

        // inject for this
        var result = invar.testMethodInContext();
        if (! result) {
          throw new doh._AssertFailure("invariant error: " + invar.testMethodForPrint + " (on " + subject.toString() + ")");
        }
      }
    };
    doh.invars = doh.validateInvariants;

    doh.assertFailure = function(/*String?*/ hint, /*Error*/ error) {
      // summary:
      //    The test failed.
      var msg = "test failed";
      if (error) {
        msg += ('" + error + "');
      }
      throw new doh._AssertFailure(msg, hint);
    };
    doh.fail = doh.assertFailure;

    doh.unexpectedException = function(/*Error*/ exc) {
      // summary:
      //    exc was encountered, and this was unexpected
      var msg = "encountered an unexpected exception";
      throw new doh._AssertFailure(msg, exc);
    };
    doh.exc = doh.unexpectedException;

    return doh;
  }
);
