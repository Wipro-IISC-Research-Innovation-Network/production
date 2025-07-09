// Simple regenerator runtime polyfill
if (typeof global !== 'undefined') {
  if (!global.regeneratorRuntime) {
    global.regeneratorRuntime = {};
  }
}

if (typeof window !== 'undefined') {
  if (!window.regeneratorRuntime) {
    window.regeneratorRuntime = {};
  }
}

// Basic regenerator runtime implementation
const regeneratorRuntime = {
  mark: function(genFun) {
    return genFun;
  },
  wrap: function(innerFn, outerFn, self, tryLocsList) {
    return function() {
      return new Promise((resolve, reject) => {
        try {
          const result = innerFn.apply(self, arguments);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    };
  },
  async: function(fn) {
    return function() {
      return new Promise((resolve, reject) => {
        try {
          const result = fn.apply(this, arguments);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    };
  }
};

if (typeof global !== 'undefined') {
  global.regeneratorRuntime = regeneratorRuntime;
}

if (typeof window !== 'undefined') {
  window.regeneratorRuntime = regeneratorRuntime;
}

export default regeneratorRuntime; 