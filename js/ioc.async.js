/*global IOC:true*/
//Asynchronous tools
IOC.Async = function () {
  var _sequencialLatch = function (values, callback, finalCallback) {
    var index = 0;
    var length = values.length;

    var _next = function () {
      if (index < length) {
        callback(values[index++]);
      } else {
        finalCallback();
      }
    };

    return {
      next: _next
    };
  };

  var _latch = function (times, callback, name) {
    var id = name || new Date().getTime();
    window.console.groupCollapsed('Latch: Starting latch "' + id + '" for', times, 'times');
    window.console.trace();
    window.console.groupEnd();
    var executions = 0;
    return {
      countDown: function () {
        executions++;
        window.console.log('Latch: Counting down latch "' + id + '" ,', times - executions, 'remaining');
        if (executions === times) {
          window.console.log('Latch: Triggering latch "' + id + '"');
          callback(executions);
        }
      },
      countUp: function () {
        executions--;
        window.console.log('Latch: Counting up latch "' + id + '" ,', times - executions, 'remaining');
        if (executions === times) {
          window.console.log('Latch: Triggering latch "' + id + '"');
          callback(executions);
        }
      }
    };
  };

  return {
    async: {
      //###Sequencial latch.
      //The sequencial latch will synchronously execute the handler
      // with the provided values and execute a callback when all operations are complete.
      //<pre><code>
      // seqLatch(values, handler, callback)
      //</code></pre>
      // Where *<b>values</b>* is an array of values to be passed as parameters to the handler function.
      // The *<b>handler</b>* function must call the <code>next</code> function of the returned object when it
      // finishes the execution.
      // The *<b>callback</b>* is the function that is executed once all the values have been handled.
      seqLatch: function (values, handler, callback) {
        return new _sequencialLatch(values, handler, callback);
      },
      //###Latch.
      //The latch will execute asynchronous tasks and invoke a callback when all the declared times have been executed
      //<pre><code>
      // latch(times, callback [, name])
      //</code></pre>
      // Where *<b>times</b>* is the initially expected times the latch should wait for to trigger the callback.
      // The *<b>callback</b>* is the function invoked once times reaches 0.
      // The optional *<b></b>*name is if you wish to have a meaningful name in the console logs.
      // This function returns an object with two functions:
      //<pre><code>
      // {
      //   countDown:...
      //   countUp:...
      // }
      //</code></pre>
      // *<b>countDown</b>* will decrease the counter and *<b>CountUp</b>* will increase the counter that is initialized with the times argument.
      // Once the counter hits 0 the callback is invoked.
      latch: function (times, callback, name) {
        return new _latch(times, callback, name);
      }
    }
  };
};