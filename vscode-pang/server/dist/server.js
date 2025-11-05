var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// node_modules/vscode-languageserver/lib/common/utils/is.js
var require_is = __commonJS({
  "node_modules/vscode-languageserver/lib/common/utils/is.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.thenable = exports2.typedArray = exports2.stringArray = exports2.array = exports2.func = exports2.error = exports2.number = exports2.string = exports2.boolean = void 0;
    function boolean(value) {
      return value === true || value === false;
    }
    exports2.boolean = boolean;
    function string(value) {
      return typeof value === "string" || value instanceof String;
    }
    exports2.string = string;
    function number(value) {
      return typeof value === "number" || value instanceof Number;
    }
    exports2.number = number;
    function error(value) {
      return value instanceof Error;
    }
    exports2.error = error;
    function func(value) {
      return typeof value === "function";
    }
    exports2.func = func;
    function array(value) {
      return Array.isArray(value);
    }
    exports2.array = array;
    function stringArray(value) {
      return array(value) && value.every((elem) => string(elem));
    }
    exports2.stringArray = stringArray;
    function typedArray(value, check) {
      return Array.isArray(value) && value.every(check);
    }
    exports2.typedArray = typedArray;
    function thenable(value) {
      return value && func(value.then);
    }
    exports2.thenable = thenable;
  }
});

// node_modules/vscode-jsonrpc/lib/common/is.js
var require_is2 = __commonJS({
  "node_modules/vscode-jsonrpc/lib/common/is.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.stringArray = exports2.array = exports2.func = exports2.error = exports2.number = exports2.string = exports2.boolean = void 0;
    function boolean(value) {
      return value === true || value === false;
    }
    exports2.boolean = boolean;
    function string(value) {
      return typeof value === "string" || value instanceof String;
    }
    exports2.string = string;
    function number(value) {
      return typeof value === "number" || value instanceof Number;
    }
    exports2.number = number;
    function error(value) {
      return value instanceof Error;
    }
    exports2.error = error;
    function func(value) {
      return typeof value === "function";
    }
    exports2.func = func;
    function array(value) {
      return Array.isArray(value);
    }
    exports2.array = array;
    function stringArray(value) {
      return array(value) && value.every((elem) => string(elem));
    }
    exports2.stringArray = stringArray;
  }
});

// node_modules/vscode-jsonrpc/lib/common/messages.js
var require_messages = __commonJS({
  "node_modules/vscode-jsonrpc/lib/common/messages.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Message = exports2.NotificationType9 = exports2.NotificationType8 = exports2.NotificationType7 = exports2.NotificationType6 = exports2.NotificationType5 = exports2.NotificationType4 = exports2.NotificationType3 = exports2.NotificationType2 = exports2.NotificationType1 = exports2.NotificationType0 = exports2.NotificationType = exports2.RequestType9 = exports2.RequestType8 = exports2.RequestType7 = exports2.RequestType6 = exports2.RequestType5 = exports2.RequestType4 = exports2.RequestType3 = exports2.RequestType2 = exports2.RequestType1 = exports2.RequestType = exports2.RequestType0 = exports2.AbstractMessageSignature = exports2.ParameterStructures = exports2.ResponseError = exports2.ErrorCodes = void 0;
    var is = require_is2();
    var ErrorCodes;
    (function(ErrorCodes2) {
      ErrorCodes2.ParseError = -32700;
      ErrorCodes2.InvalidRequest = -32600;
      ErrorCodes2.MethodNotFound = -32601;
      ErrorCodes2.InvalidParams = -32602;
      ErrorCodes2.InternalError = -32603;
      ErrorCodes2.jsonrpcReservedErrorRangeStart = -32099;
      ErrorCodes2.serverErrorStart = -32099;
      ErrorCodes2.MessageWriteError = -32099;
      ErrorCodes2.MessageReadError = -32098;
      ErrorCodes2.PendingResponseRejected = -32097;
      ErrorCodes2.ConnectionInactive = -32096;
      ErrorCodes2.ServerNotInitialized = -32002;
      ErrorCodes2.UnknownErrorCode = -32001;
      ErrorCodes2.jsonrpcReservedErrorRangeEnd = -32e3;
      ErrorCodes2.serverErrorEnd = -32e3;
    })(ErrorCodes || (exports2.ErrorCodes = ErrorCodes = {}));
    var ResponseError = class extends Error {
      constructor(code, message, data) {
        super(message);
        this.code = is.number(code) ? code : ErrorCodes.UnknownErrorCode;
        this.data = data;
        Object.setPrototypeOf(this, ResponseError.prototype);
      }
      toJson() {
        const result = {
          code: this.code,
          message: this.message
        };
        if (this.data !== void 0) {
          result.data = this.data;
        }
        return result;
      }
    };
    exports2.ResponseError = ResponseError;
    var ParameterStructures = class {
      constructor(kind) {
        this.kind = kind;
      }
      static is(value) {
        return value === ParameterStructures.auto || value === ParameterStructures.byName || value === ParameterStructures.byPosition;
      }
      toString() {
        return this.kind;
      }
    };
    exports2.ParameterStructures = ParameterStructures;
    ParameterStructures.auto = new ParameterStructures("auto");
    ParameterStructures.byPosition = new ParameterStructures("byPosition");
    ParameterStructures.byName = new ParameterStructures("byName");
    var AbstractMessageSignature = class {
      constructor(method, numberOfParams) {
        this.method = method;
        this.numberOfParams = numberOfParams;
      }
      get parameterStructures() {
        return ParameterStructures.auto;
      }
    };
    exports2.AbstractMessageSignature = AbstractMessageSignature;
    var RequestType0 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 0);
      }
    };
    exports2.RequestType0 = RequestType0;
    var RequestType = class extends AbstractMessageSignature {
      constructor(method, _parameterStructures = ParameterStructures.auto) {
        super(method, 1);
        this._parameterStructures = _parameterStructures;
      }
      get parameterStructures() {
        return this._parameterStructures;
      }
    };
    exports2.RequestType = RequestType;
    var RequestType1 = class extends AbstractMessageSignature {
      constructor(method, _parameterStructures = ParameterStructures.auto) {
        super(method, 1);
        this._parameterStructures = _parameterStructures;
      }
      get parameterStructures() {
        return this._parameterStructures;
      }
    };
    exports2.RequestType1 = RequestType1;
    var RequestType2 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 2);
      }
    };
    exports2.RequestType2 = RequestType2;
    var RequestType3 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 3);
      }
    };
    exports2.RequestType3 = RequestType3;
    var RequestType4 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 4);
      }
    };
    exports2.RequestType4 = RequestType4;
    var RequestType5 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 5);
      }
    };
    exports2.RequestType5 = RequestType5;
    var RequestType6 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 6);
      }
    };
    exports2.RequestType6 = RequestType6;
    var RequestType7 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 7);
      }
    };
    exports2.RequestType7 = RequestType7;
    var RequestType8 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 8);
      }
    };
    exports2.RequestType8 = RequestType8;
    var RequestType9 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 9);
      }
    };
    exports2.RequestType9 = RequestType9;
    var NotificationType = class extends AbstractMessageSignature {
      constructor(method, _parameterStructures = ParameterStructures.auto) {
        super(method, 1);
        this._parameterStructures = _parameterStructures;
      }
      get parameterStructures() {
        return this._parameterStructures;
      }
    };
    exports2.NotificationType = NotificationType;
    var NotificationType0 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 0);
      }
    };
    exports2.NotificationType0 = NotificationType0;
    var NotificationType1 = class extends AbstractMessageSignature {
      constructor(method, _parameterStructures = ParameterStructures.auto) {
        super(method, 1);
        this._parameterStructures = _parameterStructures;
      }
      get parameterStructures() {
        return this._parameterStructures;
      }
    };
    exports2.NotificationType1 = NotificationType1;
    var NotificationType2 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 2);
      }
    };
    exports2.NotificationType2 = NotificationType2;
    var NotificationType3 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 3);
      }
    };
    exports2.NotificationType3 = NotificationType3;
    var NotificationType4 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 4);
      }
    };
    exports2.NotificationType4 = NotificationType4;
    var NotificationType5 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 5);
      }
    };
    exports2.NotificationType5 = NotificationType5;
    var NotificationType6 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 6);
      }
    };
    exports2.NotificationType6 = NotificationType6;
    var NotificationType7 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 7);
      }
    };
    exports2.NotificationType7 = NotificationType7;
    var NotificationType8 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 8);
      }
    };
    exports2.NotificationType8 = NotificationType8;
    var NotificationType9 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 9);
      }
    };
    exports2.NotificationType9 = NotificationType9;
    var Message;
    (function(Message2) {
      function isRequest(message) {
        const candidate = message;
        return candidate && is.string(candidate.method) && (is.string(candidate.id) || is.number(candidate.id));
      }
      Message2.isRequest = isRequest;
      function isNotification(message) {
        const candidate = message;
        return candidate && is.string(candidate.method) && message.id === void 0;
      }
      Message2.isNotification = isNotification;
      function isResponse(message) {
        const candidate = message;
        return candidate && (candidate.result !== void 0 || !!candidate.error) && (is.string(candidate.id) || is.number(candidate.id) || candidate.id === null);
      }
      Message2.isResponse = isResponse;
    })(Message || (exports2.Message = Message = {}));
  }
});

// node_modules/vscode-jsonrpc/lib/common/linkedMap.js
var require_linkedMap = __commonJS({
  "node_modules/vscode-jsonrpc/lib/common/linkedMap.js"(exports2) {
    "use strict";
    var _a;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LRUCache = exports2.LinkedMap = exports2.Touch = void 0;
    var Touch;
    (function(Touch2) {
      Touch2.None = 0;
      Touch2.First = 1;
      Touch2.AsOld = Touch2.First;
      Touch2.Last = 2;
      Touch2.AsNew = Touch2.Last;
    })(Touch || (exports2.Touch = Touch = {}));
    var LinkedMap = class {
      constructor() {
        this[_a] = "LinkedMap";
        this._map = /* @__PURE__ */ new Map();
        this._head = void 0;
        this._tail = void 0;
        this._size = 0;
        this._state = 0;
      }
      clear() {
        this._map.clear();
        this._head = void 0;
        this._tail = void 0;
        this._size = 0;
        this._state++;
      }
      isEmpty() {
        return !this._head && !this._tail;
      }
      get size() {
        return this._size;
      }
      get first() {
        var _a2;
        return (_a2 = this._head) == null ? void 0 : _a2.value;
      }
      get last() {
        var _a2;
        return (_a2 = this._tail) == null ? void 0 : _a2.value;
      }
      has(key) {
        return this._map.has(key);
      }
      get(key, touch = Touch.None) {
        const item = this._map.get(key);
        if (!item) {
          return void 0;
        }
        if (touch !== Touch.None) {
          this.touch(item, touch);
        }
        return item.value;
      }
      set(key, value, touch = Touch.None) {
        let item = this._map.get(key);
        if (item) {
          item.value = value;
          if (touch !== Touch.None) {
            this.touch(item, touch);
          }
        } else {
          item = { key, value, next: void 0, previous: void 0 };
          switch (touch) {
            case Touch.None:
              this.addItemLast(item);
              break;
            case Touch.First:
              this.addItemFirst(item);
              break;
            case Touch.Last:
              this.addItemLast(item);
              break;
            default:
              this.addItemLast(item);
              break;
          }
          this._map.set(key, item);
          this._size++;
        }
        return this;
      }
      delete(key) {
        return !!this.remove(key);
      }
      remove(key) {
        const item = this._map.get(key);
        if (!item) {
          return void 0;
        }
        this._map.delete(key);
        this.removeItem(item);
        this._size--;
        return item.value;
      }
      shift() {
        if (!this._head && !this._tail) {
          return void 0;
        }
        if (!this._head || !this._tail) {
          throw new Error("Invalid list");
        }
        const item = this._head;
        this._map.delete(item.key);
        this.removeItem(item);
        this._size--;
        return item.value;
      }
      forEach(callbackfn, thisArg) {
        const state = this._state;
        let current = this._head;
        while (current) {
          if (thisArg) {
            callbackfn.bind(thisArg)(current.value, current.key, this);
          } else {
            callbackfn(current.value, current.key, this);
          }
          if (this._state !== state) {
            throw new Error(`LinkedMap got modified during iteration.`);
          }
          current = current.next;
        }
      }
      keys() {
        const state = this._state;
        let current = this._head;
        const iterator = {
          [Symbol.iterator]: () => {
            return iterator;
          },
          next: () => {
            if (this._state !== state) {
              throw new Error(`LinkedMap got modified during iteration.`);
            }
            if (current) {
              const result = { value: current.key, done: false };
              current = current.next;
              return result;
            } else {
              return { value: void 0, done: true };
            }
          }
        };
        return iterator;
      }
      values() {
        const state = this._state;
        let current = this._head;
        const iterator = {
          [Symbol.iterator]: () => {
            return iterator;
          },
          next: () => {
            if (this._state !== state) {
              throw new Error(`LinkedMap got modified during iteration.`);
            }
            if (current) {
              const result = { value: current.value, done: false };
              current = current.next;
              return result;
            } else {
              return { value: void 0, done: true };
            }
          }
        };
        return iterator;
      }
      entries() {
        const state = this._state;
        let current = this._head;
        const iterator = {
          [Symbol.iterator]: () => {
            return iterator;
          },
          next: () => {
            if (this._state !== state) {
              throw new Error(`LinkedMap got modified during iteration.`);
            }
            if (current) {
              const result = { value: [current.key, current.value], done: false };
              current = current.next;
              return result;
            } else {
              return { value: void 0, done: true };
            }
          }
        };
        return iterator;
      }
      [(_a = Symbol.toStringTag, Symbol.iterator)]() {
        return this.entries();
      }
      trimOld(newSize) {
        if (newSize >= this.size) {
          return;
        }
        if (newSize === 0) {
          this.clear();
          return;
        }
        let current = this._head;
        let currentSize = this.size;
        while (current && currentSize > newSize) {
          this._map.delete(current.key);
          current = current.next;
          currentSize--;
        }
        this._head = current;
        this._size = currentSize;
        if (current) {
          current.previous = void 0;
        }
        this._state++;
      }
      addItemFirst(item) {
        if (!this._head && !this._tail) {
          this._tail = item;
        } else if (!this._head) {
          throw new Error("Invalid list");
        } else {
          item.next = this._head;
          this._head.previous = item;
        }
        this._head = item;
        this._state++;
      }
      addItemLast(item) {
        if (!this._head && !this._tail) {
          this._head = item;
        } else if (!this._tail) {
          throw new Error("Invalid list");
        } else {
          item.previous = this._tail;
          this._tail.next = item;
        }
        this._tail = item;
        this._state++;
      }
      removeItem(item) {
        if (item === this._head && item === this._tail) {
          this._head = void 0;
          this._tail = void 0;
        } else if (item === this._head) {
          if (!item.next) {
            throw new Error("Invalid list");
          }
          item.next.previous = void 0;
          this._head = item.next;
        } else if (item === this._tail) {
          if (!item.previous) {
            throw new Error("Invalid list");
          }
          item.previous.next = void 0;
          this._tail = item.previous;
        } else {
          const next = item.next;
          const previous = item.previous;
          if (!next || !previous) {
            throw new Error("Invalid list");
          }
          next.previous = previous;
          previous.next = next;
        }
        item.next = void 0;
        item.previous = void 0;
        this._state++;
      }
      touch(item, touch) {
        if (!this._head || !this._tail) {
          throw new Error("Invalid list");
        }
        if (touch !== Touch.First && touch !== Touch.Last) {
          return;
        }
        if (touch === Touch.First) {
          if (item === this._head) {
            return;
          }
          const next = item.next;
          const previous = item.previous;
          if (item === this._tail) {
            previous.next = void 0;
            this._tail = previous;
          } else {
            next.previous = previous;
            previous.next = next;
          }
          item.previous = void 0;
          item.next = this._head;
          this._head.previous = item;
          this._head = item;
          this._state++;
        } else if (touch === Touch.Last) {
          if (item === this._tail) {
            return;
          }
          const next = item.next;
          const previous = item.previous;
          if (item === this._head) {
            next.previous = void 0;
            this._head = next;
          } else {
            next.previous = previous;
            previous.next = next;
          }
          item.next = void 0;
          item.previous = this._tail;
          this._tail.next = item;
          this._tail = item;
          this._state++;
        }
      }
      toJSON() {
        const data = [];
        this.forEach((value, key) => {
          data.push([key, value]);
        });
        return data;
      }
      fromJSON(data) {
        this.clear();
        for (const [key, value] of data) {
          this.set(key, value);
        }
      }
    };
    exports2.LinkedMap = LinkedMap;
    var LRUCache = class extends LinkedMap {
      constructor(limit, ratio = 1) {
        super();
        this._limit = limit;
        this._ratio = Math.min(Math.max(0, ratio), 1);
      }
      get limit() {
        return this._limit;
      }
      set limit(limit) {
        this._limit = limit;
        this.checkTrim();
      }
      get ratio() {
        return this._ratio;
      }
      set ratio(ratio) {
        this._ratio = Math.min(Math.max(0, ratio), 1);
        this.checkTrim();
      }
      get(key, touch = Touch.AsNew) {
        return super.get(key, touch);
      }
      peek(key) {
        return super.get(key, Touch.None);
      }
      set(key, value) {
        super.set(key, value, Touch.Last);
        this.checkTrim();
        return this;
      }
      checkTrim() {
        if (this.size > this._limit) {
          this.trimOld(Math.round(this._limit * this._ratio));
        }
      }
    };
    exports2.LRUCache = LRUCache;
  }
});

// node_modules/vscode-jsonrpc/lib/common/disposable.js
var require_disposable = __commonJS({
  "node_modules/vscode-jsonrpc/lib/common/disposable.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Disposable = void 0;
    var Disposable;
    (function(Disposable2) {
      function create(func) {
        return {
          dispose: func
        };
      }
      Disposable2.create = create;
    })(Disposable || (exports2.Disposable = Disposable = {}));
  }
});

// node_modules/vscode-jsonrpc/lib/common/ral.js
var require_ral = __commonJS({
  "node_modules/vscode-jsonrpc/lib/common/ral.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var _ral;
    function RAL() {
      if (_ral === void 0) {
        throw new Error(`No runtime abstraction layer installed`);
      }
      return _ral;
    }
    (function(RAL2) {
      function install(ral) {
        if (ral === void 0) {
          throw new Error(`No runtime abstraction layer provided`);
        }
        _ral = ral;
      }
      RAL2.install = install;
    })(RAL || (RAL = {}));
    exports2.default = RAL;
  }
});

// node_modules/vscode-jsonrpc/lib/common/events.js
var require_events = __commonJS({
  "node_modules/vscode-jsonrpc/lib/common/events.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Emitter = exports2.Event = void 0;
    var ral_1 = require_ral();
    var Event;
    (function(Event2) {
      const _disposable = { dispose() {
      } };
      Event2.None = function() {
        return _disposable;
      };
    })(Event || (exports2.Event = Event = {}));
    var CallbackList = class {
      add(callback, context = null, bucket) {
        if (!this._callbacks) {
          this._callbacks = [];
          this._contexts = [];
        }
        this._callbacks.push(callback);
        this._contexts.push(context);
        if (Array.isArray(bucket)) {
          bucket.push({ dispose: () => this.remove(callback, context) });
        }
      }
      remove(callback, context = null) {
        if (!this._callbacks) {
          return;
        }
        let foundCallbackWithDifferentContext = false;
        for (let i = 0, len = this._callbacks.length; i < len; i++) {
          if (this._callbacks[i] === callback) {
            if (this._contexts[i] === context) {
              this._callbacks.splice(i, 1);
              this._contexts.splice(i, 1);
              return;
            } else {
              foundCallbackWithDifferentContext = true;
            }
          }
        }
        if (foundCallbackWithDifferentContext) {
          throw new Error("When adding a listener with a context, you should remove it with the same context");
        }
      }
      invoke(...args) {
        if (!this._callbacks) {
          return [];
        }
        const ret = [], callbacks = this._callbacks.slice(0), contexts = this._contexts.slice(0);
        for (let i = 0, len = callbacks.length; i < len; i++) {
          try {
            ret.push(callbacks[i].apply(contexts[i], args));
          } catch (e) {
            (0, ral_1.default)().console.error(e);
          }
        }
        return ret;
      }
      isEmpty() {
        return !this._callbacks || this._callbacks.length === 0;
      }
      dispose() {
        this._callbacks = void 0;
        this._contexts = void 0;
      }
    };
    var Emitter = class {
      constructor(_options) {
        this._options = _options;
      }
      /**
       * For the public to allow to subscribe
       * to events from this Emitter
       */
      get event() {
        if (!this._event) {
          this._event = (listener, thisArgs, disposables) => {
            if (!this._callbacks) {
              this._callbacks = new CallbackList();
            }
            if (this._options && this._options.onFirstListenerAdd && this._callbacks.isEmpty()) {
              this._options.onFirstListenerAdd(this);
            }
            this._callbacks.add(listener, thisArgs);
            const result = {
              dispose: () => {
                if (!this._callbacks) {
                  return;
                }
                this._callbacks.remove(listener, thisArgs);
                result.dispose = Emitter._noop;
                if (this._options && this._options.onLastListenerRemove && this._callbacks.isEmpty()) {
                  this._options.onLastListenerRemove(this);
                }
              }
            };
            if (Array.isArray(disposables)) {
              disposables.push(result);
            }
            return result;
          };
        }
        return this._event;
      }
      /**
       * To be kept private to fire an event to
       * subscribers
       */
      fire(event) {
        if (this._callbacks) {
          this._callbacks.invoke.call(this._callbacks, event);
        }
      }
      dispose() {
        if (this._callbacks) {
          this._callbacks.dispose();
          this._callbacks = void 0;
        }
      }
    };
    exports2.Emitter = Emitter;
    Emitter._noop = function() {
    };
  }
});

// node_modules/vscode-jsonrpc/lib/common/cancellation.js
var require_cancellation = __commonJS({
  "node_modules/vscode-jsonrpc/lib/common/cancellation.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.CancellationTokenSource = exports2.CancellationToken = void 0;
    var ral_1 = require_ral();
    var Is = require_is2();
    var events_1 = require_events();
    var CancellationToken;
    (function(CancellationToken2) {
      CancellationToken2.None = Object.freeze({
        isCancellationRequested: false,
        onCancellationRequested: events_1.Event.None
      });
      CancellationToken2.Cancelled = Object.freeze({
        isCancellationRequested: true,
        onCancellationRequested: events_1.Event.None
      });
      function is(value) {
        const candidate = value;
        return candidate && (candidate === CancellationToken2.None || candidate === CancellationToken2.Cancelled || Is.boolean(candidate.isCancellationRequested) && !!candidate.onCancellationRequested);
      }
      CancellationToken2.is = is;
    })(CancellationToken || (exports2.CancellationToken = CancellationToken = {}));
    var shortcutEvent = Object.freeze(function(callback, context) {
      const handle = (0, ral_1.default)().timer.setTimeout(callback.bind(context), 0);
      return { dispose() {
        handle.dispose();
      } };
    });
    var MutableToken = class {
      constructor() {
        this._isCancelled = false;
      }
      cancel() {
        if (!this._isCancelled) {
          this._isCancelled = true;
          if (this._emitter) {
            this._emitter.fire(void 0);
            this.dispose();
          }
        }
      }
      get isCancellationRequested() {
        return this._isCancelled;
      }
      get onCancellationRequested() {
        if (this._isCancelled) {
          return shortcutEvent;
        }
        if (!this._emitter) {
          this._emitter = new events_1.Emitter();
        }
        return this._emitter.event;
      }
      dispose() {
        if (this._emitter) {
          this._emitter.dispose();
          this._emitter = void 0;
        }
      }
    };
    var CancellationTokenSource = class {
      get token() {
        if (!this._token) {
          this._token = new MutableToken();
        }
        return this._token;
      }
      cancel() {
        if (!this._token) {
          this._token = CancellationToken.Cancelled;
        } else {
          this._token.cancel();
        }
      }
      dispose() {
        if (!this._token) {
          this._token = CancellationToken.None;
        } else if (this._token instanceof MutableToken) {
          this._token.dispose();
        }
      }
    };
    exports2.CancellationTokenSource = CancellationTokenSource;
  }
});

// node_modules/vscode-jsonrpc/lib/common/sharedArrayCancellation.js
var require_sharedArrayCancellation = __commonJS({
  "node_modules/vscode-jsonrpc/lib/common/sharedArrayCancellation.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.SharedArrayReceiverStrategy = exports2.SharedArraySenderStrategy = void 0;
    var cancellation_1 = require_cancellation();
    var CancellationState;
    (function(CancellationState2) {
      CancellationState2.Continue = 0;
      CancellationState2.Cancelled = 1;
    })(CancellationState || (CancellationState = {}));
    var SharedArraySenderStrategy = class {
      constructor() {
        this.buffers = /* @__PURE__ */ new Map();
      }
      enableCancellation(request) {
        if (request.id === null) {
          return;
        }
        const buffer = new SharedArrayBuffer(4);
        const data = new Int32Array(buffer, 0, 1);
        data[0] = CancellationState.Continue;
        this.buffers.set(request.id, buffer);
        request.$cancellationData = buffer;
      }
      async sendCancellation(_conn, id) {
        const buffer = this.buffers.get(id);
        if (buffer === void 0) {
          return;
        }
        const data = new Int32Array(buffer, 0, 1);
        Atomics.store(data, 0, CancellationState.Cancelled);
      }
      cleanup(id) {
        this.buffers.delete(id);
      }
      dispose() {
        this.buffers.clear();
      }
    };
    exports2.SharedArraySenderStrategy = SharedArraySenderStrategy;
    var SharedArrayBufferCancellationToken = class {
      constructor(buffer) {
        this.data = new Int32Array(buffer, 0, 1);
      }
      get isCancellationRequested() {
        return Atomics.load(this.data, 0) === CancellationState.Cancelled;
      }
      get onCancellationRequested() {
        throw new Error(`Cancellation over SharedArrayBuffer doesn't support cancellation events`);
      }
    };
    var SharedArrayBufferCancellationTokenSource = class {
      constructor(buffer) {
        this.token = new SharedArrayBufferCancellationToken(buffer);
      }
      cancel() {
      }
      dispose() {
      }
    };
    var SharedArrayReceiverStrategy = class {
      constructor() {
        this.kind = "request";
      }
      createCancellationTokenSource(request) {
        const buffer = request.$cancellationData;
        if (buffer === void 0) {
          return new cancellation_1.CancellationTokenSource();
        }
        return new SharedArrayBufferCancellationTokenSource(buffer);
      }
    };
    exports2.SharedArrayReceiverStrategy = SharedArrayReceiverStrategy;
  }
});

// node_modules/vscode-jsonrpc/lib/common/semaphore.js
var require_semaphore = __commonJS({
  "node_modules/vscode-jsonrpc/lib/common/semaphore.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Semaphore = void 0;
    var ral_1 = require_ral();
    var Semaphore = class {
      constructor(capacity = 1) {
        if (capacity <= 0) {
          throw new Error("Capacity must be greater than 0");
        }
        this._capacity = capacity;
        this._active = 0;
        this._waiting = [];
      }
      lock(thunk) {
        return new Promise((resolve, reject) => {
          this._waiting.push({ thunk, resolve, reject });
          this.runNext();
        });
      }
      get active() {
        return this._active;
      }
      runNext() {
        if (this._waiting.length === 0 || this._active === this._capacity) {
          return;
        }
        (0, ral_1.default)().timer.setImmediate(() => this.doRunNext());
      }
      doRunNext() {
        if (this._waiting.length === 0 || this._active === this._capacity) {
          return;
        }
        const next = this._waiting.shift();
        this._active++;
        if (this._active > this._capacity) {
          throw new Error(`To many thunks active`);
        }
        try {
          const result = next.thunk();
          if (result instanceof Promise) {
            result.then((value) => {
              this._active--;
              next.resolve(value);
              this.runNext();
            }, (err) => {
              this._active--;
              next.reject(err);
              this.runNext();
            });
          } else {
            this._active--;
            next.resolve(result);
            this.runNext();
          }
        } catch (err) {
          this._active--;
          next.reject(err);
          this.runNext();
        }
      }
    };
    exports2.Semaphore = Semaphore;
  }
});

// node_modules/vscode-jsonrpc/lib/common/messageReader.js
var require_messageReader = __commonJS({
  "node_modules/vscode-jsonrpc/lib/common/messageReader.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ReadableStreamMessageReader = exports2.AbstractMessageReader = exports2.MessageReader = void 0;
    var ral_1 = require_ral();
    var Is = require_is2();
    var events_1 = require_events();
    var semaphore_1 = require_semaphore();
    var MessageReader;
    (function(MessageReader2) {
      function is(value) {
        let candidate = value;
        return candidate && Is.func(candidate.listen) && Is.func(candidate.dispose) && Is.func(candidate.onError) && Is.func(candidate.onClose) && Is.func(candidate.onPartialMessage);
      }
      MessageReader2.is = is;
    })(MessageReader || (exports2.MessageReader = MessageReader = {}));
    var AbstractMessageReader = class {
      constructor() {
        this.errorEmitter = new events_1.Emitter();
        this.closeEmitter = new events_1.Emitter();
        this.partialMessageEmitter = new events_1.Emitter();
      }
      dispose() {
        this.errorEmitter.dispose();
        this.closeEmitter.dispose();
      }
      get onError() {
        return this.errorEmitter.event;
      }
      fireError(error) {
        this.errorEmitter.fire(this.asError(error));
      }
      get onClose() {
        return this.closeEmitter.event;
      }
      fireClose() {
        this.closeEmitter.fire(void 0);
      }
      get onPartialMessage() {
        return this.partialMessageEmitter.event;
      }
      firePartialMessage(info) {
        this.partialMessageEmitter.fire(info);
      }
      asError(error) {
        if (error instanceof Error) {
          return error;
        } else {
          return new Error(`Reader received error. Reason: ${Is.string(error.message) ? error.message : "unknown"}`);
        }
      }
    };
    exports2.AbstractMessageReader = AbstractMessageReader;
    var ResolvedMessageReaderOptions;
    (function(ResolvedMessageReaderOptions2) {
      function fromOptions(options) {
        let charset;
        let result;
        let contentDecoder;
        const contentDecoders = /* @__PURE__ */ new Map();
        let contentTypeDecoder;
        const contentTypeDecoders = /* @__PURE__ */ new Map();
        if (options === void 0 || typeof options === "string") {
          charset = options ?? "utf-8";
        } else {
          charset = options.charset ?? "utf-8";
          if (options.contentDecoder !== void 0) {
            contentDecoder = options.contentDecoder;
            contentDecoders.set(contentDecoder.name, contentDecoder);
          }
          if (options.contentDecoders !== void 0) {
            for (const decoder of options.contentDecoders) {
              contentDecoders.set(decoder.name, decoder);
            }
          }
          if (options.contentTypeDecoder !== void 0) {
            contentTypeDecoder = options.contentTypeDecoder;
            contentTypeDecoders.set(contentTypeDecoder.name, contentTypeDecoder);
          }
          if (options.contentTypeDecoders !== void 0) {
            for (const decoder of options.contentTypeDecoders) {
              contentTypeDecoders.set(decoder.name, decoder);
            }
          }
        }
        if (contentTypeDecoder === void 0) {
          contentTypeDecoder = (0, ral_1.default)().applicationJson.decoder;
          contentTypeDecoders.set(contentTypeDecoder.name, contentTypeDecoder);
        }
        return { charset, contentDecoder, contentDecoders, contentTypeDecoder, contentTypeDecoders };
      }
      ResolvedMessageReaderOptions2.fromOptions = fromOptions;
    })(ResolvedMessageReaderOptions || (ResolvedMessageReaderOptions = {}));
    var ReadableStreamMessageReader = class extends AbstractMessageReader {
      constructor(readable, options) {
        super();
        this.readable = readable;
        this.options = ResolvedMessageReaderOptions.fromOptions(options);
        this.buffer = (0, ral_1.default)().messageBuffer.create(this.options.charset);
        this._partialMessageTimeout = 1e4;
        this.nextMessageLength = -1;
        this.messageToken = 0;
        this.readSemaphore = new semaphore_1.Semaphore(1);
      }
      set partialMessageTimeout(timeout) {
        this._partialMessageTimeout = timeout;
      }
      get partialMessageTimeout() {
        return this._partialMessageTimeout;
      }
      listen(callback) {
        this.nextMessageLength = -1;
        this.messageToken = 0;
        this.partialMessageTimer = void 0;
        this.callback = callback;
        const result = this.readable.onData((data) => {
          this.onData(data);
        });
        this.readable.onError((error) => this.fireError(error));
        this.readable.onClose(() => this.fireClose());
        return result;
      }
      onData(data) {
        try {
          this.buffer.append(data);
          while (true) {
            if (this.nextMessageLength === -1) {
              const headers = this.buffer.tryReadHeaders(true);
              if (!headers) {
                return;
              }
              const contentLength = headers.get("content-length");
              if (!contentLength) {
                this.fireError(new Error(`Header must provide a Content-Length property.
${JSON.stringify(Object.fromEntries(headers))}`));
                return;
              }
              const length = parseInt(contentLength);
              if (isNaN(length)) {
                this.fireError(new Error(`Content-Length value must be a number. Got ${contentLength}`));
                return;
              }
              this.nextMessageLength = length;
            }
            const body = this.buffer.tryReadBody(this.nextMessageLength);
            if (body === void 0) {
              this.setPartialMessageTimer();
              return;
            }
            this.clearPartialMessageTimer();
            this.nextMessageLength = -1;
            this.readSemaphore.lock(async () => {
              const bytes = this.options.contentDecoder !== void 0 ? await this.options.contentDecoder.decode(body) : body;
              const message = await this.options.contentTypeDecoder.decode(bytes, this.options);
              this.callback(message);
            }).catch((error) => {
              this.fireError(error);
            });
          }
        } catch (error) {
          this.fireError(error);
        }
      }
      clearPartialMessageTimer() {
        if (this.partialMessageTimer) {
          this.partialMessageTimer.dispose();
          this.partialMessageTimer = void 0;
        }
      }
      setPartialMessageTimer() {
        this.clearPartialMessageTimer();
        if (this._partialMessageTimeout <= 0) {
          return;
        }
        this.partialMessageTimer = (0, ral_1.default)().timer.setTimeout((token, timeout) => {
          this.partialMessageTimer = void 0;
          if (token === this.messageToken) {
            this.firePartialMessage({ messageToken: token, waitingTime: timeout });
            this.setPartialMessageTimer();
          }
        }, this._partialMessageTimeout, this.messageToken, this._partialMessageTimeout);
      }
    };
    exports2.ReadableStreamMessageReader = ReadableStreamMessageReader;
  }
});

// node_modules/vscode-jsonrpc/lib/common/messageWriter.js
var require_messageWriter = __commonJS({
  "node_modules/vscode-jsonrpc/lib/common/messageWriter.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.WriteableStreamMessageWriter = exports2.AbstractMessageWriter = exports2.MessageWriter = void 0;
    var ral_1 = require_ral();
    var Is = require_is2();
    var semaphore_1 = require_semaphore();
    var events_1 = require_events();
    var ContentLength = "Content-Length: ";
    var CRLF = "\r\n";
    var MessageWriter;
    (function(MessageWriter2) {
      function is(value) {
        let candidate = value;
        return candidate && Is.func(candidate.dispose) && Is.func(candidate.onClose) && Is.func(candidate.onError) && Is.func(candidate.write);
      }
      MessageWriter2.is = is;
    })(MessageWriter || (exports2.MessageWriter = MessageWriter = {}));
    var AbstractMessageWriter = class {
      constructor() {
        this.errorEmitter = new events_1.Emitter();
        this.closeEmitter = new events_1.Emitter();
      }
      dispose() {
        this.errorEmitter.dispose();
        this.closeEmitter.dispose();
      }
      get onError() {
        return this.errorEmitter.event;
      }
      fireError(error, message, count) {
        this.errorEmitter.fire([this.asError(error), message, count]);
      }
      get onClose() {
        return this.closeEmitter.event;
      }
      fireClose() {
        this.closeEmitter.fire(void 0);
      }
      asError(error) {
        if (error instanceof Error) {
          return error;
        } else {
          return new Error(`Writer received error. Reason: ${Is.string(error.message) ? error.message : "unknown"}`);
        }
      }
    };
    exports2.AbstractMessageWriter = AbstractMessageWriter;
    var ResolvedMessageWriterOptions;
    (function(ResolvedMessageWriterOptions2) {
      function fromOptions(options) {
        if (options === void 0 || typeof options === "string") {
          return { charset: options ?? "utf-8", contentTypeEncoder: (0, ral_1.default)().applicationJson.encoder };
        } else {
          return { charset: options.charset ?? "utf-8", contentEncoder: options.contentEncoder, contentTypeEncoder: options.contentTypeEncoder ?? (0, ral_1.default)().applicationJson.encoder };
        }
      }
      ResolvedMessageWriterOptions2.fromOptions = fromOptions;
    })(ResolvedMessageWriterOptions || (ResolvedMessageWriterOptions = {}));
    var WriteableStreamMessageWriter = class extends AbstractMessageWriter {
      constructor(writable, options) {
        super();
        this.writable = writable;
        this.options = ResolvedMessageWriterOptions.fromOptions(options);
        this.errorCount = 0;
        this.writeSemaphore = new semaphore_1.Semaphore(1);
        this.writable.onError((error) => this.fireError(error));
        this.writable.onClose(() => this.fireClose());
      }
      async write(msg) {
        return this.writeSemaphore.lock(async () => {
          const payload = this.options.contentTypeEncoder.encode(msg, this.options).then((buffer) => {
            if (this.options.contentEncoder !== void 0) {
              return this.options.contentEncoder.encode(buffer);
            } else {
              return buffer;
            }
          });
          return payload.then((buffer) => {
            const headers = [];
            headers.push(ContentLength, buffer.byteLength.toString(), CRLF);
            headers.push(CRLF);
            return this.doWrite(msg, headers, buffer);
          }, (error) => {
            this.fireError(error);
            throw error;
          });
        });
      }
      async doWrite(msg, headers, data) {
        try {
          await this.writable.write(headers.join(""), "ascii");
          return this.writable.write(data);
        } catch (error) {
          this.handleError(error, msg);
          return Promise.reject(error);
        }
      }
      handleError(error, msg) {
        this.errorCount++;
        this.fireError(error, msg, this.errorCount);
      }
      end() {
        this.writable.end();
      }
    };
    exports2.WriteableStreamMessageWriter = WriteableStreamMessageWriter;
  }
});

// node_modules/vscode-jsonrpc/lib/common/messageBuffer.js
var require_messageBuffer = __commonJS({
  "node_modules/vscode-jsonrpc/lib/common/messageBuffer.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.AbstractMessageBuffer = void 0;
    var CR = 13;
    var LF = 10;
    var CRLF = "\r\n";
    var AbstractMessageBuffer = class {
      constructor(encoding = "utf-8") {
        this._encoding = encoding;
        this._chunks = [];
        this._totalLength = 0;
      }
      get encoding() {
        return this._encoding;
      }
      append(chunk) {
        const toAppend = typeof chunk === "string" ? this.fromString(chunk, this._encoding) : chunk;
        this._chunks.push(toAppend);
        this._totalLength += toAppend.byteLength;
      }
      tryReadHeaders(lowerCaseKeys = false) {
        if (this._chunks.length === 0) {
          return void 0;
        }
        let state = 0;
        let chunkIndex = 0;
        let offset = 0;
        let chunkBytesRead = 0;
        row:
          while (chunkIndex < this._chunks.length) {
            const chunk = this._chunks[chunkIndex];
            offset = 0;
            column:
              while (offset < chunk.length) {
                const value = chunk[offset];
                switch (value) {
                  case CR:
                    switch (state) {
                      case 0:
                        state = 1;
                        break;
                      case 2:
                        state = 3;
                        break;
                      default:
                        state = 0;
                    }
                    break;
                  case LF:
                    switch (state) {
                      case 1:
                        state = 2;
                        break;
                      case 3:
                        state = 4;
                        offset++;
                        break row;
                      default:
                        state = 0;
                    }
                    break;
                  default:
                    state = 0;
                }
                offset++;
              }
            chunkBytesRead += chunk.byteLength;
            chunkIndex++;
          }
        if (state !== 4) {
          return void 0;
        }
        const buffer = this._read(chunkBytesRead + offset);
        const result = /* @__PURE__ */ new Map();
        const headers = this.toString(buffer, "ascii").split(CRLF);
        if (headers.length < 2) {
          return result;
        }
        for (let i = 0; i < headers.length - 2; i++) {
          const header = headers[i];
          const index = header.indexOf(":");
          if (index === -1) {
            throw new Error(`Message header must separate key and value using ':'
${header}`);
          }
          const key = header.substr(0, index);
          const value = header.substr(index + 1).trim();
          result.set(lowerCaseKeys ? key.toLowerCase() : key, value);
        }
        return result;
      }
      tryReadBody(length) {
        if (this._totalLength < length) {
          return void 0;
        }
        return this._read(length);
      }
      get numberOfBytes() {
        return this._totalLength;
      }
      _read(byteCount) {
        if (byteCount === 0) {
          return this.emptyBuffer();
        }
        if (byteCount > this._totalLength) {
          throw new Error(`Cannot read so many bytes!`);
        }
        if (this._chunks[0].byteLength === byteCount) {
          const chunk = this._chunks[0];
          this._chunks.shift();
          this._totalLength -= byteCount;
          return this.asNative(chunk);
        }
        if (this._chunks[0].byteLength > byteCount) {
          const chunk = this._chunks[0];
          const result2 = this.asNative(chunk, byteCount);
          this._chunks[0] = chunk.slice(byteCount);
          this._totalLength -= byteCount;
          return result2;
        }
        const result = this.allocNative(byteCount);
        let resultOffset = 0;
        let chunkIndex = 0;
        while (byteCount > 0) {
          const chunk = this._chunks[chunkIndex];
          if (chunk.byteLength > byteCount) {
            const chunkPart = chunk.slice(0, byteCount);
            result.set(chunkPart, resultOffset);
            resultOffset += byteCount;
            this._chunks[chunkIndex] = chunk.slice(byteCount);
            this._totalLength -= byteCount;
            byteCount -= byteCount;
          } else {
            result.set(chunk, resultOffset);
            resultOffset += chunk.byteLength;
            this._chunks.shift();
            this._totalLength -= chunk.byteLength;
            byteCount -= chunk.byteLength;
          }
        }
        return result;
      }
    };
    exports2.AbstractMessageBuffer = AbstractMessageBuffer;
  }
});

// node_modules/vscode-jsonrpc/lib/common/connection.js
var require_connection = __commonJS({
  "node_modules/vscode-jsonrpc/lib/common/connection.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createMessageConnection = exports2.ConnectionOptions = exports2.MessageStrategy = exports2.CancellationStrategy = exports2.CancellationSenderStrategy = exports2.CancellationReceiverStrategy = exports2.RequestCancellationReceiverStrategy = exports2.IdCancellationReceiverStrategy = exports2.ConnectionStrategy = exports2.ConnectionError = exports2.ConnectionErrors = exports2.LogTraceNotification = exports2.SetTraceNotification = exports2.TraceFormat = exports2.TraceValues = exports2.Trace = exports2.NullLogger = exports2.ProgressType = exports2.ProgressToken = void 0;
    var ral_1 = require_ral();
    var Is = require_is2();
    var messages_1 = require_messages();
    var linkedMap_1 = require_linkedMap();
    var events_1 = require_events();
    var cancellation_1 = require_cancellation();
    var CancelNotification;
    (function(CancelNotification2) {
      CancelNotification2.type = new messages_1.NotificationType("$/cancelRequest");
    })(CancelNotification || (CancelNotification = {}));
    var ProgressToken;
    (function(ProgressToken2) {
      function is(value) {
        return typeof value === "string" || typeof value === "number";
      }
      ProgressToken2.is = is;
    })(ProgressToken || (exports2.ProgressToken = ProgressToken = {}));
    var ProgressNotification;
    (function(ProgressNotification2) {
      ProgressNotification2.type = new messages_1.NotificationType("$/progress");
    })(ProgressNotification || (ProgressNotification = {}));
    var ProgressType = class {
      constructor() {
      }
    };
    exports2.ProgressType = ProgressType;
    var StarRequestHandler;
    (function(StarRequestHandler2) {
      function is(value) {
        return Is.func(value);
      }
      StarRequestHandler2.is = is;
    })(StarRequestHandler || (StarRequestHandler = {}));
    exports2.NullLogger = Object.freeze({
      error: () => {
      },
      warn: () => {
      },
      info: () => {
      },
      log: () => {
      }
    });
    var Trace;
    (function(Trace2) {
      Trace2[Trace2["Off"] = 0] = "Off";
      Trace2[Trace2["Messages"] = 1] = "Messages";
      Trace2[Trace2["Compact"] = 2] = "Compact";
      Trace2[Trace2["Verbose"] = 3] = "Verbose";
    })(Trace || (exports2.Trace = Trace = {}));
    var TraceValues;
    (function(TraceValues2) {
      TraceValues2.Off = "off";
      TraceValues2.Messages = "messages";
      TraceValues2.Compact = "compact";
      TraceValues2.Verbose = "verbose";
    })(TraceValues || (exports2.TraceValues = TraceValues = {}));
    (function(Trace2) {
      function fromString(value) {
        if (!Is.string(value)) {
          return Trace2.Off;
        }
        value = value.toLowerCase();
        switch (value) {
          case "off":
            return Trace2.Off;
          case "messages":
            return Trace2.Messages;
          case "compact":
            return Trace2.Compact;
          case "verbose":
            return Trace2.Verbose;
          default:
            return Trace2.Off;
        }
      }
      Trace2.fromString = fromString;
      function toString(value) {
        switch (value) {
          case Trace2.Off:
            return "off";
          case Trace2.Messages:
            return "messages";
          case Trace2.Compact:
            return "compact";
          case Trace2.Verbose:
            return "verbose";
          default:
            return "off";
        }
      }
      Trace2.toString = toString;
    })(Trace || (exports2.Trace = Trace = {}));
    var TraceFormat;
    (function(TraceFormat2) {
      TraceFormat2["Text"] = "text";
      TraceFormat2["JSON"] = "json";
    })(TraceFormat || (exports2.TraceFormat = TraceFormat = {}));
    (function(TraceFormat2) {
      function fromString(value) {
        if (!Is.string(value)) {
          return TraceFormat2.Text;
        }
        value = value.toLowerCase();
        if (value === "json") {
          return TraceFormat2.JSON;
        } else {
          return TraceFormat2.Text;
        }
      }
      TraceFormat2.fromString = fromString;
    })(TraceFormat || (exports2.TraceFormat = TraceFormat = {}));
    var SetTraceNotification;
    (function(SetTraceNotification2) {
      SetTraceNotification2.type = new messages_1.NotificationType("$/setTrace");
    })(SetTraceNotification || (exports2.SetTraceNotification = SetTraceNotification = {}));
    var LogTraceNotification;
    (function(LogTraceNotification2) {
      LogTraceNotification2.type = new messages_1.NotificationType("$/logTrace");
    })(LogTraceNotification || (exports2.LogTraceNotification = LogTraceNotification = {}));
    var ConnectionErrors;
    (function(ConnectionErrors2) {
      ConnectionErrors2[ConnectionErrors2["Closed"] = 1] = "Closed";
      ConnectionErrors2[ConnectionErrors2["Disposed"] = 2] = "Disposed";
      ConnectionErrors2[ConnectionErrors2["AlreadyListening"] = 3] = "AlreadyListening";
    })(ConnectionErrors || (exports2.ConnectionErrors = ConnectionErrors = {}));
    var ConnectionError = class extends Error {
      constructor(code, message) {
        super(message);
        this.code = code;
        Object.setPrototypeOf(this, ConnectionError.prototype);
      }
    };
    exports2.ConnectionError = ConnectionError;
    var ConnectionStrategy;
    (function(ConnectionStrategy2) {
      function is(value) {
        const candidate = value;
        return candidate && Is.func(candidate.cancelUndispatched);
      }
      ConnectionStrategy2.is = is;
    })(ConnectionStrategy || (exports2.ConnectionStrategy = ConnectionStrategy = {}));
    var IdCancellationReceiverStrategy;
    (function(IdCancellationReceiverStrategy2) {
      function is(value) {
        const candidate = value;
        return candidate && (candidate.kind === void 0 || candidate.kind === "id") && Is.func(candidate.createCancellationTokenSource) && (candidate.dispose === void 0 || Is.func(candidate.dispose));
      }
      IdCancellationReceiverStrategy2.is = is;
    })(IdCancellationReceiverStrategy || (exports2.IdCancellationReceiverStrategy = IdCancellationReceiverStrategy = {}));
    var RequestCancellationReceiverStrategy;
    (function(RequestCancellationReceiverStrategy2) {
      function is(value) {
        const candidate = value;
        return candidate && candidate.kind === "request" && Is.func(candidate.createCancellationTokenSource) && (candidate.dispose === void 0 || Is.func(candidate.dispose));
      }
      RequestCancellationReceiverStrategy2.is = is;
    })(RequestCancellationReceiverStrategy || (exports2.RequestCancellationReceiverStrategy = RequestCancellationReceiverStrategy = {}));
    var CancellationReceiverStrategy;
    (function(CancellationReceiverStrategy2) {
      CancellationReceiverStrategy2.Message = Object.freeze({
        createCancellationTokenSource(_) {
          return new cancellation_1.CancellationTokenSource();
        }
      });
      function is(value) {
        return IdCancellationReceiverStrategy.is(value) || RequestCancellationReceiverStrategy.is(value);
      }
      CancellationReceiverStrategy2.is = is;
    })(CancellationReceiverStrategy || (exports2.CancellationReceiverStrategy = CancellationReceiverStrategy = {}));
    var CancellationSenderStrategy;
    (function(CancellationSenderStrategy2) {
      CancellationSenderStrategy2.Message = Object.freeze({
        sendCancellation(conn, id) {
          return conn.sendNotification(CancelNotification.type, { id });
        },
        cleanup(_) {
        }
      });
      function is(value) {
        const candidate = value;
        return candidate && Is.func(candidate.sendCancellation) && Is.func(candidate.cleanup);
      }
      CancellationSenderStrategy2.is = is;
    })(CancellationSenderStrategy || (exports2.CancellationSenderStrategy = CancellationSenderStrategy = {}));
    var CancellationStrategy;
    (function(CancellationStrategy2) {
      CancellationStrategy2.Message = Object.freeze({
        receiver: CancellationReceiverStrategy.Message,
        sender: CancellationSenderStrategy.Message
      });
      function is(value) {
        const candidate = value;
        return candidate && CancellationReceiverStrategy.is(candidate.receiver) && CancellationSenderStrategy.is(candidate.sender);
      }
      CancellationStrategy2.is = is;
    })(CancellationStrategy || (exports2.CancellationStrategy = CancellationStrategy = {}));
    var MessageStrategy;
    (function(MessageStrategy2) {
      function is(value) {
        const candidate = value;
        return candidate && Is.func(candidate.handleMessage);
      }
      MessageStrategy2.is = is;
    })(MessageStrategy || (exports2.MessageStrategy = MessageStrategy = {}));
    var ConnectionOptions;
    (function(ConnectionOptions2) {
      function is(value) {
        const candidate = value;
        return candidate && (CancellationStrategy.is(candidate.cancellationStrategy) || ConnectionStrategy.is(candidate.connectionStrategy) || MessageStrategy.is(candidate.messageStrategy));
      }
      ConnectionOptions2.is = is;
    })(ConnectionOptions || (exports2.ConnectionOptions = ConnectionOptions = {}));
    var ConnectionState;
    (function(ConnectionState2) {
      ConnectionState2[ConnectionState2["New"] = 1] = "New";
      ConnectionState2[ConnectionState2["Listening"] = 2] = "Listening";
      ConnectionState2[ConnectionState2["Closed"] = 3] = "Closed";
      ConnectionState2[ConnectionState2["Disposed"] = 4] = "Disposed";
    })(ConnectionState || (ConnectionState = {}));
    function createMessageConnection(messageReader, messageWriter, _logger, options) {
      const logger = _logger !== void 0 ? _logger : exports2.NullLogger;
      let sequenceNumber = 0;
      let notificationSequenceNumber = 0;
      let unknownResponseSequenceNumber = 0;
      const version = "2.0";
      let starRequestHandler = void 0;
      const requestHandlers = /* @__PURE__ */ new Map();
      let starNotificationHandler = void 0;
      const notificationHandlers = /* @__PURE__ */ new Map();
      const progressHandlers = /* @__PURE__ */ new Map();
      let timer;
      let messageQueue = new linkedMap_1.LinkedMap();
      let responsePromises = /* @__PURE__ */ new Map();
      let knownCanceledRequests = /* @__PURE__ */ new Set();
      let requestTokens = /* @__PURE__ */ new Map();
      let trace = Trace.Off;
      let traceFormat = TraceFormat.Text;
      let tracer;
      let state = ConnectionState.New;
      const errorEmitter = new events_1.Emitter();
      const closeEmitter = new events_1.Emitter();
      const unhandledNotificationEmitter = new events_1.Emitter();
      const unhandledProgressEmitter = new events_1.Emitter();
      const disposeEmitter = new events_1.Emitter();
      const cancellationStrategy = options && options.cancellationStrategy ? options.cancellationStrategy : CancellationStrategy.Message;
      function createRequestQueueKey(id) {
        if (id === null) {
          throw new Error(`Can't send requests with id null since the response can't be correlated.`);
        }
        return "req-" + id.toString();
      }
      function createResponseQueueKey(id) {
        if (id === null) {
          return "res-unknown-" + (++unknownResponseSequenceNumber).toString();
        } else {
          return "res-" + id.toString();
        }
      }
      function createNotificationQueueKey() {
        return "not-" + (++notificationSequenceNumber).toString();
      }
      function addMessageToQueue(queue, message) {
        if (messages_1.Message.isRequest(message)) {
          queue.set(createRequestQueueKey(message.id), message);
        } else if (messages_1.Message.isResponse(message)) {
          queue.set(createResponseQueueKey(message.id), message);
        } else {
          queue.set(createNotificationQueueKey(), message);
        }
      }
      function cancelUndispatched(_message) {
        return void 0;
      }
      function isListening() {
        return state === ConnectionState.Listening;
      }
      function isClosed() {
        return state === ConnectionState.Closed;
      }
      function isDisposed() {
        return state === ConnectionState.Disposed;
      }
      function closeHandler() {
        if (state === ConnectionState.New || state === ConnectionState.Listening) {
          state = ConnectionState.Closed;
          closeEmitter.fire(void 0);
        }
      }
      function readErrorHandler(error) {
        errorEmitter.fire([error, void 0, void 0]);
      }
      function writeErrorHandler(data) {
        errorEmitter.fire(data);
      }
      messageReader.onClose(closeHandler);
      messageReader.onError(readErrorHandler);
      messageWriter.onClose(closeHandler);
      messageWriter.onError(writeErrorHandler);
      function triggerMessageQueue() {
        if (timer || messageQueue.size === 0) {
          return;
        }
        timer = (0, ral_1.default)().timer.setImmediate(() => {
          timer = void 0;
          processMessageQueue();
        });
      }
      function handleMessage(message) {
        if (messages_1.Message.isRequest(message)) {
          handleRequest(message);
        } else if (messages_1.Message.isNotification(message)) {
          handleNotification(message);
        } else if (messages_1.Message.isResponse(message)) {
          handleResponse(message);
        } else {
          handleInvalidMessage(message);
        }
      }
      function processMessageQueue() {
        if (messageQueue.size === 0) {
          return;
        }
        const message = messageQueue.shift();
        try {
          const messageStrategy = options == null ? void 0 : options.messageStrategy;
          if (MessageStrategy.is(messageStrategy)) {
            messageStrategy.handleMessage(message, handleMessage);
          } else {
            handleMessage(message);
          }
        } finally {
          triggerMessageQueue();
        }
      }
      const callback = (message) => {
        try {
          if (messages_1.Message.isNotification(message) && message.method === CancelNotification.type.method) {
            const cancelId = message.params.id;
            const key = createRequestQueueKey(cancelId);
            const toCancel = messageQueue.get(key);
            if (messages_1.Message.isRequest(toCancel)) {
              const strategy = options == null ? void 0 : options.connectionStrategy;
              const response = strategy && strategy.cancelUndispatched ? strategy.cancelUndispatched(toCancel, cancelUndispatched) : cancelUndispatched(toCancel);
              if (response && (response.error !== void 0 || response.result !== void 0)) {
                messageQueue.delete(key);
                requestTokens.delete(cancelId);
                response.id = toCancel.id;
                traceSendingResponse(response, message.method, Date.now());
                messageWriter.write(response).catch(() => logger.error(`Sending response for canceled message failed.`));
                return;
              }
            }
            const cancellationToken = requestTokens.get(cancelId);
            if (cancellationToken !== void 0) {
              cancellationToken.cancel();
              traceReceivedNotification(message);
              return;
            } else {
              knownCanceledRequests.add(cancelId);
            }
          }
          addMessageToQueue(messageQueue, message);
        } finally {
          triggerMessageQueue();
        }
      };
      function handleRequest(requestMessage) {
        if (isDisposed()) {
          return;
        }
        function reply(resultOrError, method, startTime2) {
          const message = {
            jsonrpc: version,
            id: requestMessage.id
          };
          if (resultOrError instanceof messages_1.ResponseError) {
            message.error = resultOrError.toJson();
          } else {
            message.result = resultOrError === void 0 ? null : resultOrError;
          }
          traceSendingResponse(message, method, startTime2);
          messageWriter.write(message).catch(() => logger.error(`Sending response failed.`));
        }
        function replyError(error, method, startTime2) {
          const message = {
            jsonrpc: version,
            id: requestMessage.id,
            error: error.toJson()
          };
          traceSendingResponse(message, method, startTime2);
          messageWriter.write(message).catch(() => logger.error(`Sending response failed.`));
        }
        function replySuccess(result, method, startTime2) {
          if (result === void 0) {
            result = null;
          }
          const message = {
            jsonrpc: version,
            id: requestMessage.id,
            result
          };
          traceSendingResponse(message, method, startTime2);
          messageWriter.write(message).catch(() => logger.error(`Sending response failed.`));
        }
        traceReceivedRequest(requestMessage);
        const element = requestHandlers.get(requestMessage.method);
        let type;
        let requestHandler;
        if (element) {
          type = element.type;
          requestHandler = element.handler;
        }
        const startTime = Date.now();
        if (requestHandler || starRequestHandler) {
          const tokenKey = requestMessage.id ?? String(Date.now());
          const cancellationSource = IdCancellationReceiverStrategy.is(cancellationStrategy.receiver) ? cancellationStrategy.receiver.createCancellationTokenSource(tokenKey) : cancellationStrategy.receiver.createCancellationTokenSource(requestMessage);
          if (requestMessage.id !== null && knownCanceledRequests.has(requestMessage.id)) {
            cancellationSource.cancel();
          }
          if (requestMessage.id !== null) {
            requestTokens.set(tokenKey, cancellationSource);
          }
          try {
            let handlerResult;
            if (requestHandler) {
              if (requestMessage.params === void 0) {
                if (type !== void 0 && type.numberOfParams !== 0) {
                  replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InvalidParams, `Request ${requestMessage.method} defines ${type.numberOfParams} params but received none.`), requestMessage.method, startTime);
                  return;
                }
                handlerResult = requestHandler(cancellationSource.token);
              } else if (Array.isArray(requestMessage.params)) {
                if (type !== void 0 && type.parameterStructures === messages_1.ParameterStructures.byName) {
                  replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InvalidParams, `Request ${requestMessage.method} defines parameters by name but received parameters by position`), requestMessage.method, startTime);
                  return;
                }
                handlerResult = requestHandler(...requestMessage.params, cancellationSource.token);
              } else {
                if (type !== void 0 && type.parameterStructures === messages_1.ParameterStructures.byPosition) {
                  replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InvalidParams, `Request ${requestMessage.method} defines parameters by position but received parameters by name`), requestMessage.method, startTime);
                  return;
                }
                handlerResult = requestHandler(requestMessage.params, cancellationSource.token);
              }
            } else if (starRequestHandler) {
              handlerResult = starRequestHandler(requestMessage.method, requestMessage.params, cancellationSource.token);
            }
            const promise = handlerResult;
            if (!handlerResult) {
              requestTokens.delete(tokenKey);
              replySuccess(handlerResult, requestMessage.method, startTime);
            } else if (promise.then) {
              promise.then((resultOrError) => {
                requestTokens.delete(tokenKey);
                reply(resultOrError, requestMessage.method, startTime);
              }, (error) => {
                requestTokens.delete(tokenKey);
                if (error instanceof messages_1.ResponseError) {
                  replyError(error, requestMessage.method, startTime);
                } else if (error && Is.string(error.message)) {
                  replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, `Request ${requestMessage.method} failed with message: ${error.message}`), requestMessage.method, startTime);
                } else {
                  replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, `Request ${requestMessage.method} failed unexpectedly without providing any details.`), requestMessage.method, startTime);
                }
              });
            } else {
              requestTokens.delete(tokenKey);
              reply(handlerResult, requestMessage.method, startTime);
            }
          } catch (error) {
            requestTokens.delete(tokenKey);
            if (error instanceof messages_1.ResponseError) {
              reply(error, requestMessage.method, startTime);
            } else if (error && Is.string(error.message)) {
              replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, `Request ${requestMessage.method} failed with message: ${error.message}`), requestMessage.method, startTime);
            } else {
              replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, `Request ${requestMessage.method} failed unexpectedly without providing any details.`), requestMessage.method, startTime);
            }
          }
        } else {
          replyError(new messages_1.ResponseError(messages_1.ErrorCodes.MethodNotFound, `Unhandled method ${requestMessage.method}`), requestMessage.method, startTime);
        }
      }
      function handleResponse(responseMessage) {
        if (isDisposed()) {
          return;
        }
        if (responseMessage.id === null) {
          if (responseMessage.error) {
            logger.error(`Received response message without id: Error is: 
${JSON.stringify(responseMessage.error, void 0, 4)}`);
          } else {
            logger.error(`Received response message without id. No further error information provided.`);
          }
        } else {
          const key = responseMessage.id;
          const responsePromise = responsePromises.get(key);
          traceReceivedResponse(responseMessage, responsePromise);
          if (responsePromise !== void 0) {
            responsePromises.delete(key);
            try {
              if (responseMessage.error) {
                const error = responseMessage.error;
                responsePromise.reject(new messages_1.ResponseError(error.code, error.message, error.data));
              } else if (responseMessage.result !== void 0) {
                responsePromise.resolve(responseMessage.result);
              } else {
                throw new Error("Should never happen.");
              }
            } catch (error) {
              if (error.message) {
                logger.error(`Response handler '${responsePromise.method}' failed with message: ${error.message}`);
              } else {
                logger.error(`Response handler '${responsePromise.method}' failed unexpectedly.`);
              }
            }
          }
        }
      }
      function handleNotification(message) {
        if (isDisposed()) {
          return;
        }
        let type = void 0;
        let notificationHandler;
        if (message.method === CancelNotification.type.method) {
          const cancelId = message.params.id;
          knownCanceledRequests.delete(cancelId);
          traceReceivedNotification(message);
          return;
        } else {
          const element = notificationHandlers.get(message.method);
          if (element) {
            notificationHandler = element.handler;
            type = element.type;
          }
        }
        if (notificationHandler || starNotificationHandler) {
          try {
            traceReceivedNotification(message);
            if (notificationHandler) {
              if (message.params === void 0) {
                if (type !== void 0) {
                  if (type.numberOfParams !== 0 && type.parameterStructures !== messages_1.ParameterStructures.byName) {
                    logger.error(`Notification ${message.method} defines ${type.numberOfParams} params but received none.`);
                  }
                }
                notificationHandler();
              } else if (Array.isArray(message.params)) {
                const params = message.params;
                if (message.method === ProgressNotification.type.method && params.length === 2 && ProgressToken.is(params[0])) {
                  notificationHandler({ token: params[0], value: params[1] });
                } else {
                  if (type !== void 0) {
                    if (type.parameterStructures === messages_1.ParameterStructures.byName) {
                      logger.error(`Notification ${message.method} defines parameters by name but received parameters by position`);
                    }
                    if (type.numberOfParams !== message.params.length) {
                      logger.error(`Notification ${message.method} defines ${type.numberOfParams} params but received ${params.length} arguments`);
                    }
                  }
                  notificationHandler(...params);
                }
              } else {
                if (type !== void 0 && type.parameterStructures === messages_1.ParameterStructures.byPosition) {
                  logger.error(`Notification ${message.method} defines parameters by position but received parameters by name`);
                }
                notificationHandler(message.params);
              }
            } else if (starNotificationHandler) {
              starNotificationHandler(message.method, message.params);
            }
          } catch (error) {
            if (error.message) {
              logger.error(`Notification handler '${message.method}' failed with message: ${error.message}`);
            } else {
              logger.error(`Notification handler '${message.method}' failed unexpectedly.`);
            }
          }
        } else {
          unhandledNotificationEmitter.fire(message);
        }
      }
      function handleInvalidMessage(message) {
        if (!message) {
          logger.error("Received empty message.");
          return;
        }
        logger.error(`Received message which is neither a response nor a notification message:
${JSON.stringify(message, null, 4)}`);
        const responseMessage = message;
        if (Is.string(responseMessage.id) || Is.number(responseMessage.id)) {
          const key = responseMessage.id;
          const responseHandler = responsePromises.get(key);
          if (responseHandler) {
            responseHandler.reject(new Error("The received response has neither a result nor an error property."));
          }
        }
      }
      function stringifyTrace(params) {
        if (params === void 0 || params === null) {
          return void 0;
        }
        switch (trace) {
          case Trace.Verbose:
            return JSON.stringify(params, null, 4);
          case Trace.Compact:
            return JSON.stringify(params);
          default:
            return void 0;
        }
      }
      function traceSendingRequest(message) {
        if (trace === Trace.Off || !tracer) {
          return;
        }
        if (traceFormat === TraceFormat.Text) {
          let data = void 0;
          if ((trace === Trace.Verbose || trace === Trace.Compact) && message.params) {
            data = `Params: ${stringifyTrace(message.params)}

`;
          }
          tracer.log(`Sending request '${message.method} - (${message.id})'.`, data);
        } else {
          logLSPMessage("send-request", message);
        }
      }
      function traceSendingNotification(message) {
        if (trace === Trace.Off || !tracer) {
          return;
        }
        if (traceFormat === TraceFormat.Text) {
          let data = void 0;
          if (trace === Trace.Verbose || trace === Trace.Compact) {
            if (message.params) {
              data = `Params: ${stringifyTrace(message.params)}

`;
            } else {
              data = "No parameters provided.\n\n";
            }
          }
          tracer.log(`Sending notification '${message.method}'.`, data);
        } else {
          logLSPMessage("send-notification", message);
        }
      }
      function traceSendingResponse(message, method, startTime) {
        if (trace === Trace.Off || !tracer) {
          return;
        }
        if (traceFormat === TraceFormat.Text) {
          let data = void 0;
          if (trace === Trace.Verbose || trace === Trace.Compact) {
            if (message.error && message.error.data) {
              data = `Error data: ${stringifyTrace(message.error.data)}

`;
            } else {
              if (message.result) {
                data = `Result: ${stringifyTrace(message.result)}

`;
              } else if (message.error === void 0) {
                data = "No result returned.\n\n";
              }
            }
          }
          tracer.log(`Sending response '${method} - (${message.id})'. Processing request took ${Date.now() - startTime}ms`, data);
        } else {
          logLSPMessage("send-response", message);
        }
      }
      function traceReceivedRequest(message) {
        if (trace === Trace.Off || !tracer) {
          return;
        }
        if (traceFormat === TraceFormat.Text) {
          let data = void 0;
          if ((trace === Trace.Verbose || trace === Trace.Compact) && message.params) {
            data = `Params: ${stringifyTrace(message.params)}

`;
          }
          tracer.log(`Received request '${message.method} - (${message.id})'.`, data);
        } else {
          logLSPMessage("receive-request", message);
        }
      }
      function traceReceivedNotification(message) {
        if (trace === Trace.Off || !tracer || message.method === LogTraceNotification.type.method) {
          return;
        }
        if (traceFormat === TraceFormat.Text) {
          let data = void 0;
          if (trace === Trace.Verbose || trace === Trace.Compact) {
            if (message.params) {
              data = `Params: ${stringifyTrace(message.params)}

`;
            } else {
              data = "No parameters provided.\n\n";
            }
          }
          tracer.log(`Received notification '${message.method}'.`, data);
        } else {
          logLSPMessage("receive-notification", message);
        }
      }
      function traceReceivedResponse(message, responsePromise) {
        if (trace === Trace.Off || !tracer) {
          return;
        }
        if (traceFormat === TraceFormat.Text) {
          let data = void 0;
          if (trace === Trace.Verbose || trace === Trace.Compact) {
            if (message.error && message.error.data) {
              data = `Error data: ${stringifyTrace(message.error.data)}

`;
            } else {
              if (message.result) {
                data = `Result: ${stringifyTrace(message.result)}

`;
              } else if (message.error === void 0) {
                data = "No result returned.\n\n";
              }
            }
          }
          if (responsePromise) {
            const error = message.error ? ` Request failed: ${message.error.message} (${message.error.code}).` : "";
            tracer.log(`Received response '${responsePromise.method} - (${message.id})' in ${Date.now() - responsePromise.timerStart}ms.${error}`, data);
          } else {
            tracer.log(`Received response ${message.id} without active response promise.`, data);
          }
        } else {
          logLSPMessage("receive-response", message);
        }
      }
      function logLSPMessage(type, message) {
        if (!tracer || trace === Trace.Off) {
          return;
        }
        const lspMessage = {
          isLSPMessage: true,
          type,
          message,
          timestamp: Date.now()
        };
        tracer.log(lspMessage);
      }
      function throwIfClosedOrDisposed() {
        if (isClosed()) {
          throw new ConnectionError(ConnectionErrors.Closed, "Connection is closed.");
        }
        if (isDisposed()) {
          throw new ConnectionError(ConnectionErrors.Disposed, "Connection is disposed.");
        }
      }
      function throwIfListening() {
        if (isListening()) {
          throw new ConnectionError(ConnectionErrors.AlreadyListening, "Connection is already listening");
        }
      }
      function throwIfNotListening() {
        if (!isListening()) {
          throw new Error("Call listen() first.");
        }
      }
      function undefinedToNull(param) {
        if (param === void 0) {
          return null;
        } else {
          return param;
        }
      }
      function nullToUndefined(param) {
        if (param === null) {
          return void 0;
        } else {
          return param;
        }
      }
      function isNamedParam(param) {
        return param !== void 0 && param !== null && !Array.isArray(param) && typeof param === "object";
      }
      function computeSingleParam(parameterStructures, param) {
        switch (parameterStructures) {
          case messages_1.ParameterStructures.auto:
            if (isNamedParam(param)) {
              return nullToUndefined(param);
            } else {
              return [undefinedToNull(param)];
            }
          case messages_1.ParameterStructures.byName:
            if (!isNamedParam(param)) {
              throw new Error(`Received parameters by name but param is not an object literal.`);
            }
            return nullToUndefined(param);
          case messages_1.ParameterStructures.byPosition:
            return [undefinedToNull(param)];
          default:
            throw new Error(`Unknown parameter structure ${parameterStructures.toString()}`);
        }
      }
      function computeMessageParams(type, params) {
        let result;
        const numberOfParams = type.numberOfParams;
        switch (numberOfParams) {
          case 0:
            result = void 0;
            break;
          case 1:
            result = computeSingleParam(type.parameterStructures, params[0]);
            break;
          default:
            result = [];
            for (let i = 0; i < params.length && i < numberOfParams; i++) {
              result.push(undefinedToNull(params[i]));
            }
            if (params.length < numberOfParams) {
              for (let i = params.length; i < numberOfParams; i++) {
                result.push(null);
              }
            }
            break;
        }
        return result;
      }
      const connection2 = {
        sendNotification: (type, ...args) => {
          throwIfClosedOrDisposed();
          let method;
          let messageParams;
          if (Is.string(type)) {
            method = type;
            const first = args[0];
            let paramStart = 0;
            let parameterStructures = messages_1.ParameterStructures.auto;
            if (messages_1.ParameterStructures.is(first)) {
              paramStart = 1;
              parameterStructures = first;
            }
            let paramEnd = args.length;
            const numberOfParams = paramEnd - paramStart;
            switch (numberOfParams) {
              case 0:
                messageParams = void 0;
                break;
              case 1:
                messageParams = computeSingleParam(parameterStructures, args[paramStart]);
                break;
              default:
                if (parameterStructures === messages_1.ParameterStructures.byName) {
                  throw new Error(`Received ${numberOfParams} parameters for 'by Name' notification parameter structure.`);
                }
                messageParams = args.slice(paramStart, paramEnd).map((value) => undefinedToNull(value));
                break;
            }
          } else {
            const params = args;
            method = type.method;
            messageParams = computeMessageParams(type, params);
          }
          const notificationMessage = {
            jsonrpc: version,
            method,
            params: messageParams
          };
          traceSendingNotification(notificationMessage);
          return messageWriter.write(notificationMessage).catch((error) => {
            logger.error(`Sending notification failed.`);
            throw error;
          });
        },
        onNotification: (type, handler) => {
          throwIfClosedOrDisposed();
          let method;
          if (Is.func(type)) {
            starNotificationHandler = type;
          } else if (handler) {
            if (Is.string(type)) {
              method = type;
              notificationHandlers.set(type, { type: void 0, handler });
            } else {
              method = type.method;
              notificationHandlers.set(type.method, { type, handler });
            }
          }
          return {
            dispose: () => {
              if (method !== void 0) {
                notificationHandlers.delete(method);
              } else {
                starNotificationHandler = void 0;
              }
            }
          };
        },
        onProgress: (_type, token, handler) => {
          if (progressHandlers.has(token)) {
            throw new Error(`Progress handler for token ${token} already registered`);
          }
          progressHandlers.set(token, handler);
          return {
            dispose: () => {
              progressHandlers.delete(token);
            }
          };
        },
        sendProgress: (_type, token, value) => {
          return connection2.sendNotification(ProgressNotification.type, { token, value });
        },
        onUnhandledProgress: unhandledProgressEmitter.event,
        sendRequest: (type, ...args) => {
          throwIfClosedOrDisposed();
          throwIfNotListening();
          let method;
          let messageParams;
          let token = void 0;
          if (Is.string(type)) {
            method = type;
            const first = args[0];
            const last = args[args.length - 1];
            let paramStart = 0;
            let parameterStructures = messages_1.ParameterStructures.auto;
            if (messages_1.ParameterStructures.is(first)) {
              paramStart = 1;
              parameterStructures = first;
            }
            let paramEnd = args.length;
            if (cancellation_1.CancellationToken.is(last)) {
              paramEnd = paramEnd - 1;
              token = last;
            }
            const numberOfParams = paramEnd - paramStart;
            switch (numberOfParams) {
              case 0:
                messageParams = void 0;
                break;
              case 1:
                messageParams = computeSingleParam(parameterStructures, args[paramStart]);
                break;
              default:
                if (parameterStructures === messages_1.ParameterStructures.byName) {
                  throw new Error(`Received ${numberOfParams} parameters for 'by Name' request parameter structure.`);
                }
                messageParams = args.slice(paramStart, paramEnd).map((value) => undefinedToNull(value));
                break;
            }
          } else {
            const params = args;
            method = type.method;
            messageParams = computeMessageParams(type, params);
            const numberOfParams = type.numberOfParams;
            token = cancellation_1.CancellationToken.is(params[numberOfParams]) ? params[numberOfParams] : void 0;
          }
          const id = sequenceNumber++;
          let disposable;
          if (token) {
            disposable = token.onCancellationRequested(() => {
              const p = cancellationStrategy.sender.sendCancellation(connection2, id);
              if (p === void 0) {
                logger.log(`Received no promise from cancellation strategy when cancelling id ${id}`);
                return Promise.resolve();
              } else {
                return p.catch(() => {
                  logger.log(`Sending cancellation messages for id ${id} failed`);
                });
              }
            });
          }
          const requestMessage = {
            jsonrpc: version,
            id,
            method,
            params: messageParams
          };
          traceSendingRequest(requestMessage);
          if (typeof cancellationStrategy.sender.enableCancellation === "function") {
            cancellationStrategy.sender.enableCancellation(requestMessage);
          }
          return new Promise(async (resolve, reject) => {
            const resolveWithCleanup = (r) => {
              resolve(r);
              cancellationStrategy.sender.cleanup(id);
              disposable == null ? void 0 : disposable.dispose();
            };
            const rejectWithCleanup = (r) => {
              reject(r);
              cancellationStrategy.sender.cleanup(id);
              disposable == null ? void 0 : disposable.dispose();
            };
            const responsePromise = { method, timerStart: Date.now(), resolve: resolveWithCleanup, reject: rejectWithCleanup };
            try {
              await messageWriter.write(requestMessage);
              responsePromises.set(id, responsePromise);
            } catch (error) {
              logger.error(`Sending request failed.`);
              responsePromise.reject(new messages_1.ResponseError(messages_1.ErrorCodes.MessageWriteError, error.message ? error.message : "Unknown reason"));
              throw error;
            }
          });
        },
        onRequest: (type, handler) => {
          throwIfClosedOrDisposed();
          let method = null;
          if (StarRequestHandler.is(type)) {
            method = void 0;
            starRequestHandler = type;
          } else if (Is.string(type)) {
            method = null;
            if (handler !== void 0) {
              method = type;
              requestHandlers.set(type, { handler, type: void 0 });
            }
          } else {
            if (handler !== void 0) {
              method = type.method;
              requestHandlers.set(type.method, { type, handler });
            }
          }
          return {
            dispose: () => {
              if (method === null) {
                return;
              }
              if (method !== void 0) {
                requestHandlers.delete(method);
              } else {
                starRequestHandler = void 0;
              }
            }
          };
        },
        hasPendingResponse: () => {
          return responsePromises.size > 0;
        },
        trace: async (_value, _tracer, sendNotificationOrTraceOptions) => {
          let _sendNotification = false;
          let _traceFormat = TraceFormat.Text;
          if (sendNotificationOrTraceOptions !== void 0) {
            if (Is.boolean(sendNotificationOrTraceOptions)) {
              _sendNotification = sendNotificationOrTraceOptions;
            } else {
              _sendNotification = sendNotificationOrTraceOptions.sendNotification || false;
              _traceFormat = sendNotificationOrTraceOptions.traceFormat || TraceFormat.Text;
            }
          }
          trace = _value;
          traceFormat = _traceFormat;
          if (trace === Trace.Off) {
            tracer = void 0;
          } else {
            tracer = _tracer;
          }
          if (_sendNotification && !isClosed() && !isDisposed()) {
            await connection2.sendNotification(SetTraceNotification.type, { value: Trace.toString(_value) });
          }
        },
        onError: errorEmitter.event,
        onClose: closeEmitter.event,
        onUnhandledNotification: unhandledNotificationEmitter.event,
        onDispose: disposeEmitter.event,
        end: () => {
          messageWriter.end();
        },
        dispose: () => {
          if (isDisposed()) {
            return;
          }
          state = ConnectionState.Disposed;
          disposeEmitter.fire(void 0);
          const error = new messages_1.ResponseError(messages_1.ErrorCodes.PendingResponseRejected, "Pending response rejected since connection got disposed");
          for (const promise of responsePromises.values()) {
            promise.reject(error);
          }
          responsePromises = /* @__PURE__ */ new Map();
          requestTokens = /* @__PURE__ */ new Map();
          knownCanceledRequests = /* @__PURE__ */ new Set();
          messageQueue = new linkedMap_1.LinkedMap();
          if (Is.func(messageWriter.dispose)) {
            messageWriter.dispose();
          }
          if (Is.func(messageReader.dispose)) {
            messageReader.dispose();
          }
        },
        listen: () => {
          throwIfClosedOrDisposed();
          throwIfListening();
          state = ConnectionState.Listening;
          messageReader.listen(callback);
        },
        inspect: () => {
          (0, ral_1.default)().console.log("inspect");
        }
      };
      connection2.onNotification(LogTraceNotification.type, (params) => {
        if (trace === Trace.Off || !tracer) {
          return;
        }
        const verbose = trace === Trace.Verbose || trace === Trace.Compact;
        tracer.log(params.message, verbose ? params.verbose : void 0);
      });
      connection2.onNotification(ProgressNotification.type, (params) => {
        const handler = progressHandlers.get(params.token);
        if (handler) {
          handler(params.value);
        } else {
          unhandledProgressEmitter.fire(params);
        }
      });
      return connection2;
    }
    exports2.createMessageConnection = createMessageConnection;
  }
});

// node_modules/vscode-jsonrpc/lib/common/api.js
var require_api = __commonJS({
  "node_modules/vscode-jsonrpc/lib/common/api.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ProgressType = exports2.ProgressToken = exports2.createMessageConnection = exports2.NullLogger = exports2.ConnectionOptions = exports2.ConnectionStrategy = exports2.AbstractMessageBuffer = exports2.WriteableStreamMessageWriter = exports2.AbstractMessageWriter = exports2.MessageWriter = exports2.ReadableStreamMessageReader = exports2.AbstractMessageReader = exports2.MessageReader = exports2.SharedArrayReceiverStrategy = exports2.SharedArraySenderStrategy = exports2.CancellationToken = exports2.CancellationTokenSource = exports2.Emitter = exports2.Event = exports2.Disposable = exports2.LRUCache = exports2.Touch = exports2.LinkedMap = exports2.ParameterStructures = exports2.NotificationType9 = exports2.NotificationType8 = exports2.NotificationType7 = exports2.NotificationType6 = exports2.NotificationType5 = exports2.NotificationType4 = exports2.NotificationType3 = exports2.NotificationType2 = exports2.NotificationType1 = exports2.NotificationType0 = exports2.NotificationType = exports2.ErrorCodes = exports2.ResponseError = exports2.RequestType9 = exports2.RequestType8 = exports2.RequestType7 = exports2.RequestType6 = exports2.RequestType5 = exports2.RequestType4 = exports2.RequestType3 = exports2.RequestType2 = exports2.RequestType1 = exports2.RequestType0 = exports2.RequestType = exports2.Message = exports2.RAL = void 0;
    exports2.MessageStrategy = exports2.CancellationStrategy = exports2.CancellationSenderStrategy = exports2.CancellationReceiverStrategy = exports2.ConnectionError = exports2.ConnectionErrors = exports2.LogTraceNotification = exports2.SetTraceNotification = exports2.TraceFormat = exports2.TraceValues = exports2.Trace = void 0;
    var messages_1 = require_messages();
    Object.defineProperty(exports2, "Message", { enumerable: true, get: function() {
      return messages_1.Message;
    } });
    Object.defineProperty(exports2, "RequestType", { enumerable: true, get: function() {
      return messages_1.RequestType;
    } });
    Object.defineProperty(exports2, "RequestType0", { enumerable: true, get: function() {
      return messages_1.RequestType0;
    } });
    Object.defineProperty(exports2, "RequestType1", { enumerable: true, get: function() {
      return messages_1.RequestType1;
    } });
    Object.defineProperty(exports2, "RequestType2", { enumerable: true, get: function() {
      return messages_1.RequestType2;
    } });
    Object.defineProperty(exports2, "RequestType3", { enumerable: true, get: function() {
      return messages_1.RequestType3;
    } });
    Object.defineProperty(exports2, "RequestType4", { enumerable: true, get: function() {
      return messages_1.RequestType4;
    } });
    Object.defineProperty(exports2, "RequestType5", { enumerable: true, get: function() {
      return messages_1.RequestType5;
    } });
    Object.defineProperty(exports2, "RequestType6", { enumerable: true, get: function() {
      return messages_1.RequestType6;
    } });
    Object.defineProperty(exports2, "RequestType7", { enumerable: true, get: function() {
      return messages_1.RequestType7;
    } });
    Object.defineProperty(exports2, "RequestType8", { enumerable: true, get: function() {
      return messages_1.RequestType8;
    } });
    Object.defineProperty(exports2, "RequestType9", { enumerable: true, get: function() {
      return messages_1.RequestType9;
    } });
    Object.defineProperty(exports2, "ResponseError", { enumerable: true, get: function() {
      return messages_1.ResponseError;
    } });
    Object.defineProperty(exports2, "ErrorCodes", { enumerable: true, get: function() {
      return messages_1.ErrorCodes;
    } });
    Object.defineProperty(exports2, "NotificationType", { enumerable: true, get: function() {
      return messages_1.NotificationType;
    } });
    Object.defineProperty(exports2, "NotificationType0", { enumerable: true, get: function() {
      return messages_1.NotificationType0;
    } });
    Object.defineProperty(exports2, "NotificationType1", { enumerable: true, get: function() {
      return messages_1.NotificationType1;
    } });
    Object.defineProperty(exports2, "NotificationType2", { enumerable: true, get: function() {
      return messages_1.NotificationType2;
    } });
    Object.defineProperty(exports2, "NotificationType3", { enumerable: true, get: function() {
      return messages_1.NotificationType3;
    } });
    Object.defineProperty(exports2, "NotificationType4", { enumerable: true, get: function() {
      return messages_1.NotificationType4;
    } });
    Object.defineProperty(exports2, "NotificationType5", { enumerable: true, get: function() {
      return messages_1.NotificationType5;
    } });
    Object.defineProperty(exports2, "NotificationType6", { enumerable: true, get: function() {
      return messages_1.NotificationType6;
    } });
    Object.defineProperty(exports2, "NotificationType7", { enumerable: true, get: function() {
      return messages_1.NotificationType7;
    } });
    Object.defineProperty(exports2, "NotificationType8", { enumerable: true, get: function() {
      return messages_1.NotificationType8;
    } });
    Object.defineProperty(exports2, "NotificationType9", { enumerable: true, get: function() {
      return messages_1.NotificationType9;
    } });
    Object.defineProperty(exports2, "ParameterStructures", { enumerable: true, get: function() {
      return messages_1.ParameterStructures;
    } });
    var linkedMap_1 = require_linkedMap();
    Object.defineProperty(exports2, "LinkedMap", { enumerable: true, get: function() {
      return linkedMap_1.LinkedMap;
    } });
    Object.defineProperty(exports2, "LRUCache", { enumerable: true, get: function() {
      return linkedMap_1.LRUCache;
    } });
    Object.defineProperty(exports2, "Touch", { enumerable: true, get: function() {
      return linkedMap_1.Touch;
    } });
    var disposable_1 = require_disposable();
    Object.defineProperty(exports2, "Disposable", { enumerable: true, get: function() {
      return disposable_1.Disposable;
    } });
    var events_1 = require_events();
    Object.defineProperty(exports2, "Event", { enumerable: true, get: function() {
      return events_1.Event;
    } });
    Object.defineProperty(exports2, "Emitter", { enumerable: true, get: function() {
      return events_1.Emitter;
    } });
    var cancellation_1 = require_cancellation();
    Object.defineProperty(exports2, "CancellationTokenSource", { enumerable: true, get: function() {
      return cancellation_1.CancellationTokenSource;
    } });
    Object.defineProperty(exports2, "CancellationToken", { enumerable: true, get: function() {
      return cancellation_1.CancellationToken;
    } });
    var sharedArrayCancellation_1 = require_sharedArrayCancellation();
    Object.defineProperty(exports2, "SharedArraySenderStrategy", { enumerable: true, get: function() {
      return sharedArrayCancellation_1.SharedArraySenderStrategy;
    } });
    Object.defineProperty(exports2, "SharedArrayReceiverStrategy", { enumerable: true, get: function() {
      return sharedArrayCancellation_1.SharedArrayReceiverStrategy;
    } });
    var messageReader_1 = require_messageReader();
    Object.defineProperty(exports2, "MessageReader", { enumerable: true, get: function() {
      return messageReader_1.MessageReader;
    } });
    Object.defineProperty(exports2, "AbstractMessageReader", { enumerable: true, get: function() {
      return messageReader_1.AbstractMessageReader;
    } });
    Object.defineProperty(exports2, "ReadableStreamMessageReader", { enumerable: true, get: function() {
      return messageReader_1.ReadableStreamMessageReader;
    } });
    var messageWriter_1 = require_messageWriter();
    Object.defineProperty(exports2, "MessageWriter", { enumerable: true, get: function() {
      return messageWriter_1.MessageWriter;
    } });
    Object.defineProperty(exports2, "AbstractMessageWriter", { enumerable: true, get: function() {
      return messageWriter_1.AbstractMessageWriter;
    } });
    Object.defineProperty(exports2, "WriteableStreamMessageWriter", { enumerable: true, get: function() {
      return messageWriter_1.WriteableStreamMessageWriter;
    } });
    var messageBuffer_1 = require_messageBuffer();
    Object.defineProperty(exports2, "AbstractMessageBuffer", { enumerable: true, get: function() {
      return messageBuffer_1.AbstractMessageBuffer;
    } });
    var connection_1 = require_connection();
    Object.defineProperty(exports2, "ConnectionStrategy", { enumerable: true, get: function() {
      return connection_1.ConnectionStrategy;
    } });
    Object.defineProperty(exports2, "ConnectionOptions", { enumerable: true, get: function() {
      return connection_1.ConnectionOptions;
    } });
    Object.defineProperty(exports2, "NullLogger", { enumerable: true, get: function() {
      return connection_1.NullLogger;
    } });
    Object.defineProperty(exports2, "createMessageConnection", { enumerable: true, get: function() {
      return connection_1.createMessageConnection;
    } });
    Object.defineProperty(exports2, "ProgressToken", { enumerable: true, get: function() {
      return connection_1.ProgressToken;
    } });
    Object.defineProperty(exports2, "ProgressType", { enumerable: true, get: function() {
      return connection_1.ProgressType;
    } });
    Object.defineProperty(exports2, "Trace", { enumerable: true, get: function() {
      return connection_1.Trace;
    } });
    Object.defineProperty(exports2, "TraceValues", { enumerable: true, get: function() {
      return connection_1.TraceValues;
    } });
    Object.defineProperty(exports2, "TraceFormat", { enumerable: true, get: function() {
      return connection_1.TraceFormat;
    } });
    Object.defineProperty(exports2, "SetTraceNotification", { enumerable: true, get: function() {
      return connection_1.SetTraceNotification;
    } });
    Object.defineProperty(exports2, "LogTraceNotification", { enumerable: true, get: function() {
      return connection_1.LogTraceNotification;
    } });
    Object.defineProperty(exports2, "ConnectionErrors", { enumerable: true, get: function() {
      return connection_1.ConnectionErrors;
    } });
    Object.defineProperty(exports2, "ConnectionError", { enumerable: true, get: function() {
      return connection_1.ConnectionError;
    } });
    Object.defineProperty(exports2, "CancellationReceiverStrategy", { enumerable: true, get: function() {
      return connection_1.CancellationReceiverStrategy;
    } });
    Object.defineProperty(exports2, "CancellationSenderStrategy", { enumerable: true, get: function() {
      return connection_1.CancellationSenderStrategy;
    } });
    Object.defineProperty(exports2, "CancellationStrategy", { enumerable: true, get: function() {
      return connection_1.CancellationStrategy;
    } });
    Object.defineProperty(exports2, "MessageStrategy", { enumerable: true, get: function() {
      return connection_1.MessageStrategy;
    } });
    var ral_1 = require_ral();
    exports2.RAL = ral_1.default;
  }
});

// node_modules/vscode-jsonrpc/lib/node/ril.js
var require_ril = __commonJS({
  "node_modules/vscode-jsonrpc/lib/node/ril.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var util_1 = require("util");
    var api_1 = require_api();
    var MessageBuffer = class extends api_1.AbstractMessageBuffer {
      constructor(encoding = "utf-8") {
        super(encoding);
      }
      emptyBuffer() {
        return MessageBuffer.emptyBuffer;
      }
      fromString(value, encoding) {
        return Buffer.from(value, encoding);
      }
      toString(value, encoding) {
        if (value instanceof Buffer) {
          return value.toString(encoding);
        } else {
          return new util_1.TextDecoder(encoding).decode(value);
        }
      }
      asNative(buffer, length) {
        if (length === void 0) {
          return buffer instanceof Buffer ? buffer : Buffer.from(buffer);
        } else {
          return buffer instanceof Buffer ? buffer.slice(0, length) : Buffer.from(buffer, 0, length);
        }
      }
      allocNative(length) {
        return Buffer.allocUnsafe(length);
      }
    };
    MessageBuffer.emptyBuffer = Buffer.allocUnsafe(0);
    var ReadableStreamWrapper = class {
      constructor(stream) {
        this.stream = stream;
      }
      onClose(listener) {
        this.stream.on("close", listener);
        return api_1.Disposable.create(() => this.stream.off("close", listener));
      }
      onError(listener) {
        this.stream.on("error", listener);
        return api_1.Disposable.create(() => this.stream.off("error", listener));
      }
      onEnd(listener) {
        this.stream.on("end", listener);
        return api_1.Disposable.create(() => this.stream.off("end", listener));
      }
      onData(listener) {
        this.stream.on("data", listener);
        return api_1.Disposable.create(() => this.stream.off("data", listener));
      }
    };
    var WritableStreamWrapper = class {
      constructor(stream) {
        this.stream = stream;
      }
      onClose(listener) {
        this.stream.on("close", listener);
        return api_1.Disposable.create(() => this.stream.off("close", listener));
      }
      onError(listener) {
        this.stream.on("error", listener);
        return api_1.Disposable.create(() => this.stream.off("error", listener));
      }
      onEnd(listener) {
        this.stream.on("end", listener);
        return api_1.Disposable.create(() => this.stream.off("end", listener));
      }
      write(data, encoding) {
        return new Promise((resolve, reject) => {
          const callback = (error) => {
            if (error === void 0 || error === null) {
              resolve();
            } else {
              reject(error);
            }
          };
          if (typeof data === "string") {
            this.stream.write(data, encoding, callback);
          } else {
            this.stream.write(data, callback);
          }
        });
      }
      end() {
        this.stream.end();
      }
    };
    var _ril = Object.freeze({
      messageBuffer: Object.freeze({
        create: (encoding) => new MessageBuffer(encoding)
      }),
      applicationJson: Object.freeze({
        encoder: Object.freeze({
          name: "application/json",
          encode: (msg, options) => {
            try {
              return Promise.resolve(Buffer.from(JSON.stringify(msg, void 0, 0), options.charset));
            } catch (err) {
              return Promise.reject(err);
            }
          }
        }),
        decoder: Object.freeze({
          name: "application/json",
          decode: (buffer, options) => {
            try {
              if (buffer instanceof Buffer) {
                return Promise.resolve(JSON.parse(buffer.toString(options.charset)));
              } else {
                return Promise.resolve(JSON.parse(new util_1.TextDecoder(options.charset).decode(buffer)));
              }
            } catch (err) {
              return Promise.reject(err);
            }
          }
        })
      }),
      stream: Object.freeze({
        asReadableStream: (stream) => new ReadableStreamWrapper(stream),
        asWritableStream: (stream) => new WritableStreamWrapper(stream)
      }),
      console,
      timer: Object.freeze({
        setTimeout(callback, ms, ...args) {
          const handle = setTimeout(callback, ms, ...args);
          return { dispose: () => clearTimeout(handle) };
        },
        setImmediate(callback, ...args) {
          const handle = setImmediate(callback, ...args);
          return { dispose: () => clearImmediate(handle) };
        },
        setInterval(callback, ms, ...args) {
          const handle = setInterval(callback, ms, ...args);
          return { dispose: () => clearInterval(handle) };
        }
      })
    });
    function RIL() {
      return _ril;
    }
    (function(RIL2) {
      function install() {
        api_1.RAL.install(_ril);
      }
      RIL2.install = install;
    })(RIL || (RIL = {}));
    exports2.default = RIL;
  }
});

// node_modules/vscode-jsonrpc/lib/node/main.js
var require_main = __commonJS({
  "node_modules/vscode-jsonrpc/lib/node/main.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p))
          __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createMessageConnection = exports2.createServerSocketTransport = exports2.createClientSocketTransport = exports2.createServerPipeTransport = exports2.createClientPipeTransport = exports2.generateRandomPipeName = exports2.StreamMessageWriter = exports2.StreamMessageReader = exports2.SocketMessageWriter = exports2.SocketMessageReader = exports2.PortMessageWriter = exports2.PortMessageReader = exports2.IPCMessageWriter = exports2.IPCMessageReader = void 0;
    var ril_1 = require_ril();
    ril_1.default.install();
    var path2 = require("path");
    var os = require("os");
    var crypto_1 = require("crypto");
    var net_1 = require("net");
    var api_1 = require_api();
    __exportStar(require_api(), exports2);
    var IPCMessageReader = class extends api_1.AbstractMessageReader {
      constructor(process2) {
        super();
        this.process = process2;
        let eventEmitter = this.process;
        eventEmitter.on("error", (error) => this.fireError(error));
        eventEmitter.on("close", () => this.fireClose());
      }
      listen(callback) {
        this.process.on("message", callback);
        return api_1.Disposable.create(() => this.process.off("message", callback));
      }
    };
    exports2.IPCMessageReader = IPCMessageReader;
    var IPCMessageWriter = class extends api_1.AbstractMessageWriter {
      constructor(process2) {
        super();
        this.process = process2;
        this.errorCount = 0;
        const eventEmitter = this.process;
        eventEmitter.on("error", (error) => this.fireError(error));
        eventEmitter.on("close", () => this.fireClose);
      }
      write(msg) {
        try {
          if (typeof this.process.send === "function") {
            this.process.send(msg, void 0, void 0, (error) => {
              if (error) {
                this.errorCount++;
                this.handleError(error, msg);
              } else {
                this.errorCount = 0;
              }
            });
          }
          return Promise.resolve();
        } catch (error) {
          this.handleError(error, msg);
          return Promise.reject(error);
        }
      }
      handleError(error, msg) {
        this.errorCount++;
        this.fireError(error, msg, this.errorCount);
      }
      end() {
      }
    };
    exports2.IPCMessageWriter = IPCMessageWriter;
    var PortMessageReader = class extends api_1.AbstractMessageReader {
      constructor(port) {
        super();
        this.onData = new api_1.Emitter();
        port.on("close", () => this.fireClose);
        port.on("error", (error) => this.fireError(error));
        port.on("message", (message) => {
          this.onData.fire(message);
        });
      }
      listen(callback) {
        return this.onData.event(callback);
      }
    };
    exports2.PortMessageReader = PortMessageReader;
    var PortMessageWriter = class extends api_1.AbstractMessageWriter {
      constructor(port) {
        super();
        this.port = port;
        this.errorCount = 0;
        port.on("close", () => this.fireClose());
        port.on("error", (error) => this.fireError(error));
      }
      write(msg) {
        try {
          this.port.postMessage(msg);
          return Promise.resolve();
        } catch (error) {
          this.handleError(error, msg);
          return Promise.reject(error);
        }
      }
      handleError(error, msg) {
        this.errorCount++;
        this.fireError(error, msg, this.errorCount);
      }
      end() {
      }
    };
    exports2.PortMessageWriter = PortMessageWriter;
    var SocketMessageReader = class extends api_1.ReadableStreamMessageReader {
      constructor(socket, encoding = "utf-8") {
        super((0, ril_1.default)().stream.asReadableStream(socket), encoding);
      }
    };
    exports2.SocketMessageReader = SocketMessageReader;
    var SocketMessageWriter = class extends api_1.WriteableStreamMessageWriter {
      constructor(socket, options) {
        super((0, ril_1.default)().stream.asWritableStream(socket), options);
        this.socket = socket;
      }
      dispose() {
        super.dispose();
        this.socket.destroy();
      }
    };
    exports2.SocketMessageWriter = SocketMessageWriter;
    var StreamMessageReader = class extends api_1.ReadableStreamMessageReader {
      constructor(readable, encoding) {
        super((0, ril_1.default)().stream.asReadableStream(readable), encoding);
      }
    };
    exports2.StreamMessageReader = StreamMessageReader;
    var StreamMessageWriter = class extends api_1.WriteableStreamMessageWriter {
      constructor(writable, options) {
        super((0, ril_1.default)().stream.asWritableStream(writable), options);
      }
    };
    exports2.StreamMessageWriter = StreamMessageWriter;
    var XDG_RUNTIME_DIR = process.env["XDG_RUNTIME_DIR"];
    var safeIpcPathLengths = /* @__PURE__ */ new Map([
      ["linux", 107],
      ["darwin", 103]
    ]);
    function generateRandomPipeName() {
      const randomSuffix = (0, crypto_1.randomBytes)(21).toString("hex");
      if (process.platform === "win32") {
        return `\\\\.\\pipe\\vscode-jsonrpc-${randomSuffix}-sock`;
      }
      let result;
      if (XDG_RUNTIME_DIR) {
        result = path2.join(XDG_RUNTIME_DIR, `vscode-ipc-${randomSuffix}.sock`);
      } else {
        result = path2.join(os.tmpdir(), `vscode-${randomSuffix}.sock`);
      }
      const limit = safeIpcPathLengths.get(process.platform);
      if (limit !== void 0 && result.length > limit) {
        (0, ril_1.default)().console.warn(`WARNING: IPC handle "${result}" is longer than ${limit} characters.`);
      }
      return result;
    }
    exports2.generateRandomPipeName = generateRandomPipeName;
    function createClientPipeTransport(pipeName, encoding = "utf-8") {
      let connectResolve;
      const connected = new Promise((resolve, _reject) => {
        connectResolve = resolve;
      });
      return new Promise((resolve, reject) => {
        let server = (0, net_1.createServer)((socket) => {
          server.close();
          connectResolve([
            new SocketMessageReader(socket, encoding),
            new SocketMessageWriter(socket, encoding)
          ]);
        });
        server.on("error", reject);
        server.listen(pipeName, () => {
          server.removeListener("error", reject);
          resolve({
            onConnected: () => {
              return connected;
            }
          });
        });
      });
    }
    exports2.createClientPipeTransport = createClientPipeTransport;
    function createServerPipeTransport(pipeName, encoding = "utf-8") {
      const socket = (0, net_1.createConnection)(pipeName);
      return [
        new SocketMessageReader(socket, encoding),
        new SocketMessageWriter(socket, encoding)
      ];
    }
    exports2.createServerPipeTransport = createServerPipeTransport;
    function createClientSocketTransport(port, encoding = "utf-8") {
      let connectResolve;
      const connected = new Promise((resolve, _reject) => {
        connectResolve = resolve;
      });
      return new Promise((resolve, reject) => {
        const server = (0, net_1.createServer)((socket) => {
          server.close();
          connectResolve([
            new SocketMessageReader(socket, encoding),
            new SocketMessageWriter(socket, encoding)
          ]);
        });
        server.on("error", reject);
        server.listen(port, "127.0.0.1", () => {
          server.removeListener("error", reject);
          resolve({
            onConnected: () => {
              return connected;
            }
          });
        });
      });
    }
    exports2.createClientSocketTransport = createClientSocketTransport;
    function createServerSocketTransport(port, encoding = "utf-8") {
      const socket = (0, net_1.createConnection)(port, "127.0.0.1");
      return [
        new SocketMessageReader(socket, encoding),
        new SocketMessageWriter(socket, encoding)
      ];
    }
    exports2.createServerSocketTransport = createServerSocketTransport;
    function isReadableStream(value) {
      const candidate = value;
      return candidate.read !== void 0 && candidate.addListener !== void 0;
    }
    function isWritableStream(value) {
      const candidate = value;
      return candidate.write !== void 0 && candidate.addListener !== void 0;
    }
    function createMessageConnection(input, output, logger, options) {
      if (!logger) {
        logger = api_1.NullLogger;
      }
      const reader = isReadableStream(input) ? new StreamMessageReader(input) : input;
      const writer = isWritableStream(output) ? new StreamMessageWriter(output) : output;
      if (api_1.ConnectionStrategy.is(options)) {
        options = { connectionStrategy: options };
      }
      return (0, api_1.createMessageConnection)(reader, writer, logger, options);
    }
    exports2.createMessageConnection = createMessageConnection;
  }
});

// node_modules/vscode-jsonrpc/node.js
var require_node = __commonJS({
  "node_modules/vscode-jsonrpc/node.js"(exports2, module2) {
    "use strict";
    module2.exports = require_main();
  }
});

// node_modules/vscode-languageserver-types/lib/umd/main.js
var require_main2 = __commonJS({
  "node_modules/vscode-languageserver-types/lib/umd/main.js"(exports2, module2) {
    (function(factory) {
      if (typeof module2 === "object" && typeof module2.exports === "object") {
        var v = factory(require, exports2);
        if (v !== void 0)
          module2.exports = v;
      } else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
      }
    })(function(require2, exports3) {
      "use strict";
      Object.defineProperty(exports3, "__esModule", { value: true });
      exports3.TextDocument = exports3.EOL = exports3.WorkspaceFolder = exports3.InlineCompletionContext = exports3.SelectedCompletionInfo = exports3.InlineCompletionTriggerKind = exports3.InlineCompletionList = exports3.InlineCompletionItem = exports3.StringValue = exports3.InlayHint = exports3.InlayHintLabelPart = exports3.InlayHintKind = exports3.InlineValueContext = exports3.InlineValueEvaluatableExpression = exports3.InlineValueVariableLookup = exports3.InlineValueText = exports3.SemanticTokens = exports3.SemanticTokenModifiers = exports3.SemanticTokenTypes = exports3.SelectionRange = exports3.DocumentLink = exports3.FormattingOptions = exports3.CodeLens = exports3.CodeAction = exports3.CodeActionContext = exports3.CodeActionTriggerKind = exports3.CodeActionKind = exports3.DocumentSymbol = exports3.WorkspaceSymbol = exports3.SymbolInformation = exports3.SymbolTag = exports3.SymbolKind = exports3.DocumentHighlight = exports3.DocumentHighlightKind = exports3.SignatureInformation = exports3.ParameterInformation = exports3.Hover = exports3.MarkedString = exports3.CompletionList = exports3.CompletionItem = exports3.CompletionItemLabelDetails = exports3.InsertTextMode = exports3.InsertReplaceEdit = exports3.CompletionItemTag = exports3.InsertTextFormat = exports3.CompletionItemKind = exports3.MarkupContent = exports3.MarkupKind = exports3.TextDocumentItem = exports3.OptionalVersionedTextDocumentIdentifier = exports3.VersionedTextDocumentIdentifier = exports3.TextDocumentIdentifier = exports3.WorkspaceChange = exports3.WorkspaceEdit = exports3.DeleteFile = exports3.RenameFile = exports3.CreateFile = exports3.TextDocumentEdit = exports3.AnnotatedTextEdit = exports3.ChangeAnnotationIdentifier = exports3.ChangeAnnotation = exports3.TextEdit = exports3.Command = exports3.Diagnostic = exports3.CodeDescription = exports3.DiagnosticTag = exports3.DiagnosticSeverity = exports3.DiagnosticRelatedInformation = exports3.FoldingRange = exports3.FoldingRangeKind = exports3.ColorPresentation = exports3.ColorInformation = exports3.Color = exports3.LocationLink = exports3.Location = exports3.Range = exports3.Position = exports3.uinteger = exports3.integer = exports3.URI = exports3.DocumentUri = void 0;
      var DocumentUri;
      (function(DocumentUri2) {
        function is(value) {
          return typeof value === "string";
        }
        DocumentUri2.is = is;
      })(DocumentUri || (exports3.DocumentUri = DocumentUri = {}));
      var URI;
      (function(URI2) {
        function is(value) {
          return typeof value === "string";
        }
        URI2.is = is;
      })(URI || (exports3.URI = URI = {}));
      var integer;
      (function(integer2) {
        integer2.MIN_VALUE = -2147483648;
        integer2.MAX_VALUE = 2147483647;
        function is(value) {
          return typeof value === "number" && integer2.MIN_VALUE <= value && value <= integer2.MAX_VALUE;
        }
        integer2.is = is;
      })(integer || (exports3.integer = integer = {}));
      var uinteger;
      (function(uinteger2) {
        uinteger2.MIN_VALUE = 0;
        uinteger2.MAX_VALUE = 2147483647;
        function is(value) {
          return typeof value === "number" && uinteger2.MIN_VALUE <= value && value <= uinteger2.MAX_VALUE;
        }
        uinteger2.is = is;
      })(uinteger || (exports3.uinteger = uinteger = {}));
      var Position;
      (function(Position2) {
        function create(line, character) {
          if (line === Number.MAX_VALUE) {
            line = uinteger.MAX_VALUE;
          }
          if (character === Number.MAX_VALUE) {
            character = uinteger.MAX_VALUE;
          }
          return { line, character };
        }
        Position2.create = create;
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && Is.uinteger(candidate.line) && Is.uinteger(candidate.character);
        }
        Position2.is = is;
      })(Position || (exports3.Position = Position = {}));
      var Range;
      (function(Range2) {
        function create(one, two, three, four) {
          if (Is.uinteger(one) && Is.uinteger(two) && Is.uinteger(three) && Is.uinteger(four)) {
            return { start: Position.create(one, two), end: Position.create(three, four) };
          } else if (Position.is(one) && Position.is(two)) {
            return { start: one, end: two };
          } else {
            throw new Error("Range#create called with invalid arguments[".concat(one, ", ").concat(two, ", ").concat(three, ", ").concat(four, "]"));
          }
        }
        Range2.create = create;
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && Position.is(candidate.start) && Position.is(candidate.end);
        }
        Range2.is = is;
      })(Range || (exports3.Range = Range = {}));
      var Location;
      (function(Location2) {
        function create(uri, range) {
          return { uri, range };
        }
        Location2.create = create;
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && Range.is(candidate.range) && (Is.string(candidate.uri) || Is.undefined(candidate.uri));
        }
        Location2.is = is;
      })(Location || (exports3.Location = Location = {}));
      var LocationLink;
      (function(LocationLink2) {
        function create(targetUri, targetRange, targetSelectionRange, originSelectionRange) {
          return { targetUri, targetRange, targetSelectionRange, originSelectionRange };
        }
        LocationLink2.create = create;
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && Range.is(candidate.targetRange) && Is.string(candidate.targetUri) && Range.is(candidate.targetSelectionRange) && (Range.is(candidate.originSelectionRange) || Is.undefined(candidate.originSelectionRange));
        }
        LocationLink2.is = is;
      })(LocationLink || (exports3.LocationLink = LocationLink = {}));
      var Color;
      (function(Color2) {
        function create(red, green, blue, alpha) {
          return {
            red,
            green,
            blue,
            alpha
          };
        }
        Color2.create = create;
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && Is.numberRange(candidate.red, 0, 1) && Is.numberRange(candidate.green, 0, 1) && Is.numberRange(candidate.blue, 0, 1) && Is.numberRange(candidate.alpha, 0, 1);
        }
        Color2.is = is;
      })(Color || (exports3.Color = Color = {}));
      var ColorInformation;
      (function(ColorInformation2) {
        function create(range, color) {
          return {
            range,
            color
          };
        }
        ColorInformation2.create = create;
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && Range.is(candidate.range) && Color.is(candidate.color);
        }
        ColorInformation2.is = is;
      })(ColorInformation || (exports3.ColorInformation = ColorInformation = {}));
      var ColorPresentation;
      (function(ColorPresentation2) {
        function create(label, textEdit, additionalTextEdits) {
          return {
            label,
            textEdit,
            additionalTextEdits
          };
        }
        ColorPresentation2.create = create;
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && Is.string(candidate.label) && (Is.undefined(candidate.textEdit) || TextEdit.is(candidate)) && (Is.undefined(candidate.additionalTextEdits) || Is.typedArray(candidate.additionalTextEdits, TextEdit.is));
        }
        ColorPresentation2.is = is;
      })(ColorPresentation || (exports3.ColorPresentation = ColorPresentation = {}));
      var FoldingRangeKind;
      (function(FoldingRangeKind2) {
        FoldingRangeKind2.Comment = "comment";
        FoldingRangeKind2.Imports = "imports";
        FoldingRangeKind2.Region = "region";
      })(FoldingRangeKind || (exports3.FoldingRangeKind = FoldingRangeKind = {}));
      var FoldingRange;
      (function(FoldingRange2) {
        function create(startLine, endLine, startCharacter, endCharacter, kind, collapsedText) {
          var result = {
            startLine,
            endLine
          };
          if (Is.defined(startCharacter)) {
            result.startCharacter = startCharacter;
          }
          if (Is.defined(endCharacter)) {
            result.endCharacter = endCharacter;
          }
          if (Is.defined(kind)) {
            result.kind = kind;
          }
          if (Is.defined(collapsedText)) {
            result.collapsedText = collapsedText;
          }
          return result;
        }
        FoldingRange2.create = create;
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && Is.uinteger(candidate.startLine) && Is.uinteger(candidate.startLine) && (Is.undefined(candidate.startCharacter) || Is.uinteger(candidate.startCharacter)) && (Is.undefined(candidate.endCharacter) || Is.uinteger(candidate.endCharacter)) && (Is.undefined(candidate.kind) || Is.string(candidate.kind));
        }
        FoldingRange2.is = is;
      })(FoldingRange || (exports3.FoldingRange = FoldingRange = {}));
      var DiagnosticRelatedInformation;
      (function(DiagnosticRelatedInformation2) {
        function create(location, message) {
          return {
            location,
            message
          };
        }
        DiagnosticRelatedInformation2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Location.is(candidate.location) && Is.string(candidate.message);
        }
        DiagnosticRelatedInformation2.is = is;
      })(DiagnosticRelatedInformation || (exports3.DiagnosticRelatedInformation = DiagnosticRelatedInformation = {}));
      var DiagnosticSeverity2;
      (function(DiagnosticSeverity3) {
        DiagnosticSeverity3.Error = 1;
        DiagnosticSeverity3.Warning = 2;
        DiagnosticSeverity3.Information = 3;
        DiagnosticSeverity3.Hint = 4;
      })(DiagnosticSeverity2 || (exports3.DiagnosticSeverity = DiagnosticSeverity2 = {}));
      var DiagnosticTag;
      (function(DiagnosticTag2) {
        DiagnosticTag2.Unnecessary = 1;
        DiagnosticTag2.Deprecated = 2;
      })(DiagnosticTag || (exports3.DiagnosticTag = DiagnosticTag = {}));
      var CodeDescription;
      (function(CodeDescription2) {
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && Is.string(candidate.href);
        }
        CodeDescription2.is = is;
      })(CodeDescription || (exports3.CodeDescription = CodeDescription = {}));
      var Diagnostic;
      (function(Diagnostic2) {
        function create(range, message, severity, code, source, relatedInformation) {
          var result = { range, message };
          if (Is.defined(severity)) {
            result.severity = severity;
          }
          if (Is.defined(code)) {
            result.code = code;
          }
          if (Is.defined(source)) {
            result.source = source;
          }
          if (Is.defined(relatedInformation)) {
            result.relatedInformation = relatedInformation;
          }
          return result;
        }
        Diagnostic2.create = create;
        function is(value) {
          var _a;
          var candidate = value;
          return Is.defined(candidate) && Range.is(candidate.range) && Is.string(candidate.message) && (Is.number(candidate.severity) || Is.undefined(candidate.severity)) && (Is.integer(candidate.code) || Is.string(candidate.code) || Is.undefined(candidate.code)) && (Is.undefined(candidate.codeDescription) || Is.string((_a = candidate.codeDescription) === null || _a === void 0 ? void 0 : _a.href)) && (Is.string(candidate.source) || Is.undefined(candidate.source)) && (Is.undefined(candidate.relatedInformation) || Is.typedArray(candidate.relatedInformation, DiagnosticRelatedInformation.is));
        }
        Diagnostic2.is = is;
      })(Diagnostic || (exports3.Diagnostic = Diagnostic = {}));
      var Command;
      (function(Command2) {
        function create(title, command) {
          var args = [];
          for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
          }
          var result = { title, command };
          if (Is.defined(args) && args.length > 0) {
            result.arguments = args;
          }
          return result;
        }
        Command2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Is.string(candidate.title) && Is.string(candidate.command);
        }
        Command2.is = is;
      })(Command || (exports3.Command = Command = {}));
      var TextEdit;
      (function(TextEdit2) {
        function replace(range, newText) {
          return { range, newText };
        }
        TextEdit2.replace = replace;
        function insert(position, newText) {
          return { range: { start: position, end: position }, newText };
        }
        TextEdit2.insert = insert;
        function del(range) {
          return { range, newText: "" };
        }
        TextEdit2.del = del;
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && Is.string(candidate.newText) && Range.is(candidate.range);
        }
        TextEdit2.is = is;
      })(TextEdit || (exports3.TextEdit = TextEdit = {}));
      var ChangeAnnotation;
      (function(ChangeAnnotation2) {
        function create(label, needsConfirmation, description) {
          var result = { label };
          if (needsConfirmation !== void 0) {
            result.needsConfirmation = needsConfirmation;
          }
          if (description !== void 0) {
            result.description = description;
          }
          return result;
        }
        ChangeAnnotation2.create = create;
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && Is.string(candidate.label) && (Is.boolean(candidate.needsConfirmation) || candidate.needsConfirmation === void 0) && (Is.string(candidate.description) || candidate.description === void 0);
        }
        ChangeAnnotation2.is = is;
      })(ChangeAnnotation || (exports3.ChangeAnnotation = ChangeAnnotation = {}));
      var ChangeAnnotationIdentifier;
      (function(ChangeAnnotationIdentifier2) {
        function is(value) {
          var candidate = value;
          return Is.string(candidate);
        }
        ChangeAnnotationIdentifier2.is = is;
      })(ChangeAnnotationIdentifier || (exports3.ChangeAnnotationIdentifier = ChangeAnnotationIdentifier = {}));
      var AnnotatedTextEdit;
      (function(AnnotatedTextEdit2) {
        function replace(range, newText, annotation) {
          return { range, newText, annotationId: annotation };
        }
        AnnotatedTextEdit2.replace = replace;
        function insert(position, newText, annotation) {
          return { range: { start: position, end: position }, newText, annotationId: annotation };
        }
        AnnotatedTextEdit2.insert = insert;
        function del(range, annotation) {
          return { range, newText: "", annotationId: annotation };
        }
        AnnotatedTextEdit2.del = del;
        function is(value) {
          var candidate = value;
          return TextEdit.is(candidate) && (ChangeAnnotation.is(candidate.annotationId) || ChangeAnnotationIdentifier.is(candidate.annotationId));
        }
        AnnotatedTextEdit2.is = is;
      })(AnnotatedTextEdit || (exports3.AnnotatedTextEdit = AnnotatedTextEdit = {}));
      var TextDocumentEdit;
      (function(TextDocumentEdit2) {
        function create(textDocument, edits) {
          return { textDocument, edits };
        }
        TextDocumentEdit2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && OptionalVersionedTextDocumentIdentifier.is(candidate.textDocument) && Array.isArray(candidate.edits);
        }
        TextDocumentEdit2.is = is;
      })(TextDocumentEdit || (exports3.TextDocumentEdit = TextDocumentEdit = {}));
      var CreateFile;
      (function(CreateFile2) {
        function create(uri, options, annotation) {
          var result = {
            kind: "create",
            uri
          };
          if (options !== void 0 && (options.overwrite !== void 0 || options.ignoreIfExists !== void 0)) {
            result.options = options;
          }
          if (annotation !== void 0) {
            result.annotationId = annotation;
          }
          return result;
        }
        CreateFile2.create = create;
        function is(value) {
          var candidate = value;
          return candidate && candidate.kind === "create" && Is.string(candidate.uri) && (candidate.options === void 0 || (candidate.options.overwrite === void 0 || Is.boolean(candidate.options.overwrite)) && (candidate.options.ignoreIfExists === void 0 || Is.boolean(candidate.options.ignoreIfExists))) && (candidate.annotationId === void 0 || ChangeAnnotationIdentifier.is(candidate.annotationId));
        }
        CreateFile2.is = is;
      })(CreateFile || (exports3.CreateFile = CreateFile = {}));
      var RenameFile;
      (function(RenameFile2) {
        function create(oldUri, newUri, options, annotation) {
          var result = {
            kind: "rename",
            oldUri,
            newUri
          };
          if (options !== void 0 && (options.overwrite !== void 0 || options.ignoreIfExists !== void 0)) {
            result.options = options;
          }
          if (annotation !== void 0) {
            result.annotationId = annotation;
          }
          return result;
        }
        RenameFile2.create = create;
        function is(value) {
          var candidate = value;
          return candidate && candidate.kind === "rename" && Is.string(candidate.oldUri) && Is.string(candidate.newUri) && (candidate.options === void 0 || (candidate.options.overwrite === void 0 || Is.boolean(candidate.options.overwrite)) && (candidate.options.ignoreIfExists === void 0 || Is.boolean(candidate.options.ignoreIfExists))) && (candidate.annotationId === void 0 || ChangeAnnotationIdentifier.is(candidate.annotationId));
        }
        RenameFile2.is = is;
      })(RenameFile || (exports3.RenameFile = RenameFile = {}));
      var DeleteFile;
      (function(DeleteFile2) {
        function create(uri, options, annotation) {
          var result = {
            kind: "delete",
            uri
          };
          if (options !== void 0 && (options.recursive !== void 0 || options.ignoreIfNotExists !== void 0)) {
            result.options = options;
          }
          if (annotation !== void 0) {
            result.annotationId = annotation;
          }
          return result;
        }
        DeleteFile2.create = create;
        function is(value) {
          var candidate = value;
          return candidate && candidate.kind === "delete" && Is.string(candidate.uri) && (candidate.options === void 0 || (candidate.options.recursive === void 0 || Is.boolean(candidate.options.recursive)) && (candidate.options.ignoreIfNotExists === void 0 || Is.boolean(candidate.options.ignoreIfNotExists))) && (candidate.annotationId === void 0 || ChangeAnnotationIdentifier.is(candidate.annotationId));
        }
        DeleteFile2.is = is;
      })(DeleteFile || (exports3.DeleteFile = DeleteFile = {}));
      var WorkspaceEdit;
      (function(WorkspaceEdit2) {
        function is(value) {
          var candidate = value;
          return candidate && (candidate.changes !== void 0 || candidate.documentChanges !== void 0) && (candidate.documentChanges === void 0 || candidate.documentChanges.every(function(change) {
            if (Is.string(change.kind)) {
              return CreateFile.is(change) || RenameFile.is(change) || DeleteFile.is(change);
            } else {
              return TextDocumentEdit.is(change);
            }
          }));
        }
        WorkspaceEdit2.is = is;
      })(WorkspaceEdit || (exports3.WorkspaceEdit = WorkspaceEdit = {}));
      var TextEditChangeImpl = (
        /** @class */
        function() {
          function TextEditChangeImpl2(edits, changeAnnotations) {
            this.edits = edits;
            this.changeAnnotations = changeAnnotations;
          }
          TextEditChangeImpl2.prototype.insert = function(position, newText, annotation) {
            var edit;
            var id;
            if (annotation === void 0) {
              edit = TextEdit.insert(position, newText);
            } else if (ChangeAnnotationIdentifier.is(annotation)) {
              id = annotation;
              edit = AnnotatedTextEdit.insert(position, newText, annotation);
            } else {
              this.assertChangeAnnotations(this.changeAnnotations);
              id = this.changeAnnotations.manage(annotation);
              edit = AnnotatedTextEdit.insert(position, newText, id);
            }
            this.edits.push(edit);
            if (id !== void 0) {
              return id;
            }
          };
          TextEditChangeImpl2.prototype.replace = function(range, newText, annotation) {
            var edit;
            var id;
            if (annotation === void 0) {
              edit = TextEdit.replace(range, newText);
            } else if (ChangeAnnotationIdentifier.is(annotation)) {
              id = annotation;
              edit = AnnotatedTextEdit.replace(range, newText, annotation);
            } else {
              this.assertChangeAnnotations(this.changeAnnotations);
              id = this.changeAnnotations.manage(annotation);
              edit = AnnotatedTextEdit.replace(range, newText, id);
            }
            this.edits.push(edit);
            if (id !== void 0) {
              return id;
            }
          };
          TextEditChangeImpl2.prototype.delete = function(range, annotation) {
            var edit;
            var id;
            if (annotation === void 0) {
              edit = TextEdit.del(range);
            } else if (ChangeAnnotationIdentifier.is(annotation)) {
              id = annotation;
              edit = AnnotatedTextEdit.del(range, annotation);
            } else {
              this.assertChangeAnnotations(this.changeAnnotations);
              id = this.changeAnnotations.manage(annotation);
              edit = AnnotatedTextEdit.del(range, id);
            }
            this.edits.push(edit);
            if (id !== void 0) {
              return id;
            }
          };
          TextEditChangeImpl2.prototype.add = function(edit) {
            this.edits.push(edit);
          };
          TextEditChangeImpl2.prototype.all = function() {
            return this.edits;
          };
          TextEditChangeImpl2.prototype.clear = function() {
            this.edits.splice(0, this.edits.length);
          };
          TextEditChangeImpl2.prototype.assertChangeAnnotations = function(value) {
            if (value === void 0) {
              throw new Error("Text edit change is not configured to manage change annotations.");
            }
          };
          return TextEditChangeImpl2;
        }()
      );
      var ChangeAnnotations = (
        /** @class */
        function() {
          function ChangeAnnotations2(annotations) {
            this._annotations = annotations === void 0 ? /* @__PURE__ */ Object.create(null) : annotations;
            this._counter = 0;
            this._size = 0;
          }
          ChangeAnnotations2.prototype.all = function() {
            return this._annotations;
          };
          Object.defineProperty(ChangeAnnotations2.prototype, "size", {
            get: function() {
              return this._size;
            },
            enumerable: false,
            configurable: true
          });
          ChangeAnnotations2.prototype.manage = function(idOrAnnotation, annotation) {
            var id;
            if (ChangeAnnotationIdentifier.is(idOrAnnotation)) {
              id = idOrAnnotation;
            } else {
              id = this.nextId();
              annotation = idOrAnnotation;
            }
            if (this._annotations[id] !== void 0) {
              throw new Error("Id ".concat(id, " is already in use."));
            }
            if (annotation === void 0) {
              throw new Error("No annotation provided for id ".concat(id));
            }
            this._annotations[id] = annotation;
            this._size++;
            return id;
          };
          ChangeAnnotations2.prototype.nextId = function() {
            this._counter++;
            return this._counter.toString();
          };
          return ChangeAnnotations2;
        }()
      );
      var WorkspaceChange = (
        /** @class */
        function() {
          function WorkspaceChange2(workspaceEdit) {
            var _this = this;
            this._textEditChanges = /* @__PURE__ */ Object.create(null);
            if (workspaceEdit !== void 0) {
              this._workspaceEdit = workspaceEdit;
              if (workspaceEdit.documentChanges) {
                this._changeAnnotations = new ChangeAnnotations(workspaceEdit.changeAnnotations);
                workspaceEdit.changeAnnotations = this._changeAnnotations.all();
                workspaceEdit.documentChanges.forEach(function(change) {
                  if (TextDocumentEdit.is(change)) {
                    var textEditChange = new TextEditChangeImpl(change.edits, _this._changeAnnotations);
                    _this._textEditChanges[change.textDocument.uri] = textEditChange;
                  }
                });
              } else if (workspaceEdit.changes) {
                Object.keys(workspaceEdit.changes).forEach(function(key) {
                  var textEditChange = new TextEditChangeImpl(workspaceEdit.changes[key]);
                  _this._textEditChanges[key] = textEditChange;
                });
              }
            } else {
              this._workspaceEdit = {};
            }
          }
          Object.defineProperty(WorkspaceChange2.prototype, "edit", {
            /**
             * Returns the underlying {@link WorkspaceEdit} literal
             * use to be returned from a workspace edit operation like rename.
             */
            get: function() {
              this.initDocumentChanges();
              if (this._changeAnnotations !== void 0) {
                if (this._changeAnnotations.size === 0) {
                  this._workspaceEdit.changeAnnotations = void 0;
                } else {
                  this._workspaceEdit.changeAnnotations = this._changeAnnotations.all();
                }
              }
              return this._workspaceEdit;
            },
            enumerable: false,
            configurable: true
          });
          WorkspaceChange2.prototype.getTextEditChange = function(key) {
            if (OptionalVersionedTextDocumentIdentifier.is(key)) {
              this.initDocumentChanges();
              if (this._workspaceEdit.documentChanges === void 0) {
                throw new Error("Workspace edit is not configured for document changes.");
              }
              var textDocument = { uri: key.uri, version: key.version };
              var result = this._textEditChanges[textDocument.uri];
              if (!result) {
                var edits = [];
                var textDocumentEdit = {
                  textDocument,
                  edits
                };
                this._workspaceEdit.documentChanges.push(textDocumentEdit);
                result = new TextEditChangeImpl(edits, this._changeAnnotations);
                this._textEditChanges[textDocument.uri] = result;
              }
              return result;
            } else {
              this.initChanges();
              if (this._workspaceEdit.changes === void 0) {
                throw new Error("Workspace edit is not configured for normal text edit changes.");
              }
              var result = this._textEditChanges[key];
              if (!result) {
                var edits = [];
                this._workspaceEdit.changes[key] = edits;
                result = new TextEditChangeImpl(edits);
                this._textEditChanges[key] = result;
              }
              return result;
            }
          };
          WorkspaceChange2.prototype.initDocumentChanges = function() {
            if (this._workspaceEdit.documentChanges === void 0 && this._workspaceEdit.changes === void 0) {
              this._changeAnnotations = new ChangeAnnotations();
              this._workspaceEdit.documentChanges = [];
              this._workspaceEdit.changeAnnotations = this._changeAnnotations.all();
            }
          };
          WorkspaceChange2.prototype.initChanges = function() {
            if (this._workspaceEdit.documentChanges === void 0 && this._workspaceEdit.changes === void 0) {
              this._workspaceEdit.changes = /* @__PURE__ */ Object.create(null);
            }
          };
          WorkspaceChange2.prototype.createFile = function(uri, optionsOrAnnotation, options) {
            this.initDocumentChanges();
            if (this._workspaceEdit.documentChanges === void 0) {
              throw new Error("Workspace edit is not configured for document changes.");
            }
            var annotation;
            if (ChangeAnnotation.is(optionsOrAnnotation) || ChangeAnnotationIdentifier.is(optionsOrAnnotation)) {
              annotation = optionsOrAnnotation;
            } else {
              options = optionsOrAnnotation;
            }
            var operation;
            var id;
            if (annotation === void 0) {
              operation = CreateFile.create(uri, options);
            } else {
              id = ChangeAnnotationIdentifier.is(annotation) ? annotation : this._changeAnnotations.manage(annotation);
              operation = CreateFile.create(uri, options, id);
            }
            this._workspaceEdit.documentChanges.push(operation);
            if (id !== void 0) {
              return id;
            }
          };
          WorkspaceChange2.prototype.renameFile = function(oldUri, newUri, optionsOrAnnotation, options) {
            this.initDocumentChanges();
            if (this._workspaceEdit.documentChanges === void 0) {
              throw new Error("Workspace edit is not configured for document changes.");
            }
            var annotation;
            if (ChangeAnnotation.is(optionsOrAnnotation) || ChangeAnnotationIdentifier.is(optionsOrAnnotation)) {
              annotation = optionsOrAnnotation;
            } else {
              options = optionsOrAnnotation;
            }
            var operation;
            var id;
            if (annotation === void 0) {
              operation = RenameFile.create(oldUri, newUri, options);
            } else {
              id = ChangeAnnotationIdentifier.is(annotation) ? annotation : this._changeAnnotations.manage(annotation);
              operation = RenameFile.create(oldUri, newUri, options, id);
            }
            this._workspaceEdit.documentChanges.push(operation);
            if (id !== void 0) {
              return id;
            }
          };
          WorkspaceChange2.prototype.deleteFile = function(uri, optionsOrAnnotation, options) {
            this.initDocumentChanges();
            if (this._workspaceEdit.documentChanges === void 0) {
              throw new Error("Workspace edit is not configured for document changes.");
            }
            var annotation;
            if (ChangeAnnotation.is(optionsOrAnnotation) || ChangeAnnotationIdentifier.is(optionsOrAnnotation)) {
              annotation = optionsOrAnnotation;
            } else {
              options = optionsOrAnnotation;
            }
            var operation;
            var id;
            if (annotation === void 0) {
              operation = DeleteFile.create(uri, options);
            } else {
              id = ChangeAnnotationIdentifier.is(annotation) ? annotation : this._changeAnnotations.manage(annotation);
              operation = DeleteFile.create(uri, options, id);
            }
            this._workspaceEdit.documentChanges.push(operation);
            if (id !== void 0) {
              return id;
            }
          };
          return WorkspaceChange2;
        }()
      );
      exports3.WorkspaceChange = WorkspaceChange;
      var TextDocumentIdentifier;
      (function(TextDocumentIdentifier2) {
        function create(uri) {
          return { uri };
        }
        TextDocumentIdentifier2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Is.string(candidate.uri);
        }
        TextDocumentIdentifier2.is = is;
      })(TextDocumentIdentifier || (exports3.TextDocumentIdentifier = TextDocumentIdentifier = {}));
      var VersionedTextDocumentIdentifier;
      (function(VersionedTextDocumentIdentifier2) {
        function create(uri, version) {
          return { uri, version };
        }
        VersionedTextDocumentIdentifier2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Is.string(candidate.uri) && Is.integer(candidate.version);
        }
        VersionedTextDocumentIdentifier2.is = is;
      })(VersionedTextDocumentIdentifier || (exports3.VersionedTextDocumentIdentifier = VersionedTextDocumentIdentifier = {}));
      var OptionalVersionedTextDocumentIdentifier;
      (function(OptionalVersionedTextDocumentIdentifier2) {
        function create(uri, version) {
          return { uri, version };
        }
        OptionalVersionedTextDocumentIdentifier2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Is.string(candidate.uri) && (candidate.version === null || Is.integer(candidate.version));
        }
        OptionalVersionedTextDocumentIdentifier2.is = is;
      })(OptionalVersionedTextDocumentIdentifier || (exports3.OptionalVersionedTextDocumentIdentifier = OptionalVersionedTextDocumentIdentifier = {}));
      var TextDocumentItem;
      (function(TextDocumentItem2) {
        function create(uri, languageId, version, text) {
          return { uri, languageId, version, text };
        }
        TextDocumentItem2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Is.string(candidate.uri) && Is.string(candidate.languageId) && Is.integer(candidate.version) && Is.string(candidate.text);
        }
        TextDocumentItem2.is = is;
      })(TextDocumentItem || (exports3.TextDocumentItem = TextDocumentItem = {}));
      var MarkupKind;
      (function(MarkupKind2) {
        MarkupKind2.PlainText = "plaintext";
        MarkupKind2.Markdown = "markdown";
        function is(value) {
          var candidate = value;
          return candidate === MarkupKind2.PlainText || candidate === MarkupKind2.Markdown;
        }
        MarkupKind2.is = is;
      })(MarkupKind || (exports3.MarkupKind = MarkupKind = {}));
      var MarkupContent;
      (function(MarkupContent2) {
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(value) && MarkupKind.is(candidate.kind) && Is.string(candidate.value);
        }
        MarkupContent2.is = is;
      })(MarkupContent || (exports3.MarkupContent = MarkupContent = {}));
      var CompletionItemKind;
      (function(CompletionItemKind2) {
        CompletionItemKind2.Text = 1;
        CompletionItemKind2.Method = 2;
        CompletionItemKind2.Function = 3;
        CompletionItemKind2.Constructor = 4;
        CompletionItemKind2.Field = 5;
        CompletionItemKind2.Variable = 6;
        CompletionItemKind2.Class = 7;
        CompletionItemKind2.Interface = 8;
        CompletionItemKind2.Module = 9;
        CompletionItemKind2.Property = 10;
        CompletionItemKind2.Unit = 11;
        CompletionItemKind2.Value = 12;
        CompletionItemKind2.Enum = 13;
        CompletionItemKind2.Keyword = 14;
        CompletionItemKind2.Snippet = 15;
        CompletionItemKind2.Color = 16;
        CompletionItemKind2.File = 17;
        CompletionItemKind2.Reference = 18;
        CompletionItemKind2.Folder = 19;
        CompletionItemKind2.EnumMember = 20;
        CompletionItemKind2.Constant = 21;
        CompletionItemKind2.Struct = 22;
        CompletionItemKind2.Event = 23;
        CompletionItemKind2.Operator = 24;
        CompletionItemKind2.TypeParameter = 25;
      })(CompletionItemKind || (exports3.CompletionItemKind = CompletionItemKind = {}));
      var InsertTextFormat;
      (function(InsertTextFormat2) {
        InsertTextFormat2.PlainText = 1;
        InsertTextFormat2.Snippet = 2;
      })(InsertTextFormat || (exports3.InsertTextFormat = InsertTextFormat = {}));
      var CompletionItemTag;
      (function(CompletionItemTag2) {
        CompletionItemTag2.Deprecated = 1;
      })(CompletionItemTag || (exports3.CompletionItemTag = CompletionItemTag = {}));
      var InsertReplaceEdit;
      (function(InsertReplaceEdit2) {
        function create(newText, insert, replace) {
          return { newText, insert, replace };
        }
        InsertReplaceEdit2.create = create;
        function is(value) {
          var candidate = value;
          return candidate && Is.string(candidate.newText) && Range.is(candidate.insert) && Range.is(candidate.replace);
        }
        InsertReplaceEdit2.is = is;
      })(InsertReplaceEdit || (exports3.InsertReplaceEdit = InsertReplaceEdit = {}));
      var InsertTextMode;
      (function(InsertTextMode2) {
        InsertTextMode2.asIs = 1;
        InsertTextMode2.adjustIndentation = 2;
      })(InsertTextMode || (exports3.InsertTextMode = InsertTextMode = {}));
      var CompletionItemLabelDetails;
      (function(CompletionItemLabelDetails2) {
        function is(value) {
          var candidate = value;
          return candidate && (Is.string(candidate.detail) || candidate.detail === void 0) && (Is.string(candidate.description) || candidate.description === void 0);
        }
        CompletionItemLabelDetails2.is = is;
      })(CompletionItemLabelDetails || (exports3.CompletionItemLabelDetails = CompletionItemLabelDetails = {}));
      var CompletionItem;
      (function(CompletionItem2) {
        function create(label) {
          return { label };
        }
        CompletionItem2.create = create;
      })(CompletionItem || (exports3.CompletionItem = CompletionItem = {}));
      var CompletionList;
      (function(CompletionList2) {
        function create(items, isIncomplete) {
          return { items: items ? items : [], isIncomplete: !!isIncomplete };
        }
        CompletionList2.create = create;
      })(CompletionList || (exports3.CompletionList = CompletionList = {}));
      var MarkedString;
      (function(MarkedString2) {
        function fromPlainText(plainText) {
          return plainText.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&");
        }
        MarkedString2.fromPlainText = fromPlainText;
        function is(value) {
          var candidate = value;
          return Is.string(candidate) || Is.objectLiteral(candidate) && Is.string(candidate.language) && Is.string(candidate.value);
        }
        MarkedString2.is = is;
      })(MarkedString || (exports3.MarkedString = MarkedString = {}));
      var Hover;
      (function(Hover2) {
        function is(value) {
          var candidate = value;
          return !!candidate && Is.objectLiteral(candidate) && (MarkupContent.is(candidate.contents) || MarkedString.is(candidate.contents) || Is.typedArray(candidate.contents, MarkedString.is)) && (value.range === void 0 || Range.is(value.range));
        }
        Hover2.is = is;
      })(Hover || (exports3.Hover = Hover = {}));
      var ParameterInformation;
      (function(ParameterInformation2) {
        function create(label, documentation) {
          return documentation ? { label, documentation } : { label };
        }
        ParameterInformation2.create = create;
      })(ParameterInformation || (exports3.ParameterInformation = ParameterInformation = {}));
      var SignatureInformation;
      (function(SignatureInformation2) {
        function create(label, documentation) {
          var parameters = [];
          for (var _i = 2; _i < arguments.length; _i++) {
            parameters[_i - 2] = arguments[_i];
          }
          var result = { label };
          if (Is.defined(documentation)) {
            result.documentation = documentation;
          }
          if (Is.defined(parameters)) {
            result.parameters = parameters;
          } else {
            result.parameters = [];
          }
          return result;
        }
        SignatureInformation2.create = create;
      })(SignatureInformation || (exports3.SignatureInformation = SignatureInformation = {}));
      var DocumentHighlightKind;
      (function(DocumentHighlightKind2) {
        DocumentHighlightKind2.Text = 1;
        DocumentHighlightKind2.Read = 2;
        DocumentHighlightKind2.Write = 3;
      })(DocumentHighlightKind || (exports3.DocumentHighlightKind = DocumentHighlightKind = {}));
      var DocumentHighlight;
      (function(DocumentHighlight2) {
        function create(range, kind) {
          var result = { range };
          if (Is.number(kind)) {
            result.kind = kind;
          }
          return result;
        }
        DocumentHighlight2.create = create;
      })(DocumentHighlight || (exports3.DocumentHighlight = DocumentHighlight = {}));
      var SymbolKind;
      (function(SymbolKind2) {
        SymbolKind2.File = 1;
        SymbolKind2.Module = 2;
        SymbolKind2.Namespace = 3;
        SymbolKind2.Package = 4;
        SymbolKind2.Class = 5;
        SymbolKind2.Method = 6;
        SymbolKind2.Property = 7;
        SymbolKind2.Field = 8;
        SymbolKind2.Constructor = 9;
        SymbolKind2.Enum = 10;
        SymbolKind2.Interface = 11;
        SymbolKind2.Function = 12;
        SymbolKind2.Variable = 13;
        SymbolKind2.Constant = 14;
        SymbolKind2.String = 15;
        SymbolKind2.Number = 16;
        SymbolKind2.Boolean = 17;
        SymbolKind2.Array = 18;
        SymbolKind2.Object = 19;
        SymbolKind2.Key = 20;
        SymbolKind2.Null = 21;
        SymbolKind2.EnumMember = 22;
        SymbolKind2.Struct = 23;
        SymbolKind2.Event = 24;
        SymbolKind2.Operator = 25;
        SymbolKind2.TypeParameter = 26;
      })(SymbolKind || (exports3.SymbolKind = SymbolKind = {}));
      var SymbolTag;
      (function(SymbolTag2) {
        SymbolTag2.Deprecated = 1;
      })(SymbolTag || (exports3.SymbolTag = SymbolTag = {}));
      var SymbolInformation;
      (function(SymbolInformation2) {
        function create(name, kind, range, uri, containerName) {
          var result = {
            name,
            kind,
            location: { uri, range }
          };
          if (containerName) {
            result.containerName = containerName;
          }
          return result;
        }
        SymbolInformation2.create = create;
      })(SymbolInformation || (exports3.SymbolInformation = SymbolInformation = {}));
      var WorkspaceSymbol;
      (function(WorkspaceSymbol2) {
        function create(name, kind, uri, range) {
          return range !== void 0 ? { name, kind, location: { uri, range } } : { name, kind, location: { uri } };
        }
        WorkspaceSymbol2.create = create;
      })(WorkspaceSymbol || (exports3.WorkspaceSymbol = WorkspaceSymbol = {}));
      var DocumentSymbol;
      (function(DocumentSymbol2) {
        function create(name, detail, kind, range, selectionRange, children) {
          var result = {
            name,
            detail,
            kind,
            range,
            selectionRange
          };
          if (children !== void 0) {
            result.children = children;
          }
          return result;
        }
        DocumentSymbol2.create = create;
        function is(value) {
          var candidate = value;
          return candidate && Is.string(candidate.name) && Is.number(candidate.kind) && Range.is(candidate.range) && Range.is(candidate.selectionRange) && (candidate.detail === void 0 || Is.string(candidate.detail)) && (candidate.deprecated === void 0 || Is.boolean(candidate.deprecated)) && (candidate.children === void 0 || Array.isArray(candidate.children)) && (candidate.tags === void 0 || Array.isArray(candidate.tags));
        }
        DocumentSymbol2.is = is;
      })(DocumentSymbol || (exports3.DocumentSymbol = DocumentSymbol = {}));
      var CodeActionKind;
      (function(CodeActionKind2) {
        CodeActionKind2.Empty = "";
        CodeActionKind2.QuickFix = "quickfix";
        CodeActionKind2.Refactor = "refactor";
        CodeActionKind2.RefactorExtract = "refactor.extract";
        CodeActionKind2.RefactorInline = "refactor.inline";
        CodeActionKind2.RefactorRewrite = "refactor.rewrite";
        CodeActionKind2.Source = "source";
        CodeActionKind2.SourceOrganizeImports = "source.organizeImports";
        CodeActionKind2.SourceFixAll = "source.fixAll";
      })(CodeActionKind || (exports3.CodeActionKind = CodeActionKind = {}));
      var CodeActionTriggerKind;
      (function(CodeActionTriggerKind2) {
        CodeActionTriggerKind2.Invoked = 1;
        CodeActionTriggerKind2.Automatic = 2;
      })(CodeActionTriggerKind || (exports3.CodeActionTriggerKind = CodeActionTriggerKind = {}));
      var CodeActionContext;
      (function(CodeActionContext2) {
        function create(diagnostics, only, triggerKind) {
          var result = { diagnostics };
          if (only !== void 0 && only !== null) {
            result.only = only;
          }
          if (triggerKind !== void 0 && triggerKind !== null) {
            result.triggerKind = triggerKind;
          }
          return result;
        }
        CodeActionContext2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Is.typedArray(candidate.diagnostics, Diagnostic.is) && (candidate.only === void 0 || Is.typedArray(candidate.only, Is.string)) && (candidate.triggerKind === void 0 || candidate.triggerKind === CodeActionTriggerKind.Invoked || candidate.triggerKind === CodeActionTriggerKind.Automatic);
        }
        CodeActionContext2.is = is;
      })(CodeActionContext || (exports3.CodeActionContext = CodeActionContext = {}));
      var CodeAction;
      (function(CodeAction2) {
        function create(title, kindOrCommandOrEdit, kind) {
          var result = { title };
          var checkKind = true;
          if (typeof kindOrCommandOrEdit === "string") {
            checkKind = false;
            result.kind = kindOrCommandOrEdit;
          } else if (Command.is(kindOrCommandOrEdit)) {
            result.command = kindOrCommandOrEdit;
          } else {
            result.edit = kindOrCommandOrEdit;
          }
          if (checkKind && kind !== void 0) {
            result.kind = kind;
          }
          return result;
        }
        CodeAction2.create = create;
        function is(value) {
          var candidate = value;
          return candidate && Is.string(candidate.title) && (candidate.diagnostics === void 0 || Is.typedArray(candidate.diagnostics, Diagnostic.is)) && (candidate.kind === void 0 || Is.string(candidate.kind)) && (candidate.edit !== void 0 || candidate.command !== void 0) && (candidate.command === void 0 || Command.is(candidate.command)) && (candidate.isPreferred === void 0 || Is.boolean(candidate.isPreferred)) && (candidate.edit === void 0 || WorkspaceEdit.is(candidate.edit));
        }
        CodeAction2.is = is;
      })(CodeAction || (exports3.CodeAction = CodeAction = {}));
      var CodeLens;
      (function(CodeLens2) {
        function create(range, data) {
          var result = { range };
          if (Is.defined(data)) {
            result.data = data;
          }
          return result;
        }
        CodeLens2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Range.is(candidate.range) && (Is.undefined(candidate.command) || Command.is(candidate.command));
        }
        CodeLens2.is = is;
      })(CodeLens || (exports3.CodeLens = CodeLens = {}));
      var FormattingOptions;
      (function(FormattingOptions2) {
        function create(tabSize, insertSpaces) {
          return { tabSize, insertSpaces };
        }
        FormattingOptions2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Is.uinteger(candidate.tabSize) && Is.boolean(candidate.insertSpaces);
        }
        FormattingOptions2.is = is;
      })(FormattingOptions || (exports3.FormattingOptions = FormattingOptions = {}));
      var DocumentLink;
      (function(DocumentLink2) {
        function create(range, target, data) {
          return { range, target, data };
        }
        DocumentLink2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Range.is(candidate.range) && (Is.undefined(candidate.target) || Is.string(candidate.target));
        }
        DocumentLink2.is = is;
      })(DocumentLink || (exports3.DocumentLink = DocumentLink = {}));
      var SelectionRange;
      (function(SelectionRange2) {
        function create(range, parent) {
          return { range, parent };
        }
        SelectionRange2.create = create;
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && Range.is(candidate.range) && (candidate.parent === void 0 || SelectionRange2.is(candidate.parent));
        }
        SelectionRange2.is = is;
      })(SelectionRange || (exports3.SelectionRange = SelectionRange = {}));
      var SemanticTokenTypes;
      (function(SemanticTokenTypes2) {
        SemanticTokenTypes2["namespace"] = "namespace";
        SemanticTokenTypes2["type"] = "type";
        SemanticTokenTypes2["class"] = "class";
        SemanticTokenTypes2["enum"] = "enum";
        SemanticTokenTypes2["interface"] = "interface";
        SemanticTokenTypes2["struct"] = "struct";
        SemanticTokenTypes2["typeParameter"] = "typeParameter";
        SemanticTokenTypes2["parameter"] = "parameter";
        SemanticTokenTypes2["variable"] = "variable";
        SemanticTokenTypes2["property"] = "property";
        SemanticTokenTypes2["enumMember"] = "enumMember";
        SemanticTokenTypes2["event"] = "event";
        SemanticTokenTypes2["function"] = "function";
        SemanticTokenTypes2["method"] = "method";
        SemanticTokenTypes2["macro"] = "macro";
        SemanticTokenTypes2["keyword"] = "keyword";
        SemanticTokenTypes2["modifier"] = "modifier";
        SemanticTokenTypes2["comment"] = "comment";
        SemanticTokenTypes2["string"] = "string";
        SemanticTokenTypes2["number"] = "number";
        SemanticTokenTypes2["regexp"] = "regexp";
        SemanticTokenTypes2["operator"] = "operator";
        SemanticTokenTypes2["decorator"] = "decorator";
      })(SemanticTokenTypes || (exports3.SemanticTokenTypes = SemanticTokenTypes = {}));
      var SemanticTokenModifiers;
      (function(SemanticTokenModifiers2) {
        SemanticTokenModifiers2["declaration"] = "declaration";
        SemanticTokenModifiers2["definition"] = "definition";
        SemanticTokenModifiers2["readonly"] = "readonly";
        SemanticTokenModifiers2["static"] = "static";
        SemanticTokenModifiers2["deprecated"] = "deprecated";
        SemanticTokenModifiers2["abstract"] = "abstract";
        SemanticTokenModifiers2["async"] = "async";
        SemanticTokenModifiers2["modification"] = "modification";
        SemanticTokenModifiers2["documentation"] = "documentation";
        SemanticTokenModifiers2["defaultLibrary"] = "defaultLibrary";
      })(SemanticTokenModifiers || (exports3.SemanticTokenModifiers = SemanticTokenModifiers = {}));
      var SemanticTokens;
      (function(SemanticTokens2) {
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && (candidate.resultId === void 0 || typeof candidate.resultId === "string") && Array.isArray(candidate.data) && (candidate.data.length === 0 || typeof candidate.data[0] === "number");
        }
        SemanticTokens2.is = is;
      })(SemanticTokens || (exports3.SemanticTokens = SemanticTokens = {}));
      var InlineValueText;
      (function(InlineValueText2) {
        function create(range, text) {
          return { range, text };
        }
        InlineValueText2.create = create;
        function is(value) {
          var candidate = value;
          return candidate !== void 0 && candidate !== null && Range.is(candidate.range) && Is.string(candidate.text);
        }
        InlineValueText2.is = is;
      })(InlineValueText || (exports3.InlineValueText = InlineValueText = {}));
      var InlineValueVariableLookup;
      (function(InlineValueVariableLookup2) {
        function create(range, variableName, caseSensitiveLookup) {
          return { range, variableName, caseSensitiveLookup };
        }
        InlineValueVariableLookup2.create = create;
        function is(value) {
          var candidate = value;
          return candidate !== void 0 && candidate !== null && Range.is(candidate.range) && Is.boolean(candidate.caseSensitiveLookup) && (Is.string(candidate.variableName) || candidate.variableName === void 0);
        }
        InlineValueVariableLookup2.is = is;
      })(InlineValueVariableLookup || (exports3.InlineValueVariableLookup = InlineValueVariableLookup = {}));
      var InlineValueEvaluatableExpression;
      (function(InlineValueEvaluatableExpression2) {
        function create(range, expression) {
          return { range, expression };
        }
        InlineValueEvaluatableExpression2.create = create;
        function is(value) {
          var candidate = value;
          return candidate !== void 0 && candidate !== null && Range.is(candidate.range) && (Is.string(candidate.expression) || candidate.expression === void 0);
        }
        InlineValueEvaluatableExpression2.is = is;
      })(InlineValueEvaluatableExpression || (exports3.InlineValueEvaluatableExpression = InlineValueEvaluatableExpression = {}));
      var InlineValueContext;
      (function(InlineValueContext2) {
        function create(frameId, stoppedLocation) {
          return { frameId, stoppedLocation };
        }
        InlineValueContext2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Range.is(value.stoppedLocation);
        }
        InlineValueContext2.is = is;
      })(InlineValueContext || (exports3.InlineValueContext = InlineValueContext = {}));
      var InlayHintKind;
      (function(InlayHintKind2) {
        InlayHintKind2.Type = 1;
        InlayHintKind2.Parameter = 2;
        function is(value) {
          return value === 1 || value === 2;
        }
        InlayHintKind2.is = is;
      })(InlayHintKind || (exports3.InlayHintKind = InlayHintKind = {}));
      var InlayHintLabelPart;
      (function(InlayHintLabelPart2) {
        function create(value) {
          return { value };
        }
        InlayHintLabelPart2.create = create;
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && (candidate.tooltip === void 0 || Is.string(candidate.tooltip) || MarkupContent.is(candidate.tooltip)) && (candidate.location === void 0 || Location.is(candidate.location)) && (candidate.command === void 0 || Command.is(candidate.command));
        }
        InlayHintLabelPart2.is = is;
      })(InlayHintLabelPart || (exports3.InlayHintLabelPart = InlayHintLabelPart = {}));
      var InlayHint;
      (function(InlayHint2) {
        function create(position, label, kind) {
          var result = { position, label };
          if (kind !== void 0) {
            result.kind = kind;
          }
          return result;
        }
        InlayHint2.create = create;
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && Position.is(candidate.position) && (Is.string(candidate.label) || Is.typedArray(candidate.label, InlayHintLabelPart.is)) && (candidate.kind === void 0 || InlayHintKind.is(candidate.kind)) && candidate.textEdits === void 0 || Is.typedArray(candidate.textEdits, TextEdit.is) && (candidate.tooltip === void 0 || Is.string(candidate.tooltip) || MarkupContent.is(candidate.tooltip)) && (candidate.paddingLeft === void 0 || Is.boolean(candidate.paddingLeft)) && (candidate.paddingRight === void 0 || Is.boolean(candidate.paddingRight));
        }
        InlayHint2.is = is;
      })(InlayHint || (exports3.InlayHint = InlayHint = {}));
      var StringValue;
      (function(StringValue2) {
        function createSnippet(value) {
          return { kind: "snippet", value };
        }
        StringValue2.createSnippet = createSnippet;
      })(StringValue || (exports3.StringValue = StringValue = {}));
      var InlineCompletionItem;
      (function(InlineCompletionItem2) {
        function create(insertText, filterText, range, command) {
          return { insertText, filterText, range, command };
        }
        InlineCompletionItem2.create = create;
      })(InlineCompletionItem || (exports3.InlineCompletionItem = InlineCompletionItem = {}));
      var InlineCompletionList;
      (function(InlineCompletionList2) {
        function create(items) {
          return { items };
        }
        InlineCompletionList2.create = create;
      })(InlineCompletionList || (exports3.InlineCompletionList = InlineCompletionList = {}));
      var InlineCompletionTriggerKind;
      (function(InlineCompletionTriggerKind2) {
        InlineCompletionTriggerKind2.Invoked = 0;
        InlineCompletionTriggerKind2.Automatic = 1;
      })(InlineCompletionTriggerKind || (exports3.InlineCompletionTriggerKind = InlineCompletionTriggerKind = {}));
      var SelectedCompletionInfo;
      (function(SelectedCompletionInfo2) {
        function create(range, text) {
          return { range, text };
        }
        SelectedCompletionInfo2.create = create;
      })(SelectedCompletionInfo || (exports3.SelectedCompletionInfo = SelectedCompletionInfo = {}));
      var InlineCompletionContext;
      (function(InlineCompletionContext2) {
        function create(triggerKind, selectedCompletionInfo) {
          return { triggerKind, selectedCompletionInfo };
        }
        InlineCompletionContext2.create = create;
      })(InlineCompletionContext || (exports3.InlineCompletionContext = InlineCompletionContext = {}));
      var WorkspaceFolder;
      (function(WorkspaceFolder2) {
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && URI.is(candidate.uri) && Is.string(candidate.name);
        }
        WorkspaceFolder2.is = is;
      })(WorkspaceFolder || (exports3.WorkspaceFolder = WorkspaceFolder = {}));
      exports3.EOL = ["\n", "\r\n", "\r"];
      var TextDocument;
      (function(TextDocument2) {
        function create(uri, languageId, version, content) {
          return new FullTextDocument(uri, languageId, version, content);
        }
        TextDocument2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Is.string(candidate.uri) && (Is.undefined(candidate.languageId) || Is.string(candidate.languageId)) && Is.uinteger(candidate.lineCount) && Is.func(candidate.getText) && Is.func(candidate.positionAt) && Is.func(candidate.offsetAt) ? true : false;
        }
        TextDocument2.is = is;
        function applyEdits(document2, edits) {
          var text = document2.getText();
          var sortedEdits = mergeSort(edits, function(a, b) {
            var diff = a.range.start.line - b.range.start.line;
            if (diff === 0) {
              return a.range.start.character - b.range.start.character;
            }
            return diff;
          });
          var lastModifiedOffset = text.length;
          for (var i = sortedEdits.length - 1; i >= 0; i--) {
            var e = sortedEdits[i];
            var startOffset = document2.offsetAt(e.range.start);
            var endOffset = document2.offsetAt(e.range.end);
            if (endOffset <= lastModifiedOffset) {
              text = text.substring(0, startOffset) + e.newText + text.substring(endOffset, text.length);
            } else {
              throw new Error("Overlapping edit");
            }
            lastModifiedOffset = startOffset;
          }
          return text;
        }
        TextDocument2.applyEdits = applyEdits;
        function mergeSort(data, compare) {
          if (data.length <= 1) {
            return data;
          }
          var p = data.length / 2 | 0;
          var left = data.slice(0, p);
          var right = data.slice(p);
          mergeSort(left, compare);
          mergeSort(right, compare);
          var leftIdx = 0;
          var rightIdx = 0;
          var i = 0;
          while (leftIdx < left.length && rightIdx < right.length) {
            var ret = compare(left[leftIdx], right[rightIdx]);
            if (ret <= 0) {
              data[i++] = left[leftIdx++];
            } else {
              data[i++] = right[rightIdx++];
            }
          }
          while (leftIdx < left.length) {
            data[i++] = left[leftIdx++];
          }
          while (rightIdx < right.length) {
            data[i++] = right[rightIdx++];
          }
          return data;
        }
      })(TextDocument || (exports3.TextDocument = TextDocument = {}));
      var FullTextDocument = (
        /** @class */
        function() {
          function FullTextDocument2(uri, languageId, version, content) {
            this._uri = uri;
            this._languageId = languageId;
            this._version = version;
            this._content = content;
            this._lineOffsets = void 0;
          }
          Object.defineProperty(FullTextDocument2.prototype, "uri", {
            get: function() {
              return this._uri;
            },
            enumerable: false,
            configurable: true
          });
          Object.defineProperty(FullTextDocument2.prototype, "languageId", {
            get: function() {
              return this._languageId;
            },
            enumerable: false,
            configurable: true
          });
          Object.defineProperty(FullTextDocument2.prototype, "version", {
            get: function() {
              return this._version;
            },
            enumerable: false,
            configurable: true
          });
          FullTextDocument2.prototype.getText = function(range) {
            if (range) {
              var start = this.offsetAt(range.start);
              var end = this.offsetAt(range.end);
              return this._content.substring(start, end);
            }
            return this._content;
          };
          FullTextDocument2.prototype.update = function(event, version) {
            this._content = event.text;
            this._version = version;
            this._lineOffsets = void 0;
          };
          FullTextDocument2.prototype.getLineOffsets = function() {
            if (this._lineOffsets === void 0) {
              var lineOffsets = [];
              var text = this._content;
              var isLineStart = true;
              for (var i = 0; i < text.length; i++) {
                if (isLineStart) {
                  lineOffsets.push(i);
                  isLineStart = false;
                }
                var ch = text.charAt(i);
                isLineStart = ch === "\r" || ch === "\n";
                if (ch === "\r" && i + 1 < text.length && text.charAt(i + 1) === "\n") {
                  i++;
                }
              }
              if (isLineStart && text.length > 0) {
                lineOffsets.push(text.length);
              }
              this._lineOffsets = lineOffsets;
            }
            return this._lineOffsets;
          };
          FullTextDocument2.prototype.positionAt = function(offset) {
            offset = Math.max(Math.min(offset, this._content.length), 0);
            var lineOffsets = this.getLineOffsets();
            var low = 0, high = lineOffsets.length;
            if (high === 0) {
              return Position.create(0, offset);
            }
            while (low < high) {
              var mid = Math.floor((low + high) / 2);
              if (lineOffsets[mid] > offset) {
                high = mid;
              } else {
                low = mid + 1;
              }
            }
            var line = low - 1;
            return Position.create(line, offset - lineOffsets[line]);
          };
          FullTextDocument2.prototype.offsetAt = function(position) {
            var lineOffsets = this.getLineOffsets();
            if (position.line >= lineOffsets.length) {
              return this._content.length;
            } else if (position.line < 0) {
              return 0;
            }
            var lineOffset = lineOffsets[position.line];
            var nextLineOffset = position.line + 1 < lineOffsets.length ? lineOffsets[position.line + 1] : this._content.length;
            return Math.max(Math.min(lineOffset + position.character, nextLineOffset), lineOffset);
          };
          Object.defineProperty(FullTextDocument2.prototype, "lineCount", {
            get: function() {
              return this.getLineOffsets().length;
            },
            enumerable: false,
            configurable: true
          });
          return FullTextDocument2;
        }()
      );
      var Is;
      (function(Is2) {
        var toString = Object.prototype.toString;
        function defined(value) {
          return typeof value !== "undefined";
        }
        Is2.defined = defined;
        function undefined2(value) {
          return typeof value === "undefined";
        }
        Is2.undefined = undefined2;
        function boolean(value) {
          return value === true || value === false;
        }
        Is2.boolean = boolean;
        function string(value) {
          return toString.call(value) === "[object String]";
        }
        Is2.string = string;
        function number(value) {
          return toString.call(value) === "[object Number]";
        }
        Is2.number = number;
        function numberRange(value, min, max) {
          return toString.call(value) === "[object Number]" && min <= value && value <= max;
        }
        Is2.numberRange = numberRange;
        function integer2(value) {
          return toString.call(value) === "[object Number]" && -2147483648 <= value && value <= 2147483647;
        }
        Is2.integer = integer2;
        function uinteger2(value) {
          return toString.call(value) === "[object Number]" && 0 <= value && value <= 2147483647;
        }
        Is2.uinteger = uinteger2;
        function func(value) {
          return toString.call(value) === "[object Function]";
        }
        Is2.func = func;
        function objectLiteral(value) {
          return value !== null && typeof value === "object";
        }
        Is2.objectLiteral = objectLiteral;
        function typedArray(value, check) {
          return Array.isArray(value) && value.every(check);
        }
        Is2.typedArray = typedArray;
      })(Is || (Is = {}));
    });
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/messages.js
var require_messages2 = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/messages.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ProtocolNotificationType = exports2.ProtocolNotificationType0 = exports2.ProtocolRequestType = exports2.ProtocolRequestType0 = exports2.RegistrationType = exports2.MessageDirection = void 0;
    var vscode_jsonrpc_1 = require_main();
    var MessageDirection;
    (function(MessageDirection2) {
      MessageDirection2["clientToServer"] = "clientToServer";
      MessageDirection2["serverToClient"] = "serverToClient";
      MessageDirection2["both"] = "both";
    })(MessageDirection || (exports2.MessageDirection = MessageDirection = {}));
    var RegistrationType = class {
      constructor(method) {
        this.method = method;
      }
    };
    exports2.RegistrationType = RegistrationType;
    var ProtocolRequestType0 = class extends vscode_jsonrpc_1.RequestType0 {
      constructor(method) {
        super(method);
      }
    };
    exports2.ProtocolRequestType0 = ProtocolRequestType0;
    var ProtocolRequestType = class extends vscode_jsonrpc_1.RequestType {
      constructor(method) {
        super(method, vscode_jsonrpc_1.ParameterStructures.byName);
      }
    };
    exports2.ProtocolRequestType = ProtocolRequestType;
    var ProtocolNotificationType0 = class extends vscode_jsonrpc_1.NotificationType0 {
      constructor(method) {
        super(method);
      }
    };
    exports2.ProtocolNotificationType0 = ProtocolNotificationType0;
    var ProtocolNotificationType = class extends vscode_jsonrpc_1.NotificationType {
      constructor(method) {
        super(method, vscode_jsonrpc_1.ParameterStructures.byName);
      }
    };
    exports2.ProtocolNotificationType = ProtocolNotificationType;
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/utils/is.js
var require_is3 = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/utils/is.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.objectLiteral = exports2.typedArray = exports2.stringArray = exports2.array = exports2.func = exports2.error = exports2.number = exports2.string = exports2.boolean = void 0;
    function boolean(value) {
      return value === true || value === false;
    }
    exports2.boolean = boolean;
    function string(value) {
      return typeof value === "string" || value instanceof String;
    }
    exports2.string = string;
    function number(value) {
      return typeof value === "number" || value instanceof Number;
    }
    exports2.number = number;
    function error(value) {
      return value instanceof Error;
    }
    exports2.error = error;
    function func(value) {
      return typeof value === "function";
    }
    exports2.func = func;
    function array(value) {
      return Array.isArray(value);
    }
    exports2.array = array;
    function stringArray(value) {
      return array(value) && value.every((elem) => string(elem));
    }
    exports2.stringArray = stringArray;
    function typedArray(value, check) {
      return Array.isArray(value) && value.every(check);
    }
    exports2.typedArray = typedArray;
    function objectLiteral(value) {
      return value !== null && typeof value === "object";
    }
    exports2.objectLiteral = objectLiteral;
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.implementation.js
var require_protocol_implementation = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.implementation.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ImplementationRequest = void 0;
    var messages_1 = require_messages2();
    var ImplementationRequest;
    (function(ImplementationRequest2) {
      ImplementationRequest2.method = "textDocument/implementation";
      ImplementationRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      ImplementationRequest2.type = new messages_1.ProtocolRequestType(ImplementationRequest2.method);
    })(ImplementationRequest || (exports2.ImplementationRequest = ImplementationRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.typeDefinition.js
var require_protocol_typeDefinition = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.typeDefinition.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TypeDefinitionRequest = void 0;
    var messages_1 = require_messages2();
    var TypeDefinitionRequest;
    (function(TypeDefinitionRequest2) {
      TypeDefinitionRequest2.method = "textDocument/typeDefinition";
      TypeDefinitionRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      TypeDefinitionRequest2.type = new messages_1.ProtocolRequestType(TypeDefinitionRequest2.method);
    })(TypeDefinitionRequest || (exports2.TypeDefinitionRequest = TypeDefinitionRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.workspaceFolder.js
var require_protocol_workspaceFolder = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.workspaceFolder.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DidChangeWorkspaceFoldersNotification = exports2.WorkspaceFoldersRequest = void 0;
    var messages_1 = require_messages2();
    var WorkspaceFoldersRequest;
    (function(WorkspaceFoldersRequest2) {
      WorkspaceFoldersRequest2.method = "workspace/workspaceFolders";
      WorkspaceFoldersRequest2.messageDirection = messages_1.MessageDirection.serverToClient;
      WorkspaceFoldersRequest2.type = new messages_1.ProtocolRequestType0(WorkspaceFoldersRequest2.method);
    })(WorkspaceFoldersRequest || (exports2.WorkspaceFoldersRequest = WorkspaceFoldersRequest = {}));
    var DidChangeWorkspaceFoldersNotification;
    (function(DidChangeWorkspaceFoldersNotification2) {
      DidChangeWorkspaceFoldersNotification2.method = "workspace/didChangeWorkspaceFolders";
      DidChangeWorkspaceFoldersNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      DidChangeWorkspaceFoldersNotification2.type = new messages_1.ProtocolNotificationType(DidChangeWorkspaceFoldersNotification2.method);
    })(DidChangeWorkspaceFoldersNotification || (exports2.DidChangeWorkspaceFoldersNotification = DidChangeWorkspaceFoldersNotification = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.configuration.js
var require_protocol_configuration = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.configuration.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ConfigurationRequest = void 0;
    var messages_1 = require_messages2();
    var ConfigurationRequest;
    (function(ConfigurationRequest2) {
      ConfigurationRequest2.method = "workspace/configuration";
      ConfigurationRequest2.messageDirection = messages_1.MessageDirection.serverToClient;
      ConfigurationRequest2.type = new messages_1.ProtocolRequestType(ConfigurationRequest2.method);
    })(ConfigurationRequest || (exports2.ConfigurationRequest = ConfigurationRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.colorProvider.js
var require_protocol_colorProvider = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.colorProvider.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ColorPresentationRequest = exports2.DocumentColorRequest = void 0;
    var messages_1 = require_messages2();
    var DocumentColorRequest;
    (function(DocumentColorRequest2) {
      DocumentColorRequest2.method = "textDocument/documentColor";
      DocumentColorRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      DocumentColorRequest2.type = new messages_1.ProtocolRequestType(DocumentColorRequest2.method);
    })(DocumentColorRequest || (exports2.DocumentColorRequest = DocumentColorRequest = {}));
    var ColorPresentationRequest;
    (function(ColorPresentationRequest2) {
      ColorPresentationRequest2.method = "textDocument/colorPresentation";
      ColorPresentationRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      ColorPresentationRequest2.type = new messages_1.ProtocolRequestType(ColorPresentationRequest2.method);
    })(ColorPresentationRequest || (exports2.ColorPresentationRequest = ColorPresentationRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.foldingRange.js
var require_protocol_foldingRange = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.foldingRange.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.FoldingRangeRefreshRequest = exports2.FoldingRangeRequest = void 0;
    var messages_1 = require_messages2();
    var FoldingRangeRequest;
    (function(FoldingRangeRequest2) {
      FoldingRangeRequest2.method = "textDocument/foldingRange";
      FoldingRangeRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      FoldingRangeRequest2.type = new messages_1.ProtocolRequestType(FoldingRangeRequest2.method);
    })(FoldingRangeRequest || (exports2.FoldingRangeRequest = FoldingRangeRequest = {}));
    var FoldingRangeRefreshRequest;
    (function(FoldingRangeRefreshRequest2) {
      FoldingRangeRefreshRequest2.method = `workspace/foldingRange/refresh`;
      FoldingRangeRefreshRequest2.messageDirection = messages_1.MessageDirection.serverToClient;
      FoldingRangeRefreshRequest2.type = new messages_1.ProtocolRequestType0(FoldingRangeRefreshRequest2.method);
    })(FoldingRangeRefreshRequest || (exports2.FoldingRangeRefreshRequest = FoldingRangeRefreshRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.declaration.js
var require_protocol_declaration = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.declaration.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DeclarationRequest = void 0;
    var messages_1 = require_messages2();
    var DeclarationRequest;
    (function(DeclarationRequest2) {
      DeclarationRequest2.method = "textDocument/declaration";
      DeclarationRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      DeclarationRequest2.type = new messages_1.ProtocolRequestType(DeclarationRequest2.method);
    })(DeclarationRequest || (exports2.DeclarationRequest = DeclarationRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.selectionRange.js
var require_protocol_selectionRange = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.selectionRange.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.SelectionRangeRequest = void 0;
    var messages_1 = require_messages2();
    var SelectionRangeRequest;
    (function(SelectionRangeRequest2) {
      SelectionRangeRequest2.method = "textDocument/selectionRange";
      SelectionRangeRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      SelectionRangeRequest2.type = new messages_1.ProtocolRequestType(SelectionRangeRequest2.method);
    })(SelectionRangeRequest || (exports2.SelectionRangeRequest = SelectionRangeRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.progress.js
var require_protocol_progress = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.progress.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.WorkDoneProgressCancelNotification = exports2.WorkDoneProgressCreateRequest = exports2.WorkDoneProgress = void 0;
    var vscode_jsonrpc_1 = require_main();
    var messages_1 = require_messages2();
    var WorkDoneProgress;
    (function(WorkDoneProgress2) {
      WorkDoneProgress2.type = new vscode_jsonrpc_1.ProgressType();
      function is(value) {
        return value === WorkDoneProgress2.type;
      }
      WorkDoneProgress2.is = is;
    })(WorkDoneProgress || (exports2.WorkDoneProgress = WorkDoneProgress = {}));
    var WorkDoneProgressCreateRequest;
    (function(WorkDoneProgressCreateRequest2) {
      WorkDoneProgressCreateRequest2.method = "window/workDoneProgress/create";
      WorkDoneProgressCreateRequest2.messageDirection = messages_1.MessageDirection.serverToClient;
      WorkDoneProgressCreateRequest2.type = new messages_1.ProtocolRequestType(WorkDoneProgressCreateRequest2.method);
    })(WorkDoneProgressCreateRequest || (exports2.WorkDoneProgressCreateRequest = WorkDoneProgressCreateRequest = {}));
    var WorkDoneProgressCancelNotification;
    (function(WorkDoneProgressCancelNotification2) {
      WorkDoneProgressCancelNotification2.method = "window/workDoneProgress/cancel";
      WorkDoneProgressCancelNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      WorkDoneProgressCancelNotification2.type = new messages_1.ProtocolNotificationType(WorkDoneProgressCancelNotification2.method);
    })(WorkDoneProgressCancelNotification || (exports2.WorkDoneProgressCancelNotification = WorkDoneProgressCancelNotification = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.callHierarchy.js
var require_protocol_callHierarchy = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.callHierarchy.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.CallHierarchyOutgoingCallsRequest = exports2.CallHierarchyIncomingCallsRequest = exports2.CallHierarchyPrepareRequest = void 0;
    var messages_1 = require_messages2();
    var CallHierarchyPrepareRequest;
    (function(CallHierarchyPrepareRequest2) {
      CallHierarchyPrepareRequest2.method = "textDocument/prepareCallHierarchy";
      CallHierarchyPrepareRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      CallHierarchyPrepareRequest2.type = new messages_1.ProtocolRequestType(CallHierarchyPrepareRequest2.method);
    })(CallHierarchyPrepareRequest || (exports2.CallHierarchyPrepareRequest = CallHierarchyPrepareRequest = {}));
    var CallHierarchyIncomingCallsRequest;
    (function(CallHierarchyIncomingCallsRequest2) {
      CallHierarchyIncomingCallsRequest2.method = "callHierarchy/incomingCalls";
      CallHierarchyIncomingCallsRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      CallHierarchyIncomingCallsRequest2.type = new messages_1.ProtocolRequestType(CallHierarchyIncomingCallsRequest2.method);
    })(CallHierarchyIncomingCallsRequest || (exports2.CallHierarchyIncomingCallsRequest = CallHierarchyIncomingCallsRequest = {}));
    var CallHierarchyOutgoingCallsRequest;
    (function(CallHierarchyOutgoingCallsRequest2) {
      CallHierarchyOutgoingCallsRequest2.method = "callHierarchy/outgoingCalls";
      CallHierarchyOutgoingCallsRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      CallHierarchyOutgoingCallsRequest2.type = new messages_1.ProtocolRequestType(CallHierarchyOutgoingCallsRequest2.method);
    })(CallHierarchyOutgoingCallsRequest || (exports2.CallHierarchyOutgoingCallsRequest = CallHierarchyOutgoingCallsRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.semanticTokens.js
var require_protocol_semanticTokens = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.semanticTokens.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.SemanticTokensRefreshRequest = exports2.SemanticTokensRangeRequest = exports2.SemanticTokensDeltaRequest = exports2.SemanticTokensRequest = exports2.SemanticTokensRegistrationType = exports2.TokenFormat = void 0;
    var messages_1 = require_messages2();
    var TokenFormat;
    (function(TokenFormat2) {
      TokenFormat2.Relative = "relative";
    })(TokenFormat || (exports2.TokenFormat = TokenFormat = {}));
    var SemanticTokensRegistrationType;
    (function(SemanticTokensRegistrationType2) {
      SemanticTokensRegistrationType2.method = "textDocument/semanticTokens";
      SemanticTokensRegistrationType2.type = new messages_1.RegistrationType(SemanticTokensRegistrationType2.method);
    })(SemanticTokensRegistrationType || (exports2.SemanticTokensRegistrationType = SemanticTokensRegistrationType = {}));
    var SemanticTokensRequest;
    (function(SemanticTokensRequest2) {
      SemanticTokensRequest2.method = "textDocument/semanticTokens/full";
      SemanticTokensRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      SemanticTokensRequest2.type = new messages_1.ProtocolRequestType(SemanticTokensRequest2.method);
      SemanticTokensRequest2.registrationMethod = SemanticTokensRegistrationType.method;
    })(SemanticTokensRequest || (exports2.SemanticTokensRequest = SemanticTokensRequest = {}));
    var SemanticTokensDeltaRequest;
    (function(SemanticTokensDeltaRequest2) {
      SemanticTokensDeltaRequest2.method = "textDocument/semanticTokens/full/delta";
      SemanticTokensDeltaRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      SemanticTokensDeltaRequest2.type = new messages_1.ProtocolRequestType(SemanticTokensDeltaRequest2.method);
      SemanticTokensDeltaRequest2.registrationMethod = SemanticTokensRegistrationType.method;
    })(SemanticTokensDeltaRequest || (exports2.SemanticTokensDeltaRequest = SemanticTokensDeltaRequest = {}));
    var SemanticTokensRangeRequest;
    (function(SemanticTokensRangeRequest2) {
      SemanticTokensRangeRequest2.method = "textDocument/semanticTokens/range";
      SemanticTokensRangeRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      SemanticTokensRangeRequest2.type = new messages_1.ProtocolRequestType(SemanticTokensRangeRequest2.method);
      SemanticTokensRangeRequest2.registrationMethod = SemanticTokensRegistrationType.method;
    })(SemanticTokensRangeRequest || (exports2.SemanticTokensRangeRequest = SemanticTokensRangeRequest = {}));
    var SemanticTokensRefreshRequest;
    (function(SemanticTokensRefreshRequest2) {
      SemanticTokensRefreshRequest2.method = `workspace/semanticTokens/refresh`;
      SemanticTokensRefreshRequest2.messageDirection = messages_1.MessageDirection.serverToClient;
      SemanticTokensRefreshRequest2.type = new messages_1.ProtocolRequestType0(SemanticTokensRefreshRequest2.method);
    })(SemanticTokensRefreshRequest || (exports2.SemanticTokensRefreshRequest = SemanticTokensRefreshRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.showDocument.js
var require_protocol_showDocument = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.showDocument.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ShowDocumentRequest = void 0;
    var messages_1 = require_messages2();
    var ShowDocumentRequest;
    (function(ShowDocumentRequest2) {
      ShowDocumentRequest2.method = "window/showDocument";
      ShowDocumentRequest2.messageDirection = messages_1.MessageDirection.serverToClient;
      ShowDocumentRequest2.type = new messages_1.ProtocolRequestType(ShowDocumentRequest2.method);
    })(ShowDocumentRequest || (exports2.ShowDocumentRequest = ShowDocumentRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.linkedEditingRange.js
var require_protocol_linkedEditingRange = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.linkedEditingRange.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LinkedEditingRangeRequest = void 0;
    var messages_1 = require_messages2();
    var LinkedEditingRangeRequest;
    (function(LinkedEditingRangeRequest2) {
      LinkedEditingRangeRequest2.method = "textDocument/linkedEditingRange";
      LinkedEditingRangeRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      LinkedEditingRangeRequest2.type = new messages_1.ProtocolRequestType(LinkedEditingRangeRequest2.method);
    })(LinkedEditingRangeRequest || (exports2.LinkedEditingRangeRequest = LinkedEditingRangeRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.fileOperations.js
var require_protocol_fileOperations = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.fileOperations.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.WillDeleteFilesRequest = exports2.DidDeleteFilesNotification = exports2.DidRenameFilesNotification = exports2.WillRenameFilesRequest = exports2.DidCreateFilesNotification = exports2.WillCreateFilesRequest = exports2.FileOperationPatternKind = void 0;
    var messages_1 = require_messages2();
    var FileOperationPatternKind;
    (function(FileOperationPatternKind2) {
      FileOperationPatternKind2.file = "file";
      FileOperationPatternKind2.folder = "folder";
    })(FileOperationPatternKind || (exports2.FileOperationPatternKind = FileOperationPatternKind = {}));
    var WillCreateFilesRequest;
    (function(WillCreateFilesRequest2) {
      WillCreateFilesRequest2.method = "workspace/willCreateFiles";
      WillCreateFilesRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      WillCreateFilesRequest2.type = new messages_1.ProtocolRequestType(WillCreateFilesRequest2.method);
    })(WillCreateFilesRequest || (exports2.WillCreateFilesRequest = WillCreateFilesRequest = {}));
    var DidCreateFilesNotification;
    (function(DidCreateFilesNotification2) {
      DidCreateFilesNotification2.method = "workspace/didCreateFiles";
      DidCreateFilesNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      DidCreateFilesNotification2.type = new messages_1.ProtocolNotificationType(DidCreateFilesNotification2.method);
    })(DidCreateFilesNotification || (exports2.DidCreateFilesNotification = DidCreateFilesNotification = {}));
    var WillRenameFilesRequest;
    (function(WillRenameFilesRequest2) {
      WillRenameFilesRequest2.method = "workspace/willRenameFiles";
      WillRenameFilesRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      WillRenameFilesRequest2.type = new messages_1.ProtocolRequestType(WillRenameFilesRequest2.method);
    })(WillRenameFilesRequest || (exports2.WillRenameFilesRequest = WillRenameFilesRequest = {}));
    var DidRenameFilesNotification;
    (function(DidRenameFilesNotification2) {
      DidRenameFilesNotification2.method = "workspace/didRenameFiles";
      DidRenameFilesNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      DidRenameFilesNotification2.type = new messages_1.ProtocolNotificationType(DidRenameFilesNotification2.method);
    })(DidRenameFilesNotification || (exports2.DidRenameFilesNotification = DidRenameFilesNotification = {}));
    var DidDeleteFilesNotification;
    (function(DidDeleteFilesNotification2) {
      DidDeleteFilesNotification2.method = "workspace/didDeleteFiles";
      DidDeleteFilesNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      DidDeleteFilesNotification2.type = new messages_1.ProtocolNotificationType(DidDeleteFilesNotification2.method);
    })(DidDeleteFilesNotification || (exports2.DidDeleteFilesNotification = DidDeleteFilesNotification = {}));
    var WillDeleteFilesRequest;
    (function(WillDeleteFilesRequest2) {
      WillDeleteFilesRequest2.method = "workspace/willDeleteFiles";
      WillDeleteFilesRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      WillDeleteFilesRequest2.type = new messages_1.ProtocolRequestType(WillDeleteFilesRequest2.method);
    })(WillDeleteFilesRequest || (exports2.WillDeleteFilesRequest = WillDeleteFilesRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.moniker.js
var require_protocol_moniker = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.moniker.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.MonikerRequest = exports2.MonikerKind = exports2.UniquenessLevel = void 0;
    var messages_1 = require_messages2();
    var UniquenessLevel;
    (function(UniquenessLevel2) {
      UniquenessLevel2.document = "document";
      UniquenessLevel2.project = "project";
      UniquenessLevel2.group = "group";
      UniquenessLevel2.scheme = "scheme";
      UniquenessLevel2.global = "global";
    })(UniquenessLevel || (exports2.UniquenessLevel = UniquenessLevel = {}));
    var MonikerKind;
    (function(MonikerKind2) {
      MonikerKind2.$import = "import";
      MonikerKind2.$export = "export";
      MonikerKind2.local = "local";
    })(MonikerKind || (exports2.MonikerKind = MonikerKind = {}));
    var MonikerRequest;
    (function(MonikerRequest2) {
      MonikerRequest2.method = "textDocument/moniker";
      MonikerRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      MonikerRequest2.type = new messages_1.ProtocolRequestType(MonikerRequest2.method);
    })(MonikerRequest || (exports2.MonikerRequest = MonikerRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.typeHierarchy.js
var require_protocol_typeHierarchy = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.typeHierarchy.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TypeHierarchySubtypesRequest = exports2.TypeHierarchySupertypesRequest = exports2.TypeHierarchyPrepareRequest = void 0;
    var messages_1 = require_messages2();
    var TypeHierarchyPrepareRequest;
    (function(TypeHierarchyPrepareRequest2) {
      TypeHierarchyPrepareRequest2.method = "textDocument/prepareTypeHierarchy";
      TypeHierarchyPrepareRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      TypeHierarchyPrepareRequest2.type = new messages_1.ProtocolRequestType(TypeHierarchyPrepareRequest2.method);
    })(TypeHierarchyPrepareRequest || (exports2.TypeHierarchyPrepareRequest = TypeHierarchyPrepareRequest = {}));
    var TypeHierarchySupertypesRequest;
    (function(TypeHierarchySupertypesRequest2) {
      TypeHierarchySupertypesRequest2.method = "typeHierarchy/supertypes";
      TypeHierarchySupertypesRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      TypeHierarchySupertypesRequest2.type = new messages_1.ProtocolRequestType(TypeHierarchySupertypesRequest2.method);
    })(TypeHierarchySupertypesRequest || (exports2.TypeHierarchySupertypesRequest = TypeHierarchySupertypesRequest = {}));
    var TypeHierarchySubtypesRequest;
    (function(TypeHierarchySubtypesRequest2) {
      TypeHierarchySubtypesRequest2.method = "typeHierarchy/subtypes";
      TypeHierarchySubtypesRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      TypeHierarchySubtypesRequest2.type = new messages_1.ProtocolRequestType(TypeHierarchySubtypesRequest2.method);
    })(TypeHierarchySubtypesRequest || (exports2.TypeHierarchySubtypesRequest = TypeHierarchySubtypesRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.inlineValue.js
var require_protocol_inlineValue = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.inlineValue.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.InlineValueRefreshRequest = exports2.InlineValueRequest = void 0;
    var messages_1 = require_messages2();
    var InlineValueRequest;
    (function(InlineValueRequest2) {
      InlineValueRequest2.method = "textDocument/inlineValue";
      InlineValueRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      InlineValueRequest2.type = new messages_1.ProtocolRequestType(InlineValueRequest2.method);
    })(InlineValueRequest || (exports2.InlineValueRequest = InlineValueRequest = {}));
    var InlineValueRefreshRequest;
    (function(InlineValueRefreshRequest2) {
      InlineValueRefreshRequest2.method = `workspace/inlineValue/refresh`;
      InlineValueRefreshRequest2.messageDirection = messages_1.MessageDirection.serverToClient;
      InlineValueRefreshRequest2.type = new messages_1.ProtocolRequestType0(InlineValueRefreshRequest2.method);
    })(InlineValueRefreshRequest || (exports2.InlineValueRefreshRequest = InlineValueRefreshRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.inlayHint.js
var require_protocol_inlayHint = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.inlayHint.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.InlayHintRefreshRequest = exports2.InlayHintResolveRequest = exports2.InlayHintRequest = void 0;
    var messages_1 = require_messages2();
    var InlayHintRequest;
    (function(InlayHintRequest2) {
      InlayHintRequest2.method = "textDocument/inlayHint";
      InlayHintRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      InlayHintRequest2.type = new messages_1.ProtocolRequestType(InlayHintRequest2.method);
    })(InlayHintRequest || (exports2.InlayHintRequest = InlayHintRequest = {}));
    var InlayHintResolveRequest;
    (function(InlayHintResolveRequest2) {
      InlayHintResolveRequest2.method = "inlayHint/resolve";
      InlayHintResolveRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      InlayHintResolveRequest2.type = new messages_1.ProtocolRequestType(InlayHintResolveRequest2.method);
    })(InlayHintResolveRequest || (exports2.InlayHintResolveRequest = InlayHintResolveRequest = {}));
    var InlayHintRefreshRequest;
    (function(InlayHintRefreshRequest2) {
      InlayHintRefreshRequest2.method = `workspace/inlayHint/refresh`;
      InlayHintRefreshRequest2.messageDirection = messages_1.MessageDirection.serverToClient;
      InlayHintRefreshRequest2.type = new messages_1.ProtocolRequestType0(InlayHintRefreshRequest2.method);
    })(InlayHintRefreshRequest || (exports2.InlayHintRefreshRequest = InlayHintRefreshRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.diagnostic.js
var require_protocol_diagnostic = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.diagnostic.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DiagnosticRefreshRequest = exports2.WorkspaceDiagnosticRequest = exports2.DocumentDiagnosticRequest = exports2.DocumentDiagnosticReportKind = exports2.DiagnosticServerCancellationData = void 0;
    var vscode_jsonrpc_1 = require_main();
    var Is = require_is3();
    var messages_1 = require_messages2();
    var DiagnosticServerCancellationData;
    (function(DiagnosticServerCancellationData2) {
      function is(value) {
        const candidate = value;
        return candidate && Is.boolean(candidate.retriggerRequest);
      }
      DiagnosticServerCancellationData2.is = is;
    })(DiagnosticServerCancellationData || (exports2.DiagnosticServerCancellationData = DiagnosticServerCancellationData = {}));
    var DocumentDiagnosticReportKind;
    (function(DocumentDiagnosticReportKind2) {
      DocumentDiagnosticReportKind2.Full = "full";
      DocumentDiagnosticReportKind2.Unchanged = "unchanged";
    })(DocumentDiagnosticReportKind || (exports2.DocumentDiagnosticReportKind = DocumentDiagnosticReportKind = {}));
    var DocumentDiagnosticRequest;
    (function(DocumentDiagnosticRequest2) {
      DocumentDiagnosticRequest2.method = "textDocument/diagnostic";
      DocumentDiagnosticRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      DocumentDiagnosticRequest2.type = new messages_1.ProtocolRequestType(DocumentDiagnosticRequest2.method);
      DocumentDiagnosticRequest2.partialResult = new vscode_jsonrpc_1.ProgressType();
    })(DocumentDiagnosticRequest || (exports2.DocumentDiagnosticRequest = DocumentDiagnosticRequest = {}));
    var WorkspaceDiagnosticRequest;
    (function(WorkspaceDiagnosticRequest2) {
      WorkspaceDiagnosticRequest2.method = "workspace/diagnostic";
      WorkspaceDiagnosticRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      WorkspaceDiagnosticRequest2.type = new messages_1.ProtocolRequestType(WorkspaceDiagnosticRequest2.method);
      WorkspaceDiagnosticRequest2.partialResult = new vscode_jsonrpc_1.ProgressType();
    })(WorkspaceDiagnosticRequest || (exports2.WorkspaceDiagnosticRequest = WorkspaceDiagnosticRequest = {}));
    var DiagnosticRefreshRequest;
    (function(DiagnosticRefreshRequest2) {
      DiagnosticRefreshRequest2.method = `workspace/diagnostic/refresh`;
      DiagnosticRefreshRequest2.messageDirection = messages_1.MessageDirection.serverToClient;
      DiagnosticRefreshRequest2.type = new messages_1.ProtocolRequestType0(DiagnosticRefreshRequest2.method);
    })(DiagnosticRefreshRequest || (exports2.DiagnosticRefreshRequest = DiagnosticRefreshRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.js
var require_protocol_notebook = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DidCloseNotebookDocumentNotification = exports2.DidSaveNotebookDocumentNotification = exports2.DidChangeNotebookDocumentNotification = exports2.NotebookCellArrayChange = exports2.DidOpenNotebookDocumentNotification = exports2.NotebookDocumentSyncRegistrationType = exports2.NotebookDocument = exports2.NotebookCell = exports2.ExecutionSummary = exports2.NotebookCellKind = void 0;
    var vscode_languageserver_types_1 = require_main2();
    var Is = require_is3();
    var messages_1 = require_messages2();
    var NotebookCellKind;
    (function(NotebookCellKind2) {
      NotebookCellKind2.Markup = 1;
      NotebookCellKind2.Code = 2;
      function is(value) {
        return value === 1 || value === 2;
      }
      NotebookCellKind2.is = is;
    })(NotebookCellKind || (exports2.NotebookCellKind = NotebookCellKind = {}));
    var ExecutionSummary;
    (function(ExecutionSummary2) {
      function create(executionOrder, success) {
        const result = { executionOrder };
        if (success === true || success === false) {
          result.success = success;
        }
        return result;
      }
      ExecutionSummary2.create = create;
      function is(value) {
        const candidate = value;
        return Is.objectLiteral(candidate) && vscode_languageserver_types_1.uinteger.is(candidate.executionOrder) && (candidate.success === void 0 || Is.boolean(candidate.success));
      }
      ExecutionSummary2.is = is;
      function equals(one, other) {
        if (one === other) {
          return true;
        }
        if (one === null || one === void 0 || other === null || other === void 0) {
          return false;
        }
        return one.executionOrder === other.executionOrder && one.success === other.success;
      }
      ExecutionSummary2.equals = equals;
    })(ExecutionSummary || (exports2.ExecutionSummary = ExecutionSummary = {}));
    var NotebookCell;
    (function(NotebookCell2) {
      function create(kind, document2) {
        return { kind, document: document2 };
      }
      NotebookCell2.create = create;
      function is(value) {
        const candidate = value;
        return Is.objectLiteral(candidate) && NotebookCellKind.is(candidate.kind) && vscode_languageserver_types_1.DocumentUri.is(candidate.document) && (candidate.metadata === void 0 || Is.objectLiteral(candidate.metadata));
      }
      NotebookCell2.is = is;
      function diff(one, two) {
        const result = /* @__PURE__ */ new Set();
        if (one.document !== two.document) {
          result.add("document");
        }
        if (one.kind !== two.kind) {
          result.add("kind");
        }
        if (one.executionSummary !== two.executionSummary) {
          result.add("executionSummary");
        }
        if ((one.metadata !== void 0 || two.metadata !== void 0) && !equalsMetadata(one.metadata, two.metadata)) {
          result.add("metadata");
        }
        if ((one.executionSummary !== void 0 || two.executionSummary !== void 0) && !ExecutionSummary.equals(one.executionSummary, two.executionSummary)) {
          result.add("executionSummary");
        }
        return result;
      }
      NotebookCell2.diff = diff;
      function equalsMetadata(one, other) {
        if (one === other) {
          return true;
        }
        if (one === null || one === void 0 || other === null || other === void 0) {
          return false;
        }
        if (typeof one !== typeof other) {
          return false;
        }
        if (typeof one !== "object") {
          return false;
        }
        const oneArray = Array.isArray(one);
        const otherArray = Array.isArray(other);
        if (oneArray !== otherArray) {
          return false;
        }
        if (oneArray && otherArray) {
          if (one.length !== other.length) {
            return false;
          }
          for (let i = 0; i < one.length; i++) {
            if (!equalsMetadata(one[i], other[i])) {
              return false;
            }
          }
        }
        if (Is.objectLiteral(one) && Is.objectLiteral(other)) {
          const oneKeys = Object.keys(one);
          const otherKeys = Object.keys(other);
          if (oneKeys.length !== otherKeys.length) {
            return false;
          }
          oneKeys.sort();
          otherKeys.sort();
          if (!equalsMetadata(oneKeys, otherKeys)) {
            return false;
          }
          for (let i = 0; i < oneKeys.length; i++) {
            const prop = oneKeys[i];
            if (!equalsMetadata(one[prop], other[prop])) {
              return false;
            }
          }
        }
        return true;
      }
    })(NotebookCell || (exports2.NotebookCell = NotebookCell = {}));
    var NotebookDocument;
    (function(NotebookDocument2) {
      function create(uri, notebookType, version, cells) {
        return { uri, notebookType, version, cells };
      }
      NotebookDocument2.create = create;
      function is(value) {
        const candidate = value;
        return Is.objectLiteral(candidate) && Is.string(candidate.uri) && vscode_languageserver_types_1.integer.is(candidate.version) && Is.typedArray(candidate.cells, NotebookCell.is);
      }
      NotebookDocument2.is = is;
    })(NotebookDocument || (exports2.NotebookDocument = NotebookDocument = {}));
    var NotebookDocumentSyncRegistrationType;
    (function(NotebookDocumentSyncRegistrationType2) {
      NotebookDocumentSyncRegistrationType2.method = "notebookDocument/sync";
      NotebookDocumentSyncRegistrationType2.messageDirection = messages_1.MessageDirection.clientToServer;
      NotebookDocumentSyncRegistrationType2.type = new messages_1.RegistrationType(NotebookDocumentSyncRegistrationType2.method);
    })(NotebookDocumentSyncRegistrationType || (exports2.NotebookDocumentSyncRegistrationType = NotebookDocumentSyncRegistrationType = {}));
    var DidOpenNotebookDocumentNotification;
    (function(DidOpenNotebookDocumentNotification2) {
      DidOpenNotebookDocumentNotification2.method = "notebookDocument/didOpen";
      DidOpenNotebookDocumentNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      DidOpenNotebookDocumentNotification2.type = new messages_1.ProtocolNotificationType(DidOpenNotebookDocumentNotification2.method);
      DidOpenNotebookDocumentNotification2.registrationMethod = NotebookDocumentSyncRegistrationType.method;
    })(DidOpenNotebookDocumentNotification || (exports2.DidOpenNotebookDocumentNotification = DidOpenNotebookDocumentNotification = {}));
    var NotebookCellArrayChange;
    (function(NotebookCellArrayChange2) {
      function is(value) {
        const candidate = value;
        return Is.objectLiteral(candidate) && vscode_languageserver_types_1.uinteger.is(candidate.start) && vscode_languageserver_types_1.uinteger.is(candidate.deleteCount) && (candidate.cells === void 0 || Is.typedArray(candidate.cells, NotebookCell.is));
      }
      NotebookCellArrayChange2.is = is;
      function create(start, deleteCount, cells) {
        const result = { start, deleteCount };
        if (cells !== void 0) {
          result.cells = cells;
        }
        return result;
      }
      NotebookCellArrayChange2.create = create;
    })(NotebookCellArrayChange || (exports2.NotebookCellArrayChange = NotebookCellArrayChange = {}));
    var DidChangeNotebookDocumentNotification;
    (function(DidChangeNotebookDocumentNotification2) {
      DidChangeNotebookDocumentNotification2.method = "notebookDocument/didChange";
      DidChangeNotebookDocumentNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      DidChangeNotebookDocumentNotification2.type = new messages_1.ProtocolNotificationType(DidChangeNotebookDocumentNotification2.method);
      DidChangeNotebookDocumentNotification2.registrationMethod = NotebookDocumentSyncRegistrationType.method;
    })(DidChangeNotebookDocumentNotification || (exports2.DidChangeNotebookDocumentNotification = DidChangeNotebookDocumentNotification = {}));
    var DidSaveNotebookDocumentNotification;
    (function(DidSaveNotebookDocumentNotification2) {
      DidSaveNotebookDocumentNotification2.method = "notebookDocument/didSave";
      DidSaveNotebookDocumentNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      DidSaveNotebookDocumentNotification2.type = new messages_1.ProtocolNotificationType(DidSaveNotebookDocumentNotification2.method);
      DidSaveNotebookDocumentNotification2.registrationMethod = NotebookDocumentSyncRegistrationType.method;
    })(DidSaveNotebookDocumentNotification || (exports2.DidSaveNotebookDocumentNotification = DidSaveNotebookDocumentNotification = {}));
    var DidCloseNotebookDocumentNotification;
    (function(DidCloseNotebookDocumentNotification2) {
      DidCloseNotebookDocumentNotification2.method = "notebookDocument/didClose";
      DidCloseNotebookDocumentNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      DidCloseNotebookDocumentNotification2.type = new messages_1.ProtocolNotificationType(DidCloseNotebookDocumentNotification2.method);
      DidCloseNotebookDocumentNotification2.registrationMethod = NotebookDocumentSyncRegistrationType.method;
    })(DidCloseNotebookDocumentNotification || (exports2.DidCloseNotebookDocumentNotification = DidCloseNotebookDocumentNotification = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.inlineCompletion.js
var require_protocol_inlineCompletion = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.inlineCompletion.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.InlineCompletionRequest = void 0;
    var messages_1 = require_messages2();
    var InlineCompletionRequest;
    (function(InlineCompletionRequest2) {
      InlineCompletionRequest2.method = "textDocument/inlineCompletion";
      InlineCompletionRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      InlineCompletionRequest2.type = new messages_1.ProtocolRequestType(InlineCompletionRequest2.method);
    })(InlineCompletionRequest || (exports2.InlineCompletionRequest = InlineCompletionRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.js
var require_protocol = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.WorkspaceSymbolRequest = exports2.CodeActionResolveRequest = exports2.CodeActionRequest = exports2.DocumentSymbolRequest = exports2.DocumentHighlightRequest = exports2.ReferencesRequest = exports2.DefinitionRequest = exports2.SignatureHelpRequest = exports2.SignatureHelpTriggerKind = exports2.HoverRequest = exports2.CompletionResolveRequest = exports2.CompletionRequest = exports2.CompletionTriggerKind = exports2.PublishDiagnosticsNotification = exports2.WatchKind = exports2.RelativePattern = exports2.FileChangeType = exports2.DidChangeWatchedFilesNotification = exports2.WillSaveTextDocumentWaitUntilRequest = exports2.WillSaveTextDocumentNotification = exports2.TextDocumentSaveReason = exports2.DidSaveTextDocumentNotification = exports2.DidCloseTextDocumentNotification = exports2.DidChangeTextDocumentNotification = exports2.TextDocumentContentChangeEvent = exports2.DidOpenTextDocumentNotification = exports2.TextDocumentSyncKind = exports2.TelemetryEventNotification = exports2.LogMessageNotification = exports2.ShowMessageRequest = exports2.ShowMessageNotification = exports2.MessageType = exports2.DidChangeConfigurationNotification = exports2.ExitNotification = exports2.ShutdownRequest = exports2.InitializedNotification = exports2.InitializeErrorCodes = exports2.InitializeRequest = exports2.WorkDoneProgressOptions = exports2.TextDocumentRegistrationOptions = exports2.StaticRegistrationOptions = exports2.PositionEncodingKind = exports2.FailureHandlingKind = exports2.ResourceOperationKind = exports2.UnregistrationRequest = exports2.RegistrationRequest = exports2.DocumentSelector = exports2.NotebookCellTextDocumentFilter = exports2.NotebookDocumentFilter = exports2.TextDocumentFilter = void 0;
    exports2.MonikerRequest = exports2.MonikerKind = exports2.UniquenessLevel = exports2.WillDeleteFilesRequest = exports2.DidDeleteFilesNotification = exports2.WillRenameFilesRequest = exports2.DidRenameFilesNotification = exports2.WillCreateFilesRequest = exports2.DidCreateFilesNotification = exports2.FileOperationPatternKind = exports2.LinkedEditingRangeRequest = exports2.ShowDocumentRequest = exports2.SemanticTokensRegistrationType = exports2.SemanticTokensRefreshRequest = exports2.SemanticTokensRangeRequest = exports2.SemanticTokensDeltaRequest = exports2.SemanticTokensRequest = exports2.TokenFormat = exports2.CallHierarchyPrepareRequest = exports2.CallHierarchyOutgoingCallsRequest = exports2.CallHierarchyIncomingCallsRequest = exports2.WorkDoneProgressCancelNotification = exports2.WorkDoneProgressCreateRequest = exports2.WorkDoneProgress = exports2.SelectionRangeRequest = exports2.DeclarationRequest = exports2.FoldingRangeRefreshRequest = exports2.FoldingRangeRequest = exports2.ColorPresentationRequest = exports2.DocumentColorRequest = exports2.ConfigurationRequest = exports2.DidChangeWorkspaceFoldersNotification = exports2.WorkspaceFoldersRequest = exports2.TypeDefinitionRequest = exports2.ImplementationRequest = exports2.ApplyWorkspaceEditRequest = exports2.ExecuteCommandRequest = exports2.PrepareRenameRequest = exports2.RenameRequest = exports2.PrepareSupportDefaultBehavior = exports2.DocumentOnTypeFormattingRequest = exports2.DocumentRangesFormattingRequest = exports2.DocumentRangeFormattingRequest = exports2.DocumentFormattingRequest = exports2.DocumentLinkResolveRequest = exports2.DocumentLinkRequest = exports2.CodeLensRefreshRequest = exports2.CodeLensResolveRequest = exports2.CodeLensRequest = exports2.WorkspaceSymbolResolveRequest = void 0;
    exports2.InlineCompletionRequest = exports2.DidCloseNotebookDocumentNotification = exports2.DidSaveNotebookDocumentNotification = exports2.DidChangeNotebookDocumentNotification = exports2.NotebookCellArrayChange = exports2.DidOpenNotebookDocumentNotification = exports2.NotebookDocumentSyncRegistrationType = exports2.NotebookDocument = exports2.NotebookCell = exports2.ExecutionSummary = exports2.NotebookCellKind = exports2.DiagnosticRefreshRequest = exports2.WorkspaceDiagnosticRequest = exports2.DocumentDiagnosticRequest = exports2.DocumentDiagnosticReportKind = exports2.DiagnosticServerCancellationData = exports2.InlayHintRefreshRequest = exports2.InlayHintResolveRequest = exports2.InlayHintRequest = exports2.InlineValueRefreshRequest = exports2.InlineValueRequest = exports2.TypeHierarchySupertypesRequest = exports2.TypeHierarchySubtypesRequest = exports2.TypeHierarchyPrepareRequest = void 0;
    var messages_1 = require_messages2();
    var vscode_languageserver_types_1 = require_main2();
    var Is = require_is3();
    var protocol_implementation_1 = require_protocol_implementation();
    Object.defineProperty(exports2, "ImplementationRequest", { enumerable: true, get: function() {
      return protocol_implementation_1.ImplementationRequest;
    } });
    var protocol_typeDefinition_1 = require_protocol_typeDefinition();
    Object.defineProperty(exports2, "TypeDefinitionRequest", { enumerable: true, get: function() {
      return protocol_typeDefinition_1.TypeDefinitionRequest;
    } });
    var protocol_workspaceFolder_1 = require_protocol_workspaceFolder();
    Object.defineProperty(exports2, "WorkspaceFoldersRequest", { enumerable: true, get: function() {
      return protocol_workspaceFolder_1.WorkspaceFoldersRequest;
    } });
    Object.defineProperty(exports2, "DidChangeWorkspaceFoldersNotification", { enumerable: true, get: function() {
      return protocol_workspaceFolder_1.DidChangeWorkspaceFoldersNotification;
    } });
    var protocol_configuration_1 = require_protocol_configuration();
    Object.defineProperty(exports2, "ConfigurationRequest", { enumerable: true, get: function() {
      return protocol_configuration_1.ConfigurationRequest;
    } });
    var protocol_colorProvider_1 = require_protocol_colorProvider();
    Object.defineProperty(exports2, "DocumentColorRequest", { enumerable: true, get: function() {
      return protocol_colorProvider_1.DocumentColorRequest;
    } });
    Object.defineProperty(exports2, "ColorPresentationRequest", { enumerable: true, get: function() {
      return protocol_colorProvider_1.ColorPresentationRequest;
    } });
    var protocol_foldingRange_1 = require_protocol_foldingRange();
    Object.defineProperty(exports2, "FoldingRangeRequest", { enumerable: true, get: function() {
      return protocol_foldingRange_1.FoldingRangeRequest;
    } });
    Object.defineProperty(exports2, "FoldingRangeRefreshRequest", { enumerable: true, get: function() {
      return protocol_foldingRange_1.FoldingRangeRefreshRequest;
    } });
    var protocol_declaration_1 = require_protocol_declaration();
    Object.defineProperty(exports2, "DeclarationRequest", { enumerable: true, get: function() {
      return protocol_declaration_1.DeclarationRequest;
    } });
    var protocol_selectionRange_1 = require_protocol_selectionRange();
    Object.defineProperty(exports2, "SelectionRangeRequest", { enumerable: true, get: function() {
      return protocol_selectionRange_1.SelectionRangeRequest;
    } });
    var protocol_progress_1 = require_protocol_progress();
    Object.defineProperty(exports2, "WorkDoneProgress", { enumerable: true, get: function() {
      return protocol_progress_1.WorkDoneProgress;
    } });
    Object.defineProperty(exports2, "WorkDoneProgressCreateRequest", { enumerable: true, get: function() {
      return protocol_progress_1.WorkDoneProgressCreateRequest;
    } });
    Object.defineProperty(exports2, "WorkDoneProgressCancelNotification", { enumerable: true, get: function() {
      return protocol_progress_1.WorkDoneProgressCancelNotification;
    } });
    var protocol_callHierarchy_1 = require_protocol_callHierarchy();
    Object.defineProperty(exports2, "CallHierarchyIncomingCallsRequest", { enumerable: true, get: function() {
      return protocol_callHierarchy_1.CallHierarchyIncomingCallsRequest;
    } });
    Object.defineProperty(exports2, "CallHierarchyOutgoingCallsRequest", { enumerable: true, get: function() {
      return protocol_callHierarchy_1.CallHierarchyOutgoingCallsRequest;
    } });
    Object.defineProperty(exports2, "CallHierarchyPrepareRequest", { enumerable: true, get: function() {
      return protocol_callHierarchy_1.CallHierarchyPrepareRequest;
    } });
    var protocol_semanticTokens_1 = require_protocol_semanticTokens();
    Object.defineProperty(exports2, "TokenFormat", { enumerable: true, get: function() {
      return protocol_semanticTokens_1.TokenFormat;
    } });
    Object.defineProperty(exports2, "SemanticTokensRequest", { enumerable: true, get: function() {
      return protocol_semanticTokens_1.SemanticTokensRequest;
    } });
    Object.defineProperty(exports2, "SemanticTokensDeltaRequest", { enumerable: true, get: function() {
      return protocol_semanticTokens_1.SemanticTokensDeltaRequest;
    } });
    Object.defineProperty(exports2, "SemanticTokensRangeRequest", { enumerable: true, get: function() {
      return protocol_semanticTokens_1.SemanticTokensRangeRequest;
    } });
    Object.defineProperty(exports2, "SemanticTokensRefreshRequest", { enumerable: true, get: function() {
      return protocol_semanticTokens_1.SemanticTokensRefreshRequest;
    } });
    Object.defineProperty(exports2, "SemanticTokensRegistrationType", { enumerable: true, get: function() {
      return protocol_semanticTokens_1.SemanticTokensRegistrationType;
    } });
    var protocol_showDocument_1 = require_protocol_showDocument();
    Object.defineProperty(exports2, "ShowDocumentRequest", { enumerable: true, get: function() {
      return protocol_showDocument_1.ShowDocumentRequest;
    } });
    var protocol_linkedEditingRange_1 = require_protocol_linkedEditingRange();
    Object.defineProperty(exports2, "LinkedEditingRangeRequest", { enumerable: true, get: function() {
      return protocol_linkedEditingRange_1.LinkedEditingRangeRequest;
    } });
    var protocol_fileOperations_1 = require_protocol_fileOperations();
    Object.defineProperty(exports2, "FileOperationPatternKind", { enumerable: true, get: function() {
      return protocol_fileOperations_1.FileOperationPatternKind;
    } });
    Object.defineProperty(exports2, "DidCreateFilesNotification", { enumerable: true, get: function() {
      return protocol_fileOperations_1.DidCreateFilesNotification;
    } });
    Object.defineProperty(exports2, "WillCreateFilesRequest", { enumerable: true, get: function() {
      return protocol_fileOperations_1.WillCreateFilesRequest;
    } });
    Object.defineProperty(exports2, "DidRenameFilesNotification", { enumerable: true, get: function() {
      return protocol_fileOperations_1.DidRenameFilesNotification;
    } });
    Object.defineProperty(exports2, "WillRenameFilesRequest", { enumerable: true, get: function() {
      return protocol_fileOperations_1.WillRenameFilesRequest;
    } });
    Object.defineProperty(exports2, "DidDeleteFilesNotification", { enumerable: true, get: function() {
      return protocol_fileOperations_1.DidDeleteFilesNotification;
    } });
    Object.defineProperty(exports2, "WillDeleteFilesRequest", { enumerable: true, get: function() {
      return protocol_fileOperations_1.WillDeleteFilesRequest;
    } });
    var protocol_moniker_1 = require_protocol_moniker();
    Object.defineProperty(exports2, "UniquenessLevel", { enumerable: true, get: function() {
      return protocol_moniker_1.UniquenessLevel;
    } });
    Object.defineProperty(exports2, "MonikerKind", { enumerable: true, get: function() {
      return protocol_moniker_1.MonikerKind;
    } });
    Object.defineProperty(exports2, "MonikerRequest", { enumerable: true, get: function() {
      return protocol_moniker_1.MonikerRequest;
    } });
    var protocol_typeHierarchy_1 = require_protocol_typeHierarchy();
    Object.defineProperty(exports2, "TypeHierarchyPrepareRequest", { enumerable: true, get: function() {
      return protocol_typeHierarchy_1.TypeHierarchyPrepareRequest;
    } });
    Object.defineProperty(exports2, "TypeHierarchySubtypesRequest", { enumerable: true, get: function() {
      return protocol_typeHierarchy_1.TypeHierarchySubtypesRequest;
    } });
    Object.defineProperty(exports2, "TypeHierarchySupertypesRequest", { enumerable: true, get: function() {
      return protocol_typeHierarchy_1.TypeHierarchySupertypesRequest;
    } });
    var protocol_inlineValue_1 = require_protocol_inlineValue();
    Object.defineProperty(exports2, "InlineValueRequest", { enumerable: true, get: function() {
      return protocol_inlineValue_1.InlineValueRequest;
    } });
    Object.defineProperty(exports2, "InlineValueRefreshRequest", { enumerable: true, get: function() {
      return protocol_inlineValue_1.InlineValueRefreshRequest;
    } });
    var protocol_inlayHint_1 = require_protocol_inlayHint();
    Object.defineProperty(exports2, "InlayHintRequest", { enumerable: true, get: function() {
      return protocol_inlayHint_1.InlayHintRequest;
    } });
    Object.defineProperty(exports2, "InlayHintResolveRequest", { enumerable: true, get: function() {
      return protocol_inlayHint_1.InlayHintResolveRequest;
    } });
    Object.defineProperty(exports2, "InlayHintRefreshRequest", { enumerable: true, get: function() {
      return protocol_inlayHint_1.InlayHintRefreshRequest;
    } });
    var protocol_diagnostic_1 = require_protocol_diagnostic();
    Object.defineProperty(exports2, "DiagnosticServerCancellationData", { enumerable: true, get: function() {
      return protocol_diagnostic_1.DiagnosticServerCancellationData;
    } });
    Object.defineProperty(exports2, "DocumentDiagnosticReportKind", { enumerable: true, get: function() {
      return protocol_diagnostic_1.DocumentDiagnosticReportKind;
    } });
    Object.defineProperty(exports2, "DocumentDiagnosticRequest", { enumerable: true, get: function() {
      return protocol_diagnostic_1.DocumentDiagnosticRequest;
    } });
    Object.defineProperty(exports2, "WorkspaceDiagnosticRequest", { enumerable: true, get: function() {
      return protocol_diagnostic_1.WorkspaceDiagnosticRequest;
    } });
    Object.defineProperty(exports2, "DiagnosticRefreshRequest", { enumerable: true, get: function() {
      return protocol_diagnostic_1.DiagnosticRefreshRequest;
    } });
    var protocol_notebook_1 = require_protocol_notebook();
    Object.defineProperty(exports2, "NotebookCellKind", { enumerable: true, get: function() {
      return protocol_notebook_1.NotebookCellKind;
    } });
    Object.defineProperty(exports2, "ExecutionSummary", { enumerable: true, get: function() {
      return protocol_notebook_1.ExecutionSummary;
    } });
    Object.defineProperty(exports2, "NotebookCell", { enumerable: true, get: function() {
      return protocol_notebook_1.NotebookCell;
    } });
    Object.defineProperty(exports2, "NotebookDocument", { enumerable: true, get: function() {
      return protocol_notebook_1.NotebookDocument;
    } });
    Object.defineProperty(exports2, "NotebookDocumentSyncRegistrationType", { enumerable: true, get: function() {
      return protocol_notebook_1.NotebookDocumentSyncRegistrationType;
    } });
    Object.defineProperty(exports2, "DidOpenNotebookDocumentNotification", { enumerable: true, get: function() {
      return protocol_notebook_1.DidOpenNotebookDocumentNotification;
    } });
    Object.defineProperty(exports2, "NotebookCellArrayChange", { enumerable: true, get: function() {
      return protocol_notebook_1.NotebookCellArrayChange;
    } });
    Object.defineProperty(exports2, "DidChangeNotebookDocumentNotification", { enumerable: true, get: function() {
      return protocol_notebook_1.DidChangeNotebookDocumentNotification;
    } });
    Object.defineProperty(exports2, "DidSaveNotebookDocumentNotification", { enumerable: true, get: function() {
      return protocol_notebook_1.DidSaveNotebookDocumentNotification;
    } });
    Object.defineProperty(exports2, "DidCloseNotebookDocumentNotification", { enumerable: true, get: function() {
      return protocol_notebook_1.DidCloseNotebookDocumentNotification;
    } });
    var protocol_inlineCompletion_1 = require_protocol_inlineCompletion();
    Object.defineProperty(exports2, "InlineCompletionRequest", { enumerable: true, get: function() {
      return protocol_inlineCompletion_1.InlineCompletionRequest;
    } });
    var TextDocumentFilter;
    (function(TextDocumentFilter2) {
      function is(value) {
        const candidate = value;
        return Is.string(candidate) || (Is.string(candidate.language) || Is.string(candidate.scheme) || Is.string(candidate.pattern));
      }
      TextDocumentFilter2.is = is;
    })(TextDocumentFilter || (exports2.TextDocumentFilter = TextDocumentFilter = {}));
    var NotebookDocumentFilter;
    (function(NotebookDocumentFilter2) {
      function is(value) {
        const candidate = value;
        return Is.objectLiteral(candidate) && (Is.string(candidate.notebookType) || Is.string(candidate.scheme) || Is.string(candidate.pattern));
      }
      NotebookDocumentFilter2.is = is;
    })(NotebookDocumentFilter || (exports2.NotebookDocumentFilter = NotebookDocumentFilter = {}));
    var NotebookCellTextDocumentFilter;
    (function(NotebookCellTextDocumentFilter2) {
      function is(value) {
        const candidate = value;
        return Is.objectLiteral(candidate) && (Is.string(candidate.notebook) || NotebookDocumentFilter.is(candidate.notebook)) && (candidate.language === void 0 || Is.string(candidate.language));
      }
      NotebookCellTextDocumentFilter2.is = is;
    })(NotebookCellTextDocumentFilter || (exports2.NotebookCellTextDocumentFilter = NotebookCellTextDocumentFilter = {}));
    var DocumentSelector;
    (function(DocumentSelector2) {
      function is(value) {
        if (!Array.isArray(value)) {
          return false;
        }
        for (let elem of value) {
          if (!Is.string(elem) && !TextDocumentFilter.is(elem) && !NotebookCellTextDocumentFilter.is(elem)) {
            return false;
          }
        }
        return true;
      }
      DocumentSelector2.is = is;
    })(DocumentSelector || (exports2.DocumentSelector = DocumentSelector = {}));
    var RegistrationRequest;
    (function(RegistrationRequest2) {
      RegistrationRequest2.method = "client/registerCapability";
      RegistrationRequest2.messageDirection = messages_1.MessageDirection.serverToClient;
      RegistrationRequest2.type = new messages_1.ProtocolRequestType(RegistrationRequest2.method);
    })(RegistrationRequest || (exports2.RegistrationRequest = RegistrationRequest = {}));
    var UnregistrationRequest;
    (function(UnregistrationRequest2) {
      UnregistrationRequest2.method = "client/unregisterCapability";
      UnregistrationRequest2.messageDirection = messages_1.MessageDirection.serverToClient;
      UnregistrationRequest2.type = new messages_1.ProtocolRequestType(UnregistrationRequest2.method);
    })(UnregistrationRequest || (exports2.UnregistrationRequest = UnregistrationRequest = {}));
    var ResourceOperationKind;
    (function(ResourceOperationKind2) {
      ResourceOperationKind2.Create = "create";
      ResourceOperationKind2.Rename = "rename";
      ResourceOperationKind2.Delete = "delete";
    })(ResourceOperationKind || (exports2.ResourceOperationKind = ResourceOperationKind = {}));
    var FailureHandlingKind;
    (function(FailureHandlingKind2) {
      FailureHandlingKind2.Abort = "abort";
      FailureHandlingKind2.Transactional = "transactional";
      FailureHandlingKind2.TextOnlyTransactional = "textOnlyTransactional";
      FailureHandlingKind2.Undo = "undo";
    })(FailureHandlingKind || (exports2.FailureHandlingKind = FailureHandlingKind = {}));
    var PositionEncodingKind;
    (function(PositionEncodingKind2) {
      PositionEncodingKind2.UTF8 = "utf-8";
      PositionEncodingKind2.UTF16 = "utf-16";
      PositionEncodingKind2.UTF32 = "utf-32";
    })(PositionEncodingKind || (exports2.PositionEncodingKind = PositionEncodingKind = {}));
    var StaticRegistrationOptions;
    (function(StaticRegistrationOptions2) {
      function hasId(value) {
        const candidate = value;
        return candidate && Is.string(candidate.id) && candidate.id.length > 0;
      }
      StaticRegistrationOptions2.hasId = hasId;
    })(StaticRegistrationOptions || (exports2.StaticRegistrationOptions = StaticRegistrationOptions = {}));
    var TextDocumentRegistrationOptions;
    (function(TextDocumentRegistrationOptions2) {
      function is(value) {
        const candidate = value;
        return candidate && (candidate.documentSelector === null || DocumentSelector.is(candidate.documentSelector));
      }
      TextDocumentRegistrationOptions2.is = is;
    })(TextDocumentRegistrationOptions || (exports2.TextDocumentRegistrationOptions = TextDocumentRegistrationOptions = {}));
    var WorkDoneProgressOptions;
    (function(WorkDoneProgressOptions2) {
      function is(value) {
        const candidate = value;
        return Is.objectLiteral(candidate) && (candidate.workDoneProgress === void 0 || Is.boolean(candidate.workDoneProgress));
      }
      WorkDoneProgressOptions2.is = is;
      function hasWorkDoneProgress(value) {
        const candidate = value;
        return candidate && Is.boolean(candidate.workDoneProgress);
      }
      WorkDoneProgressOptions2.hasWorkDoneProgress = hasWorkDoneProgress;
    })(WorkDoneProgressOptions || (exports2.WorkDoneProgressOptions = WorkDoneProgressOptions = {}));
    var InitializeRequest;
    (function(InitializeRequest2) {
      InitializeRequest2.method = "initialize";
      InitializeRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      InitializeRequest2.type = new messages_1.ProtocolRequestType(InitializeRequest2.method);
    })(InitializeRequest || (exports2.InitializeRequest = InitializeRequest = {}));
    var InitializeErrorCodes;
    (function(InitializeErrorCodes2) {
      InitializeErrorCodes2.unknownProtocolVersion = 1;
    })(InitializeErrorCodes || (exports2.InitializeErrorCodes = InitializeErrorCodes = {}));
    var InitializedNotification;
    (function(InitializedNotification2) {
      InitializedNotification2.method = "initialized";
      InitializedNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      InitializedNotification2.type = new messages_1.ProtocolNotificationType(InitializedNotification2.method);
    })(InitializedNotification || (exports2.InitializedNotification = InitializedNotification = {}));
    var ShutdownRequest;
    (function(ShutdownRequest2) {
      ShutdownRequest2.method = "shutdown";
      ShutdownRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      ShutdownRequest2.type = new messages_1.ProtocolRequestType0(ShutdownRequest2.method);
    })(ShutdownRequest || (exports2.ShutdownRequest = ShutdownRequest = {}));
    var ExitNotification;
    (function(ExitNotification2) {
      ExitNotification2.method = "exit";
      ExitNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      ExitNotification2.type = new messages_1.ProtocolNotificationType0(ExitNotification2.method);
    })(ExitNotification || (exports2.ExitNotification = ExitNotification = {}));
    var DidChangeConfigurationNotification;
    (function(DidChangeConfigurationNotification2) {
      DidChangeConfigurationNotification2.method = "workspace/didChangeConfiguration";
      DidChangeConfigurationNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      DidChangeConfigurationNotification2.type = new messages_1.ProtocolNotificationType(DidChangeConfigurationNotification2.method);
    })(DidChangeConfigurationNotification || (exports2.DidChangeConfigurationNotification = DidChangeConfigurationNotification = {}));
    var MessageType;
    (function(MessageType2) {
      MessageType2.Error = 1;
      MessageType2.Warning = 2;
      MessageType2.Info = 3;
      MessageType2.Log = 4;
      MessageType2.Debug = 5;
    })(MessageType || (exports2.MessageType = MessageType = {}));
    var ShowMessageNotification;
    (function(ShowMessageNotification2) {
      ShowMessageNotification2.method = "window/showMessage";
      ShowMessageNotification2.messageDirection = messages_1.MessageDirection.serverToClient;
      ShowMessageNotification2.type = new messages_1.ProtocolNotificationType(ShowMessageNotification2.method);
    })(ShowMessageNotification || (exports2.ShowMessageNotification = ShowMessageNotification = {}));
    var ShowMessageRequest;
    (function(ShowMessageRequest2) {
      ShowMessageRequest2.method = "window/showMessageRequest";
      ShowMessageRequest2.messageDirection = messages_1.MessageDirection.serverToClient;
      ShowMessageRequest2.type = new messages_1.ProtocolRequestType(ShowMessageRequest2.method);
    })(ShowMessageRequest || (exports2.ShowMessageRequest = ShowMessageRequest = {}));
    var LogMessageNotification;
    (function(LogMessageNotification2) {
      LogMessageNotification2.method = "window/logMessage";
      LogMessageNotification2.messageDirection = messages_1.MessageDirection.serverToClient;
      LogMessageNotification2.type = new messages_1.ProtocolNotificationType(LogMessageNotification2.method);
    })(LogMessageNotification || (exports2.LogMessageNotification = LogMessageNotification = {}));
    var TelemetryEventNotification;
    (function(TelemetryEventNotification2) {
      TelemetryEventNotification2.method = "telemetry/event";
      TelemetryEventNotification2.messageDirection = messages_1.MessageDirection.serverToClient;
      TelemetryEventNotification2.type = new messages_1.ProtocolNotificationType(TelemetryEventNotification2.method);
    })(TelemetryEventNotification || (exports2.TelemetryEventNotification = TelemetryEventNotification = {}));
    var TextDocumentSyncKind;
    (function(TextDocumentSyncKind2) {
      TextDocumentSyncKind2.None = 0;
      TextDocumentSyncKind2.Full = 1;
      TextDocumentSyncKind2.Incremental = 2;
    })(TextDocumentSyncKind || (exports2.TextDocumentSyncKind = TextDocumentSyncKind = {}));
    var DidOpenTextDocumentNotification;
    (function(DidOpenTextDocumentNotification2) {
      DidOpenTextDocumentNotification2.method = "textDocument/didOpen";
      DidOpenTextDocumentNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      DidOpenTextDocumentNotification2.type = new messages_1.ProtocolNotificationType(DidOpenTextDocumentNotification2.method);
    })(DidOpenTextDocumentNotification || (exports2.DidOpenTextDocumentNotification = DidOpenTextDocumentNotification = {}));
    var TextDocumentContentChangeEvent;
    (function(TextDocumentContentChangeEvent2) {
      function isIncremental(event) {
        let candidate = event;
        return candidate !== void 0 && candidate !== null && typeof candidate.text === "string" && candidate.range !== void 0 && (candidate.rangeLength === void 0 || typeof candidate.rangeLength === "number");
      }
      TextDocumentContentChangeEvent2.isIncremental = isIncremental;
      function isFull(event) {
        let candidate = event;
        return candidate !== void 0 && candidate !== null && typeof candidate.text === "string" && candidate.range === void 0 && candidate.rangeLength === void 0;
      }
      TextDocumentContentChangeEvent2.isFull = isFull;
    })(TextDocumentContentChangeEvent || (exports2.TextDocumentContentChangeEvent = TextDocumentContentChangeEvent = {}));
    var DidChangeTextDocumentNotification;
    (function(DidChangeTextDocumentNotification2) {
      DidChangeTextDocumentNotification2.method = "textDocument/didChange";
      DidChangeTextDocumentNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      DidChangeTextDocumentNotification2.type = new messages_1.ProtocolNotificationType(DidChangeTextDocumentNotification2.method);
    })(DidChangeTextDocumentNotification || (exports2.DidChangeTextDocumentNotification = DidChangeTextDocumentNotification = {}));
    var DidCloseTextDocumentNotification;
    (function(DidCloseTextDocumentNotification2) {
      DidCloseTextDocumentNotification2.method = "textDocument/didClose";
      DidCloseTextDocumentNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      DidCloseTextDocumentNotification2.type = new messages_1.ProtocolNotificationType(DidCloseTextDocumentNotification2.method);
    })(DidCloseTextDocumentNotification || (exports2.DidCloseTextDocumentNotification = DidCloseTextDocumentNotification = {}));
    var DidSaveTextDocumentNotification;
    (function(DidSaveTextDocumentNotification2) {
      DidSaveTextDocumentNotification2.method = "textDocument/didSave";
      DidSaveTextDocumentNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      DidSaveTextDocumentNotification2.type = new messages_1.ProtocolNotificationType(DidSaveTextDocumentNotification2.method);
    })(DidSaveTextDocumentNotification || (exports2.DidSaveTextDocumentNotification = DidSaveTextDocumentNotification = {}));
    var TextDocumentSaveReason;
    (function(TextDocumentSaveReason2) {
      TextDocumentSaveReason2.Manual = 1;
      TextDocumentSaveReason2.AfterDelay = 2;
      TextDocumentSaveReason2.FocusOut = 3;
    })(TextDocumentSaveReason || (exports2.TextDocumentSaveReason = TextDocumentSaveReason = {}));
    var WillSaveTextDocumentNotification;
    (function(WillSaveTextDocumentNotification2) {
      WillSaveTextDocumentNotification2.method = "textDocument/willSave";
      WillSaveTextDocumentNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      WillSaveTextDocumentNotification2.type = new messages_1.ProtocolNotificationType(WillSaveTextDocumentNotification2.method);
    })(WillSaveTextDocumentNotification || (exports2.WillSaveTextDocumentNotification = WillSaveTextDocumentNotification = {}));
    var WillSaveTextDocumentWaitUntilRequest;
    (function(WillSaveTextDocumentWaitUntilRequest2) {
      WillSaveTextDocumentWaitUntilRequest2.method = "textDocument/willSaveWaitUntil";
      WillSaveTextDocumentWaitUntilRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      WillSaveTextDocumentWaitUntilRequest2.type = new messages_1.ProtocolRequestType(WillSaveTextDocumentWaitUntilRequest2.method);
    })(WillSaveTextDocumentWaitUntilRequest || (exports2.WillSaveTextDocumentWaitUntilRequest = WillSaveTextDocumentWaitUntilRequest = {}));
    var DidChangeWatchedFilesNotification;
    (function(DidChangeWatchedFilesNotification2) {
      DidChangeWatchedFilesNotification2.method = "workspace/didChangeWatchedFiles";
      DidChangeWatchedFilesNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      DidChangeWatchedFilesNotification2.type = new messages_1.ProtocolNotificationType(DidChangeWatchedFilesNotification2.method);
    })(DidChangeWatchedFilesNotification || (exports2.DidChangeWatchedFilesNotification = DidChangeWatchedFilesNotification = {}));
    var FileChangeType;
    (function(FileChangeType2) {
      FileChangeType2.Created = 1;
      FileChangeType2.Changed = 2;
      FileChangeType2.Deleted = 3;
    })(FileChangeType || (exports2.FileChangeType = FileChangeType = {}));
    var RelativePattern;
    (function(RelativePattern2) {
      function is(value) {
        const candidate = value;
        return Is.objectLiteral(candidate) && (vscode_languageserver_types_1.URI.is(candidate.baseUri) || vscode_languageserver_types_1.WorkspaceFolder.is(candidate.baseUri)) && Is.string(candidate.pattern);
      }
      RelativePattern2.is = is;
    })(RelativePattern || (exports2.RelativePattern = RelativePattern = {}));
    var WatchKind;
    (function(WatchKind2) {
      WatchKind2.Create = 1;
      WatchKind2.Change = 2;
      WatchKind2.Delete = 4;
    })(WatchKind || (exports2.WatchKind = WatchKind = {}));
    var PublishDiagnosticsNotification;
    (function(PublishDiagnosticsNotification2) {
      PublishDiagnosticsNotification2.method = "textDocument/publishDiagnostics";
      PublishDiagnosticsNotification2.messageDirection = messages_1.MessageDirection.serverToClient;
      PublishDiagnosticsNotification2.type = new messages_1.ProtocolNotificationType(PublishDiagnosticsNotification2.method);
    })(PublishDiagnosticsNotification || (exports2.PublishDiagnosticsNotification = PublishDiagnosticsNotification = {}));
    var CompletionTriggerKind;
    (function(CompletionTriggerKind2) {
      CompletionTriggerKind2.Invoked = 1;
      CompletionTriggerKind2.TriggerCharacter = 2;
      CompletionTriggerKind2.TriggerForIncompleteCompletions = 3;
    })(CompletionTriggerKind || (exports2.CompletionTriggerKind = CompletionTriggerKind = {}));
    var CompletionRequest;
    (function(CompletionRequest2) {
      CompletionRequest2.method = "textDocument/completion";
      CompletionRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      CompletionRequest2.type = new messages_1.ProtocolRequestType(CompletionRequest2.method);
    })(CompletionRequest || (exports2.CompletionRequest = CompletionRequest = {}));
    var CompletionResolveRequest;
    (function(CompletionResolveRequest2) {
      CompletionResolveRequest2.method = "completionItem/resolve";
      CompletionResolveRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      CompletionResolveRequest2.type = new messages_1.ProtocolRequestType(CompletionResolveRequest2.method);
    })(CompletionResolveRequest || (exports2.CompletionResolveRequest = CompletionResolveRequest = {}));
    var HoverRequest;
    (function(HoverRequest2) {
      HoverRequest2.method = "textDocument/hover";
      HoverRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      HoverRequest2.type = new messages_1.ProtocolRequestType(HoverRequest2.method);
    })(HoverRequest || (exports2.HoverRequest = HoverRequest = {}));
    var SignatureHelpTriggerKind;
    (function(SignatureHelpTriggerKind2) {
      SignatureHelpTriggerKind2.Invoked = 1;
      SignatureHelpTriggerKind2.TriggerCharacter = 2;
      SignatureHelpTriggerKind2.ContentChange = 3;
    })(SignatureHelpTriggerKind || (exports2.SignatureHelpTriggerKind = SignatureHelpTriggerKind = {}));
    var SignatureHelpRequest;
    (function(SignatureHelpRequest2) {
      SignatureHelpRequest2.method = "textDocument/signatureHelp";
      SignatureHelpRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      SignatureHelpRequest2.type = new messages_1.ProtocolRequestType(SignatureHelpRequest2.method);
    })(SignatureHelpRequest || (exports2.SignatureHelpRequest = SignatureHelpRequest = {}));
    var DefinitionRequest;
    (function(DefinitionRequest2) {
      DefinitionRequest2.method = "textDocument/definition";
      DefinitionRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      DefinitionRequest2.type = new messages_1.ProtocolRequestType(DefinitionRequest2.method);
    })(DefinitionRequest || (exports2.DefinitionRequest = DefinitionRequest = {}));
    var ReferencesRequest;
    (function(ReferencesRequest2) {
      ReferencesRequest2.method = "textDocument/references";
      ReferencesRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      ReferencesRequest2.type = new messages_1.ProtocolRequestType(ReferencesRequest2.method);
    })(ReferencesRequest || (exports2.ReferencesRequest = ReferencesRequest = {}));
    var DocumentHighlightRequest;
    (function(DocumentHighlightRequest2) {
      DocumentHighlightRequest2.method = "textDocument/documentHighlight";
      DocumentHighlightRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      DocumentHighlightRequest2.type = new messages_1.ProtocolRequestType(DocumentHighlightRequest2.method);
    })(DocumentHighlightRequest || (exports2.DocumentHighlightRequest = DocumentHighlightRequest = {}));
    var DocumentSymbolRequest;
    (function(DocumentSymbolRequest2) {
      DocumentSymbolRequest2.method = "textDocument/documentSymbol";
      DocumentSymbolRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      DocumentSymbolRequest2.type = new messages_1.ProtocolRequestType(DocumentSymbolRequest2.method);
    })(DocumentSymbolRequest || (exports2.DocumentSymbolRequest = DocumentSymbolRequest = {}));
    var CodeActionRequest;
    (function(CodeActionRequest2) {
      CodeActionRequest2.method = "textDocument/codeAction";
      CodeActionRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      CodeActionRequest2.type = new messages_1.ProtocolRequestType(CodeActionRequest2.method);
    })(CodeActionRequest || (exports2.CodeActionRequest = CodeActionRequest = {}));
    var CodeActionResolveRequest;
    (function(CodeActionResolveRequest2) {
      CodeActionResolveRequest2.method = "codeAction/resolve";
      CodeActionResolveRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      CodeActionResolveRequest2.type = new messages_1.ProtocolRequestType(CodeActionResolveRequest2.method);
    })(CodeActionResolveRequest || (exports2.CodeActionResolveRequest = CodeActionResolveRequest = {}));
    var WorkspaceSymbolRequest;
    (function(WorkspaceSymbolRequest2) {
      WorkspaceSymbolRequest2.method = "workspace/symbol";
      WorkspaceSymbolRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      WorkspaceSymbolRequest2.type = new messages_1.ProtocolRequestType(WorkspaceSymbolRequest2.method);
    })(WorkspaceSymbolRequest || (exports2.WorkspaceSymbolRequest = WorkspaceSymbolRequest = {}));
    var WorkspaceSymbolResolveRequest;
    (function(WorkspaceSymbolResolveRequest2) {
      WorkspaceSymbolResolveRequest2.method = "workspaceSymbol/resolve";
      WorkspaceSymbolResolveRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      WorkspaceSymbolResolveRequest2.type = new messages_1.ProtocolRequestType(WorkspaceSymbolResolveRequest2.method);
    })(WorkspaceSymbolResolveRequest || (exports2.WorkspaceSymbolResolveRequest = WorkspaceSymbolResolveRequest = {}));
    var CodeLensRequest;
    (function(CodeLensRequest2) {
      CodeLensRequest2.method = "textDocument/codeLens";
      CodeLensRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      CodeLensRequest2.type = new messages_1.ProtocolRequestType(CodeLensRequest2.method);
    })(CodeLensRequest || (exports2.CodeLensRequest = CodeLensRequest = {}));
    var CodeLensResolveRequest;
    (function(CodeLensResolveRequest2) {
      CodeLensResolveRequest2.method = "codeLens/resolve";
      CodeLensResolveRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      CodeLensResolveRequest2.type = new messages_1.ProtocolRequestType(CodeLensResolveRequest2.method);
    })(CodeLensResolveRequest || (exports2.CodeLensResolveRequest = CodeLensResolveRequest = {}));
    var CodeLensRefreshRequest;
    (function(CodeLensRefreshRequest2) {
      CodeLensRefreshRequest2.method = `workspace/codeLens/refresh`;
      CodeLensRefreshRequest2.messageDirection = messages_1.MessageDirection.serverToClient;
      CodeLensRefreshRequest2.type = new messages_1.ProtocolRequestType0(CodeLensRefreshRequest2.method);
    })(CodeLensRefreshRequest || (exports2.CodeLensRefreshRequest = CodeLensRefreshRequest = {}));
    var DocumentLinkRequest;
    (function(DocumentLinkRequest2) {
      DocumentLinkRequest2.method = "textDocument/documentLink";
      DocumentLinkRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      DocumentLinkRequest2.type = new messages_1.ProtocolRequestType(DocumentLinkRequest2.method);
    })(DocumentLinkRequest || (exports2.DocumentLinkRequest = DocumentLinkRequest = {}));
    var DocumentLinkResolveRequest;
    (function(DocumentLinkResolveRequest2) {
      DocumentLinkResolveRequest2.method = "documentLink/resolve";
      DocumentLinkResolveRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      DocumentLinkResolveRequest2.type = new messages_1.ProtocolRequestType(DocumentLinkResolveRequest2.method);
    })(DocumentLinkResolveRequest || (exports2.DocumentLinkResolveRequest = DocumentLinkResolveRequest = {}));
    var DocumentFormattingRequest;
    (function(DocumentFormattingRequest2) {
      DocumentFormattingRequest2.method = "textDocument/formatting";
      DocumentFormattingRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      DocumentFormattingRequest2.type = new messages_1.ProtocolRequestType(DocumentFormattingRequest2.method);
    })(DocumentFormattingRequest || (exports2.DocumentFormattingRequest = DocumentFormattingRequest = {}));
    var DocumentRangeFormattingRequest;
    (function(DocumentRangeFormattingRequest2) {
      DocumentRangeFormattingRequest2.method = "textDocument/rangeFormatting";
      DocumentRangeFormattingRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      DocumentRangeFormattingRequest2.type = new messages_1.ProtocolRequestType(DocumentRangeFormattingRequest2.method);
    })(DocumentRangeFormattingRequest || (exports2.DocumentRangeFormattingRequest = DocumentRangeFormattingRequest = {}));
    var DocumentRangesFormattingRequest;
    (function(DocumentRangesFormattingRequest2) {
      DocumentRangesFormattingRequest2.method = "textDocument/rangesFormatting";
      DocumentRangesFormattingRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      DocumentRangesFormattingRequest2.type = new messages_1.ProtocolRequestType(DocumentRangesFormattingRequest2.method);
    })(DocumentRangesFormattingRequest || (exports2.DocumentRangesFormattingRequest = DocumentRangesFormattingRequest = {}));
    var DocumentOnTypeFormattingRequest;
    (function(DocumentOnTypeFormattingRequest2) {
      DocumentOnTypeFormattingRequest2.method = "textDocument/onTypeFormatting";
      DocumentOnTypeFormattingRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      DocumentOnTypeFormattingRequest2.type = new messages_1.ProtocolRequestType(DocumentOnTypeFormattingRequest2.method);
    })(DocumentOnTypeFormattingRequest || (exports2.DocumentOnTypeFormattingRequest = DocumentOnTypeFormattingRequest = {}));
    var PrepareSupportDefaultBehavior;
    (function(PrepareSupportDefaultBehavior2) {
      PrepareSupportDefaultBehavior2.Identifier = 1;
    })(PrepareSupportDefaultBehavior || (exports2.PrepareSupportDefaultBehavior = PrepareSupportDefaultBehavior = {}));
    var RenameRequest;
    (function(RenameRequest2) {
      RenameRequest2.method = "textDocument/rename";
      RenameRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      RenameRequest2.type = new messages_1.ProtocolRequestType(RenameRequest2.method);
    })(RenameRequest || (exports2.RenameRequest = RenameRequest = {}));
    var PrepareRenameRequest;
    (function(PrepareRenameRequest2) {
      PrepareRenameRequest2.method = "textDocument/prepareRename";
      PrepareRenameRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      PrepareRenameRequest2.type = new messages_1.ProtocolRequestType(PrepareRenameRequest2.method);
    })(PrepareRenameRequest || (exports2.PrepareRenameRequest = PrepareRenameRequest = {}));
    var ExecuteCommandRequest;
    (function(ExecuteCommandRequest2) {
      ExecuteCommandRequest2.method = "workspace/executeCommand";
      ExecuteCommandRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      ExecuteCommandRequest2.type = new messages_1.ProtocolRequestType(ExecuteCommandRequest2.method);
    })(ExecuteCommandRequest || (exports2.ExecuteCommandRequest = ExecuteCommandRequest = {}));
    var ApplyWorkspaceEditRequest;
    (function(ApplyWorkspaceEditRequest2) {
      ApplyWorkspaceEditRequest2.method = "workspace/applyEdit";
      ApplyWorkspaceEditRequest2.messageDirection = messages_1.MessageDirection.serverToClient;
      ApplyWorkspaceEditRequest2.type = new messages_1.ProtocolRequestType("workspace/applyEdit");
    })(ApplyWorkspaceEditRequest || (exports2.ApplyWorkspaceEditRequest = ApplyWorkspaceEditRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/connection.js
var require_connection2 = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/connection.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createProtocolConnection = void 0;
    var vscode_jsonrpc_1 = require_main();
    function createProtocolConnection(input, output, logger, options) {
      if (vscode_jsonrpc_1.ConnectionStrategy.is(options)) {
        options = { connectionStrategy: options };
      }
      return (0, vscode_jsonrpc_1.createMessageConnection)(input, output, logger, options);
    }
    exports2.createProtocolConnection = createProtocolConnection;
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/api.js
var require_api2 = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/api.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p))
          __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LSPErrorCodes = exports2.createProtocolConnection = void 0;
    __exportStar(require_main(), exports2);
    __exportStar(require_main2(), exports2);
    __exportStar(require_messages2(), exports2);
    __exportStar(require_protocol(), exports2);
    var connection_1 = require_connection2();
    Object.defineProperty(exports2, "createProtocolConnection", { enumerable: true, get: function() {
      return connection_1.createProtocolConnection;
    } });
    var LSPErrorCodes;
    (function(LSPErrorCodes2) {
      LSPErrorCodes2.lspReservedErrorRangeStart = -32899;
      LSPErrorCodes2.RequestFailed = -32803;
      LSPErrorCodes2.ServerCancelled = -32802;
      LSPErrorCodes2.ContentModified = -32801;
      LSPErrorCodes2.RequestCancelled = -32800;
      LSPErrorCodes2.lspReservedErrorRangeEnd = -32800;
    })(LSPErrorCodes || (exports2.LSPErrorCodes = LSPErrorCodes = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/node/main.js
var require_main3 = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/node/main.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p))
          __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createProtocolConnection = void 0;
    var node_1 = require_node();
    __exportStar(require_node(), exports2);
    __exportStar(require_api2(), exports2);
    function createProtocolConnection(input, output, logger, options) {
      return (0, node_1.createMessageConnection)(input, output, logger, options);
    }
    exports2.createProtocolConnection = createProtocolConnection;
  }
});

// node_modules/vscode-languageserver/lib/common/utils/uuid.js
var require_uuid = __commonJS({
  "node_modules/vscode-languageserver/lib/common/utils/uuid.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.generateUuid = exports2.parse = exports2.isUUID = exports2.v4 = exports2.empty = void 0;
    var ValueUUID = class {
      constructor(_value) {
        this._value = _value;
      }
      asHex() {
        return this._value;
      }
      equals(other) {
        return this.asHex() === other.asHex();
      }
    };
    var V4UUID = class extends ValueUUID {
      static _oneOf(array) {
        return array[Math.floor(array.length * Math.random())];
      }
      static _randomHex() {
        return V4UUID._oneOf(V4UUID._chars);
      }
      constructor() {
        super([
          V4UUID._randomHex(),
          V4UUID._randomHex(),
          V4UUID._randomHex(),
          V4UUID._randomHex(),
          V4UUID._randomHex(),
          V4UUID._randomHex(),
          V4UUID._randomHex(),
          V4UUID._randomHex(),
          "-",
          V4UUID._randomHex(),
          V4UUID._randomHex(),
          V4UUID._randomHex(),
          V4UUID._randomHex(),
          "-",
          "4",
          V4UUID._randomHex(),
          V4UUID._randomHex(),
          V4UUID._randomHex(),
          "-",
          V4UUID._oneOf(V4UUID._timeHighBits),
          V4UUID._randomHex(),
          V4UUID._randomHex(),
          V4UUID._randomHex(),
          "-",
          V4UUID._randomHex(),
          V4UUID._randomHex(),
          V4UUID._randomHex(),
          V4UUID._randomHex(),
          V4UUID._randomHex(),
          V4UUID._randomHex(),
          V4UUID._randomHex(),
          V4UUID._randomHex(),
          V4UUID._randomHex(),
          V4UUID._randomHex(),
          V4UUID._randomHex(),
          V4UUID._randomHex()
        ].join(""));
      }
    };
    V4UUID._chars = ["0", "1", "2", "3", "4", "5", "6", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
    V4UUID._timeHighBits = ["8", "9", "a", "b"];
    exports2.empty = new ValueUUID("00000000-0000-0000-0000-000000000000");
    function v4() {
      return new V4UUID();
    }
    exports2.v4 = v4;
    var _UUIDPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    function isUUID(value) {
      return _UUIDPattern.test(value);
    }
    exports2.isUUID = isUUID;
    function parse(value) {
      if (!isUUID(value)) {
        throw new Error("invalid uuid");
      }
      return new ValueUUID(value);
    }
    exports2.parse = parse;
    function generateUuid() {
      return v4().asHex();
    }
    exports2.generateUuid = generateUuid;
  }
});

// node_modules/vscode-languageserver/lib/common/progress.js
var require_progress = __commonJS({
  "node_modules/vscode-languageserver/lib/common/progress.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.attachPartialResult = exports2.ProgressFeature = exports2.attachWorkDone = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var uuid_1 = require_uuid();
    var WorkDoneProgressReporterImpl = class {
      constructor(_connection, _token) {
        this._connection = _connection;
        this._token = _token;
        WorkDoneProgressReporterImpl.Instances.set(this._token, this);
      }
      begin(title, percentage, message, cancellable) {
        let param = {
          kind: "begin",
          title,
          percentage,
          message,
          cancellable
        };
        this._connection.sendProgress(vscode_languageserver_protocol_1.WorkDoneProgress.type, this._token, param);
      }
      report(arg0, arg1) {
        let param = {
          kind: "report"
        };
        if (typeof arg0 === "number") {
          param.percentage = arg0;
          if (arg1 !== void 0) {
            param.message = arg1;
          }
        } else {
          param.message = arg0;
        }
        this._connection.sendProgress(vscode_languageserver_protocol_1.WorkDoneProgress.type, this._token, param);
      }
      done() {
        WorkDoneProgressReporterImpl.Instances.delete(this._token);
        this._connection.sendProgress(vscode_languageserver_protocol_1.WorkDoneProgress.type, this._token, { kind: "end" });
      }
    };
    WorkDoneProgressReporterImpl.Instances = /* @__PURE__ */ new Map();
    var WorkDoneProgressServerReporterImpl = class extends WorkDoneProgressReporterImpl {
      constructor(connection2, token) {
        super(connection2, token);
        this._source = new vscode_languageserver_protocol_1.CancellationTokenSource();
      }
      get token() {
        return this._source.token;
      }
      done() {
        this._source.dispose();
        super.done();
      }
      cancel() {
        this._source.cancel();
      }
    };
    var NullProgressReporter = class {
      constructor() {
      }
      begin() {
      }
      report() {
      }
      done() {
      }
    };
    var NullProgressServerReporter = class extends NullProgressReporter {
      constructor() {
        super();
        this._source = new vscode_languageserver_protocol_1.CancellationTokenSource();
      }
      get token() {
        return this._source.token;
      }
      done() {
        this._source.dispose();
      }
      cancel() {
        this._source.cancel();
      }
    };
    function attachWorkDone(connection2, params) {
      if (params === void 0 || params.workDoneToken === void 0) {
        return new NullProgressReporter();
      }
      const token = params.workDoneToken;
      delete params.workDoneToken;
      return new WorkDoneProgressReporterImpl(connection2, token);
    }
    exports2.attachWorkDone = attachWorkDone;
    var ProgressFeature = (Base) => {
      return class extends Base {
        constructor() {
          super();
          this._progressSupported = false;
        }
        initialize(capabilities) {
          var _a;
          super.initialize(capabilities);
          if (((_a = capabilities == null ? void 0 : capabilities.window) == null ? void 0 : _a.workDoneProgress) === true) {
            this._progressSupported = true;
            this.connection.onNotification(vscode_languageserver_protocol_1.WorkDoneProgressCancelNotification.type, (params) => {
              let progress = WorkDoneProgressReporterImpl.Instances.get(params.token);
              if (progress instanceof WorkDoneProgressServerReporterImpl || progress instanceof NullProgressServerReporter) {
                progress.cancel();
              }
            });
          }
        }
        attachWorkDoneProgress(token) {
          if (token === void 0) {
            return new NullProgressReporter();
          } else {
            return new WorkDoneProgressReporterImpl(this.connection, token);
          }
        }
        createWorkDoneProgress() {
          if (this._progressSupported) {
            const token = (0, uuid_1.generateUuid)();
            return this.connection.sendRequest(vscode_languageserver_protocol_1.WorkDoneProgressCreateRequest.type, { token }).then(() => {
              const result = new WorkDoneProgressServerReporterImpl(this.connection, token);
              return result;
            });
          } else {
            return Promise.resolve(new NullProgressServerReporter());
          }
        }
      };
    };
    exports2.ProgressFeature = ProgressFeature;
    var ResultProgress;
    (function(ResultProgress2) {
      ResultProgress2.type = new vscode_languageserver_protocol_1.ProgressType();
    })(ResultProgress || (ResultProgress = {}));
    var ResultProgressReporterImpl = class {
      constructor(_connection, _token) {
        this._connection = _connection;
        this._token = _token;
      }
      report(data) {
        this._connection.sendProgress(ResultProgress.type, this._token, data);
      }
    };
    function attachPartialResult(connection2, params) {
      if (params === void 0 || params.partialResultToken === void 0) {
        return void 0;
      }
      const token = params.partialResultToken;
      delete params.partialResultToken;
      return new ResultProgressReporterImpl(connection2, token);
    }
    exports2.attachPartialResult = attachPartialResult;
  }
});

// node_modules/vscode-languageserver/lib/common/configuration.js
var require_configuration = __commonJS({
  "node_modules/vscode-languageserver/lib/common/configuration.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ConfigurationFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var Is = require_is();
    var ConfigurationFeature = (Base) => {
      return class extends Base {
        getConfiguration(arg) {
          if (!arg) {
            return this._getConfiguration({});
          } else if (Is.string(arg)) {
            return this._getConfiguration({ section: arg });
          } else {
            return this._getConfiguration(arg);
          }
        }
        _getConfiguration(arg) {
          let params = {
            items: Array.isArray(arg) ? arg : [arg]
          };
          return this.connection.sendRequest(vscode_languageserver_protocol_1.ConfigurationRequest.type, params).then((result) => {
            if (Array.isArray(result)) {
              return Array.isArray(arg) ? result : result[0];
            } else {
              return Array.isArray(arg) ? [] : null;
            }
          });
        }
      };
    };
    exports2.ConfigurationFeature = ConfigurationFeature;
  }
});

// node_modules/vscode-languageserver/lib/common/workspaceFolder.js
var require_workspaceFolder = __commonJS({
  "node_modules/vscode-languageserver/lib/common/workspaceFolder.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.WorkspaceFoldersFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var WorkspaceFoldersFeature = (Base) => {
      return class extends Base {
        constructor() {
          super();
          this._notificationIsAutoRegistered = false;
        }
        initialize(capabilities) {
          super.initialize(capabilities);
          let workspaceCapabilities = capabilities.workspace;
          if (workspaceCapabilities && workspaceCapabilities.workspaceFolders) {
            this._onDidChangeWorkspaceFolders = new vscode_languageserver_protocol_1.Emitter();
            this.connection.onNotification(vscode_languageserver_protocol_1.DidChangeWorkspaceFoldersNotification.type, (params) => {
              this._onDidChangeWorkspaceFolders.fire(params.event);
            });
          }
        }
        fillServerCapabilities(capabilities) {
          var _a, _b;
          super.fillServerCapabilities(capabilities);
          const changeNotifications = (_b = (_a = capabilities.workspace) == null ? void 0 : _a.workspaceFolders) == null ? void 0 : _b.changeNotifications;
          this._notificationIsAutoRegistered = changeNotifications === true || typeof changeNotifications === "string";
        }
        getWorkspaceFolders() {
          return this.connection.sendRequest(vscode_languageserver_protocol_1.WorkspaceFoldersRequest.type);
        }
        get onDidChangeWorkspaceFolders() {
          if (!this._onDidChangeWorkspaceFolders) {
            throw new Error("Client doesn't support sending workspace folder change events.");
          }
          if (!this._notificationIsAutoRegistered && !this._unregistration) {
            this._unregistration = this.connection.client.register(vscode_languageserver_protocol_1.DidChangeWorkspaceFoldersNotification.type);
          }
          return this._onDidChangeWorkspaceFolders.event;
        }
      };
    };
    exports2.WorkspaceFoldersFeature = WorkspaceFoldersFeature;
  }
});

// node_modules/vscode-languageserver/lib/common/callHierarchy.js
var require_callHierarchy = __commonJS({
  "node_modules/vscode-languageserver/lib/common/callHierarchy.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.CallHierarchyFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var CallHierarchyFeature = (Base) => {
      return class extends Base {
        get callHierarchy() {
          return {
            onPrepare: (handler) => {
              return this.connection.onRequest(vscode_languageserver_protocol_1.CallHierarchyPrepareRequest.type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params), void 0);
              });
            },
            onIncomingCalls: (handler) => {
              const type = vscode_languageserver_protocol_1.CallHierarchyIncomingCallsRequest.type;
              return this.connection.onRequest(type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
              });
            },
            onOutgoingCalls: (handler) => {
              const type = vscode_languageserver_protocol_1.CallHierarchyOutgoingCallsRequest.type;
              return this.connection.onRequest(type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
              });
            }
          };
        }
      };
    };
    exports2.CallHierarchyFeature = CallHierarchyFeature;
  }
});

// node_modules/vscode-languageserver/lib/common/semanticTokens.js
var require_semanticTokens = __commonJS({
  "node_modules/vscode-languageserver/lib/common/semanticTokens.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.SemanticTokensBuilder = exports2.SemanticTokensDiff = exports2.SemanticTokensFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var SemanticTokensFeature = (Base) => {
      return class extends Base {
        get semanticTokens() {
          return {
            refresh: () => {
              return this.connection.sendRequest(vscode_languageserver_protocol_1.SemanticTokensRefreshRequest.type);
            },
            on: (handler) => {
              const type = vscode_languageserver_protocol_1.SemanticTokensRequest.type;
              return this.connection.onRequest(type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
              });
            },
            onDelta: (handler) => {
              const type = vscode_languageserver_protocol_1.SemanticTokensDeltaRequest.type;
              return this.connection.onRequest(type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
              });
            },
            onRange: (handler) => {
              const type = vscode_languageserver_protocol_1.SemanticTokensRangeRequest.type;
              return this.connection.onRequest(type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
              });
            }
          };
        }
      };
    };
    exports2.SemanticTokensFeature = SemanticTokensFeature;
    var SemanticTokensDiff = class {
      constructor(originalSequence, modifiedSequence) {
        this.originalSequence = originalSequence;
        this.modifiedSequence = modifiedSequence;
      }
      computeDiff() {
        const originalLength = this.originalSequence.length;
        const modifiedLength = this.modifiedSequence.length;
        let startIndex = 0;
        while (startIndex < modifiedLength && startIndex < originalLength && this.originalSequence[startIndex] === this.modifiedSequence[startIndex]) {
          startIndex++;
        }
        if (startIndex < modifiedLength && startIndex < originalLength) {
          let originalEndIndex = originalLength - 1;
          let modifiedEndIndex = modifiedLength - 1;
          while (originalEndIndex >= startIndex && modifiedEndIndex >= startIndex && this.originalSequence[originalEndIndex] === this.modifiedSequence[modifiedEndIndex]) {
            originalEndIndex--;
            modifiedEndIndex--;
          }
          if (originalEndIndex < startIndex || modifiedEndIndex < startIndex) {
            originalEndIndex++;
            modifiedEndIndex++;
          }
          const deleteCount = originalEndIndex - startIndex + 1;
          const newData = this.modifiedSequence.slice(startIndex, modifiedEndIndex + 1);
          if (newData.length === 1 && newData[0] === this.originalSequence[originalEndIndex]) {
            return [
              { start: startIndex, deleteCount: deleteCount - 1 }
            ];
          } else {
            return [
              { start: startIndex, deleteCount, data: newData }
            ];
          }
        } else if (startIndex < modifiedLength) {
          return [
            { start: startIndex, deleteCount: 0, data: this.modifiedSequence.slice(startIndex) }
          ];
        } else if (startIndex < originalLength) {
          return [
            { start: startIndex, deleteCount: originalLength - startIndex }
          ];
        } else {
          return [];
        }
      }
    };
    exports2.SemanticTokensDiff = SemanticTokensDiff;
    var SemanticTokensBuilder = class {
      constructor() {
        this._prevData = void 0;
        this.initialize();
      }
      initialize() {
        this._id = Date.now();
        this._prevLine = 0;
        this._prevChar = 0;
        this._data = [];
        this._dataLen = 0;
      }
      push(line, char, length, tokenType, tokenModifiers) {
        let pushLine = line;
        let pushChar = char;
        if (this._dataLen > 0) {
          pushLine -= this._prevLine;
          if (pushLine === 0) {
            pushChar -= this._prevChar;
          }
        }
        this._data[this._dataLen++] = pushLine;
        this._data[this._dataLen++] = pushChar;
        this._data[this._dataLen++] = length;
        this._data[this._dataLen++] = tokenType;
        this._data[this._dataLen++] = tokenModifiers;
        this._prevLine = line;
        this._prevChar = char;
      }
      get id() {
        return this._id.toString();
      }
      previousResult(id) {
        if (this.id === id) {
          this._prevData = this._data;
        }
        this.initialize();
      }
      build() {
        this._prevData = void 0;
        return {
          resultId: this.id,
          data: this._data
        };
      }
      canBuildEdits() {
        return this._prevData !== void 0;
      }
      buildEdits() {
        if (this._prevData !== void 0) {
          return {
            resultId: this.id,
            edits: new SemanticTokensDiff(this._prevData, this._data).computeDiff()
          };
        } else {
          return this.build();
        }
      }
    };
    exports2.SemanticTokensBuilder = SemanticTokensBuilder;
  }
});

// node_modules/vscode-languageserver/lib/common/showDocument.js
var require_showDocument = __commonJS({
  "node_modules/vscode-languageserver/lib/common/showDocument.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ShowDocumentFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var ShowDocumentFeature = (Base) => {
      return class extends Base {
        showDocument(params) {
          return this.connection.sendRequest(vscode_languageserver_protocol_1.ShowDocumentRequest.type, params);
        }
      };
    };
    exports2.ShowDocumentFeature = ShowDocumentFeature;
  }
});

// node_modules/vscode-languageserver/lib/common/fileOperations.js
var require_fileOperations = __commonJS({
  "node_modules/vscode-languageserver/lib/common/fileOperations.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.FileOperationsFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var FileOperationsFeature = (Base) => {
      return class extends Base {
        onDidCreateFiles(handler) {
          return this.connection.onNotification(vscode_languageserver_protocol_1.DidCreateFilesNotification.type, (params) => {
            handler(params);
          });
        }
        onDidRenameFiles(handler) {
          return this.connection.onNotification(vscode_languageserver_protocol_1.DidRenameFilesNotification.type, (params) => {
            handler(params);
          });
        }
        onDidDeleteFiles(handler) {
          return this.connection.onNotification(vscode_languageserver_protocol_1.DidDeleteFilesNotification.type, (params) => {
            handler(params);
          });
        }
        onWillCreateFiles(handler) {
          return this.connection.onRequest(vscode_languageserver_protocol_1.WillCreateFilesRequest.type, (params, cancel) => {
            return handler(params, cancel);
          });
        }
        onWillRenameFiles(handler) {
          return this.connection.onRequest(vscode_languageserver_protocol_1.WillRenameFilesRequest.type, (params, cancel) => {
            return handler(params, cancel);
          });
        }
        onWillDeleteFiles(handler) {
          return this.connection.onRequest(vscode_languageserver_protocol_1.WillDeleteFilesRequest.type, (params, cancel) => {
            return handler(params, cancel);
          });
        }
      };
    };
    exports2.FileOperationsFeature = FileOperationsFeature;
  }
});

// node_modules/vscode-languageserver/lib/common/linkedEditingRange.js
var require_linkedEditingRange = __commonJS({
  "node_modules/vscode-languageserver/lib/common/linkedEditingRange.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LinkedEditingRangeFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var LinkedEditingRangeFeature = (Base) => {
      return class extends Base {
        onLinkedEditingRange(handler) {
          return this.connection.onRequest(vscode_languageserver_protocol_1.LinkedEditingRangeRequest.type, (params, cancel) => {
            return handler(params, cancel, this.attachWorkDoneProgress(params), void 0);
          });
        }
      };
    };
    exports2.LinkedEditingRangeFeature = LinkedEditingRangeFeature;
  }
});

// node_modules/vscode-languageserver/lib/common/typeHierarchy.js
var require_typeHierarchy = __commonJS({
  "node_modules/vscode-languageserver/lib/common/typeHierarchy.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TypeHierarchyFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var TypeHierarchyFeature = (Base) => {
      return class extends Base {
        get typeHierarchy() {
          return {
            onPrepare: (handler) => {
              return this.connection.onRequest(vscode_languageserver_protocol_1.TypeHierarchyPrepareRequest.type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params), void 0);
              });
            },
            onSupertypes: (handler) => {
              const type = vscode_languageserver_protocol_1.TypeHierarchySupertypesRequest.type;
              return this.connection.onRequest(type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
              });
            },
            onSubtypes: (handler) => {
              const type = vscode_languageserver_protocol_1.TypeHierarchySubtypesRequest.type;
              return this.connection.onRequest(type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
              });
            }
          };
        }
      };
    };
    exports2.TypeHierarchyFeature = TypeHierarchyFeature;
  }
});

// node_modules/vscode-languageserver/lib/common/inlineValue.js
var require_inlineValue = __commonJS({
  "node_modules/vscode-languageserver/lib/common/inlineValue.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.InlineValueFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var InlineValueFeature = (Base) => {
      return class extends Base {
        get inlineValue() {
          return {
            refresh: () => {
              return this.connection.sendRequest(vscode_languageserver_protocol_1.InlineValueRefreshRequest.type);
            },
            on: (handler) => {
              return this.connection.onRequest(vscode_languageserver_protocol_1.InlineValueRequest.type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params));
              });
            }
          };
        }
      };
    };
    exports2.InlineValueFeature = InlineValueFeature;
  }
});

// node_modules/vscode-languageserver/lib/common/foldingRange.js
var require_foldingRange = __commonJS({
  "node_modules/vscode-languageserver/lib/common/foldingRange.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.FoldingRangeFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var FoldingRangeFeature = (Base) => {
      return class extends Base {
        get foldingRange() {
          return {
            refresh: () => {
              return this.connection.sendRequest(vscode_languageserver_protocol_1.FoldingRangeRefreshRequest.type);
            },
            on: (handler) => {
              const type = vscode_languageserver_protocol_1.FoldingRangeRequest.type;
              return this.connection.onRequest(type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
              });
            }
          };
        }
      };
    };
    exports2.FoldingRangeFeature = FoldingRangeFeature;
  }
});

// node_modules/vscode-languageserver/lib/common/inlayHint.js
var require_inlayHint = __commonJS({
  "node_modules/vscode-languageserver/lib/common/inlayHint.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.InlayHintFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var InlayHintFeature = (Base) => {
      return class extends Base {
        get inlayHint() {
          return {
            refresh: () => {
              return this.connection.sendRequest(vscode_languageserver_protocol_1.InlayHintRefreshRequest.type);
            },
            on: (handler) => {
              return this.connection.onRequest(vscode_languageserver_protocol_1.InlayHintRequest.type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params));
              });
            },
            resolve: (handler) => {
              return this.connection.onRequest(vscode_languageserver_protocol_1.InlayHintResolveRequest.type, (params, cancel) => {
                return handler(params, cancel);
              });
            }
          };
        }
      };
    };
    exports2.InlayHintFeature = InlayHintFeature;
  }
});

// node_modules/vscode-languageserver/lib/common/diagnostic.js
var require_diagnostic = __commonJS({
  "node_modules/vscode-languageserver/lib/common/diagnostic.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DiagnosticFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var DiagnosticFeature = (Base) => {
      return class extends Base {
        get diagnostics() {
          return {
            refresh: () => {
              return this.connection.sendRequest(vscode_languageserver_protocol_1.DiagnosticRefreshRequest.type);
            },
            on: (handler) => {
              return this.connection.onRequest(vscode_languageserver_protocol_1.DocumentDiagnosticRequest.type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(vscode_languageserver_protocol_1.DocumentDiagnosticRequest.partialResult, params));
              });
            },
            onWorkspace: (handler) => {
              return this.connection.onRequest(vscode_languageserver_protocol_1.WorkspaceDiagnosticRequest.type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(vscode_languageserver_protocol_1.WorkspaceDiagnosticRequest.partialResult, params));
              });
            }
          };
        }
      };
    };
    exports2.DiagnosticFeature = DiagnosticFeature;
  }
});

// node_modules/vscode-languageserver/lib/common/textDocuments.js
var require_textDocuments = __commonJS({
  "node_modules/vscode-languageserver/lib/common/textDocuments.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TextDocuments = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var TextDocuments2 = class {
      /**
       * Create a new text document manager.
       */
      constructor(configuration) {
        this._configuration = configuration;
        this._syncedDocuments = /* @__PURE__ */ new Map();
        this._onDidChangeContent = new vscode_languageserver_protocol_1.Emitter();
        this._onDidOpen = new vscode_languageserver_protocol_1.Emitter();
        this._onDidClose = new vscode_languageserver_protocol_1.Emitter();
        this._onDidSave = new vscode_languageserver_protocol_1.Emitter();
        this._onWillSave = new vscode_languageserver_protocol_1.Emitter();
      }
      /**
       * An event that fires when a text document managed by this manager
       * has been opened.
       */
      get onDidOpen() {
        return this._onDidOpen.event;
      }
      /**
       * An event that fires when a text document managed by this manager
       * has been opened or the content changes.
       */
      get onDidChangeContent() {
        return this._onDidChangeContent.event;
      }
      /**
       * An event that fires when a text document managed by this manager
       * will be saved.
       */
      get onWillSave() {
        return this._onWillSave.event;
      }
      /**
       * Sets a handler that will be called if a participant wants to provide
       * edits during a text document save.
       */
      onWillSaveWaitUntil(handler) {
        this._willSaveWaitUntil = handler;
      }
      /**
       * An event that fires when a text document managed by this manager
       * has been saved.
       */
      get onDidSave() {
        return this._onDidSave.event;
      }
      /**
       * An event that fires when a text document managed by this manager
       * has been closed.
       */
      get onDidClose() {
        return this._onDidClose.event;
      }
      /**
       * Returns the document for the given URI. Returns undefined if
       * the document is not managed by this instance.
       *
       * @param uri The text document's URI to retrieve.
       * @return the text document or `undefined`.
       */
      get(uri) {
        return this._syncedDocuments.get(uri);
      }
      /**
       * Returns all text documents managed by this instance.
       *
       * @return all text documents.
       */
      all() {
        return Array.from(this._syncedDocuments.values());
      }
      /**
       * Returns the URIs of all text documents managed by this instance.
       *
       * @return the URI's of all text documents.
       */
      keys() {
        return Array.from(this._syncedDocuments.keys());
      }
      /**
       * Listens for `low level` notification on the given connection to
       * update the text documents managed by this instance.
       *
       * Please note that the connection only provides handlers not an event model. Therefore
       * listening on a connection will overwrite the following handlers on a connection:
       * `onDidOpenTextDocument`, `onDidChangeTextDocument`, `onDidCloseTextDocument`,
       * `onWillSaveTextDocument`, `onWillSaveTextDocumentWaitUntil` and `onDidSaveTextDocument`.
       *
       * Use the corresponding events on the TextDocuments instance instead.
       *
       * @param connection The connection to listen on.
       */
      listen(connection2) {
        connection2.__textDocumentSync = vscode_languageserver_protocol_1.TextDocumentSyncKind.Incremental;
        const disposables = [];
        disposables.push(connection2.onDidOpenTextDocument((event) => {
          const td = event.textDocument;
          const document2 = this._configuration.create(td.uri, td.languageId, td.version, td.text);
          this._syncedDocuments.set(td.uri, document2);
          const toFire = Object.freeze({ document: document2 });
          this._onDidOpen.fire(toFire);
          this._onDidChangeContent.fire(toFire);
        }));
        disposables.push(connection2.onDidChangeTextDocument((event) => {
          const td = event.textDocument;
          const changes = event.contentChanges;
          if (changes.length === 0) {
            return;
          }
          const { version } = td;
          if (version === null || version === void 0) {
            throw new Error(`Received document change event for ${td.uri} without valid version identifier`);
          }
          let syncedDocument = this._syncedDocuments.get(td.uri);
          if (syncedDocument !== void 0) {
            syncedDocument = this._configuration.update(syncedDocument, changes, version);
            this._syncedDocuments.set(td.uri, syncedDocument);
            this._onDidChangeContent.fire(Object.freeze({ document: syncedDocument }));
          }
        }));
        disposables.push(connection2.onDidCloseTextDocument((event) => {
          let syncedDocument = this._syncedDocuments.get(event.textDocument.uri);
          if (syncedDocument !== void 0) {
            this._syncedDocuments.delete(event.textDocument.uri);
            this._onDidClose.fire(Object.freeze({ document: syncedDocument }));
          }
        }));
        disposables.push(connection2.onWillSaveTextDocument((event) => {
          let syncedDocument = this._syncedDocuments.get(event.textDocument.uri);
          if (syncedDocument !== void 0) {
            this._onWillSave.fire(Object.freeze({ document: syncedDocument, reason: event.reason }));
          }
        }));
        disposables.push(connection2.onWillSaveTextDocumentWaitUntil((event, token) => {
          let syncedDocument = this._syncedDocuments.get(event.textDocument.uri);
          if (syncedDocument !== void 0 && this._willSaveWaitUntil) {
            return this._willSaveWaitUntil(Object.freeze({ document: syncedDocument, reason: event.reason }), token);
          } else {
            return [];
          }
        }));
        disposables.push(connection2.onDidSaveTextDocument((event) => {
          let syncedDocument = this._syncedDocuments.get(event.textDocument.uri);
          if (syncedDocument !== void 0) {
            this._onDidSave.fire(Object.freeze({ document: syncedDocument }));
          }
        }));
        return vscode_languageserver_protocol_1.Disposable.create(() => {
          disposables.forEach((disposable) => disposable.dispose());
        });
      }
    };
    exports2.TextDocuments = TextDocuments2;
  }
});

// node_modules/vscode-languageserver/lib/common/notebook.js
var require_notebook = __commonJS({
  "node_modules/vscode-languageserver/lib/common/notebook.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.NotebookDocuments = exports2.NotebookSyncFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var textDocuments_1 = require_textDocuments();
    var NotebookSyncFeature = (Base) => {
      return class extends Base {
        get synchronization() {
          return {
            onDidOpenNotebookDocument: (handler) => {
              return this.connection.onNotification(vscode_languageserver_protocol_1.DidOpenNotebookDocumentNotification.type, (params) => {
                handler(params);
              });
            },
            onDidChangeNotebookDocument: (handler) => {
              return this.connection.onNotification(vscode_languageserver_protocol_1.DidChangeNotebookDocumentNotification.type, (params) => {
                handler(params);
              });
            },
            onDidSaveNotebookDocument: (handler) => {
              return this.connection.onNotification(vscode_languageserver_protocol_1.DidSaveNotebookDocumentNotification.type, (params) => {
                handler(params);
              });
            },
            onDidCloseNotebookDocument: (handler) => {
              return this.connection.onNotification(vscode_languageserver_protocol_1.DidCloseNotebookDocumentNotification.type, (params) => {
                handler(params);
              });
            }
          };
        }
      };
    };
    exports2.NotebookSyncFeature = NotebookSyncFeature;
    var CellTextDocumentConnection = class {
      onDidOpenTextDocument(handler) {
        this.openHandler = handler;
        return vscode_languageserver_protocol_1.Disposable.create(() => {
          this.openHandler = void 0;
        });
      }
      openTextDocument(params) {
        this.openHandler && this.openHandler(params);
      }
      onDidChangeTextDocument(handler) {
        this.changeHandler = handler;
        return vscode_languageserver_protocol_1.Disposable.create(() => {
          this.changeHandler = handler;
        });
      }
      changeTextDocument(params) {
        this.changeHandler && this.changeHandler(params);
      }
      onDidCloseTextDocument(handler) {
        this.closeHandler = handler;
        return vscode_languageserver_protocol_1.Disposable.create(() => {
          this.closeHandler = void 0;
        });
      }
      closeTextDocument(params) {
        this.closeHandler && this.closeHandler(params);
      }
      onWillSaveTextDocument() {
        return CellTextDocumentConnection.NULL_DISPOSE;
      }
      onWillSaveTextDocumentWaitUntil() {
        return CellTextDocumentConnection.NULL_DISPOSE;
      }
      onDidSaveTextDocument() {
        return CellTextDocumentConnection.NULL_DISPOSE;
      }
    };
    CellTextDocumentConnection.NULL_DISPOSE = Object.freeze({ dispose: () => {
    } });
    var NotebookDocuments = class {
      constructor(configurationOrTextDocuments) {
        if (configurationOrTextDocuments instanceof textDocuments_1.TextDocuments) {
          this._cellTextDocuments = configurationOrTextDocuments;
        } else {
          this._cellTextDocuments = new textDocuments_1.TextDocuments(configurationOrTextDocuments);
        }
        this.notebookDocuments = /* @__PURE__ */ new Map();
        this.notebookCellMap = /* @__PURE__ */ new Map();
        this._onDidOpen = new vscode_languageserver_protocol_1.Emitter();
        this._onDidChange = new vscode_languageserver_protocol_1.Emitter();
        this._onDidSave = new vscode_languageserver_protocol_1.Emitter();
        this._onDidClose = new vscode_languageserver_protocol_1.Emitter();
      }
      get cellTextDocuments() {
        return this._cellTextDocuments;
      }
      getCellTextDocument(cell) {
        return this._cellTextDocuments.get(cell.document);
      }
      getNotebookDocument(uri) {
        return this.notebookDocuments.get(uri);
      }
      getNotebookCell(uri) {
        const value = this.notebookCellMap.get(uri);
        return value && value[0];
      }
      findNotebookDocumentForCell(cell) {
        const key = typeof cell === "string" ? cell : cell.document;
        const value = this.notebookCellMap.get(key);
        return value && value[1];
      }
      get onDidOpen() {
        return this._onDidOpen.event;
      }
      get onDidSave() {
        return this._onDidSave.event;
      }
      get onDidChange() {
        return this._onDidChange.event;
      }
      get onDidClose() {
        return this._onDidClose.event;
      }
      /**
       * Listens for `low level` notification on the given connection to
       * update the notebook documents managed by this instance.
       *
       * Please note that the connection only provides handlers not an event model. Therefore
       * listening on a connection will overwrite the following handlers on a connection:
       * `onDidOpenNotebookDocument`, `onDidChangeNotebookDocument`, `onDidSaveNotebookDocument`,
       *  and `onDidCloseNotebookDocument`.
       *
       * @param connection The connection to listen on.
       */
      listen(connection2) {
        const cellTextDocumentConnection = new CellTextDocumentConnection();
        const disposables = [];
        disposables.push(this.cellTextDocuments.listen(cellTextDocumentConnection));
        disposables.push(connection2.notebooks.synchronization.onDidOpenNotebookDocument((params) => {
          this.notebookDocuments.set(params.notebookDocument.uri, params.notebookDocument);
          for (const cellTextDocument of params.cellTextDocuments) {
            cellTextDocumentConnection.openTextDocument({ textDocument: cellTextDocument });
          }
          this.updateCellMap(params.notebookDocument);
          this._onDidOpen.fire(params.notebookDocument);
        }));
        disposables.push(connection2.notebooks.synchronization.onDidChangeNotebookDocument((params) => {
          const notebookDocument = this.notebookDocuments.get(params.notebookDocument.uri);
          if (notebookDocument === void 0) {
            return;
          }
          notebookDocument.version = params.notebookDocument.version;
          const oldMetadata = notebookDocument.metadata;
          let metadataChanged = false;
          const change = params.change;
          if (change.metadata !== void 0) {
            metadataChanged = true;
            notebookDocument.metadata = change.metadata;
          }
          const opened = [];
          const closed = [];
          const data = [];
          const text = [];
          if (change.cells !== void 0) {
            const changedCells = change.cells;
            if (changedCells.structure !== void 0) {
              const array = changedCells.structure.array;
              notebookDocument.cells.splice(array.start, array.deleteCount, ...array.cells !== void 0 ? array.cells : []);
              if (changedCells.structure.didOpen !== void 0) {
                for (const open of changedCells.structure.didOpen) {
                  cellTextDocumentConnection.openTextDocument({ textDocument: open });
                  opened.push(open.uri);
                }
              }
              if (changedCells.structure.didClose) {
                for (const close of changedCells.structure.didClose) {
                  cellTextDocumentConnection.closeTextDocument({ textDocument: close });
                  closed.push(close.uri);
                }
              }
            }
            if (changedCells.data !== void 0) {
              const cellUpdates = new Map(changedCells.data.map((cell) => [cell.document, cell]));
              for (let i = 0; i <= notebookDocument.cells.length; i++) {
                const change2 = cellUpdates.get(notebookDocument.cells[i].document);
                if (change2 !== void 0) {
                  const old = notebookDocument.cells.splice(i, 1, change2);
                  data.push({ old: old[0], new: change2 });
                  cellUpdates.delete(change2.document);
                  if (cellUpdates.size === 0) {
                    break;
                  }
                }
              }
            }
            if (changedCells.textContent !== void 0) {
              for (const cellTextDocument of changedCells.textContent) {
                cellTextDocumentConnection.changeTextDocument({ textDocument: cellTextDocument.document, contentChanges: cellTextDocument.changes });
                text.push(cellTextDocument.document.uri);
              }
            }
          }
          this.updateCellMap(notebookDocument);
          const changeEvent = { notebookDocument };
          if (metadataChanged) {
            changeEvent.metadata = { old: oldMetadata, new: notebookDocument.metadata };
          }
          const added = [];
          for (const open of opened) {
            added.push(this.getNotebookCell(open));
          }
          const removed = [];
          for (const close of closed) {
            removed.push(this.getNotebookCell(close));
          }
          const textContent = [];
          for (const change2 of text) {
            textContent.push(this.getNotebookCell(change2));
          }
          if (added.length > 0 || removed.length > 0 || data.length > 0 || textContent.length > 0) {
            changeEvent.cells = { added, removed, changed: { data, textContent } };
          }
          if (changeEvent.metadata !== void 0 || changeEvent.cells !== void 0) {
            this._onDidChange.fire(changeEvent);
          }
        }));
        disposables.push(connection2.notebooks.synchronization.onDidSaveNotebookDocument((params) => {
          const notebookDocument = this.notebookDocuments.get(params.notebookDocument.uri);
          if (notebookDocument === void 0) {
            return;
          }
          this._onDidSave.fire(notebookDocument);
        }));
        disposables.push(connection2.notebooks.synchronization.onDidCloseNotebookDocument((params) => {
          const notebookDocument = this.notebookDocuments.get(params.notebookDocument.uri);
          if (notebookDocument === void 0) {
            return;
          }
          this._onDidClose.fire(notebookDocument);
          for (const cellTextDocument of params.cellTextDocuments) {
            cellTextDocumentConnection.closeTextDocument({ textDocument: cellTextDocument });
          }
          this.notebookDocuments.delete(params.notebookDocument.uri);
          for (const cell of notebookDocument.cells) {
            this.notebookCellMap.delete(cell.document);
          }
        }));
        return vscode_languageserver_protocol_1.Disposable.create(() => {
          disposables.forEach((disposable) => disposable.dispose());
        });
      }
      updateCellMap(notebookDocument) {
        for (const cell of notebookDocument.cells) {
          this.notebookCellMap.set(cell.document, [cell, notebookDocument]);
        }
      }
    };
    exports2.NotebookDocuments = NotebookDocuments;
  }
});

// node_modules/vscode-languageserver/lib/common/moniker.js
var require_moniker = __commonJS({
  "node_modules/vscode-languageserver/lib/common/moniker.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.MonikerFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var MonikerFeature = (Base) => {
      return class extends Base {
        get moniker() {
          return {
            on: (handler) => {
              const type = vscode_languageserver_protocol_1.MonikerRequest.type;
              return this.connection.onRequest(type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
              });
            }
          };
        }
      };
    };
    exports2.MonikerFeature = MonikerFeature;
  }
});

// node_modules/vscode-languageserver/lib/common/server.js
var require_server = __commonJS({
  "node_modules/vscode-languageserver/lib/common/server.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createConnection = exports2.combineFeatures = exports2.combineNotebooksFeatures = exports2.combineLanguagesFeatures = exports2.combineWorkspaceFeatures = exports2.combineWindowFeatures = exports2.combineClientFeatures = exports2.combineTracerFeatures = exports2.combineTelemetryFeatures = exports2.combineConsoleFeatures = exports2._NotebooksImpl = exports2._LanguagesImpl = exports2.BulkUnregistration = exports2.BulkRegistration = exports2.ErrorMessageTracker = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var Is = require_is();
    var UUID = require_uuid();
    var progress_1 = require_progress();
    var configuration_1 = require_configuration();
    var workspaceFolder_1 = require_workspaceFolder();
    var callHierarchy_1 = require_callHierarchy();
    var semanticTokens_1 = require_semanticTokens();
    var showDocument_1 = require_showDocument();
    var fileOperations_1 = require_fileOperations();
    var linkedEditingRange_1 = require_linkedEditingRange();
    var typeHierarchy_1 = require_typeHierarchy();
    var inlineValue_1 = require_inlineValue();
    var foldingRange_1 = require_foldingRange();
    var inlayHint_1 = require_inlayHint();
    var diagnostic_1 = require_diagnostic();
    var notebook_1 = require_notebook();
    var moniker_1 = require_moniker();
    function null2Undefined(value) {
      if (value === null) {
        return void 0;
      }
      return value;
    }
    var ErrorMessageTracker = class {
      constructor() {
        this._messages = /* @__PURE__ */ Object.create(null);
      }
      /**
       * Add a message to the tracker.
       *
       * @param message The message to add.
       */
      add(message) {
        let count = this._messages[message];
        if (!count) {
          count = 0;
        }
        count++;
        this._messages[message] = count;
      }
      /**
       * Send all tracked messages to the connection's window.
       *
       * @param connection The connection established between client and server.
       */
      sendErrors(connection2) {
        Object.keys(this._messages).forEach((message) => {
          connection2.window.showErrorMessage(message);
        });
      }
    };
    exports2.ErrorMessageTracker = ErrorMessageTracker;
    var RemoteConsoleImpl = class {
      constructor() {
      }
      rawAttach(connection2) {
        this._rawConnection = connection2;
      }
      attach(connection2) {
        this._connection = connection2;
      }
      get connection() {
        if (!this._connection) {
          throw new Error("Remote is not attached to a connection yet.");
        }
        return this._connection;
      }
      fillServerCapabilities(_capabilities) {
      }
      initialize(_capabilities) {
      }
      error(message) {
        this.send(vscode_languageserver_protocol_1.MessageType.Error, message);
      }
      warn(message) {
        this.send(vscode_languageserver_protocol_1.MessageType.Warning, message);
      }
      info(message) {
        this.send(vscode_languageserver_protocol_1.MessageType.Info, message);
      }
      log(message) {
        this.send(vscode_languageserver_protocol_1.MessageType.Log, message);
      }
      debug(message) {
        this.send(vscode_languageserver_protocol_1.MessageType.Debug, message);
      }
      send(type, message) {
        if (this._rawConnection) {
          this._rawConnection.sendNotification(vscode_languageserver_protocol_1.LogMessageNotification.type, { type, message }).catch(() => {
            (0, vscode_languageserver_protocol_1.RAL)().console.error(`Sending log message failed`);
          });
        }
      }
    };
    var _RemoteWindowImpl = class {
      constructor() {
      }
      attach(connection2) {
        this._connection = connection2;
      }
      get connection() {
        if (!this._connection) {
          throw new Error("Remote is not attached to a connection yet.");
        }
        return this._connection;
      }
      initialize(_capabilities) {
      }
      fillServerCapabilities(_capabilities) {
      }
      showErrorMessage(message, ...actions) {
        let params = { type: vscode_languageserver_protocol_1.MessageType.Error, message, actions };
        return this.connection.sendRequest(vscode_languageserver_protocol_1.ShowMessageRequest.type, params).then(null2Undefined);
      }
      showWarningMessage(message, ...actions) {
        let params = { type: vscode_languageserver_protocol_1.MessageType.Warning, message, actions };
        return this.connection.sendRequest(vscode_languageserver_protocol_1.ShowMessageRequest.type, params).then(null2Undefined);
      }
      showInformationMessage(message, ...actions) {
        let params = { type: vscode_languageserver_protocol_1.MessageType.Info, message, actions };
        return this.connection.sendRequest(vscode_languageserver_protocol_1.ShowMessageRequest.type, params).then(null2Undefined);
      }
    };
    var RemoteWindowImpl = (0, showDocument_1.ShowDocumentFeature)((0, progress_1.ProgressFeature)(_RemoteWindowImpl));
    var BulkRegistration;
    (function(BulkRegistration2) {
      function create() {
        return new BulkRegistrationImpl();
      }
      BulkRegistration2.create = create;
    })(BulkRegistration || (exports2.BulkRegistration = BulkRegistration = {}));
    var BulkRegistrationImpl = class {
      constructor() {
        this._registrations = [];
        this._registered = /* @__PURE__ */ new Set();
      }
      add(type, registerOptions) {
        const method = Is.string(type) ? type : type.method;
        if (this._registered.has(method)) {
          throw new Error(`${method} is already added to this registration`);
        }
        const id = UUID.generateUuid();
        this._registrations.push({
          id,
          method,
          registerOptions: registerOptions || {}
        });
        this._registered.add(method);
      }
      asRegistrationParams() {
        return {
          registrations: this._registrations
        };
      }
    };
    var BulkUnregistration;
    (function(BulkUnregistration2) {
      function create() {
        return new BulkUnregistrationImpl(void 0, []);
      }
      BulkUnregistration2.create = create;
    })(BulkUnregistration || (exports2.BulkUnregistration = BulkUnregistration = {}));
    var BulkUnregistrationImpl = class {
      constructor(_connection, unregistrations) {
        this._connection = _connection;
        this._unregistrations = /* @__PURE__ */ new Map();
        unregistrations.forEach((unregistration) => {
          this._unregistrations.set(unregistration.method, unregistration);
        });
      }
      get isAttached() {
        return !!this._connection;
      }
      attach(connection2) {
        this._connection = connection2;
      }
      add(unregistration) {
        this._unregistrations.set(unregistration.method, unregistration);
      }
      dispose() {
        let unregistrations = [];
        for (let unregistration of this._unregistrations.values()) {
          unregistrations.push(unregistration);
        }
        let params = {
          unregisterations: unregistrations
        };
        this._connection.sendRequest(vscode_languageserver_protocol_1.UnregistrationRequest.type, params).catch(() => {
          this._connection.console.info(`Bulk unregistration failed.`);
        });
      }
      disposeSingle(arg) {
        const method = Is.string(arg) ? arg : arg.method;
        const unregistration = this._unregistrations.get(method);
        if (!unregistration) {
          return false;
        }
        let params = {
          unregisterations: [unregistration]
        };
        this._connection.sendRequest(vscode_languageserver_protocol_1.UnregistrationRequest.type, params).then(() => {
          this._unregistrations.delete(method);
        }, (_error) => {
          this._connection.console.info(`Un-registering request handler for ${unregistration.id} failed.`);
        });
        return true;
      }
    };
    var RemoteClientImpl = class {
      attach(connection2) {
        this._connection = connection2;
      }
      get connection() {
        if (!this._connection) {
          throw new Error("Remote is not attached to a connection yet.");
        }
        return this._connection;
      }
      initialize(_capabilities) {
      }
      fillServerCapabilities(_capabilities) {
      }
      register(typeOrRegistrations, registerOptionsOrType, registerOptions) {
        if (typeOrRegistrations instanceof BulkRegistrationImpl) {
          return this.registerMany(typeOrRegistrations);
        } else if (typeOrRegistrations instanceof BulkUnregistrationImpl) {
          return this.registerSingle1(typeOrRegistrations, registerOptionsOrType, registerOptions);
        } else {
          return this.registerSingle2(typeOrRegistrations, registerOptionsOrType);
        }
      }
      registerSingle1(unregistration, type, registerOptions) {
        const method = Is.string(type) ? type : type.method;
        const id = UUID.generateUuid();
        let params = {
          registrations: [{ id, method, registerOptions: registerOptions || {} }]
        };
        if (!unregistration.isAttached) {
          unregistration.attach(this.connection);
        }
        return this.connection.sendRequest(vscode_languageserver_protocol_1.RegistrationRequest.type, params).then((_result) => {
          unregistration.add({ id, method });
          return unregistration;
        }, (_error) => {
          this.connection.console.info(`Registering request handler for ${method} failed.`);
          return Promise.reject(_error);
        });
      }
      registerSingle2(type, registerOptions) {
        const method = Is.string(type) ? type : type.method;
        const id = UUID.generateUuid();
        let params = {
          registrations: [{ id, method, registerOptions: registerOptions || {} }]
        };
        return this.connection.sendRequest(vscode_languageserver_protocol_1.RegistrationRequest.type, params).then((_result) => {
          return vscode_languageserver_protocol_1.Disposable.create(() => {
            this.unregisterSingle(id, method).catch(() => {
              this.connection.console.info(`Un-registering capability with id ${id} failed.`);
            });
          });
        }, (_error) => {
          this.connection.console.info(`Registering request handler for ${method} failed.`);
          return Promise.reject(_error);
        });
      }
      unregisterSingle(id, method) {
        let params = {
          unregisterations: [{ id, method }]
        };
        return this.connection.sendRequest(vscode_languageserver_protocol_1.UnregistrationRequest.type, params).catch(() => {
          this.connection.console.info(`Un-registering request handler for ${id} failed.`);
        });
      }
      registerMany(registrations) {
        let params = registrations.asRegistrationParams();
        return this.connection.sendRequest(vscode_languageserver_protocol_1.RegistrationRequest.type, params).then(() => {
          return new BulkUnregistrationImpl(this._connection, params.registrations.map((registration) => {
            return { id: registration.id, method: registration.method };
          }));
        }, (_error) => {
          this.connection.console.info(`Bulk registration failed.`);
          return Promise.reject(_error);
        });
      }
    };
    var _RemoteWorkspaceImpl = class {
      constructor() {
      }
      attach(connection2) {
        this._connection = connection2;
      }
      get connection() {
        if (!this._connection) {
          throw new Error("Remote is not attached to a connection yet.");
        }
        return this._connection;
      }
      initialize(_capabilities) {
      }
      fillServerCapabilities(_capabilities) {
      }
      applyEdit(paramOrEdit) {
        function isApplyWorkspaceEditParams(value) {
          return value && !!value.edit;
        }
        let params = isApplyWorkspaceEditParams(paramOrEdit) ? paramOrEdit : { edit: paramOrEdit };
        return this.connection.sendRequest(vscode_languageserver_protocol_1.ApplyWorkspaceEditRequest.type, params);
      }
    };
    var RemoteWorkspaceImpl = (0, fileOperations_1.FileOperationsFeature)((0, workspaceFolder_1.WorkspaceFoldersFeature)((0, configuration_1.ConfigurationFeature)(_RemoteWorkspaceImpl)));
    var TracerImpl = class {
      constructor() {
        this._trace = vscode_languageserver_protocol_1.Trace.Off;
      }
      attach(connection2) {
        this._connection = connection2;
      }
      get connection() {
        if (!this._connection) {
          throw new Error("Remote is not attached to a connection yet.");
        }
        return this._connection;
      }
      initialize(_capabilities) {
      }
      fillServerCapabilities(_capabilities) {
      }
      set trace(value) {
        this._trace = value;
      }
      log(message, verbose) {
        if (this._trace === vscode_languageserver_protocol_1.Trace.Off) {
          return;
        }
        this.connection.sendNotification(vscode_languageserver_protocol_1.LogTraceNotification.type, {
          message,
          verbose: this._trace === vscode_languageserver_protocol_1.Trace.Verbose ? verbose : void 0
        }).catch(() => {
        });
      }
    };
    var TelemetryImpl = class {
      constructor() {
      }
      attach(connection2) {
        this._connection = connection2;
      }
      get connection() {
        if (!this._connection) {
          throw new Error("Remote is not attached to a connection yet.");
        }
        return this._connection;
      }
      initialize(_capabilities) {
      }
      fillServerCapabilities(_capabilities) {
      }
      logEvent(data) {
        this.connection.sendNotification(vscode_languageserver_protocol_1.TelemetryEventNotification.type, data).catch(() => {
          this.connection.console.log(`Sending TelemetryEventNotification failed`);
        });
      }
    };
    var _LanguagesImpl = class {
      constructor() {
      }
      attach(connection2) {
        this._connection = connection2;
      }
      get connection() {
        if (!this._connection) {
          throw new Error("Remote is not attached to a connection yet.");
        }
        return this._connection;
      }
      initialize(_capabilities) {
      }
      fillServerCapabilities(_capabilities) {
      }
      attachWorkDoneProgress(params) {
        return (0, progress_1.attachWorkDone)(this.connection, params);
      }
      attachPartialResultProgress(_type, params) {
        return (0, progress_1.attachPartialResult)(this.connection, params);
      }
    };
    exports2._LanguagesImpl = _LanguagesImpl;
    var LanguagesImpl = (0, foldingRange_1.FoldingRangeFeature)((0, moniker_1.MonikerFeature)((0, diagnostic_1.DiagnosticFeature)((0, inlayHint_1.InlayHintFeature)((0, inlineValue_1.InlineValueFeature)((0, typeHierarchy_1.TypeHierarchyFeature)((0, linkedEditingRange_1.LinkedEditingRangeFeature)((0, semanticTokens_1.SemanticTokensFeature)((0, callHierarchy_1.CallHierarchyFeature)(_LanguagesImpl)))))))));
    var _NotebooksImpl = class {
      constructor() {
      }
      attach(connection2) {
        this._connection = connection2;
      }
      get connection() {
        if (!this._connection) {
          throw new Error("Remote is not attached to a connection yet.");
        }
        return this._connection;
      }
      initialize(_capabilities) {
      }
      fillServerCapabilities(_capabilities) {
      }
      attachWorkDoneProgress(params) {
        return (0, progress_1.attachWorkDone)(this.connection, params);
      }
      attachPartialResultProgress(_type, params) {
        return (0, progress_1.attachPartialResult)(this.connection, params);
      }
    };
    exports2._NotebooksImpl = _NotebooksImpl;
    var NotebooksImpl = (0, notebook_1.NotebookSyncFeature)(_NotebooksImpl);
    function combineConsoleFeatures(one, two) {
      return function(Base) {
        return two(one(Base));
      };
    }
    exports2.combineConsoleFeatures = combineConsoleFeatures;
    function combineTelemetryFeatures(one, two) {
      return function(Base) {
        return two(one(Base));
      };
    }
    exports2.combineTelemetryFeatures = combineTelemetryFeatures;
    function combineTracerFeatures(one, two) {
      return function(Base) {
        return two(one(Base));
      };
    }
    exports2.combineTracerFeatures = combineTracerFeatures;
    function combineClientFeatures(one, two) {
      return function(Base) {
        return two(one(Base));
      };
    }
    exports2.combineClientFeatures = combineClientFeatures;
    function combineWindowFeatures(one, two) {
      return function(Base) {
        return two(one(Base));
      };
    }
    exports2.combineWindowFeatures = combineWindowFeatures;
    function combineWorkspaceFeatures(one, two) {
      return function(Base) {
        return two(one(Base));
      };
    }
    exports2.combineWorkspaceFeatures = combineWorkspaceFeatures;
    function combineLanguagesFeatures(one, two) {
      return function(Base) {
        return two(one(Base));
      };
    }
    exports2.combineLanguagesFeatures = combineLanguagesFeatures;
    function combineNotebooksFeatures(one, two) {
      return function(Base) {
        return two(one(Base));
      };
    }
    exports2.combineNotebooksFeatures = combineNotebooksFeatures;
    function combineFeatures(one, two) {
      function combine(one2, two2, func) {
        if (one2 && two2) {
          return func(one2, two2);
        } else if (one2) {
          return one2;
        } else {
          return two2;
        }
      }
      let result = {
        __brand: "features",
        console: combine(one.console, two.console, combineConsoleFeatures),
        tracer: combine(one.tracer, two.tracer, combineTracerFeatures),
        telemetry: combine(one.telemetry, two.telemetry, combineTelemetryFeatures),
        client: combine(one.client, two.client, combineClientFeatures),
        window: combine(one.window, two.window, combineWindowFeatures),
        workspace: combine(one.workspace, two.workspace, combineWorkspaceFeatures),
        languages: combine(one.languages, two.languages, combineLanguagesFeatures),
        notebooks: combine(one.notebooks, two.notebooks, combineNotebooksFeatures)
      };
      return result;
    }
    exports2.combineFeatures = combineFeatures;
    function createConnection2(connectionFactory, watchDog, factories) {
      const logger = factories && factories.console ? new (factories.console(RemoteConsoleImpl))() : new RemoteConsoleImpl();
      const connection2 = connectionFactory(logger);
      logger.rawAttach(connection2);
      const tracer = factories && factories.tracer ? new (factories.tracer(TracerImpl))() : new TracerImpl();
      const telemetry = factories && factories.telemetry ? new (factories.telemetry(TelemetryImpl))() : new TelemetryImpl();
      const client = factories && factories.client ? new (factories.client(RemoteClientImpl))() : new RemoteClientImpl();
      const remoteWindow = factories && factories.window ? new (factories.window(RemoteWindowImpl))() : new RemoteWindowImpl();
      const workspace = factories && factories.workspace ? new (factories.workspace(RemoteWorkspaceImpl))() : new RemoteWorkspaceImpl();
      const languages = factories && factories.languages ? new (factories.languages(LanguagesImpl))() : new LanguagesImpl();
      const notebooks = factories && factories.notebooks ? new (factories.notebooks(NotebooksImpl))() : new NotebooksImpl();
      const allRemotes = [logger, tracer, telemetry, client, remoteWindow, workspace, languages, notebooks];
      function asPromise(value) {
        if (value instanceof Promise) {
          return value;
        } else if (Is.thenable(value)) {
          return new Promise((resolve, reject) => {
            value.then((resolved) => resolve(resolved), (error) => reject(error));
          });
        } else {
          return Promise.resolve(value);
        }
      }
      let shutdownHandler = void 0;
      let initializeHandler = void 0;
      let exitHandler = void 0;
      let protocolConnection = {
        listen: () => connection2.listen(),
        sendRequest: (type, ...params) => connection2.sendRequest(Is.string(type) ? type : type.method, ...params),
        onRequest: (type, handler) => connection2.onRequest(type, handler),
        sendNotification: (type, param) => {
          const method = Is.string(type) ? type : type.method;
          return connection2.sendNotification(method, param);
        },
        onNotification: (type, handler) => connection2.onNotification(type, handler),
        onProgress: connection2.onProgress,
        sendProgress: connection2.sendProgress,
        onInitialize: (handler) => {
          initializeHandler = handler;
          return {
            dispose: () => {
              initializeHandler = void 0;
            }
          };
        },
        onInitialized: (handler) => connection2.onNotification(vscode_languageserver_protocol_1.InitializedNotification.type, handler),
        onShutdown: (handler) => {
          shutdownHandler = handler;
          return {
            dispose: () => {
              shutdownHandler = void 0;
            }
          };
        },
        onExit: (handler) => {
          exitHandler = handler;
          return {
            dispose: () => {
              exitHandler = void 0;
            }
          };
        },
        get console() {
          return logger;
        },
        get telemetry() {
          return telemetry;
        },
        get tracer() {
          return tracer;
        },
        get client() {
          return client;
        },
        get window() {
          return remoteWindow;
        },
        get workspace() {
          return workspace;
        },
        get languages() {
          return languages;
        },
        get notebooks() {
          return notebooks;
        },
        onDidChangeConfiguration: (handler) => connection2.onNotification(vscode_languageserver_protocol_1.DidChangeConfigurationNotification.type, handler),
        onDidChangeWatchedFiles: (handler) => connection2.onNotification(vscode_languageserver_protocol_1.DidChangeWatchedFilesNotification.type, handler),
        __textDocumentSync: void 0,
        onDidOpenTextDocument: (handler) => connection2.onNotification(vscode_languageserver_protocol_1.DidOpenTextDocumentNotification.type, handler),
        onDidChangeTextDocument: (handler) => connection2.onNotification(vscode_languageserver_protocol_1.DidChangeTextDocumentNotification.type, handler),
        onDidCloseTextDocument: (handler) => connection2.onNotification(vscode_languageserver_protocol_1.DidCloseTextDocumentNotification.type, handler),
        onWillSaveTextDocument: (handler) => connection2.onNotification(vscode_languageserver_protocol_1.WillSaveTextDocumentNotification.type, handler),
        onWillSaveTextDocumentWaitUntil: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.WillSaveTextDocumentWaitUntilRequest.type, handler),
        onDidSaveTextDocument: (handler) => connection2.onNotification(vscode_languageserver_protocol_1.DidSaveTextDocumentNotification.type, handler),
        sendDiagnostics: (params) => connection2.sendNotification(vscode_languageserver_protocol_1.PublishDiagnosticsNotification.type, params),
        onHover: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.HoverRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), void 0);
        }),
        onCompletion: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.CompletionRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), (0, progress_1.attachPartialResult)(connection2, params));
        }),
        onCompletionResolve: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.CompletionResolveRequest.type, handler),
        onSignatureHelp: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.SignatureHelpRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), void 0);
        }),
        onDeclaration: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.DeclarationRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), (0, progress_1.attachPartialResult)(connection2, params));
        }),
        onDefinition: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.DefinitionRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), (0, progress_1.attachPartialResult)(connection2, params));
        }),
        onTypeDefinition: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.TypeDefinitionRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), (0, progress_1.attachPartialResult)(connection2, params));
        }),
        onImplementation: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.ImplementationRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), (0, progress_1.attachPartialResult)(connection2, params));
        }),
        onReferences: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.ReferencesRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), (0, progress_1.attachPartialResult)(connection2, params));
        }),
        onDocumentHighlight: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.DocumentHighlightRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), (0, progress_1.attachPartialResult)(connection2, params));
        }),
        onDocumentSymbol: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.DocumentSymbolRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), (0, progress_1.attachPartialResult)(connection2, params));
        }),
        onWorkspaceSymbol: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.WorkspaceSymbolRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), (0, progress_1.attachPartialResult)(connection2, params));
        }),
        onWorkspaceSymbolResolve: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.WorkspaceSymbolResolveRequest.type, handler),
        onCodeAction: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.CodeActionRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), (0, progress_1.attachPartialResult)(connection2, params));
        }),
        onCodeActionResolve: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.CodeActionResolveRequest.type, (params, cancel) => {
          return handler(params, cancel);
        }),
        onCodeLens: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.CodeLensRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), (0, progress_1.attachPartialResult)(connection2, params));
        }),
        onCodeLensResolve: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.CodeLensResolveRequest.type, (params, cancel) => {
          return handler(params, cancel);
        }),
        onDocumentFormatting: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.DocumentFormattingRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), void 0);
        }),
        onDocumentRangeFormatting: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.DocumentRangeFormattingRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), void 0);
        }),
        onDocumentOnTypeFormatting: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.DocumentOnTypeFormattingRequest.type, (params, cancel) => {
          return handler(params, cancel);
        }),
        onRenameRequest: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.RenameRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), void 0);
        }),
        onPrepareRename: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.PrepareRenameRequest.type, (params, cancel) => {
          return handler(params, cancel);
        }),
        onDocumentLinks: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.DocumentLinkRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), (0, progress_1.attachPartialResult)(connection2, params));
        }),
        onDocumentLinkResolve: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.DocumentLinkResolveRequest.type, (params, cancel) => {
          return handler(params, cancel);
        }),
        onDocumentColor: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.DocumentColorRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), (0, progress_1.attachPartialResult)(connection2, params));
        }),
        onColorPresentation: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.ColorPresentationRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), (0, progress_1.attachPartialResult)(connection2, params));
        }),
        onFoldingRanges: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.FoldingRangeRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), (0, progress_1.attachPartialResult)(connection2, params));
        }),
        onSelectionRanges: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.SelectionRangeRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), (0, progress_1.attachPartialResult)(connection2, params));
        }),
        onExecuteCommand: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.ExecuteCommandRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), void 0);
        }),
        dispose: () => connection2.dispose()
      };
      for (let remote of allRemotes) {
        remote.attach(protocolConnection);
      }
      connection2.onRequest(vscode_languageserver_protocol_1.InitializeRequest.type, (params) => {
        watchDog.initialize(params);
        if (Is.string(params.trace)) {
          tracer.trace = vscode_languageserver_protocol_1.Trace.fromString(params.trace);
        }
        for (let remote of allRemotes) {
          remote.initialize(params.capabilities);
        }
        if (initializeHandler) {
          let result = initializeHandler(params, new vscode_languageserver_protocol_1.CancellationTokenSource().token, (0, progress_1.attachWorkDone)(connection2, params), void 0);
          return asPromise(result).then((value) => {
            if (value instanceof vscode_languageserver_protocol_1.ResponseError) {
              return value;
            }
            let result2 = value;
            if (!result2) {
              result2 = { capabilities: {} };
            }
            let capabilities = result2.capabilities;
            if (!capabilities) {
              capabilities = {};
              result2.capabilities = capabilities;
            }
            if (capabilities.textDocumentSync === void 0 || capabilities.textDocumentSync === null) {
              capabilities.textDocumentSync = Is.number(protocolConnection.__textDocumentSync) ? protocolConnection.__textDocumentSync : vscode_languageserver_protocol_1.TextDocumentSyncKind.None;
            } else if (!Is.number(capabilities.textDocumentSync) && !Is.number(capabilities.textDocumentSync.change)) {
              capabilities.textDocumentSync.change = Is.number(protocolConnection.__textDocumentSync) ? protocolConnection.__textDocumentSync : vscode_languageserver_protocol_1.TextDocumentSyncKind.None;
            }
            for (let remote of allRemotes) {
              remote.fillServerCapabilities(capabilities);
            }
            return result2;
          });
        } else {
          let result = { capabilities: { textDocumentSync: vscode_languageserver_protocol_1.TextDocumentSyncKind.None } };
          for (let remote of allRemotes) {
            remote.fillServerCapabilities(result.capabilities);
          }
          return result;
        }
      });
      connection2.onRequest(vscode_languageserver_protocol_1.ShutdownRequest.type, () => {
        watchDog.shutdownReceived = true;
        if (shutdownHandler) {
          return shutdownHandler(new vscode_languageserver_protocol_1.CancellationTokenSource().token);
        } else {
          return void 0;
        }
      });
      connection2.onNotification(vscode_languageserver_protocol_1.ExitNotification.type, () => {
        try {
          if (exitHandler) {
            exitHandler();
          }
        } finally {
          if (watchDog.shutdownReceived) {
            watchDog.exit(0);
          } else {
            watchDog.exit(1);
          }
        }
      });
      connection2.onNotification(vscode_languageserver_protocol_1.SetTraceNotification.type, (params) => {
        tracer.trace = vscode_languageserver_protocol_1.Trace.fromString(params.value);
      });
      return protocolConnection;
    }
    exports2.createConnection = createConnection2;
  }
});

// node_modules/vscode-languageserver/lib/node/files.js
var require_files = __commonJS({
  "node_modules/vscode-languageserver/lib/node/files.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.resolveModulePath = exports2.FileSystem = exports2.resolveGlobalYarnPath = exports2.resolveGlobalNodePath = exports2.resolve = exports2.uriToFilePath = void 0;
    var url = require("url");
    var path2 = require("path");
    var fs2 = require("fs");
    var child_process_1 = require("child_process");
    function uriToFilePath(uri) {
      let parsed = url.parse(uri);
      if (parsed.protocol !== "file:" || !parsed.path) {
        return void 0;
      }
      let segments = parsed.path.split("/");
      for (var i = 0, len = segments.length; i < len; i++) {
        segments[i] = decodeURIComponent(segments[i]);
      }
      if (process.platform === "win32" && segments.length > 1) {
        let first = segments[0];
        let second = segments[1];
        if (first.length === 0 && second.length > 1 && second[1] === ":") {
          segments.shift();
        }
      }
      return path2.normalize(segments.join("/"));
    }
    exports2.uriToFilePath = uriToFilePath;
    function isWindows() {
      return process.platform === "win32";
    }
    function resolve(moduleName, nodePath, cwd, tracer) {
      const nodePathKey = "NODE_PATH";
      const app = [
        "var p = process;",
        "p.on('message',function(m){",
        "if(m.c==='e'){",
        "p.exit(0);",
        "}",
        "else if(m.c==='rs'){",
        "try{",
        "var r=require.resolve(m.a);",
        "p.send({c:'r',s:true,r:r});",
        "}",
        "catch(err){",
        "p.send({c:'r',s:false});",
        "}",
        "}",
        "});"
      ].join("");
      return new Promise((resolve2, reject) => {
        let env = process.env;
        let newEnv = /* @__PURE__ */ Object.create(null);
        Object.keys(env).forEach((key) => newEnv[key] = env[key]);
        if (nodePath && fs2.existsSync(nodePath)) {
          if (newEnv[nodePathKey]) {
            newEnv[nodePathKey] = nodePath + path2.delimiter + newEnv[nodePathKey];
          } else {
            newEnv[nodePathKey] = nodePath;
          }
          if (tracer) {
            tracer(`NODE_PATH value is: ${newEnv[nodePathKey]}`);
          }
        }
        newEnv["ELECTRON_RUN_AS_NODE"] = "1";
        try {
          let cp = (0, child_process_1.fork)("", [], {
            cwd,
            env: newEnv,
            execArgv: ["-e", app]
          });
          if (cp.pid === void 0) {
            reject(new Error(`Starting process to resolve node module  ${moduleName} failed`));
            return;
          }
          cp.on("error", (error) => {
            reject(error);
          });
          cp.on("message", (message2) => {
            if (message2.c === "r") {
              cp.send({ c: "e" });
              if (message2.s) {
                resolve2(message2.r);
              } else {
                reject(new Error(`Failed to resolve module: ${moduleName}`));
              }
            }
          });
          let message = {
            c: "rs",
            a: moduleName
          };
          cp.send(message);
        } catch (error) {
          reject(error);
        }
      });
    }
    exports2.resolve = resolve;
    function resolveGlobalNodePath(tracer) {
      let npmCommand = "npm";
      const env = /* @__PURE__ */ Object.create(null);
      Object.keys(process.env).forEach((key) => env[key] = process.env[key]);
      env["NO_UPDATE_NOTIFIER"] = "true";
      const options = {
        encoding: "utf8",
        env
      };
      if (isWindows()) {
        npmCommand = "npm.cmd";
        options.shell = true;
      }
      let handler = () => {
      };
      try {
        process.on("SIGPIPE", handler);
        let stdout = (0, child_process_1.spawnSync)(npmCommand, ["config", "get", "prefix"], options).stdout;
        if (!stdout) {
          if (tracer) {
            tracer(`'npm config get prefix' didn't return a value.`);
          }
          return void 0;
        }
        let prefix = stdout.trim();
        if (tracer) {
          tracer(`'npm config get prefix' value is: ${prefix}`);
        }
        if (prefix.length > 0) {
          if (isWindows()) {
            return path2.join(prefix, "node_modules");
          } else {
            return path2.join(prefix, "lib", "node_modules");
          }
        }
        return void 0;
      } catch (err) {
        return void 0;
      } finally {
        process.removeListener("SIGPIPE", handler);
      }
    }
    exports2.resolveGlobalNodePath = resolveGlobalNodePath;
    function resolveGlobalYarnPath(tracer) {
      let yarnCommand = "yarn";
      let options = {
        encoding: "utf8"
      };
      if (isWindows()) {
        yarnCommand = "yarn.cmd";
        options.shell = true;
      }
      let handler = () => {
      };
      try {
        process.on("SIGPIPE", handler);
        let results = (0, child_process_1.spawnSync)(yarnCommand, ["global", "dir", "--json"], options);
        let stdout = results.stdout;
        if (!stdout) {
          if (tracer) {
            tracer(`'yarn global dir' didn't return a value.`);
            if (results.stderr) {
              tracer(results.stderr);
            }
          }
          return void 0;
        }
        let lines = stdout.trim().split(/\r?\n/);
        for (let line of lines) {
          try {
            let yarn = JSON.parse(line);
            if (yarn.type === "log") {
              return path2.join(yarn.data, "node_modules");
            }
          } catch (e) {
          }
        }
        return void 0;
      } catch (err) {
        return void 0;
      } finally {
        process.removeListener("SIGPIPE", handler);
      }
    }
    exports2.resolveGlobalYarnPath = resolveGlobalYarnPath;
    var FileSystem;
    (function(FileSystem2) {
      let _isCaseSensitive = void 0;
      function isCaseSensitive() {
        if (_isCaseSensitive !== void 0) {
          return _isCaseSensitive;
        }
        if (process.platform === "win32") {
          _isCaseSensitive = false;
        } else {
          _isCaseSensitive = !fs2.existsSync(__filename.toUpperCase()) || !fs2.existsSync(__filename.toLowerCase());
        }
        return _isCaseSensitive;
      }
      FileSystem2.isCaseSensitive = isCaseSensitive;
      function isParent(parent, child) {
        if (isCaseSensitive()) {
          return path2.normalize(child).indexOf(path2.normalize(parent)) === 0;
        } else {
          return path2.normalize(child).toLowerCase().indexOf(path2.normalize(parent).toLowerCase()) === 0;
        }
      }
      FileSystem2.isParent = isParent;
    })(FileSystem || (exports2.FileSystem = FileSystem = {}));
    function resolveModulePath(workspaceRoot, moduleName, nodePath, tracer) {
      if (nodePath) {
        if (!path2.isAbsolute(nodePath)) {
          nodePath = path2.join(workspaceRoot, nodePath);
        }
        return resolve(moduleName, nodePath, nodePath, tracer).then((value) => {
          if (FileSystem.isParent(nodePath, value)) {
            return value;
          } else {
            return Promise.reject(new Error(`Failed to load ${moduleName} from node path location.`));
          }
        }).then(void 0, (_error) => {
          return resolve(moduleName, resolveGlobalNodePath(tracer), workspaceRoot, tracer);
        });
      } else {
        return resolve(moduleName, resolveGlobalNodePath(tracer), workspaceRoot, tracer);
      }
    }
    exports2.resolveModulePath = resolveModulePath;
  }
});

// node_modules/vscode-languageserver-protocol/node.js
var require_node2 = __commonJS({
  "node_modules/vscode-languageserver-protocol/node.js"(exports2, module2) {
    "use strict";
    module2.exports = require_main3();
  }
});

// node_modules/vscode-languageserver/lib/common/inlineCompletion.proposed.js
var require_inlineCompletion_proposed = __commonJS({
  "node_modules/vscode-languageserver/lib/common/inlineCompletion.proposed.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.InlineCompletionFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var InlineCompletionFeature = (Base) => {
      return class extends Base {
        get inlineCompletion() {
          return {
            on: (handler) => {
              return this.connection.onRequest(vscode_languageserver_protocol_1.InlineCompletionRequest.type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params));
              });
            }
          };
        }
      };
    };
    exports2.InlineCompletionFeature = InlineCompletionFeature;
  }
});

// node_modules/vscode-languageserver/lib/common/api.js
var require_api3 = __commonJS({
  "node_modules/vscode-languageserver/lib/common/api.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p))
          __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ProposedFeatures = exports2.NotebookDocuments = exports2.TextDocuments = exports2.SemanticTokensBuilder = void 0;
    var semanticTokens_1 = require_semanticTokens();
    Object.defineProperty(exports2, "SemanticTokensBuilder", { enumerable: true, get: function() {
      return semanticTokens_1.SemanticTokensBuilder;
    } });
    var ic = require_inlineCompletion_proposed();
    __exportStar(require_main3(), exports2);
    var textDocuments_1 = require_textDocuments();
    Object.defineProperty(exports2, "TextDocuments", { enumerable: true, get: function() {
      return textDocuments_1.TextDocuments;
    } });
    var notebook_1 = require_notebook();
    Object.defineProperty(exports2, "NotebookDocuments", { enumerable: true, get: function() {
      return notebook_1.NotebookDocuments;
    } });
    __exportStar(require_server(), exports2);
    var ProposedFeatures2;
    (function(ProposedFeatures3) {
      ProposedFeatures3.all = {
        __brand: "features",
        languages: ic.InlineCompletionFeature
      };
    })(ProposedFeatures2 || (exports2.ProposedFeatures = ProposedFeatures2 = {}));
  }
});

// node_modules/vscode-languageserver/lib/node/main.js
var require_main4 = __commonJS({
  "node_modules/vscode-languageserver/lib/node/main.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p))
          __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createConnection = exports2.Files = void 0;
    var node_util_1 = require("util");
    var Is = require_is();
    var server_1 = require_server();
    var fm = require_files();
    var node_1 = require_node2();
    __exportStar(require_node2(), exports2);
    __exportStar(require_api3(), exports2);
    var Files;
    (function(Files2) {
      Files2.uriToFilePath = fm.uriToFilePath;
      Files2.resolveGlobalNodePath = fm.resolveGlobalNodePath;
      Files2.resolveGlobalYarnPath = fm.resolveGlobalYarnPath;
      Files2.resolve = fm.resolve;
      Files2.resolveModulePath = fm.resolveModulePath;
    })(Files || (exports2.Files = Files = {}));
    var _protocolConnection;
    function endProtocolConnection() {
      if (_protocolConnection === void 0) {
        return;
      }
      try {
        _protocolConnection.end();
      } catch (_err) {
      }
    }
    var _shutdownReceived = false;
    var exitTimer = void 0;
    function setupExitTimer() {
      const argName = "--clientProcessId";
      function runTimer(value) {
        try {
          let processId = parseInt(value);
          if (!isNaN(processId)) {
            exitTimer = setInterval(() => {
              try {
                process.kill(processId, 0);
              } catch (ex) {
                endProtocolConnection();
                process.exit(_shutdownReceived ? 0 : 1);
              }
            }, 3e3);
          }
        } catch (e) {
        }
      }
      for (let i = 2; i < process.argv.length; i++) {
        let arg = process.argv[i];
        if (arg === argName && i + 1 < process.argv.length) {
          runTimer(process.argv[i + 1]);
          return;
        } else {
          let args = arg.split("=");
          if (args[0] === argName) {
            runTimer(args[1]);
          }
        }
      }
    }
    setupExitTimer();
    var watchDog = {
      initialize: (params) => {
        const processId = params.processId;
        if (Is.number(processId) && exitTimer === void 0) {
          setInterval(() => {
            try {
              process.kill(processId, 0);
            } catch (ex) {
              process.exit(_shutdownReceived ? 0 : 1);
            }
          }, 3e3);
        }
      },
      get shutdownReceived() {
        return _shutdownReceived;
      },
      set shutdownReceived(value) {
        _shutdownReceived = value;
      },
      exit: (code) => {
        endProtocolConnection();
        process.exit(code);
      }
    };
    function createConnection2(arg1, arg2, arg3, arg4) {
      let factories;
      let input;
      let output;
      let options;
      if (arg1 !== void 0 && arg1.__brand === "features") {
        factories = arg1;
        arg1 = arg2;
        arg2 = arg3;
        arg3 = arg4;
      }
      if (node_1.ConnectionStrategy.is(arg1) || node_1.ConnectionOptions.is(arg1)) {
        options = arg1;
      } else {
        input = arg1;
        output = arg2;
        options = arg3;
      }
      return _createConnection(input, output, options, factories);
    }
    exports2.createConnection = createConnection2;
    function _createConnection(input, output, options, factories) {
      let stdio = false;
      if (!input && !output && process.argv.length > 2) {
        let port = void 0;
        let pipeName = void 0;
        let argv = process.argv.slice(2);
        for (let i = 0; i < argv.length; i++) {
          let arg = argv[i];
          if (arg === "--node-ipc") {
            input = new node_1.IPCMessageReader(process);
            output = new node_1.IPCMessageWriter(process);
            break;
          } else if (arg === "--stdio") {
            stdio = true;
            input = process.stdin;
            output = process.stdout;
            break;
          } else if (arg === "--socket") {
            port = parseInt(argv[i + 1]);
            break;
          } else if (arg === "--pipe") {
            pipeName = argv[i + 1];
            break;
          } else {
            var args = arg.split("=");
            if (args[0] === "--socket") {
              port = parseInt(args[1]);
              break;
            } else if (args[0] === "--pipe") {
              pipeName = args[1];
              break;
            }
          }
        }
        if (port) {
          let transport = (0, node_1.createServerSocketTransport)(port);
          input = transport[0];
          output = transport[1];
        } else if (pipeName) {
          let transport = (0, node_1.createServerPipeTransport)(pipeName);
          input = transport[0];
          output = transport[1];
        }
      }
      var commandLineMessage = "Use arguments of createConnection or set command line parameters: '--node-ipc', '--stdio' or '--socket={number}'";
      if (!input) {
        throw new Error("Connection input stream is not set. " + commandLineMessage);
      }
      if (!output) {
        throw new Error("Connection output stream is not set. " + commandLineMessage);
      }
      if (Is.func(input.read) && Is.func(input.on)) {
        let inputStream = input;
        inputStream.on("end", () => {
          endProtocolConnection();
          process.exit(_shutdownReceived ? 0 : 1);
        });
        inputStream.on("close", () => {
          endProtocolConnection();
          process.exit(_shutdownReceived ? 0 : 1);
        });
      }
      const connectionFactory = (logger) => {
        const result = (0, node_1.createProtocolConnection)(input, output, logger, options);
        if (stdio) {
          patchConsole(logger);
        }
        return result;
      };
      return (0, server_1.createConnection)(connectionFactory, watchDog, factories);
    }
    function patchConsole(logger) {
      function serialize(args) {
        return args.map((arg) => typeof arg === "string" ? arg : (0, node_util_1.inspect)(arg)).join(" ");
      }
      const counters = /* @__PURE__ */ new Map();
      console.assert = function assert(assertion, ...args) {
        if (assertion) {
          return;
        }
        if (args.length === 0) {
          logger.error("Assertion failed");
        } else {
          const [message, ...rest] = args;
          logger.error(`Assertion failed: ${message} ${serialize(rest)}`);
        }
      };
      console.count = function count(label = "default") {
        const message = String(label);
        let counter = counters.get(message) ?? 0;
        counter += 1;
        counters.set(message, counter);
        logger.log(`${message}: ${message}`);
      };
      console.countReset = function countReset(label) {
        if (label === void 0) {
          counters.clear();
        } else {
          counters.delete(String(label));
        }
      };
      console.debug = function debug(...args) {
        logger.log(serialize(args));
      };
      console.dir = function dir(arg, options) {
        logger.log((0, node_util_1.inspect)(arg, options));
      };
      console.log = function log(...args) {
        logger.log(serialize(args));
      };
      console.error = function error(...args) {
        logger.error(serialize(args));
      };
      console.trace = function trace(...args) {
        const stack = new Error().stack.replace(/(.+\n){2}/, "");
        let message = "Trace";
        if (args.length !== 0) {
          message += `: ${serialize(args)}`;
        }
        logger.log(`${message}
${stack}`);
      };
      console.warn = function warn(...args) {
        logger.warn(serialize(args));
      };
    }
  }
});

// node_modules/vscode-languageserver/node.js
var require_node3 = __commonJS({
  "node_modules/vscode-languageserver/node.js"(exports2, module2) {
    "use strict";
    module2.exports = require_main4();
  }
});

// ../node_modules/antlr4/dist/antlr4.node.cjs
var require_antlr4_node = __commonJS({
  "../node_modules/antlr4/dist/antlr4.node.cjs"(exports2) {
    (() => {
      "use strict";
      var t = { d: (e2, n2) => {
        for (var s2 in n2)
          t.o(n2, s2) && !t.o(e2, s2) && Object.defineProperty(e2, s2, { enumerable: true, get: n2[s2] });
      }, o: (t2, e2) => Object.prototype.hasOwnProperty.call(t2, e2), r: (t2) => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t2, "__esModule", { value: true });
      } }, e = {};
      t.r(e), t.d(e, { ATN: () => j, ATNDeserializer: () => It, BailErrorStrategy: () => _e, CharStream: () => Ae, CharStreams: () => Le, CommonToken: () => vt, CommonTokenStream: () => we, DFA: () => oe, DefaultErrorStrategy: () => Ee, DiagnosticErrorListener: () => Te, ErrorListener: () => yt, FailedPredicateException: () => fe, FileStream: () => ye, InputMismatchException: () => pe, InputStream: () => Ne, Interval: () => S, IntervalSet: () => m, LL1Analyzer: () => G, Lexer: () => Ft, LexerATNSimulator: () => Wt, NoViableAltException: () => Zt, ParseTreeListener: () => ce, ParseTreeVisitor: () => ue, ParseTreeWalker: () => de, Parser: () => be, ParserATNSimulator: () => ee, ParserRuleContext: () => Me, PredictionContextCache: () => ne, PredictionMode: () => Qt, RecognitionException: () => bt, RuleContext: () => F, RuleNode: () => v, TerminalNode: () => w, Token: () => n, TokenStreamRewriter: () => Ue, arrayToString: () => c, default: () => He });
      class n {
        constructor() {
          this.source = null, this.type = null, this.channel = null, this.start = null, this.stop = null, this.tokenIndex = null, this.line = null, this.column = null, this._text = null;
        }
        getTokenSource() {
          return this.source[0];
        }
        getInputStream() {
          return this.source[1];
        }
        get text() {
          return this._text;
        }
        set text(t2) {
          this._text = t2;
        }
      }
      function s(t2, e2) {
        if (!Array.isArray(t2) || !Array.isArray(e2))
          return false;
        if (t2 === e2)
          return true;
        if (t2.length !== e2.length)
          return false;
        for (let n2 = 0; n2 < t2.length; n2++)
          if (!(t2[n2] === e2[n2] || t2[n2].equals && t2[n2].equals(e2[n2])))
            return false;
        return true;
      }
      n.INVALID_TYPE = 0, n.EPSILON = -2, n.MIN_USER_TOKEN_TYPE = 1, n.EOF = -1, n.DEFAULT_CHANNEL = 0, n.HIDDEN_CHANNEL = 1;
      const i = Math.round(Math.random() * Math.pow(2, 32));
      function r(t2) {
        if (!t2)
          return 0;
        const e2 = typeof t2, n2 = "string" === e2 ? t2 : !("object" !== e2 || !t2.toString) && t2.toString();
        if (!n2)
          return 0;
        let s2, r2;
        const o2 = 3 & n2.length, l2 = n2.length - o2;
        let a2 = i;
        const h2 = 3432918353, c2 = 461845907;
        let u2 = 0;
        for (; u2 < l2; )
          r2 = 255 & n2.charCodeAt(u2) | (255 & n2.charCodeAt(++u2)) << 8 | (255 & n2.charCodeAt(++u2)) << 16 | (255 & n2.charCodeAt(++u2)) << 24, ++u2, r2 = (65535 & r2) * h2 + (((r2 >>> 16) * h2 & 65535) << 16) & 4294967295, r2 = r2 << 15 | r2 >>> 17, r2 = (65535 & r2) * c2 + (((r2 >>> 16) * c2 & 65535) << 16) & 4294967295, a2 ^= r2, a2 = a2 << 13 | a2 >>> 19, s2 = 5 * (65535 & a2) + ((5 * (a2 >>> 16) & 65535) << 16) & 4294967295, a2 = 27492 + (65535 & s2) + ((58964 + (s2 >>> 16) & 65535) << 16);
        switch (r2 = 0, o2) {
          case 3:
            r2 ^= (255 & n2.charCodeAt(u2 + 2)) << 16;
          case 2:
            r2 ^= (255 & n2.charCodeAt(u2 + 1)) << 8;
          case 1:
            r2 ^= 255 & n2.charCodeAt(u2), r2 = (65535 & r2) * h2 + (((r2 >>> 16) * h2 & 65535) << 16) & 4294967295, r2 = r2 << 15 | r2 >>> 17, r2 = (65535 & r2) * c2 + (((r2 >>> 16) * c2 & 65535) << 16) & 4294967295, a2 ^= r2;
        }
        return a2 ^= n2.length, a2 ^= a2 >>> 16, a2 = 2246822507 * (65535 & a2) + ((2246822507 * (a2 >>> 16) & 65535) << 16) & 4294967295, a2 ^= a2 >>> 13, a2 = 3266489909 * (65535 & a2) + ((3266489909 * (a2 >>> 16) & 65535) << 16) & 4294967295, a2 ^= a2 >>> 16, a2 >>> 0;
      }
      class o {
        constructor() {
          this.count = 0, this.hash = 0;
        }
        update() {
          for (let t2 = 0; t2 < arguments.length; t2++) {
            const e2 = arguments[t2];
            if (null != e2)
              if (Array.isArray(e2))
                this.update.apply(this, e2);
              else {
                let t3 = 0;
                switch (typeof e2) {
                  case "undefined":
                  case "function":
                    continue;
                  case "number":
                  case "boolean":
                    t3 = e2;
                    break;
                  case "string":
                    t3 = r(e2);
                    break;
                  default:
                    e2.updateHashCode ? e2.updateHashCode(this) : console.log("No updateHashCode for " + e2.toString());
                    continue;
                }
                t3 *= 3432918353, t3 = t3 << 15 | t3 >>> 17, t3 *= 461845907, this.count = this.count + 1;
                let n2 = this.hash ^ t3;
                n2 = n2 << 13 | n2 >>> 19, n2 = 5 * n2 + 3864292196, this.hash = n2;
              }
          }
        }
        finish() {
          let t2 = this.hash ^ 4 * this.count;
          return t2 ^= t2 >>> 16, t2 *= 2246822507, t2 ^= t2 >>> 13, t2 *= 3266489909, t2 ^= t2 >>> 16, t2;
        }
        static hashStuff() {
          const t2 = new o();
          return t2.update.apply(t2, arguments), t2.finish();
        }
      }
      function l(t2) {
        return t2 ? "string" == typeof t2 ? r(t2) : t2.hashCode() : -1;
      }
      function a(t2, e2) {
        return t2 && t2.equals ? t2.equals(e2) : t2 === e2;
      }
      function h(t2) {
        return null === t2 ? "null" : t2;
      }
      function c(t2) {
        return Array.isArray(t2) ? "[" + t2.map(h).join(", ") + "]" : "null";
      }
      class u {
        constructor(t2, e2) {
          this.buckets = new Array(16), this.threshold = Math.floor(12), this.itemCount = 0, this.hashFunction = t2 || l, this.equalsFunction = e2 || a;
        }
        get(t2) {
          if (null == t2)
            return t2;
          const e2 = this._getBucket(t2);
          if (!e2)
            return null;
          for (const n2 of e2)
            if (this.equalsFunction(n2, t2))
              return n2;
          return null;
        }
        add(t2) {
          return this.getOrAdd(t2) === t2;
        }
        getOrAdd(t2) {
          this._expand();
          const e2 = this._getSlot(t2);
          let n2 = this.buckets[e2];
          if (!n2)
            return n2 = [t2], this.buckets[e2] = n2, this.itemCount++, t2;
          for (const e3 of n2)
            if (this.equalsFunction(e3, t2))
              return e3;
          return n2.push(t2), this.itemCount++, t2;
        }
        has(t2) {
          return null != this.get(t2);
        }
        values() {
          return this.buckets.filter((t2) => null != t2).flat(1);
        }
        toString() {
          return c(this.values());
        }
        get length() {
          return this.itemCount;
        }
        _getSlot(t2) {
          return this.hashFunction(t2) & this.buckets.length - 1;
        }
        _getBucket(t2) {
          return this.buckets[this._getSlot(t2)];
        }
        _expand() {
          if (this.itemCount <= this.threshold)
            return;
          const t2 = this.buckets, e2 = 2 * this.buckets.length;
          this.buckets = new Array(e2), this.threshold = Math.floor(0.75 * e2);
          for (const e3 of t2)
            if (e3)
              for (const t3 of e3) {
                const e4 = this._getSlot(t3);
                let n2 = this.buckets[e4];
                n2 || (n2 = [], this.buckets[e4] = n2), n2.push(t3);
              }
        }
      }
      class d {
        hashCode() {
          const t2 = new o();
          return this.updateHashCode(t2), t2.finish();
        }
        evaluate(t2, e2) {
        }
        evalPrecedence(t2, e2) {
          return this;
        }
        static andContext(t2, e2) {
          if (null === t2 || t2 === d.NONE)
            return e2;
          if (null === e2 || e2 === d.NONE)
            return t2;
          const n2 = new g(t2, e2);
          return 1 === n2.opnds.length ? n2.opnds[0] : n2;
        }
        static orContext(t2, e2) {
          if (null === t2)
            return e2;
          if (null === e2)
            return t2;
          if (t2 === d.NONE || e2 === d.NONE)
            return d.NONE;
          const n2 = new p(t2, e2);
          return 1 === n2.opnds.length ? n2.opnds[0] : n2;
        }
      }
      class g extends d {
        constructor(t2, e2) {
          super();
          const n2 = new u();
          t2 instanceof g ? t2.opnds.map(function(t3) {
            n2.add(t3);
          }) : n2.add(t2), e2 instanceof g ? e2.opnds.map(function(t3) {
            n2.add(t3);
          }) : n2.add(e2);
          const s2 = f(n2);
          if (s2.length > 0) {
            let t3 = null;
            s2.map(function(e3) {
              (null === t3 || e3.precedence < t3.precedence) && (t3 = e3);
            }), n2.add(t3);
          }
          this.opnds = Array.from(n2.values());
        }
        equals(t2) {
          return this === t2 || t2 instanceof g && s(this.opnds, t2.opnds);
        }
        updateHashCode(t2) {
          t2.update(this.opnds, "AND");
        }
        evaluate(t2, e2) {
          for (let n2 = 0; n2 < this.opnds.length; n2++)
            if (!this.opnds[n2].evaluate(t2, e2))
              return false;
          return true;
        }
        evalPrecedence(t2, e2) {
          let n2 = false;
          const s2 = [];
          for (let i3 = 0; i3 < this.opnds.length; i3++) {
            const r2 = this.opnds[i3], o2 = r2.evalPrecedence(t2, e2);
            if (n2 |= o2 !== r2, null === o2)
              return null;
            o2 !== d.NONE && s2.push(o2);
          }
          if (!n2)
            return this;
          if (0 === s2.length)
            return d.NONE;
          let i2 = null;
          return s2.map(function(t3) {
            i2 = null === i2 ? t3 : d.andContext(i2, t3);
          }), i2;
        }
        toString() {
          const t2 = this.opnds.map((t3) => t3.toString());
          return (t2.length > 3 ? t2.slice(3) : t2).join("&&");
        }
      }
      class p extends d {
        constructor(t2, e2) {
          super();
          const n2 = new u();
          t2 instanceof p ? t2.opnds.map(function(t3) {
            n2.add(t3);
          }) : n2.add(t2), e2 instanceof p ? e2.opnds.map(function(t3) {
            n2.add(t3);
          }) : n2.add(e2);
          const s2 = f(n2);
          if (s2.length > 0) {
            const t3 = s2.sort(function(t4, e4) {
              return t4.compareTo(e4);
            }), e3 = t3[t3.length - 1];
            n2.add(e3);
          }
          this.opnds = Array.from(n2.values());
        }
        equals(t2) {
          return this === t2 || t2 instanceof p && s(this.opnds, t2.opnds);
        }
        updateHashCode(t2) {
          t2.update(this.opnds, "OR");
        }
        evaluate(t2, e2) {
          for (let n2 = 0; n2 < this.opnds.length; n2++)
            if (this.opnds[n2].evaluate(t2, e2))
              return true;
          return false;
        }
        evalPrecedence(t2, e2) {
          let n2 = false;
          const s2 = [];
          for (let i2 = 0; i2 < this.opnds.length; i2++) {
            const r2 = this.opnds[i2], o2 = r2.evalPrecedence(t2, e2);
            if (n2 |= o2 !== r2, o2 === d.NONE)
              return d.NONE;
            null !== o2 && s2.push(o2);
          }
          if (!n2)
            return this;
          if (0 === s2.length)
            return null;
          return s2.map(function(t3) {
            return t3;
          }), null;
        }
        toString() {
          const t2 = this.opnds.map((t3) => t3.toString());
          return (t2.length > 3 ? t2.slice(3) : t2).join("||");
        }
      }
      function f(t2) {
        const e2 = [];
        return t2.values().map(function(t3) {
          t3 instanceof d.PrecedencePredicate && e2.push(t3);
        }), e2;
      }
      function x(t2, e2) {
        if (null === t2) {
          const t3 = { state: null, alt: null, context: null, semanticContext: null };
          return e2 && (t3.reachesIntoOuterContext = 0), t3;
        }
        {
          const n2 = {};
          return n2.state = t2.state || null, n2.alt = void 0 === t2.alt ? null : t2.alt, n2.context = t2.context || null, n2.semanticContext = t2.semanticContext || null, e2 && (n2.reachesIntoOuterContext = t2.reachesIntoOuterContext || 0, n2.precedenceFilterSuppressed = t2.precedenceFilterSuppressed || false), n2;
        }
      }
      class T {
        constructor(t2, e2) {
          this.checkContext(t2, e2), t2 = x(t2), e2 = x(e2, true), this.state = null !== t2.state ? t2.state : e2.state, this.alt = null !== t2.alt ? t2.alt : e2.alt, this.context = null !== t2.context ? t2.context : e2.context, this.semanticContext = null !== t2.semanticContext ? t2.semanticContext : null !== e2.semanticContext ? e2.semanticContext : d.NONE, this.reachesIntoOuterContext = e2.reachesIntoOuterContext, this.precedenceFilterSuppressed = e2.precedenceFilterSuppressed;
        }
        checkContext(t2, e2) {
          null !== t2.context && void 0 !== t2.context || null !== e2 && null !== e2.context && void 0 !== e2.context || (this.context = null);
        }
        hashCode() {
          const t2 = new o();
          return this.updateHashCode(t2), t2.finish();
        }
        updateHashCode(t2) {
          t2.update(this.state.stateNumber, this.alt, this.context, this.semanticContext);
        }
        equals(t2) {
          return this === t2 || t2 instanceof T && this.state.stateNumber === t2.state.stateNumber && this.alt === t2.alt && (null === this.context ? null === t2.context : this.context.equals(t2.context)) && this.semanticContext.equals(t2.semanticContext) && this.precedenceFilterSuppressed === t2.precedenceFilterSuppressed;
        }
        hashCodeForConfigSet() {
          const t2 = new o();
          return t2.update(this.state.stateNumber, this.alt, this.semanticContext), t2.finish();
        }
        equalsForConfigSet(t2) {
          return this === t2 || t2 instanceof T && this.state.stateNumber === t2.state.stateNumber && this.alt === t2.alt && this.semanticContext.equals(t2.semanticContext);
        }
        toString() {
          return "(" + this.state + "," + this.alt + (null !== this.context ? ",[" + this.context.toString() + "]" : "") + (this.semanticContext !== d.NONE ? "," + this.semanticContext.toString() : "") + (this.reachesIntoOuterContext > 0 ? ",up=" + this.reachesIntoOuterContext : "") + ")";
        }
      }
      class S {
        constructor(t2, e2) {
          this.start = t2, this.stop = e2;
        }
        clone() {
          return new S(this.start, this.stop);
        }
        contains(t2) {
          return t2 >= this.start && t2 < this.stop;
        }
        toString() {
          return this.start === this.stop - 1 ? this.start.toString() : this.start.toString() + ".." + (this.stop - 1).toString();
        }
        get length() {
          return this.stop - this.start;
        }
      }
      S.INVALID_INTERVAL = new S(-1, -2);
      class m {
        constructor() {
          this.intervals = null, this.readOnly = false;
        }
        first(t2) {
          return null === this.intervals || 0 === this.intervals.length ? n.INVALID_TYPE : this.intervals[0].start;
        }
        addOne(t2) {
          this.addInterval(new S(t2, t2 + 1));
        }
        addRange(t2, e2) {
          this.addInterval(new S(t2, e2 + 1));
        }
        addInterval(t2) {
          if (null === this.intervals)
            this.intervals = [], this.intervals.push(t2.clone());
          else {
            for (let e2 = 0; e2 < this.intervals.length; e2++) {
              const n2 = this.intervals[e2];
              if (t2.stop < n2.start)
                return void this.intervals.splice(e2, 0, t2);
              if (t2.stop === n2.start)
                return void (this.intervals[e2] = new S(t2.start, n2.stop));
              if (t2.start <= n2.stop)
                return this.intervals[e2] = new S(Math.min(n2.start, t2.start), Math.max(n2.stop, t2.stop)), void this.reduce(e2);
            }
            this.intervals.push(t2.clone());
          }
        }
        addSet(t2) {
          return null !== t2.intervals && t2.intervals.forEach((t3) => this.addInterval(t3), this), this;
        }
        reduce(t2) {
          if (t2 < this.intervals.length - 1) {
            const e2 = this.intervals[t2], n2 = this.intervals[t2 + 1];
            e2.stop >= n2.stop ? (this.intervals.splice(t2 + 1, 1), this.reduce(t2)) : e2.stop >= n2.start && (this.intervals[t2] = new S(e2.start, n2.stop), this.intervals.splice(t2 + 1, 1));
          }
        }
        complement(t2, e2) {
          const n2 = new m();
          return n2.addInterval(new S(t2, e2 + 1)), null !== this.intervals && this.intervals.forEach((t3) => n2.removeRange(t3)), n2;
        }
        contains(t2) {
          if (null === this.intervals)
            return false;
          for (let e2 = 0; e2 < this.intervals.length; e2++)
            if (this.intervals[e2].contains(t2))
              return true;
          return false;
        }
        removeRange(t2) {
          if (t2.start === t2.stop - 1)
            this.removeOne(t2.start);
          else if (null !== this.intervals) {
            let e2 = 0;
            for (let n2 = 0; n2 < this.intervals.length; n2++) {
              const n3 = this.intervals[e2];
              if (t2.stop <= n3.start)
                return;
              if (t2.start > n3.start && t2.stop < n3.stop) {
                this.intervals[e2] = new S(n3.start, t2.start);
                const s2 = new S(t2.stop, n3.stop);
                return void this.intervals.splice(e2, 0, s2);
              }
              t2.start <= n3.start && t2.stop >= n3.stop ? (this.intervals.splice(e2, 1), e2 -= 1) : t2.start < n3.stop ? this.intervals[e2] = new S(n3.start, t2.start) : t2.stop < n3.stop && (this.intervals[e2] = new S(t2.stop, n3.stop)), e2 += 1;
            }
          }
        }
        removeOne(t2) {
          if (null !== this.intervals)
            for (let e2 = 0; e2 < this.intervals.length; e2++) {
              const n2 = this.intervals[e2];
              if (t2 < n2.start)
                return;
              if (t2 === n2.start && t2 === n2.stop - 1)
                return void this.intervals.splice(e2, 1);
              if (t2 === n2.start)
                return void (this.intervals[e2] = new S(n2.start + 1, n2.stop));
              if (t2 === n2.stop - 1)
                return void (this.intervals[e2] = new S(n2.start, n2.stop - 1));
              if (t2 < n2.stop - 1) {
                const s2 = new S(n2.start, t2);
                return n2.start = t2 + 1, void this.intervals.splice(e2, 0, s2);
              }
            }
        }
        toString(t2, e2, n2) {
          return t2 = t2 || null, e2 = e2 || null, n2 = n2 || false, null === this.intervals ? "{}" : null !== t2 || null !== e2 ? this.toTokenString(t2, e2) : n2 ? this.toCharString() : this.toIndexString();
        }
        toCharString() {
          const t2 = [];
          for (let e2 = 0; e2 < this.intervals.length; e2++) {
            const s2 = this.intervals[e2];
            s2.stop === s2.start + 1 ? s2.start === n.EOF ? t2.push("<EOF>") : t2.push("'" + String.fromCharCode(s2.start) + "'") : t2.push("'" + String.fromCharCode(s2.start) + "'..'" + String.fromCharCode(s2.stop - 1) + "'");
          }
          return t2.length > 1 ? "{" + t2.join(", ") + "}" : t2[0];
        }
        toIndexString() {
          const t2 = [];
          for (let e2 = 0; e2 < this.intervals.length; e2++) {
            const s2 = this.intervals[e2];
            s2.stop === s2.start + 1 ? s2.start === n.EOF ? t2.push("<EOF>") : t2.push(s2.start.toString()) : t2.push(s2.start.toString() + ".." + (s2.stop - 1).toString());
          }
          return t2.length > 1 ? "{" + t2.join(", ") + "}" : t2[0];
        }
        toTokenString(t2, e2) {
          const n2 = [];
          for (let s2 = 0; s2 < this.intervals.length; s2++) {
            const i2 = this.intervals[s2];
            for (let s3 = i2.start; s3 < i2.stop; s3++)
              n2.push(this.elementName(t2, e2, s3));
          }
          return n2.length > 1 ? "{" + n2.join(", ") + "}" : n2[0];
        }
        elementName(t2, e2, s2) {
          return s2 === n.EOF ? "<EOF>" : s2 === n.EPSILON ? "<EPSILON>" : t2[s2] || e2[s2];
        }
        get length() {
          return this.intervals.map((t2) => t2.length).reduce((t2, e2) => t2 + e2);
        }
      }
      class E {
        constructor() {
          this.atn = null, this.stateNumber = E.INVALID_STATE_NUMBER, this.stateType = null, this.ruleIndex = 0, this.epsilonOnlyTransitions = false, this.transitions = [], this.nextTokenWithinRule = null;
        }
        toString() {
          return this.stateNumber;
        }
        equals(t2) {
          return t2 instanceof E && this.stateNumber === t2.stateNumber;
        }
        isNonGreedyExitState() {
          return false;
        }
        addTransition(t2, e2) {
          void 0 === e2 && (e2 = -1), 0 === this.transitions.length ? this.epsilonOnlyTransitions = t2.isEpsilon : this.epsilonOnlyTransitions !== t2.isEpsilon && (this.epsilonOnlyTransitions = false), -1 === e2 ? this.transitions.push(t2) : this.transitions.splice(e2, 1, t2);
        }
      }
      E.INVALID_TYPE = 0, E.BASIC = 1, E.RULE_START = 2, E.BLOCK_START = 3, E.PLUS_BLOCK_START = 4, E.STAR_BLOCK_START = 5, E.TOKEN_START = 6, E.RULE_STOP = 7, E.BLOCK_END = 8, E.STAR_LOOP_BACK = 9, E.STAR_LOOP_ENTRY = 10, E.PLUS_LOOP_BACK = 11, E.LOOP_END = 12, E.serializationNames = ["INVALID", "BASIC", "RULE_START", "BLOCK_START", "PLUS_BLOCK_START", "STAR_BLOCK_START", "TOKEN_START", "RULE_STOP", "BLOCK_END", "STAR_LOOP_BACK", "STAR_LOOP_ENTRY", "PLUS_LOOP_BACK", "LOOP_END"], E.INVALID_STATE_NUMBER = -1;
      class _ extends E {
        constructor() {
          return super(), this.stateType = E.RULE_STOP, this;
        }
      }
      class C {
        constructor(t2) {
          if (null == t2)
            throw "target cannot be null.";
          this.target = t2, this.isEpsilon = false, this.label = null;
        }
      }
      C.EPSILON = 1, C.RANGE = 2, C.RULE = 3, C.PREDICATE = 4, C.ATOM = 5, C.ACTION = 6, C.SET = 7, C.NOT_SET = 8, C.WILDCARD = 9, C.PRECEDENCE = 10, C.serializationNames = ["INVALID", "EPSILON", "RANGE", "RULE", "PREDICATE", "ATOM", "ACTION", "SET", "NOT_SET", "WILDCARD", "PRECEDENCE"], C.serializationTypes = { EpsilonTransition: C.EPSILON, RangeTransition: C.RANGE, RuleTransition: C.RULE, PredicateTransition: C.PREDICATE, AtomTransition: C.ATOM, ActionTransition: C.ACTION, SetTransition: C.SET, NotSetTransition: C.NOT_SET, WildcardTransition: C.WILDCARD, PrecedencePredicateTransition: C.PRECEDENCE };
      class A extends C {
        constructor(t2, e2, n2, s2) {
          super(t2), this.ruleIndex = e2, this.precedence = n2, this.followState = s2, this.serializationType = C.RULE, this.isEpsilon = true;
        }
        matches(t2, e2, n2) {
          return false;
        }
      }
      class N extends C {
        constructor(t2, e2) {
          super(t2), this.serializationType = C.SET, null != e2 ? this.label = e2 : (this.label = new m(), this.label.addOne(n.INVALID_TYPE));
        }
        matches(t2, e2, n2) {
          return this.label.contains(t2);
        }
        toString() {
          return this.label.toString();
        }
      }
      class k extends N {
        constructor(t2, e2) {
          super(t2, e2), this.serializationType = C.NOT_SET;
        }
        matches(t2, e2, n2) {
          return t2 >= e2 && t2 <= n2 && !super.matches(t2, e2, n2);
        }
        toString() {
          return "~" + super.toString();
        }
      }
      class I extends C {
        constructor(t2) {
          super(t2), this.serializationType = C.WILDCARD;
        }
        matches(t2, e2, n2) {
          return t2 >= e2 && t2 <= n2;
        }
        toString() {
          return ".";
        }
      }
      class y extends C {
        constructor(t2) {
          super(t2);
        }
      }
      class L {
      }
      class O extends L {
      }
      class R extends O {
      }
      class v extends R {
        get ruleContext() {
          throw new Error("missing interface implementation");
        }
      }
      class w extends R {
      }
      class P extends w {
      }
      const b = { toStringTree: function(t2, e2, n2) {
        e2 = e2 || null, null !== (n2 = n2 || null) && (e2 = n2.ruleNames);
        let s2 = b.getNodeText(t2, e2);
        s2 = function(t3) {
          return t3 = t3.replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r");
        }(s2);
        const i2 = t2.getChildCount();
        if (0 === i2)
          return s2;
        let r2 = "(" + s2 + " ";
        i2 > 0 && (s2 = b.toStringTree(t2.getChild(0), e2), r2 = r2.concat(s2));
        for (let n3 = 1; n3 < i2; n3++)
          s2 = b.toStringTree(t2.getChild(n3), e2), r2 = r2.concat(" " + s2);
        return r2 = r2.concat(")"), r2;
      }, getNodeText: function(t2, e2, s2) {
        if (e2 = e2 || null, null !== (s2 = s2 || null) && (e2 = s2.ruleNames), null !== e2) {
          if (t2 instanceof v) {
            const n2 = t2.ruleContext.getAltNumber();
            return 0 != n2 ? e2[t2.ruleIndex] + ":" + n2 : e2[t2.ruleIndex];
          }
          if (t2 instanceof P)
            return t2.toString();
          if (t2 instanceof w && null !== t2.symbol)
            return t2.symbol.text;
        }
        const i2 = t2.getPayload();
        return i2 instanceof n ? i2.text : t2.getPayload().toString();
      }, getChildren: function(t2) {
        const e2 = [];
        for (let n2 = 0; n2 < t2.getChildCount(); n2++)
          e2.push(t2.getChild(n2));
        return e2;
      }, getAncestors: function(t2) {
        let e2 = [];
        for (t2 = t2.getParent(); null !== t2; )
          e2 = [t2].concat(e2), t2 = t2.getParent();
        return e2;
      }, findAllTokenNodes: function(t2, e2) {
        return b.findAllNodes(t2, e2, true);
      }, findAllRuleNodes: function(t2, e2) {
        return b.findAllNodes(t2, e2, false);
      }, findAllNodes: function(t2, e2, n2) {
        const s2 = [];
        return b._findAllNodes(t2, e2, n2, s2), s2;
      }, _findAllNodes: function(t2, e2, n2, s2) {
        n2 && t2 instanceof w ? t2.symbol.type === e2 && s2.push(t2) : !n2 && t2 instanceof v && t2.ruleIndex === e2 && s2.push(t2);
        for (let i2 = 0; i2 < t2.getChildCount(); i2++)
          b._findAllNodes(t2.getChild(i2), e2, n2, s2);
      }, descendants: function(t2) {
        let e2 = [t2];
        for (let n2 = 0; n2 < t2.getChildCount(); n2++)
          e2 = e2.concat(b.descendants(t2.getChild(n2)));
        return e2;
      } }, D = b;
      class F extends v {
        constructor(t2, e2) {
          super(), this.parentCtx = t2 || null, this.invokingState = e2 || -1;
        }
        depth() {
          let t2 = 0, e2 = this;
          for (; null !== e2; )
            e2 = e2.parentCtx, t2 += 1;
          return t2;
        }
        isEmpty() {
          return -1 === this.invokingState;
        }
        getSourceInterval() {
          return S.INVALID_INTERVAL;
        }
        get ruleContext() {
          return this;
        }
        getPayload() {
          return this;
        }
        getText() {
          return 0 === this.getChildCount() ? "" : this.children.map(function(t2) {
            return t2.getText();
          }).join("");
        }
        getAltNumber() {
          return 0;
        }
        setAltNumber(t2) {
        }
        getChild(t2) {
          return null;
        }
        getChildCount() {
          return 0;
        }
        accept(t2) {
          return t2.visitChildren(this);
        }
        toStringTree(t2, e2) {
          return D.toStringTree(this, t2, e2);
        }
        toString(t2, e2) {
          t2 = t2 || null, e2 = e2 || null;
          let n2 = this, s2 = "[";
          for (; null !== n2 && n2 !== e2; ) {
            if (null === t2)
              n2.isEmpty() || (s2 += n2.invokingState);
            else {
              const e3 = n2.ruleIndex;
              s2 += e3 >= 0 && e3 < t2.length ? t2[e3] : "" + e3;
            }
            null === n2.parentCtx || null === t2 && n2.parentCtx.isEmpty() || (s2 += " "), n2 = n2.parentCtx;
          }
          return s2 += "]", s2;
        }
      }
      class M {
        constructor(t2) {
          this.cachedHashCode = t2;
        }
        isEmpty() {
          return this === M.EMPTY;
        }
        hasEmptyPath() {
          return this.getReturnState(this.length - 1) === M.EMPTY_RETURN_STATE;
        }
        hashCode() {
          return this.cachedHashCode;
        }
        updateHashCode(t2) {
          t2.update(this.cachedHashCode);
        }
      }
      M.EMPTY = null, M.EMPTY_RETURN_STATE = 2147483647, M.globalNodeCount = 1, M.id = M.globalNodeCount, M.trace_atn_sim = false;
      class U extends M {
        constructor(t2, e2) {
          const n2 = new o();
          return n2.update(t2, e2), super(n2.finish()), this.parents = t2, this.returnStates = e2, this;
        }
        isEmpty() {
          return this.returnStates[0] === M.EMPTY_RETURN_STATE;
        }
        getParent(t2) {
          return this.parents[t2];
        }
        getReturnState(t2) {
          return this.returnStates[t2];
        }
        equals(t2) {
          return this === t2 || t2 instanceof U && this.hashCode() === t2.hashCode() && s(this.returnStates, t2.returnStates) && s(this.parents, t2.parents);
        }
        toString() {
          if (this.isEmpty())
            return "[]";
          {
            let t2 = "[";
            for (let e2 = 0; e2 < this.returnStates.length; e2++)
              e2 > 0 && (t2 += ", "), this.returnStates[e2] !== M.EMPTY_RETURN_STATE ? (t2 += this.returnStates[e2], null !== this.parents[e2] ? t2 = t2 + " " + this.parents[e2] : t2 += "null") : t2 += "$";
            return t2 + "]";
          }
        }
        get length() {
          return this.returnStates.length;
        }
      }
      class B extends M {
        constructor(t2, e2) {
          let n2 = 0;
          const s2 = new o();
          null !== t2 ? s2.update(t2, e2) : s2.update(1), n2 = s2.finish(), super(n2), this.parentCtx = t2, this.returnState = e2;
        }
        getParent(t2) {
          return this.parentCtx;
        }
        getReturnState(t2) {
          return this.returnState;
        }
        equals(t2) {
          return this === t2 || t2 instanceof B && this.hashCode() === t2.hashCode() && this.returnState === t2.returnState && (null == this.parentCtx ? null == t2.parentCtx : this.parentCtx.equals(t2.parentCtx));
        }
        toString() {
          const t2 = null === this.parentCtx ? "" : this.parentCtx.toString();
          return 0 === t2.length ? this.returnState === M.EMPTY_RETURN_STATE ? "$" : "" + this.returnState : this.returnState + " " + t2;
        }
        get length() {
          return 1;
        }
        static create(t2, e2) {
          return e2 === M.EMPTY_RETURN_STATE && null === t2 ? M.EMPTY : new B(t2, e2);
        }
      }
      class V extends B {
        constructor() {
          super(null, M.EMPTY_RETURN_STATE);
        }
        isEmpty() {
          return true;
        }
        getParent(t2) {
          return null;
        }
        getReturnState(t2) {
          return this.returnState;
        }
        equals(t2) {
          return this === t2;
        }
        toString() {
          return "$";
        }
      }
      M.EMPTY = new V();
      class z {
        constructor(t2, e2) {
          this.buckets = new Array(16), this.threshold = Math.floor(12), this.itemCount = 0, this.hashFunction = t2 || l, this.equalsFunction = e2 || a;
        }
        set(t2, e2) {
          this._expand();
          const n2 = this._getSlot(t2);
          let s2 = this.buckets[n2];
          if (!s2)
            return s2 = [[t2, e2]], this.buckets[n2] = s2, this.itemCount++, e2;
          const i2 = s2.find((e3) => this.equalsFunction(e3[0], t2), this);
          if (i2) {
            const t3 = i2[1];
            return i2[1] = e2, t3;
          }
          return s2.push([t2, e2]), this.itemCount++, e2;
        }
        containsKey(t2) {
          const e2 = this._getBucket(t2);
          return !!e2 && !!e2.find((e3) => this.equalsFunction(e3[0], t2), this);
        }
        get(t2) {
          const e2 = this._getBucket(t2);
          if (!e2)
            return null;
          const n2 = e2.find((e3) => this.equalsFunction(e3[0], t2), this);
          return n2 ? n2[1] : null;
        }
        entries() {
          return this.buckets.filter((t2) => null != t2).flat(1);
        }
        getKeys() {
          return this.entries().map((t2) => t2[0]);
        }
        getValues() {
          return this.entries().map((t2) => t2[1]);
        }
        toString() {
          return "[" + this.entries().map((t2) => "{" + t2[0] + ":" + t2[1] + "}").join(", ") + "]";
        }
        get length() {
          return this.itemCount;
        }
        _getSlot(t2) {
          return this.hashFunction(t2) & this.buckets.length - 1;
        }
        _getBucket(t2) {
          return this.buckets[this._getSlot(t2)];
        }
        _expand() {
          if (this.itemCount <= this.threshold)
            return;
          const t2 = this.buckets, e2 = 2 * this.buckets.length;
          this.buckets = new Array(e2), this.threshold = Math.floor(0.75 * e2);
          for (const e3 of t2)
            if (e3)
              for (const t3 of e3) {
                const e4 = this._getSlot(t3[0]);
                let n2 = this.buckets[e4];
                n2 || (n2 = [], this.buckets[e4] = n2), n2.push(t3);
              }
        }
      }
      function q(t2, e2) {
        if (null == e2 && (e2 = F.EMPTY), null === e2.parentCtx || e2 === F.EMPTY)
          return M.EMPTY;
        const n2 = q(t2, e2.parentCtx), s2 = t2.states[e2.invokingState].transitions[0];
        return B.create(n2, s2.followState.stateNumber);
      }
      function H(t2, e2, n2) {
        if (t2.isEmpty())
          return t2;
        let s2 = n2.get(t2) || null;
        if (null !== s2)
          return s2;
        if (s2 = e2.get(t2), null !== s2)
          return n2.set(t2, s2), s2;
        let i2 = false, r2 = [];
        for (let s3 = 0; s3 < r2.length; s3++) {
          const o3 = H(t2.getParent(s3), e2, n2);
          if (i2 || o3 !== t2.getParent(s3)) {
            if (!i2) {
              r2 = [];
              for (let e3 = 0; e3 < t2.length; e3++)
                r2[e3] = t2.getParent(e3);
              i2 = true;
            }
            r2[s3] = o3;
          }
        }
        if (!i2)
          return e2.add(t2), n2.set(t2, t2), t2;
        let o2 = null;
        return o2 = 0 === r2.length ? M.EMPTY : 1 === r2.length ? B.create(r2[0], t2.getReturnState(0)) : new U(r2, t2.returnStates), e2.add(o2), n2.set(o2, o2), n2.set(t2, o2), o2;
      }
      function K(t2, e2, n2, s2) {
        if (t2 === e2)
          return t2;
        if (t2 instanceof B && e2 instanceof B)
          return function(t3, e3, n3, s3) {
            if (null !== s3) {
              let n4 = s3.get(t3, e3);
              if (null !== n4)
                return n4;
              if (n4 = s3.get(e3, t3), null !== n4)
                return n4;
            }
            const i2 = function(t4, e4, n4) {
              if (n4) {
                if (t4 === M.EMPTY)
                  return M.EMPTY;
                if (e4 === M.EMPTY)
                  return M.EMPTY;
              } else {
                if (t4 === M.EMPTY && e4 === M.EMPTY)
                  return M.EMPTY;
                if (t4 === M.EMPTY) {
                  const t5 = [e4.returnState, M.EMPTY_RETURN_STATE], n5 = [e4.parentCtx, null];
                  return new U(n5, t5);
                }
                if (e4 === M.EMPTY) {
                  const e5 = [t4.returnState, M.EMPTY_RETURN_STATE], n5 = [t4.parentCtx, null];
                  return new U(n5, e5);
                }
              }
              return null;
            }(t3, e3, n3);
            if (null !== i2)
              return null !== s3 && s3.set(t3, e3, i2), i2;
            if (t3.returnState === e3.returnState) {
              const i3 = K(t3.parentCtx, e3.parentCtx, n3, s3);
              if (i3 === t3.parentCtx)
                return t3;
              if (i3 === e3.parentCtx)
                return e3;
              const r2 = B.create(i3, t3.returnState);
              return null !== s3 && s3.set(t3, e3, r2), r2;
            }
            {
              let n4 = null;
              if ((t3 === e3 || null !== t3.parentCtx && t3.parentCtx === e3.parentCtx) && (n4 = t3.parentCtx), null !== n4) {
                const i4 = [t3.returnState, e3.returnState];
                t3.returnState > e3.returnState && (i4[0] = e3.returnState, i4[1] = t3.returnState);
                const r3 = new U([n4, n4], i4);
                return null !== s3 && s3.set(t3, e3, r3), r3;
              }
              const i3 = [t3.returnState, e3.returnState];
              let r2 = [t3.parentCtx, e3.parentCtx];
              t3.returnState > e3.returnState && (i3[0] = e3.returnState, i3[1] = t3.returnState, r2 = [e3.parentCtx, t3.parentCtx]);
              const o2 = new U(r2, i3);
              return null !== s3 && s3.set(t3, e3, o2), o2;
            }
          }(t2, e2, n2, s2);
        if (n2) {
          if (t2 instanceof V)
            return t2;
          if (e2 instanceof V)
            return e2;
        }
        return t2 instanceof B && (t2 = new U([t2.getParent()], [t2.returnState])), e2 instanceof B && (e2 = new U([e2.getParent()], [e2.returnState])), function(t3, e3, n3, s3) {
          if (null !== s3) {
            let n4 = s3.get(t3, e3);
            if (null !== n4)
              return M.trace_atn_sim && console.log("mergeArrays a=" + t3 + ",b=" + e3 + " -> previous"), n4;
            if (n4 = s3.get(e3, t3), null !== n4)
              return M.trace_atn_sim && console.log("mergeArrays a=" + t3 + ",b=" + e3 + " -> previous"), n4;
          }
          let i2 = 0, r2 = 0, o2 = 0, l2 = new Array(t3.returnStates.length + e3.returnStates.length).fill(0), a2 = new Array(t3.returnStates.length + e3.returnStates.length).fill(null);
          for (; i2 < t3.returnStates.length && r2 < e3.returnStates.length; ) {
            const h3 = t3.parents[i2], c2 = e3.parents[r2];
            if (t3.returnStates[i2] === e3.returnStates[r2]) {
              const e4 = t3.returnStates[i2];
              e4 === M.EMPTY_RETURN_STATE && null === h3 && null === c2 || null !== h3 && null !== c2 && h3 === c2 ? (a2[o2] = h3, l2[o2] = e4) : (a2[o2] = K(h3, c2, n3, s3), l2[o2] = e4), i2 += 1, r2 += 1;
            } else
              t3.returnStates[i2] < e3.returnStates[r2] ? (a2[o2] = h3, l2[o2] = t3.returnStates[i2], i2 += 1) : (a2[o2] = c2, l2[o2] = e3.returnStates[r2], r2 += 1);
            o2 += 1;
          }
          if (i2 < t3.returnStates.length)
            for (let e4 = i2; e4 < t3.returnStates.length; e4++)
              a2[o2] = t3.parents[e4], l2[o2] = t3.returnStates[e4], o2 += 1;
          else
            for (let t4 = r2; t4 < e3.returnStates.length; t4++)
              a2[o2] = e3.parents[t4], l2[o2] = e3.returnStates[t4], o2 += 1;
          if (o2 < a2.length) {
            if (1 === o2) {
              const n4 = B.create(a2[0], l2[0]);
              return null !== s3 && s3.set(t3, e3, n4), n4;
            }
            a2 = a2.slice(0, o2), l2 = l2.slice(0, o2);
          }
          const h2 = new U(a2, l2);
          return h2.equals(t3) ? (null !== s3 && s3.set(t3, e3, t3), M.trace_atn_sim && console.log("mergeArrays a=" + t3 + ",b=" + e3 + " -> a"), t3) : h2.equals(e3) ? (null !== s3 && s3.set(t3, e3, e3), M.trace_atn_sim && console.log("mergeArrays a=" + t3 + ",b=" + e3 + " -> b"), e3) : (function(t4) {
            const e4 = new z();
            for (let n4 = 0; n4 < t4.length; n4++) {
              const s4 = t4[n4];
              e4.containsKey(s4) || e4.set(s4, s4);
            }
            for (let n4 = 0; n4 < t4.length; n4++)
              t4[n4] = e4.get(t4[n4]);
          }(a2), null !== s3 && s3.set(t3, e3, h2), M.trace_atn_sim && console.log("mergeArrays a=" + t3 + ",b=" + e3 + " -> " + h2), h2);
        }(t2, e2, n2, s2);
      }
      class Y {
        constructor() {
          this.data = new Uint32Array(1);
        }
        set(t2) {
          Y._checkIndex(t2), this._resize(t2), this.data[t2 >>> 5] |= 1 << t2 % 32;
        }
        get(t2) {
          Y._checkIndex(t2);
          const e2 = t2 >>> 5;
          return !(e2 >= this.data.length || !(this.data[e2] & 1 << t2 % 32));
        }
        clear(t2) {
          Y._checkIndex(t2);
          const e2 = t2 >>> 5;
          e2 < this.data.length && (this.data[e2] &= ~(1 << t2));
        }
        or(t2) {
          const e2 = Math.min(this.data.length, t2.data.length);
          for (let n2 = 0; n2 < e2; ++n2)
            this.data[n2] |= t2.data[n2];
          if (this.data.length < t2.data.length) {
            this._resize((t2.data.length << 5) - 1);
            const n2 = t2.data.length;
            for (let s2 = e2; s2 < n2; ++s2)
              this.data[s2] = t2.data[s2];
          }
        }
        values() {
          const t2 = new Array(this.length);
          let e2 = 0;
          const n2 = this.data.length;
          for (let s2 = 0; s2 < n2; ++s2) {
            let n3 = this.data[s2];
            for (; 0 !== n3; ) {
              const i2 = n3 & -n3;
              t2[e2++] = (s2 << 5) + Y._bitCount(i2 - 1), n3 ^= i2;
            }
          }
          return t2;
        }
        minValue() {
          for (let t2 = 0; t2 < this.data.length; ++t2) {
            let e2 = this.data[t2];
            if (0 !== e2) {
              let n2 = 0;
              for (; !(1 & e2); )
                n2++, e2 >>= 1;
              return n2 + 32 * t2;
            }
          }
          return 0;
        }
        hashCode() {
          return o.hashStuff(this.values());
        }
        equals(t2) {
          return t2 instanceof Y && s(this.data, t2.data);
        }
        toString() {
          return "{" + this.values().join(", ") + "}";
        }
        get length() {
          return this.data.map((t2) => Y._bitCount(t2)).reduce((t2, e2) => t2 + e2, 0);
        }
        _resize(t2) {
          const e2 = t2 + 32 >>> 5;
          if (e2 <= this.data.length)
            return;
          const n2 = new Uint32Array(e2);
          n2.set(this.data), n2.fill(0, this.data.length), this.data = n2;
        }
        static _checkIndex(t2) {
          if (t2 < 0)
            throw new RangeError("index cannot be negative");
        }
        static _bitCount(t2) {
          return t2 = (t2 = (858993459 & (t2 -= t2 >> 1 & 1431655765)) + (t2 >> 2 & 858993459)) + (t2 >> 4) & 252645135, t2 += t2 >> 8, 0 + (t2 += t2 >> 16) & 63;
        }
      }
      class G {
        constructor(t2) {
          this.atn = t2;
        }
        getDecisionLookahead(t2) {
          if (null === t2)
            return null;
          const e2 = t2.transitions.length, n2 = [];
          for (let s2 = 0; s2 < e2; s2++) {
            n2[s2] = new m();
            const e3 = new u(), i2 = false;
            this._LOOK(t2.transition(s2).target, null, M.EMPTY, n2[s2], e3, new Y(), i2, false), (0 === n2[s2].length || n2[s2].contains(G.HIT_PRED)) && (n2[s2] = null);
          }
          return n2;
        }
        LOOK(t2, e2, n2) {
          const s2 = new m(), i2 = null !== (n2 = n2 || null) ? q(t2.atn, n2) : null;
          return this._LOOK(t2, e2, i2, s2, new u(), new Y(), true, true), s2;
        }
        _LOOK(t2, e2, s2, i2, r2, o2, l2, a2) {
          const h2 = new T({ state: t2, alt: 0, context: s2 }, null);
          if (!r2.has(h2)) {
            if (r2.add(h2), t2 === e2) {
              if (null === s2)
                return void i2.addOne(n.EPSILON);
              if (s2.isEmpty() && a2)
                return void i2.addOne(n.EOF);
            }
            if (t2 instanceof _) {
              if (null === s2)
                return void i2.addOne(n.EPSILON);
              if (s2.isEmpty() && a2)
                return void i2.addOne(n.EOF);
              if (s2 !== M.EMPTY) {
                const n2 = o2.get(t2.ruleIndex);
                try {
                  o2.clear(t2.ruleIndex);
                  for (let t3 = 0; t3 < s2.length; t3++) {
                    const n3 = this.atn.states[s2.getReturnState(t3)];
                    this._LOOK(n3, e2, s2.getParent(t3), i2, r2, o2, l2, a2);
                  }
                } finally {
                  n2 && o2.set(t2.ruleIndex);
                }
                return;
              }
            }
            for (let h3 = 0; h3 < t2.transitions.length; h3++) {
              const c2 = t2.transitions[h3];
              if (c2.constructor === A) {
                if (o2.get(c2.target.ruleIndex))
                  continue;
                const t3 = B.create(s2, c2.followState.stateNumber);
                try {
                  o2.set(c2.target.ruleIndex), this._LOOK(c2.target, e2, t3, i2, r2, o2, l2, a2);
                } finally {
                  o2.clear(c2.target.ruleIndex);
                }
              } else if (c2 instanceof y)
                l2 ? this._LOOK(c2.target, e2, s2, i2, r2, o2, l2, a2) : i2.addOne(G.HIT_PRED);
              else if (c2.isEpsilon)
                this._LOOK(c2.target, e2, s2, i2, r2, o2, l2, a2);
              else if (c2.constructor === I)
                i2.addRange(n.MIN_USER_TOKEN_TYPE, this.atn.maxTokenType);
              else {
                let t3 = c2.label;
                null !== t3 && (c2 instanceof k && (t3 = t3.complement(n.MIN_USER_TOKEN_TYPE, this.atn.maxTokenType)), i2.addSet(t3));
              }
            }
          }
        }
      }
      G.HIT_PRED = n.INVALID_TYPE;
      class j {
        constructor(t2, e2) {
          this.grammarType = t2, this.maxTokenType = e2, this.states = [], this.decisionToState = [], this.ruleToStartState = [], this.ruleToStopState = null, this.modeNameToStartState = {}, this.ruleToTokenType = null, this.lexerActions = null, this.modeToStartState = [];
        }
        nextTokensInContext(t2, e2) {
          return new G(this).LOOK(t2, null, e2);
        }
        nextTokensNoContext(t2) {
          return null !== t2.nextTokenWithinRule || (t2.nextTokenWithinRule = this.nextTokensInContext(t2, null), t2.nextTokenWithinRule.readOnly = true), t2.nextTokenWithinRule;
        }
        nextTokens(t2, e2) {
          return void 0 === e2 ? this.nextTokensNoContext(t2) : this.nextTokensInContext(t2, e2);
        }
        addState(t2) {
          null !== t2 && (t2.atn = this, t2.stateNumber = this.states.length), this.states.push(t2);
        }
        removeState(t2) {
          this.states[t2.stateNumber] = null;
        }
        defineDecisionState(t2) {
          return this.decisionToState.push(t2), t2.decision = this.decisionToState.length - 1, t2.decision;
        }
        getDecisionState(t2) {
          return 0 === this.decisionToState.length ? null : this.decisionToState[t2];
        }
        getExpectedTokens(t2, e2) {
          if (t2 < 0 || t2 >= this.states.length)
            throw "Invalid state number.";
          const s2 = this.states[t2];
          let i2 = this.nextTokens(s2);
          if (!i2.contains(n.EPSILON))
            return i2;
          const r2 = new m();
          for (r2.addSet(i2), r2.removeOne(n.EPSILON); null !== e2 && e2.invokingState >= 0 && i2.contains(n.EPSILON); ) {
            const t3 = this.states[e2.invokingState].transitions[0];
            i2 = this.nextTokens(t3.followState), r2.addSet(i2), r2.removeOne(n.EPSILON), e2 = e2.parentCtx;
          }
          return i2.contains(n.EPSILON) && r2.addOne(n.EOF), r2;
        }
      }
      j.INVALID_ALT_NUMBER = 0;
      class W extends E {
        constructor() {
          super(), this.stateType = E.BASIC;
        }
      }
      class $ extends E {
        constructor() {
          return super(), this.decision = -1, this.nonGreedy = false, this;
        }
      }
      class X extends $ {
        constructor() {
          return super(), this.endState = null, this;
        }
      }
      class J extends E {
        constructor() {
          return super(), this.stateType = E.BLOCK_END, this.startState = null, this;
        }
      }
      class Q extends E {
        constructor() {
          return super(), this.stateType = E.LOOP_END, this.loopBackState = null, this;
        }
      }
      class Z extends E {
        constructor() {
          return super(), this.stateType = E.RULE_START, this.stopState = null, this.isPrecedenceRule = false, this;
        }
      }
      class tt extends $ {
        constructor() {
          return super(), this.stateType = E.TOKEN_START, this;
        }
      }
      class et extends $ {
        constructor() {
          return super(), this.stateType = E.PLUS_LOOP_BACK, this;
        }
      }
      class nt extends E {
        constructor() {
          return super(), this.stateType = E.STAR_LOOP_BACK, this;
        }
      }
      class st extends $ {
        constructor() {
          return super(), this.stateType = E.STAR_LOOP_ENTRY, this.loopBackState = null, this.isPrecedenceDecision = null, this;
        }
      }
      class it extends X {
        constructor() {
          return super(), this.stateType = E.PLUS_BLOCK_START, this.loopBackState = null, this;
        }
      }
      class rt extends X {
        constructor() {
          return super(), this.stateType = E.STAR_BLOCK_START, this;
        }
      }
      class ot extends X {
        constructor() {
          return super(), this.stateType = E.BLOCK_START, this;
        }
      }
      class lt extends C {
        constructor(t2, e2) {
          super(t2), this.label_ = e2, this.label = this.makeLabel(), this.serializationType = C.ATOM;
        }
        makeLabel() {
          const t2 = new m();
          return t2.addOne(this.label_), t2;
        }
        matches(t2, e2, n2) {
          return this.label_ === t2;
        }
        toString() {
          return this.label_;
        }
      }
      class at extends C {
        constructor(t2, e2, n2) {
          super(t2), this.serializationType = C.RANGE, this.start = e2, this.stop = n2, this.label = this.makeLabel();
        }
        makeLabel() {
          const t2 = new m();
          return t2.addRange(this.start, this.stop), t2;
        }
        matches(t2, e2, n2) {
          return t2 >= this.start && t2 <= this.stop;
        }
        toString() {
          return "'" + String.fromCharCode(this.start) + "'..'" + String.fromCharCode(this.stop) + "'";
        }
      }
      class ht extends C {
        constructor(t2, e2, n2, s2) {
          super(t2), this.serializationType = C.ACTION, this.ruleIndex = e2, this.actionIndex = void 0 === n2 ? -1 : n2, this.isCtxDependent = void 0 !== s2 && s2, this.isEpsilon = true;
        }
        matches(t2, e2, n2) {
          return false;
        }
        toString() {
          return "action_" + this.ruleIndex + ":" + this.actionIndex;
        }
      }
      class ct extends C {
        constructor(t2, e2) {
          super(t2), this.serializationType = C.EPSILON, this.isEpsilon = true, this.outermostPrecedenceReturn = e2;
        }
        matches(t2, e2, n2) {
          return false;
        }
        toString() {
          return "epsilon";
        }
      }
      class ut extends d {
        constructor(t2, e2, n2) {
          super(), this.ruleIndex = void 0 === t2 ? -1 : t2, this.predIndex = void 0 === e2 ? -1 : e2, this.isCtxDependent = void 0 !== n2 && n2;
        }
        evaluate(t2, e2) {
          const n2 = this.isCtxDependent ? e2 : null;
          return t2.sempred(n2, this.ruleIndex, this.predIndex);
        }
        updateHashCode(t2) {
          t2.update(this.ruleIndex, this.predIndex, this.isCtxDependent);
        }
        equals(t2) {
          return this === t2 || t2 instanceof ut && this.ruleIndex === t2.ruleIndex && this.predIndex === t2.predIndex && this.isCtxDependent === t2.isCtxDependent;
        }
        toString() {
          return "{" + this.ruleIndex + ":" + this.predIndex + "}?";
        }
      }
      d.NONE = new ut();
      class dt extends y {
        constructor(t2, e2, n2, s2) {
          super(t2), this.serializationType = C.PREDICATE, this.ruleIndex = e2, this.predIndex = n2, this.isCtxDependent = s2, this.isEpsilon = true;
        }
        matches(t2, e2, n2) {
          return false;
        }
        getPredicate() {
          return new ut(this.ruleIndex, this.predIndex, this.isCtxDependent);
        }
        toString() {
          return "pred_" + this.ruleIndex + ":" + this.predIndex;
        }
      }
      class gt extends d {
        constructor(t2) {
          super(), this.precedence = void 0 === t2 ? 0 : t2;
        }
        evaluate(t2, e2) {
          return t2.precpred(e2, this.precedence);
        }
        evalPrecedence(t2, e2) {
          return t2.precpred(e2, this.precedence) ? d.NONE : null;
        }
        compareTo(t2) {
          return this.precedence - t2.precedence;
        }
        updateHashCode(t2) {
          t2.update(this.precedence);
        }
        equals(t2) {
          return this === t2 || t2 instanceof gt && this.precedence === t2.precedence;
        }
        toString() {
          return "{" + this.precedence + ">=prec}?";
        }
      }
      d.PrecedencePredicate = gt;
      class pt extends y {
        constructor(t2, e2) {
          super(t2), this.serializationType = C.PRECEDENCE, this.precedence = e2, this.isEpsilon = true;
        }
        matches(t2, e2, n2) {
          return false;
        }
        getPredicate() {
          return new gt(this.precedence);
        }
        toString() {
          return this.precedence + " >= _p";
        }
      }
      class ft {
        constructor(t2) {
          void 0 === t2 && (t2 = null), this.readOnly = false, this.verifyATN = null === t2 || t2.verifyATN, this.generateRuleBypassTransitions = null !== t2 && t2.generateRuleBypassTransitions;
        }
      }
      ft.defaultOptions = new ft(), ft.defaultOptions.readOnly = true;
      class xt {
        constructor(t2) {
          this.actionType = t2, this.isPositionDependent = false;
        }
        hashCode() {
          const t2 = new o();
          return this.updateHashCode(t2), t2.finish();
        }
        updateHashCode(t2) {
          t2.update(this.actionType);
        }
        equals(t2) {
          return this === t2;
        }
      }
      class Tt extends xt {
        constructor() {
          super(6);
        }
        execute(t2) {
          t2.skip();
        }
        toString() {
          return "skip";
        }
      }
      Tt.INSTANCE = new Tt();
      class St extends xt {
        constructor(t2) {
          super(0), this.channel = t2;
        }
        execute(t2) {
          t2._channel = this.channel;
        }
        updateHashCode(t2) {
          t2.update(this.actionType, this.channel);
        }
        equals(t2) {
          return this === t2 || t2 instanceof St && this.channel === t2.channel;
        }
        toString() {
          return "channel(" + this.channel + ")";
        }
      }
      class mt extends xt {
        constructor(t2, e2) {
          super(1), this.ruleIndex = t2, this.actionIndex = e2, this.isPositionDependent = true;
        }
        execute(t2) {
          t2.action(null, this.ruleIndex, this.actionIndex);
        }
        updateHashCode(t2) {
          t2.update(this.actionType, this.ruleIndex, this.actionIndex);
        }
        equals(t2) {
          return this === t2 || t2 instanceof mt && this.ruleIndex === t2.ruleIndex && this.actionIndex === t2.actionIndex;
        }
      }
      class Et extends xt {
        constructor() {
          super(3);
        }
        execute(t2) {
          t2.more();
        }
        toString() {
          return "more";
        }
      }
      Et.INSTANCE = new Et();
      class _t extends xt {
        constructor(t2) {
          super(7), this.type = t2;
        }
        execute(t2) {
          t2.type = this.type;
        }
        updateHashCode(t2) {
          t2.update(this.actionType, this.type);
        }
        equals(t2) {
          return this === t2 || t2 instanceof _t && this.type === t2.type;
        }
        toString() {
          return "type(" + this.type + ")";
        }
      }
      class Ct extends xt {
        constructor(t2) {
          super(5), this.mode = t2;
        }
        execute(t2) {
          t2.pushMode(this.mode);
        }
        updateHashCode(t2) {
          t2.update(this.actionType, this.mode);
        }
        equals(t2) {
          return this === t2 || t2 instanceof Ct && this.mode === t2.mode;
        }
        toString() {
          return "pushMode(" + this.mode + ")";
        }
      }
      class At extends xt {
        constructor() {
          super(4);
        }
        execute(t2) {
          t2.popMode();
        }
        toString() {
          return "popMode";
        }
      }
      At.INSTANCE = new At();
      class Nt extends xt {
        constructor(t2) {
          super(2), this.mode = t2;
        }
        execute(t2) {
          t2.setMode(this.mode);
        }
        updateHashCode(t2) {
          t2.update(this.actionType, this.mode);
        }
        equals(t2) {
          return this === t2 || t2 instanceof Nt && this.mode === t2.mode;
        }
        toString() {
          return "mode(" + this.mode + ")";
        }
      }
      function kt(t2, e2) {
        const n2 = [];
        return n2[t2 - 1] = e2, n2.map(function(t3) {
          return e2;
        });
      }
      class It {
        constructor(t2) {
          null == t2 && (t2 = ft.defaultOptions), this.deserializationOptions = t2, this.stateFactories = null, this.actionFactories = null;
        }
        deserialize(t2) {
          const e2 = this.reset(t2);
          this.checkVersion(e2), e2 && this.skipUUID();
          const n2 = this.readATN();
          this.readStates(n2, e2), this.readRules(n2, e2), this.readModes(n2);
          const s2 = [];
          return this.readSets(n2, s2, this.readInt.bind(this)), e2 && this.readSets(n2, s2, this.readInt32.bind(this)), this.readEdges(n2, s2), this.readDecisions(n2), this.readLexerActions(n2, e2), this.markPrecedenceDecisions(n2), this.verifyATN(n2), this.deserializationOptions.generateRuleBypassTransitions && 1 === n2.grammarType && (this.generateRuleBypassTransitions(n2), this.verifyATN(n2)), n2;
        }
        reset(t2) {
          if (3 === (t2.charCodeAt ? t2.charCodeAt(0) : t2[0])) {
            const e2 = function(t3) {
              const e3 = t3.charCodeAt(0);
              return e3 > 1 ? e3 - 2 : e3 + 65534;
            }, n2 = t2.split("").map(e2);
            return n2[0] = t2.charCodeAt(0), this.data = n2, this.pos = 0, true;
          }
          return this.data = t2, this.pos = 0, false;
        }
        skipUUID() {
          let t2 = 0;
          for (; t2++ < 8; )
            this.readInt();
        }
        checkVersion(t2) {
          const e2 = this.readInt();
          if (!t2 && 4 !== e2)
            throw "Could not deserialize ATN with version " + e2 + " (expected 4).";
        }
        readATN() {
          const t2 = this.readInt(), e2 = this.readInt();
          return new j(t2, e2);
        }
        readStates(t2, e2) {
          let n2, s2, i2;
          const r2 = [], o2 = [], l2 = this.readInt();
          for (let n3 = 0; n3 < l2; n3++) {
            const n4 = this.readInt();
            if (n4 === E.INVALID_TYPE) {
              t2.addState(null);
              continue;
            }
            let s3 = this.readInt();
            e2 && 65535 === s3 && (s3 = -1);
            const i3 = this.stateFactory(n4, s3);
            if (n4 === E.LOOP_END) {
              const t3 = this.readInt();
              r2.push([i3, t3]);
            } else if (i3 instanceof X) {
              const t3 = this.readInt();
              o2.push([i3, t3]);
            }
            t2.addState(i3);
          }
          for (n2 = 0; n2 < r2.length; n2++)
            s2 = r2[n2], s2[0].loopBackState = t2.states[s2[1]];
          for (n2 = 0; n2 < o2.length; n2++)
            s2 = o2[n2], s2[0].endState = t2.states[s2[1]];
          let a2 = this.readInt();
          for (n2 = 0; n2 < a2; n2++)
            i2 = this.readInt(), t2.states[i2].nonGreedy = true;
          let h2 = this.readInt();
          for (n2 = 0; n2 < h2; n2++)
            i2 = this.readInt(), t2.states[i2].isPrecedenceRule = true;
        }
        readRules(t2, e2) {
          let s2;
          const i2 = this.readInt();
          for (0 === t2.grammarType && (t2.ruleToTokenType = kt(i2, 0)), t2.ruleToStartState = kt(i2, 0), s2 = 0; s2 < i2; s2++) {
            const i3 = this.readInt();
            if (t2.ruleToStartState[s2] = t2.states[i3], 0 === t2.grammarType) {
              let i4 = this.readInt();
              e2 && 65535 === i4 && (i4 = n.EOF), t2.ruleToTokenType[s2] = i4;
            }
          }
          for (t2.ruleToStopState = kt(i2, 0), s2 = 0; s2 < t2.states.length; s2++) {
            const e3 = t2.states[s2];
            e3 instanceof _ && (t2.ruleToStopState[e3.ruleIndex] = e3, t2.ruleToStartState[e3.ruleIndex].stopState = e3);
          }
        }
        readModes(t2) {
          const e2 = this.readInt();
          for (let n2 = 0; n2 < e2; n2++) {
            let e3 = this.readInt();
            t2.modeToStartState.push(t2.states[e3]);
          }
        }
        readSets(t2, e2, n2) {
          const s2 = this.readInt();
          for (let t3 = 0; t3 < s2; t3++) {
            const t4 = new m();
            e2.push(t4);
            const s3 = this.readInt();
            0 !== this.readInt() && t4.addOne(-1);
            for (let e3 = 0; e3 < s3; e3++) {
              const e4 = n2(), s4 = n2();
              t4.addRange(e4, s4);
            }
          }
        }
        readEdges(t2, e2) {
          let n2, s2, i2, r2, o2;
          const l2 = this.readInt();
          for (n2 = 0; n2 < l2; n2++) {
            const n3 = this.readInt(), s3 = this.readInt(), i3 = this.readInt(), o3 = this.readInt(), l3 = this.readInt(), a2 = this.readInt();
            r2 = this.edgeFactory(t2, i3, n3, s3, o3, l3, a2, e2), t2.states[n3].addTransition(r2);
          }
          for (n2 = 0; n2 < t2.states.length; n2++)
            for (i2 = t2.states[n2], s2 = 0; s2 < i2.transitions.length; s2++) {
              const e3 = i2.transitions[s2];
              if (!(e3 instanceof A))
                continue;
              let n3 = -1;
              t2.ruleToStartState[e3.target.ruleIndex].isPrecedenceRule && 0 === e3.precedence && (n3 = e3.target.ruleIndex), r2 = new ct(e3.followState, n3), t2.ruleToStopState[e3.target.ruleIndex].addTransition(r2);
            }
          for (n2 = 0; n2 < t2.states.length; n2++) {
            if (i2 = t2.states[n2], i2 instanceof X) {
              if (null === i2.endState)
                throw "IllegalState";
              if (null !== i2.endState.startState)
                throw "IllegalState";
              i2.endState.startState = i2;
            }
            if (i2 instanceof et)
              for (s2 = 0; s2 < i2.transitions.length; s2++)
                o2 = i2.transitions[s2].target, o2 instanceof it && (o2.loopBackState = i2);
            else if (i2 instanceof nt)
              for (s2 = 0; s2 < i2.transitions.length; s2++)
                o2 = i2.transitions[s2].target, o2 instanceof st && (o2.loopBackState = i2);
          }
        }
        readDecisions(t2) {
          const e2 = this.readInt();
          for (let n2 = 0; n2 < e2; n2++) {
            const e3 = this.readInt(), s2 = t2.states[e3];
            t2.decisionToState.push(s2), s2.decision = n2;
          }
        }
        readLexerActions(t2, e2) {
          if (0 === t2.grammarType) {
            const n2 = this.readInt();
            t2.lexerActions = kt(n2, null);
            for (let s2 = 0; s2 < n2; s2++) {
              const n3 = this.readInt();
              let i2 = this.readInt();
              e2 && 65535 === i2 && (i2 = -1);
              let r2 = this.readInt();
              e2 && 65535 === r2 && (r2 = -1), t2.lexerActions[s2] = this.lexerActionFactory(n3, i2, r2);
            }
          }
        }
        generateRuleBypassTransitions(t2) {
          let e2;
          const n2 = t2.ruleToStartState.length;
          for (e2 = 0; e2 < n2; e2++)
            t2.ruleToTokenType[e2] = t2.maxTokenType + e2 + 1;
          for (e2 = 0; e2 < n2; e2++)
            this.generateRuleBypassTransition(t2, e2);
        }
        generateRuleBypassTransition(t2, e2) {
          let n2, s2;
          const i2 = new ot();
          i2.ruleIndex = e2, t2.addState(i2);
          const r2 = new J();
          r2.ruleIndex = e2, t2.addState(r2), i2.endState = r2, t2.defineDecisionState(i2), r2.startState = i2;
          let o2 = null, l2 = null;
          if (t2.ruleToStartState[e2].isPrecedenceRule) {
            for (l2 = null, n2 = 0; n2 < t2.states.length; n2++)
              if (s2 = t2.states[n2], this.stateIsEndStateFor(s2, e2)) {
                l2 = s2, o2 = s2.loopBackState.transitions[0];
                break;
              }
            if (null === o2)
              throw "Couldn't identify final state of the precedence rule prefix section.";
          } else
            l2 = t2.ruleToStopState[e2];
          for (n2 = 0; n2 < t2.states.length; n2++) {
            s2 = t2.states[n2];
            for (let t3 = 0; t3 < s2.transitions.length; t3++) {
              const e3 = s2.transitions[t3];
              e3 !== o2 && e3.target === l2 && (e3.target = r2);
            }
          }
          const a2 = t2.ruleToStartState[e2], h2 = a2.transitions.length;
          for (; h2 > 0; )
            i2.addTransition(a2.transitions[h2 - 1]), a2.transitions = a2.transitions.slice(-1);
          t2.ruleToStartState[e2].addTransition(new ct(i2)), r2.addTransition(new ct(l2));
          const c2 = new W();
          t2.addState(c2), c2.addTransition(new lt(r2, t2.ruleToTokenType[e2])), i2.addTransition(new ct(c2));
        }
        stateIsEndStateFor(t2, e2) {
          if (t2.ruleIndex !== e2)
            return null;
          if (!(t2 instanceof st))
            return null;
          const n2 = t2.transitions[t2.transitions.length - 1].target;
          return n2 instanceof Q && n2.epsilonOnlyTransitions && n2.transitions[0].target instanceof _ ? t2 : null;
        }
        markPrecedenceDecisions(t2) {
          for (let e2 = 0; e2 < t2.states.length; e2++) {
            const n2 = t2.states[e2];
            if (n2 instanceof st && t2.ruleToStartState[n2.ruleIndex].isPrecedenceRule) {
              const t3 = n2.transitions[n2.transitions.length - 1].target;
              t3 instanceof Q && t3.epsilonOnlyTransitions && t3.transitions[0].target instanceof _ && (n2.isPrecedenceDecision = true);
            }
          }
        }
        verifyATN(t2) {
          if (this.deserializationOptions.verifyATN)
            for (let e2 = 0; e2 < t2.states.length; e2++) {
              const n2 = t2.states[e2];
              if (null !== n2)
                if (this.checkCondition(n2.epsilonOnlyTransitions || n2.transitions.length <= 1), n2 instanceof it)
                  this.checkCondition(null !== n2.loopBackState);
                else if (n2 instanceof st)
                  if (this.checkCondition(null !== n2.loopBackState), this.checkCondition(2 === n2.transitions.length), n2.transitions[0].target instanceof rt)
                    this.checkCondition(n2.transitions[1].target instanceof Q), this.checkCondition(!n2.nonGreedy);
                  else {
                    if (!(n2.transitions[0].target instanceof Q))
                      throw "IllegalState";
                    this.checkCondition(n2.transitions[1].target instanceof rt), this.checkCondition(n2.nonGreedy);
                  }
                else
                  n2 instanceof nt ? (this.checkCondition(1 === n2.transitions.length), this.checkCondition(n2.transitions[0].target instanceof st)) : n2 instanceof Q ? this.checkCondition(null !== n2.loopBackState) : n2 instanceof Z ? this.checkCondition(null !== n2.stopState) : n2 instanceof X ? this.checkCondition(null !== n2.endState) : n2 instanceof J ? this.checkCondition(null !== n2.startState) : n2 instanceof $ ? this.checkCondition(n2.transitions.length <= 1 || n2.decision >= 0) : this.checkCondition(n2.transitions.length <= 1 || n2 instanceof _);
            }
        }
        checkCondition(t2, e2) {
          if (!t2)
            throw null == e2 && (e2 = "IllegalState"), e2;
        }
        readInt() {
          return this.data[this.pos++];
        }
        readInt32() {
          return this.readInt() | this.readInt() << 16;
        }
        edgeFactory(t2, e2, s2, i2, r2, o2, l2, a2) {
          const h2 = t2.states[i2];
          switch (e2) {
            case C.EPSILON:
              return new ct(h2);
            case C.RANGE:
              return new at(h2, 0 !== l2 ? n.EOF : r2, o2);
            case C.RULE:
              return new A(t2.states[r2], o2, l2, h2);
            case C.PREDICATE:
              return new dt(h2, r2, o2, 0 !== l2);
            case C.PRECEDENCE:
              return new pt(h2, r2);
            case C.ATOM:
              return new lt(h2, 0 !== l2 ? n.EOF : r2);
            case C.ACTION:
              return new ht(h2, r2, o2, 0 !== l2);
            case C.SET:
              return new N(h2, a2[r2]);
            case C.NOT_SET:
              return new k(h2, a2[r2]);
            case C.WILDCARD:
              return new I(h2);
            default:
              throw "The specified transition type: " + e2 + " is not valid.";
          }
        }
        stateFactory(t2, e2) {
          if (null === this.stateFactories) {
            const t3 = [];
            t3[E.INVALID_TYPE] = null, t3[E.BASIC] = () => new W(), t3[E.RULE_START] = () => new Z(), t3[E.BLOCK_START] = () => new ot(), t3[E.PLUS_BLOCK_START] = () => new it(), t3[E.STAR_BLOCK_START] = () => new rt(), t3[E.TOKEN_START] = () => new tt(), t3[E.RULE_STOP] = () => new _(), t3[E.BLOCK_END] = () => new J(), t3[E.STAR_LOOP_BACK] = () => new nt(), t3[E.STAR_LOOP_ENTRY] = () => new st(), t3[E.PLUS_LOOP_BACK] = () => new et(), t3[E.LOOP_END] = () => new Q(), this.stateFactories = t3;
          }
          if (t2 > this.stateFactories.length || null === this.stateFactories[t2])
            throw "The specified state type " + t2 + " is not valid.";
          {
            const n2 = this.stateFactories[t2]();
            if (null !== n2)
              return n2.ruleIndex = e2, n2;
          }
        }
        lexerActionFactory(t2, e2, n2) {
          if (null === this.actionFactories) {
            const t3 = [];
            t3[0] = (t4, e3) => new St(t4), t3[1] = (t4, e3) => new mt(t4, e3), t3[2] = (t4, e3) => new Nt(t4), t3[3] = (t4, e3) => Et.INSTANCE, t3[4] = (t4, e3) => At.INSTANCE, t3[5] = (t4, e3) => new Ct(t4), t3[6] = (t4, e3) => Tt.INSTANCE, t3[7] = (t4, e3) => new _t(t4), this.actionFactories = t3;
          }
          if (t2 > this.actionFactories.length || null === this.actionFactories[t2])
            throw "The specified lexer action type " + t2 + " is not valid.";
          return this.actionFactories[t2](e2, n2);
        }
      }
      class yt {
        syntaxError(t2, e2, n2, s2, i2, r2) {
        }
        reportAmbiguity(t2, e2, n2, s2, i2, r2, o2) {
        }
        reportAttemptingFullContext(t2, e2, n2, s2, i2, r2) {
        }
        reportContextSensitivity(t2, e2, n2, s2, i2, r2) {
        }
      }
      class Lt extends yt {
        constructor() {
          super();
        }
        syntaxError(t2, e2, n2, s2, i2, r2) {
          console.error("line " + n2 + ":" + s2 + " " + i2);
        }
      }
      Lt.INSTANCE = new Lt();
      class Ot extends yt {
        constructor(t2) {
          if (super(), null === t2)
            throw "delegates";
          return this.delegates = t2, this;
        }
        syntaxError(t2, e2, n2, s2, i2, r2) {
          this.delegates.map((o2) => o2.syntaxError(t2, e2, n2, s2, i2, r2));
        }
        reportAmbiguity(t2, e2, n2, s2, i2, r2, o2) {
          this.delegates.map((l2) => l2.reportAmbiguity(t2, e2, n2, s2, i2, r2, o2));
        }
        reportAttemptingFullContext(t2, e2, n2, s2, i2, r2) {
          this.delegates.map((o2) => o2.reportAttemptingFullContext(t2, e2, n2, s2, i2, r2));
        }
        reportContextSensitivity(t2, e2, n2, s2, i2, r2) {
          this.delegates.map((o2) => o2.reportContextSensitivity(t2, e2, n2, s2, i2, r2));
        }
      }
      class Rt {
        constructor() {
          this._listeners = [Lt.INSTANCE], this._interp = null, this._stateNumber = -1;
        }
        checkVersion(t2) {
          const e2 = "4.13.2";
          e2 !== t2 && console.log("ANTLR runtime and generated code versions disagree: " + e2 + "!=" + t2);
        }
        addErrorListener(t2) {
          this._listeners.push(t2);
        }
        removeErrorListeners() {
          this._listeners = [];
        }
        getLiteralNames() {
          return Object.getPrototypeOf(this).constructor.literalNames || [];
        }
        getSymbolicNames() {
          return Object.getPrototypeOf(this).constructor.symbolicNames || [];
        }
        getTokenNames() {
          if (!this.tokenNames) {
            const t2 = this.getLiteralNames(), e2 = this.getSymbolicNames(), n2 = t2.length > e2.length ? t2.length : e2.length;
            this.tokenNames = [];
            for (let s2 = 0; s2 < n2; s2++)
              this.tokenNames[s2] = t2[s2] || e2[s2] || "<INVALID";
          }
          return this.tokenNames;
        }
        getTokenTypeMap() {
          const t2 = this.getTokenNames();
          if (null === t2)
            throw "The current recognizer does not provide a list of token names.";
          let e2 = this.tokenTypeMapCache[t2];
          return void 0 === e2 && (e2 = t2.reduce(function(t3, e3, n2) {
            t3[e3] = n2;
          }), e2.EOF = n.EOF, this.tokenTypeMapCache[t2] = e2), e2;
        }
        getRuleIndexMap() {
          const t2 = this.ruleNames;
          if (null === t2)
            throw "The current recognizer does not provide a list of rule names.";
          let e2 = this.ruleIndexMapCache[t2];
          return void 0 === e2 && (e2 = t2.reduce(function(t3, e3, n2) {
            t3[e3] = n2;
          }), this.ruleIndexMapCache[t2] = e2), e2;
        }
        getTokenType(t2) {
          const e2 = this.getTokenTypeMap()[t2];
          return void 0 !== e2 ? e2 : n.INVALID_TYPE;
        }
        getErrorHeader(t2) {
          return "line " + t2.getOffendingToken().line + ":" + t2.getOffendingToken().column;
        }
        getTokenErrorDisplay(t2) {
          if (null === t2)
            return "<no token>";
          let e2 = t2.text;
          return null === e2 && (e2 = t2.type === n.EOF ? "<EOF>" : "<" + t2.type + ">"), e2 = e2.replace("\n", "\\n").replace("\r", "\\r").replace("	", "\\t"), "'" + e2 + "'";
        }
        getErrorListenerDispatch() {
          return console.warn("Calling deprecated method in Recognizer class: getErrorListenerDispatch()"), this.getErrorListener();
        }
        getErrorListener() {
          return new Ot(this._listeners);
        }
        sempred(t2, e2, n2) {
          return true;
        }
        precpred(t2, e2) {
          return true;
        }
        get atn() {
          return this._interp.atn;
        }
        get state() {
          return this._stateNumber;
        }
        set state(t2) {
          this._stateNumber = t2;
        }
      }
      Rt.tokenTypeMapCache = {}, Rt.ruleIndexMapCache = {};
      class vt extends n {
        constructor(t2, e2, s2, i2, r2) {
          super(), this.source = void 0 !== t2 ? t2 : vt.EMPTY_SOURCE, this.type = void 0 !== e2 ? e2 : null, this.channel = void 0 !== s2 ? s2 : n.DEFAULT_CHANNEL, this.start = void 0 !== i2 ? i2 : -1, this.stop = void 0 !== r2 ? r2 : -1, this.tokenIndex = -1, null !== this.source[0] ? (this.line = t2[0].line, this.column = t2[0].column) : this.column = -1;
        }
        clone() {
          const t2 = new vt(this.source, this.type, this.channel, this.start, this.stop);
          return t2.tokenIndex = this.tokenIndex, t2.line = this.line, t2.column = this.column, t2.text = this.text, t2;
        }
        cloneWithType(t2) {
          const e2 = new vt(this.source, t2, this.channel, this.start, this.stop);
          return e2.tokenIndex = this.tokenIndex, e2.line = this.line, e2.column = this.column, t2 === n.EOF && (e2.text = ""), e2;
        }
        toString() {
          let t2 = this.text;
          return t2 = null !== t2 ? t2.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t") : "<no text>", "[@" + this.tokenIndex + "," + this.start + ":" + this.stop + "='" + t2 + "',<" + this.type + ">" + (this.channel > 0 ? ",channel=" + this.channel : "") + "," + this.line + ":" + this.column + "]";
        }
        get text() {
          if (null !== this._text)
            return this._text;
          const t2 = this.getInputStream();
          if (null === t2)
            return null;
          const e2 = t2.size;
          return this.start < e2 && this.stop < e2 ? t2.getText(this.start, this.stop) : "<EOF>";
        }
        set text(t2) {
          this._text = t2;
        }
      }
      vt.EMPTY_SOURCE = [null, null];
      class wt {
      }
      class Pt extends wt {
        constructor(t2) {
          super(), this.copyText = void 0 !== t2 && t2;
        }
        create(t2, e2, n2, s2, i2, r2, o2, l2) {
          const a2 = new vt(t2, e2, s2, i2, r2);
          return a2.line = o2, a2.column = l2, null !== n2 ? a2.text = n2 : this.copyText && null !== t2[1] && (a2.text = t2[1].getText(i2, r2)), a2;
        }
        createThin(t2, e2) {
          const n2 = new vt(null, t2);
          return n2.text = e2, n2;
        }
      }
      Pt.DEFAULT = new Pt();
      class bt extends Error {
        constructor(t2) {
          super(t2.message), Error.captureStackTrace && Error.captureStackTrace(this, bt), this.message = t2.message, this.recognizer = t2.recognizer, this.input = t2.input, this.ctx = t2.ctx, this.offendingToken = null, this.offendingState = -1, null !== this.recognizer && (this.offendingState = this.recognizer.state);
        }
        getExpectedTokens() {
          return null !== this.recognizer ? this.recognizer.atn.getExpectedTokens(this.offendingState, this.ctx) : null;
        }
        toString() {
          return this.message;
        }
      }
      class Dt extends bt {
        constructor(t2, e2, n2, s2) {
          super({ message: "", recognizer: t2, input: e2, ctx: null }), this.startIndex = n2, this.deadEndConfigs = s2;
        }
        toString() {
          let t2 = "";
          return this.startIndex >= 0 && this.startIndex < this.input.size && (t2 = this.input.getText(new S(this.startIndex, this.startIndex))), "LexerNoViableAltException" + t2;
        }
      }
      class Ft extends Rt {
        constructor(t2) {
          super(), this._input = t2, this._factory = Pt.DEFAULT, this._tokenFactorySourcePair = [this, t2], this._interp = null, this._token = null, this._tokenStartCharIndex = -1, this._tokenStartLine = -1, this._tokenStartColumn = -1, this._hitEOF = false, this._channel = n.DEFAULT_CHANNEL, this._type = n.INVALID_TYPE, this._modeStack = [], this._mode = Ft.DEFAULT_MODE, this._text = null;
        }
        reset() {
          null !== this._input && this._input.seek(0), this._token = null, this._type = n.INVALID_TYPE, this._channel = n.DEFAULT_CHANNEL, this._tokenStartCharIndex = -1, this._tokenStartColumn = -1, this._tokenStartLine = -1, this._text = null, this._hitEOF = false, this._mode = Ft.DEFAULT_MODE, this._modeStack = [], this._interp.reset();
        }
        nextToken() {
          if (null === this._input)
            throw "nextToken requires a non-null input stream.";
          const t2 = this._input.mark();
          try {
            for (; ; ) {
              if (this._hitEOF)
                return this.emitEOF(), this._token;
              this._token = null, this._channel = n.DEFAULT_CHANNEL, this._tokenStartCharIndex = this._input.index, this._tokenStartColumn = this._interp.column, this._tokenStartLine = this._interp.line, this._text = null;
              let t3 = false;
              for (; ; ) {
                this._type = n.INVALID_TYPE;
                let e2 = Ft.SKIP;
                try {
                  e2 = this._interp.match(this._input, this._mode);
                } catch (t4) {
                  if (!(t4 instanceof bt))
                    throw console.log(t4.stack), t4;
                  this.notifyListeners(t4), this.recover(t4);
                }
                if (this._input.LA(1) === n.EOF && (this._hitEOF = true), this._type === n.INVALID_TYPE && (this._type = e2), this._type === Ft.SKIP) {
                  t3 = true;
                  break;
                }
                if (this._type !== Ft.MORE)
                  break;
              }
              if (!t3)
                return null === this._token && this.emit(), this._token;
            }
          } finally {
            this._input.release(t2);
          }
        }
        skip() {
          this._type = Ft.SKIP;
        }
        more() {
          this._type = Ft.MORE;
        }
        mode(t2) {
          console.warn("Calling deprecated method in Lexer class: mode(...)"), this.setMode(t2);
        }
        setMode(t2) {
          this._mode = t2;
        }
        getMode() {
          return this._mode;
        }
        getModeStack() {
          return this._modeStack;
        }
        pushMode(t2) {
          this._interp.debug && console.log("pushMode " + t2), this._modeStack.push(this._mode), this.setMode(t2);
        }
        popMode() {
          if (0 === this._modeStack.length)
            throw "Empty Stack";
          return this._interp.debug && console.log("popMode back to " + this._modeStack.slice(0, -1)), this.setMode(this._modeStack.pop()), this._mode;
        }
        emitToken(t2) {
          this._token = t2;
        }
        emit() {
          const t2 = this._factory.create(this._tokenFactorySourcePair, this._type, this._text, this._channel, this._tokenStartCharIndex, this.getCharIndex() - 1, this._tokenStartLine, this._tokenStartColumn);
          return this.emitToken(t2), t2;
        }
        emitEOF() {
          const t2 = this.column, e2 = this.line, s2 = this._factory.create(this._tokenFactorySourcePair, n.EOF, null, n.DEFAULT_CHANNEL, this._input.index, this._input.index - 1, e2, t2);
          return this.emitToken(s2), s2;
        }
        getCharIndex() {
          return this._input.index;
        }
        getAllTokens() {
          const t2 = [];
          let e2 = this.nextToken();
          for (; e2.type !== n.EOF; )
            t2.push(e2), e2 = this.nextToken();
          return t2;
        }
        notifyListeners(t2) {
          const e2 = this._tokenStartCharIndex, n2 = this._input.index, s2 = this._input.getText(e2, n2), i2 = "token recognition error at: '" + this.getErrorDisplay(s2) + "'";
          this.getErrorListener().syntaxError(this, null, this._tokenStartLine, this._tokenStartColumn, i2, t2);
        }
        getErrorDisplay(t2) {
          const e2 = [];
          for (let n2 = 0; n2 < t2.length; n2++)
            e2.push(t2[n2]);
          return e2.join("");
        }
        getErrorDisplayForChar(t2) {
          return t2.charCodeAt(0) === n.EOF ? "<EOF>" : "\n" === t2 ? "\\n" : "	" === t2 ? "\\t" : "\r" === t2 ? "\\r" : t2;
        }
        getCharErrorDisplay(t2) {
          return "'" + this.getErrorDisplayForChar(t2) + "'";
        }
        recover(t2) {
          this._input.LA(1) !== n.EOF && (t2 instanceof Dt ? this._interp.consume(this._input) : this._input.consume());
        }
        get inputStream() {
          return this._input;
        }
        set inputStream(t2) {
          this._input = null, this._tokenFactorySourcePair = [this, this._input], this.reset(), this._input = t2, this._tokenFactorySourcePair = [this, this._input];
        }
        get sourceName() {
          return this._input.sourceName;
        }
        get type() {
          return this._type;
        }
        set type(t2) {
          this._type = t2;
        }
        get line() {
          return this._interp.line;
        }
        set line(t2) {
          this._interp.line = t2;
        }
        get column() {
          return this._interp.column;
        }
        set column(t2) {
          this._interp.column = t2;
        }
        get text() {
          return null !== this._text ? this._text : this._interp.getText(this._input);
        }
        set text(t2) {
          this._text = t2;
        }
      }
      function Mt(t2) {
        return t2.hashCodeForConfigSet();
      }
      function Ut(t2, e2) {
        return t2 === e2 || null !== t2 && null !== e2 && t2.equalsForConfigSet(e2);
      }
      Ft.DEFAULT_MODE = 0, Ft.MORE = -2, Ft.SKIP = -3, Ft.DEFAULT_TOKEN_CHANNEL = n.DEFAULT_CHANNEL, Ft.HIDDEN = n.HIDDEN_CHANNEL, Ft.MIN_CHAR_VALUE = 0, Ft.MAX_CHAR_VALUE = 1114111;
      class Bt {
        constructor(t2) {
          this.configLookup = new u(Mt, Ut), this.fullCtx = void 0 === t2 || t2, this.readOnly = false, this.configs = [], this.uniqueAlt = 0, this.conflictingAlts = null, this.hasSemanticContext = false, this.dipsIntoOuterContext = false, this.cachedHashCode = -1;
        }
        add(t2, e2) {
          if (void 0 === e2 && (e2 = null), this.readOnly)
            throw "This set is readonly";
          t2.semanticContext !== d.NONE && (this.hasSemanticContext = true), t2.reachesIntoOuterContext > 0 && (this.dipsIntoOuterContext = true);
          const n2 = this.configLookup.getOrAdd(t2);
          if (n2 === t2)
            return this.cachedHashCode = -1, this.configs.push(t2), true;
          const s2 = !this.fullCtx, i2 = K(n2.context, t2.context, s2, e2);
          return n2.reachesIntoOuterContext = Math.max(n2.reachesIntoOuterContext, t2.reachesIntoOuterContext), t2.precedenceFilterSuppressed && (n2.precedenceFilterSuppressed = true), n2.context = i2, true;
        }
        getStates() {
          const t2 = new u();
          for (let e2 = 0; e2 < this.configs.length; e2++)
            t2.add(this.configs[e2].state);
          return t2;
        }
        getPredicates() {
          const t2 = [];
          for (let e2 = 0; e2 < this.configs.length; e2++) {
            const n2 = this.configs[e2].semanticContext;
            n2 !== d.NONE && t2.push(n2.semanticContext);
          }
          return t2;
        }
        optimizeConfigs(t2) {
          if (this.readOnly)
            throw "This set is readonly";
          if (0 !== this.configLookup.length)
            for (let e2 = 0; e2 < this.configs.length; e2++) {
              const n2 = this.configs[e2];
              n2.context = t2.getCachedContext(n2.context);
            }
        }
        addAll(t2) {
          for (let e2 = 0; e2 < t2.length; e2++)
            this.add(t2[e2]);
          return false;
        }
        equals(t2) {
          return this === t2 || t2 instanceof Bt && s(this.configs, t2.configs) && this.fullCtx === t2.fullCtx && this.uniqueAlt === t2.uniqueAlt && this.conflictingAlts === t2.conflictingAlts && this.hasSemanticContext === t2.hasSemanticContext && this.dipsIntoOuterContext === t2.dipsIntoOuterContext;
        }
        hashCode() {
          const t2 = new o();
          return t2.update(this.configs), t2.finish();
        }
        updateHashCode(t2) {
          this.readOnly ? (-1 === this.cachedHashCode && (this.cachedHashCode = this.hashCode()), t2.update(this.cachedHashCode)) : t2.update(this.hashCode());
        }
        isEmpty() {
          return 0 === this.configs.length;
        }
        contains(t2) {
          if (null === this.configLookup)
            throw "This method is not implemented for readonly sets.";
          return this.configLookup.contains(t2);
        }
        containsFast(t2) {
          if (null === this.configLookup)
            throw "This method is not implemented for readonly sets.";
          return this.configLookup.containsFast(t2);
        }
        clear() {
          if (this.readOnly)
            throw "This set is readonly";
          this.configs = [], this.cachedHashCode = -1, this.configLookup = new u();
        }
        setReadonly(t2) {
          this.readOnly = t2, t2 && (this.configLookup = null);
        }
        toString() {
          return c(this.configs) + (this.hasSemanticContext ? ",hasSemanticContext=" + this.hasSemanticContext : "") + (this.uniqueAlt !== j.INVALID_ALT_NUMBER ? ",uniqueAlt=" + this.uniqueAlt : "") + (null !== this.conflictingAlts ? ",conflictingAlts=" + this.conflictingAlts : "") + (this.dipsIntoOuterContext ? ",dipsIntoOuterContext" : "");
        }
        get items() {
          return this.configs;
        }
        get length() {
          return this.configs.length;
        }
      }
      class Vt {
        constructor(t2, e2) {
          return null === t2 && (t2 = -1), null === e2 && (e2 = new Bt()), this.stateNumber = t2, this.configs = e2, this.edges = null, this.isAcceptState = false, this.prediction = 0, this.lexerActionExecutor = null, this.requiresFullContext = false, this.predicates = null, this;
        }
        getAltSet() {
          const t2 = new u();
          if (null !== this.configs)
            for (let e2 = 0; e2 < this.configs.length; e2++) {
              const n2 = this.configs[e2];
              t2.add(n2.alt);
            }
          return 0 === t2.length ? null : t2;
        }
        equals(t2) {
          return this === t2 || t2 instanceof Vt && this.configs.equals(t2.configs);
        }
        toString() {
          let t2 = this.stateNumber + ":" + this.configs;
          return this.isAcceptState && (t2 += "=>", null !== this.predicates ? t2 += this.predicates : t2 += this.prediction), t2;
        }
        hashCode() {
          const t2 = new o();
          return t2.update(this.configs), t2.finish();
        }
      }
      class zt {
        constructor(t2, e2) {
          return this.atn = t2, this.sharedContextCache = e2, this;
        }
        getCachedContext(t2) {
          if (null === this.sharedContextCache)
            return t2;
          const e2 = new z();
          return H(t2, this.sharedContextCache, e2);
        }
      }
      zt.ERROR = new Vt(2147483647, new Bt());
      class qt extends Bt {
        constructor() {
          super(), this.configLookup = new u();
        }
      }
      class Ht extends T {
        constructor(t2, e2) {
          super(t2, e2);
          const n2 = t2.lexerActionExecutor || null;
          return this.lexerActionExecutor = n2 || (null !== e2 ? e2.lexerActionExecutor : null), this.passedThroughNonGreedyDecision = null !== e2 && this.checkNonGreedyDecision(e2, this.state), this.hashCodeForConfigSet = Ht.prototype.hashCode, this.equalsForConfigSet = Ht.prototype.equals, this;
        }
        updateHashCode(t2) {
          t2.update(this.state.stateNumber, this.alt, this.context, this.semanticContext, this.passedThroughNonGreedyDecision, this.lexerActionExecutor);
        }
        equals(t2) {
          return this === t2 || t2 instanceof Ht && this.passedThroughNonGreedyDecision === t2.passedThroughNonGreedyDecision && (this.lexerActionExecutor ? this.lexerActionExecutor.equals(t2.lexerActionExecutor) : !t2.lexerActionExecutor) && super.equals(t2);
        }
        checkNonGreedyDecision(t2, e2) {
          return t2.passedThroughNonGreedyDecision || e2 instanceof $ && e2.nonGreedy;
        }
      }
      class Kt extends xt {
        constructor(t2, e2) {
          super(e2.actionType), this.offset = t2, this.action = e2, this.isPositionDependent = true;
        }
        execute(t2) {
          this.action.execute(t2);
        }
        updateHashCode(t2) {
          t2.update(this.actionType, this.offset, this.action);
        }
        equals(t2) {
          return this === t2 || t2 instanceof Kt && this.offset === t2.offset && this.action === t2.action;
        }
      }
      class Yt {
        constructor(t2) {
          return this.lexerActions = null === t2 ? [] : t2, this.cachedHashCode = o.hashStuff(t2), this;
        }
        fixOffsetBeforeMatch(t2) {
          let e2 = null;
          for (let n2 = 0; n2 < this.lexerActions.length; n2++)
            !this.lexerActions[n2].isPositionDependent || this.lexerActions[n2] instanceof Kt || (null === e2 && (e2 = this.lexerActions.concat([])), e2[n2] = new Kt(t2, this.lexerActions[n2]));
          return null === e2 ? this : new Yt(e2);
        }
        execute(t2, e2, n2) {
          let s2 = false;
          const i2 = e2.index;
          try {
            for (let r2 = 0; r2 < this.lexerActions.length; r2++) {
              let o2 = this.lexerActions[r2];
              if (o2 instanceof Kt) {
                const t3 = o2.offset;
                e2.seek(n2 + t3), o2 = o2.action, s2 = n2 + t3 !== i2;
              } else
                o2.isPositionDependent && (e2.seek(i2), s2 = false);
              o2.execute(t2);
            }
          } finally {
            s2 && e2.seek(i2);
          }
        }
        hashCode() {
          return this.cachedHashCode;
        }
        updateHashCode(t2) {
          t2.update(this.cachedHashCode);
        }
        equals(t2) {
          if (this === t2)
            return true;
          if (t2 instanceof Yt) {
            if (this.cachedHashCode != t2.cachedHashCode)
              return false;
            if (this.lexerActions.length != t2.lexerActions.length)
              return false;
            {
              const e2 = this.lexerActions.length;
              for (let n2 = 0; n2 < e2; ++n2)
                if (!this.lexerActions[n2].equals(t2.lexerActions[n2]))
                  return false;
              return true;
            }
          }
          return false;
        }
        static append(t2, e2) {
          if (null === t2)
            return new Yt([e2]);
          const n2 = t2.lexerActions.concat([e2]);
          return new Yt(n2);
        }
      }
      function Gt(t2) {
        t2.index = -1, t2.line = 0, t2.column = -1, t2.dfaState = null;
      }
      class jt {
        constructor() {
          Gt(this);
        }
        reset() {
          Gt(this);
        }
      }
      class Wt extends zt {
        constructor(t2, e2, n2, s2) {
          super(e2, s2), this.decisionToDFA = n2, this.recog = t2, this.startIndex = -1, this.line = 1, this.column = 0, this.mode = Ft.DEFAULT_MODE, this.prevAccept = new jt();
        }
        copyState(t2) {
          this.column = t2.column, this.line = t2.line, this.mode = t2.mode, this.startIndex = t2.startIndex;
        }
        match(t2, e2) {
          this.mode = e2;
          const n2 = t2.mark();
          try {
            this.startIndex = t2.index, this.prevAccept.reset();
            const n3 = this.decisionToDFA[e2];
            return null === n3.s0 ? this.matchATN(t2) : this.execATN(t2, n3.s0);
          } finally {
            t2.release(n2);
          }
        }
        reset() {
          this.prevAccept.reset(), this.startIndex = -1, this.line = 1, this.column = 0, this.mode = Ft.DEFAULT_MODE;
        }
        matchATN(t2) {
          const e2 = this.atn.modeToStartState[this.mode];
          Wt.debug && console.log("matchATN mode " + this.mode + " start: " + e2);
          const n2 = this.mode, s2 = this.computeStartState(t2, e2), i2 = s2.hasSemanticContext;
          s2.hasSemanticContext = false;
          const r2 = this.addDFAState(s2);
          i2 || (this.decisionToDFA[this.mode].s0 = r2);
          const o2 = this.execATN(t2, r2);
          return Wt.debug && console.log("DFA after matchATN: " + this.decisionToDFA[n2].toLexerString()), o2;
        }
        execATN(t2, e2) {
          Wt.debug && console.log("start state closure=" + e2.configs), e2.isAcceptState && this.captureSimState(this.prevAccept, t2, e2);
          let s2 = t2.LA(1), i2 = e2;
          for (; ; ) {
            Wt.debug && console.log("execATN loop starting closure: " + i2.configs);
            let e3 = this.getExistingTargetState(i2, s2);
            if (null === e3 && (e3 = this.computeTargetState(t2, i2, s2)), e3 === zt.ERROR)
              break;
            if (s2 !== n.EOF && this.consume(t2), e3.isAcceptState && (this.captureSimState(this.prevAccept, t2, e3), s2 === n.EOF))
              break;
            s2 = t2.LA(1), i2 = e3;
          }
          return this.failOrAccept(this.prevAccept, t2, i2.configs, s2);
        }
        getExistingTargetState(t2, e2) {
          if (null === t2.edges || e2 < Wt.MIN_DFA_EDGE || e2 > Wt.MAX_DFA_EDGE)
            return null;
          let n2 = t2.edges[e2 - Wt.MIN_DFA_EDGE];
          return void 0 === n2 && (n2 = null), Wt.debug && null !== n2 && console.log("reuse state " + t2.stateNumber + " edge to " + n2.stateNumber), n2;
        }
        computeTargetState(t2, e2, n2) {
          const s2 = new qt();
          return this.getReachableConfigSet(t2, e2.configs, s2, n2), 0 === s2.items.length ? (s2.hasSemanticContext || this.addDFAEdge(e2, n2, zt.ERROR), zt.ERROR) : this.addDFAEdge(e2, n2, null, s2);
        }
        failOrAccept(t2, e2, s2, i2) {
          if (null !== this.prevAccept.dfaState) {
            const n2 = t2.dfaState.lexerActionExecutor;
            return this.accept(e2, n2, this.startIndex, t2.index, t2.line, t2.column), t2.dfaState.prediction;
          }
          if (i2 === n.EOF && e2.index === this.startIndex)
            return n.EOF;
          throw new Dt(this.recog, e2, this.startIndex, s2);
        }
        getReachableConfigSet(t2, e2, s2, i2) {
          let r2 = j.INVALID_ALT_NUMBER;
          for (let o2 = 0; o2 < e2.items.length; o2++) {
            const l2 = e2.items[o2], a2 = l2.alt === r2;
            if (!a2 || !l2.passedThroughNonGreedyDecision) {
              Wt.debug && console.log("testing %s at %s\n", this.getTokenName(i2), l2.toString(this.recog, true));
              for (let e3 = 0; e3 < l2.state.transitions.length; e3++) {
                const o3 = l2.state.transitions[e3], h2 = this.getReachableTarget(o3, i2);
                if (null !== h2) {
                  let e4 = l2.lexerActionExecutor;
                  null !== e4 && (e4 = e4.fixOffsetBeforeMatch(t2.index - this.startIndex));
                  const o4 = i2 === n.EOF, c2 = new Ht({ state: h2, lexerActionExecutor: e4 }, l2);
                  this.closure(t2, c2, s2, a2, true, o4) && (r2 = l2.alt);
                }
              }
            }
          }
        }
        accept(t2, e2, n2, s2, i2, r2) {
          Wt.debug && console.log("ACTION %s\n", e2), t2.seek(s2), this.line = i2, this.column = r2, null !== e2 && null !== this.recog && e2.execute(this.recog, t2, n2);
        }
        getReachableTarget(t2, e2) {
          return t2.matches(e2, 0, Ft.MAX_CHAR_VALUE) ? t2.target : null;
        }
        computeStartState(t2, e2) {
          const n2 = M.EMPTY, s2 = new qt();
          for (let i2 = 0; i2 < e2.transitions.length; i2++) {
            const r2 = e2.transitions[i2].target, o2 = new Ht({ state: r2, alt: i2 + 1, context: n2 }, null);
            this.closure(t2, o2, s2, false, false, false);
          }
          return s2;
        }
        closure(t2, e2, n2, s2, i2, r2) {
          let o2 = null;
          if (Wt.debug && console.log("closure(" + e2.toString(this.recog, true) + ")"), e2.state instanceof _) {
            if (Wt.debug && (null !== this.recog ? console.log("closure at %s rule stop %s\n", this.recog.ruleNames[e2.state.ruleIndex], e2) : console.log("closure at rule stop %s\n", e2)), null === e2.context || e2.context.hasEmptyPath()) {
              if (null === e2.context || e2.context.isEmpty())
                return n2.add(e2), true;
              n2.add(new Ht({ state: e2.state, context: M.EMPTY }, e2)), s2 = true;
            }
            if (null !== e2.context && !e2.context.isEmpty()) {
              for (let l2 = 0; l2 < e2.context.length; l2++)
                if (e2.context.getReturnState(l2) !== M.EMPTY_RETURN_STATE) {
                  const a2 = e2.context.getParent(l2), h2 = this.atn.states[e2.context.getReturnState(l2)];
                  o2 = new Ht({ state: h2, context: a2 }, e2), s2 = this.closure(t2, o2, n2, s2, i2, r2);
                }
            }
            return s2;
          }
          e2.state.epsilonOnlyTransitions || s2 && e2.passedThroughNonGreedyDecision || n2.add(e2);
          for (let l2 = 0; l2 < e2.state.transitions.length; l2++) {
            const a2 = e2.state.transitions[l2];
            o2 = this.getEpsilonTarget(t2, e2, a2, n2, i2, r2), null !== o2 && (s2 = this.closure(t2, o2, n2, s2, i2, r2));
          }
          return s2;
        }
        getEpsilonTarget(t2, e2, s2, i2, r2, o2) {
          let l2 = null;
          if (s2.serializationType === C.RULE) {
            const t3 = B.create(e2.context, s2.followState.stateNumber);
            l2 = new Ht({ state: s2.target, context: t3 }, e2);
          } else {
            if (s2.serializationType === C.PRECEDENCE)
              throw "Precedence predicates are not supported in lexers.";
            if (s2.serializationType === C.PREDICATE)
              Wt.debug && console.log("EVAL rule " + s2.ruleIndex + ":" + s2.predIndex), i2.hasSemanticContext = true, this.evaluatePredicate(t2, s2.ruleIndex, s2.predIndex, r2) && (l2 = new Ht({ state: s2.target }, e2));
            else if (s2.serializationType === C.ACTION)
              if (null === e2.context || e2.context.hasEmptyPath()) {
                const t3 = Yt.append(e2.lexerActionExecutor, this.atn.lexerActions[s2.actionIndex]);
                l2 = new Ht({ state: s2.target, lexerActionExecutor: t3 }, e2);
              } else
                l2 = new Ht({ state: s2.target }, e2);
            else
              s2.serializationType === C.EPSILON ? l2 = new Ht({ state: s2.target }, e2) : s2.serializationType !== C.ATOM && s2.serializationType !== C.RANGE && s2.serializationType !== C.SET || o2 && s2.matches(n.EOF, 0, Ft.MAX_CHAR_VALUE) && (l2 = new Ht({ state: s2.target }, e2));
          }
          return l2;
        }
        evaluatePredicate(t2, e2, n2, s2) {
          if (null === this.recog)
            return true;
          if (!s2)
            return this.recog.sempred(null, e2, n2);
          const i2 = this.column, r2 = this.line, o2 = t2.index, l2 = t2.mark();
          try {
            return this.consume(t2), this.recog.sempred(null, e2, n2);
          } finally {
            this.column = i2, this.line = r2, t2.seek(o2), t2.release(l2);
          }
        }
        captureSimState(t2, e2, n2) {
          t2.index = e2.index, t2.line = this.line, t2.column = this.column, t2.dfaState = n2;
        }
        addDFAEdge(t2, e2, n2, s2) {
          if (void 0 === n2 && (n2 = null), void 0 === s2 && (s2 = null), null === n2 && null !== s2) {
            const t3 = s2.hasSemanticContext;
            if (s2.hasSemanticContext = false, n2 = this.addDFAState(s2), t3)
              return n2;
          }
          return e2 < Wt.MIN_DFA_EDGE || e2 > Wt.MAX_DFA_EDGE || (Wt.debug && console.log("EDGE " + t2 + " -> " + n2 + " upon " + e2), null === t2.edges && (t2.edges = []), t2.edges[e2 - Wt.MIN_DFA_EDGE] = n2), n2;
        }
        addDFAState(t2) {
          const e2 = new Vt(null, t2);
          let n2 = null;
          for (let e3 = 0; e3 < t2.items.length; e3++) {
            const s3 = t2.items[e3];
            if (s3.state instanceof _) {
              n2 = s3;
              break;
            }
          }
          null !== n2 && (e2.isAcceptState = true, e2.lexerActionExecutor = n2.lexerActionExecutor, e2.prediction = this.atn.ruleToTokenType[n2.state.ruleIndex]);
          const s2 = this.decisionToDFA[this.mode], i2 = s2.states.get(e2);
          if (null !== i2)
            return i2;
          const r2 = e2;
          return r2.stateNumber = s2.states.length, t2.setReadonly(true), r2.configs = t2, s2.states.add(r2), r2;
        }
        getDFA(t2) {
          return this.decisionToDFA[t2];
        }
        getText(t2) {
          return t2.getText(this.startIndex, t2.index - 1);
        }
        consume(t2) {
          t2.LA(1) === "\n".charCodeAt(0) ? (this.line += 1, this.column = 0) : this.column += 1, t2.consume();
        }
        getTokenName(t2) {
          return -1 === t2 ? "EOF" : "'" + String.fromCharCode(t2) + "'";
        }
      }
      Wt.debug = false, Wt.dfa_debug = false, Wt.MIN_DFA_EDGE = 0, Wt.MAX_DFA_EDGE = 127;
      class $t {
        constructor(t2, e2) {
          this.alt = e2, this.pred = t2;
        }
        toString() {
          return "(" + this.pred + ", " + this.alt + ")";
        }
      }
      class Xt {
        constructor() {
          this.data = {};
        }
        get(t2) {
          return this.data["k-" + t2] || null;
        }
        set(t2, e2) {
          this.data["k-" + t2] = e2;
        }
        values() {
          return Object.keys(this.data).filter((t2) => t2.startsWith("k-")).map((t2) => this.data[t2], this);
        }
      }
      const Jt = { SLL: 0, LL: 1, LL_EXACT_AMBIG_DETECTION: 2, hasSLLConflictTerminatingPrediction: function(t2, e2) {
        if (Jt.allConfigsInRuleStopStates(e2))
          return true;
        if (t2 === Jt.SLL && e2.hasSemanticContext) {
          const t3 = new Bt();
          for (let n3 = 0; n3 < e2.items.length; n3++) {
            let s2 = e2.items[n3];
            s2 = new T({ semanticContext: d.NONE }, s2), t3.add(s2);
          }
          e2 = t3;
        }
        const n2 = Jt.getConflictingAltSubsets(e2);
        return Jt.hasConflictingAltSet(n2) && !Jt.hasStateAssociatedWithOneAlt(e2);
      }, hasConfigInRuleStopState: function(t2) {
        for (let e2 = 0; e2 < t2.items.length; e2++)
          if (t2.items[e2].state instanceof _)
            return true;
        return false;
      }, allConfigsInRuleStopStates: function(t2) {
        for (let e2 = 0; e2 < t2.items.length; e2++)
          if (!(t2.items[e2].state instanceof _))
            return false;
        return true;
      }, resolvesToJustOneViableAlt: function(t2) {
        return Jt.getSingleViableAlt(t2);
      }, allSubsetsConflict: function(t2) {
        return !Jt.hasNonConflictingAltSet(t2);
      }, hasNonConflictingAltSet: function(t2) {
        for (let e2 = 0; e2 < t2.length; e2++)
          if (1 === t2[e2].length)
            return true;
        return false;
      }, hasConflictingAltSet: function(t2) {
        for (let e2 = 0; e2 < t2.length; e2++)
          if (t2[e2].length > 1)
            return true;
        return false;
      }, allSubsetsEqual: function(t2) {
        let e2 = null;
        for (let n2 = 0; n2 < t2.length; n2++) {
          const s2 = t2[n2];
          if (null === e2)
            e2 = s2;
          else if (s2 !== e2)
            return false;
        }
        return true;
      }, getUniqueAlt: function(t2) {
        const e2 = Jt.getAlts(t2);
        return 1 === e2.length ? e2.minValue() : j.INVALID_ALT_NUMBER;
      }, getAlts: function(t2) {
        const e2 = new Y();
        return t2.map(function(t3) {
          e2.or(t3);
        }), e2;
      }, getConflictingAltSubsets: function(t2) {
        const e2 = new z();
        return e2.hashFunction = function(t3) {
          o.hashStuff(t3.state.stateNumber, t3.context);
        }, e2.equalsFunction = function(t3, e3) {
          return t3.state.stateNumber === e3.state.stateNumber && t3.context.equals(e3.context);
        }, t2.items.map(function(t3) {
          let n2 = e2.get(t3);
          null === n2 && (n2 = new Y(), e2.set(t3, n2)), n2.set(t3.alt);
        }), e2.getValues();
      }, getStateToAltMap: function(t2) {
        const e2 = new Xt();
        return t2.items.map(function(t3) {
          let n2 = e2.get(t3.state);
          null === n2 && (n2 = new Y(), e2.set(t3.state, n2)), n2.set(t3.alt);
        }), e2;
      }, hasStateAssociatedWithOneAlt: function(t2) {
        const e2 = Jt.getStateToAltMap(t2).values();
        for (let t3 = 0; t3 < e2.length; t3++)
          if (1 === e2[t3].length)
            return true;
        return false;
      }, getSingleViableAlt: function(t2) {
        let e2 = null;
        for (let n2 = 0; n2 < t2.length; n2++) {
          const s2 = t2[n2].minValue();
          if (null === e2)
            e2 = s2;
          else if (e2 !== s2)
            return j.INVALID_ALT_NUMBER;
        }
        return e2;
      } }, Qt = Jt;
      class Zt extends bt {
        constructor(t2, e2, n2, s2, i2, r2) {
          r2 = r2 || t2._ctx, s2 = s2 || t2.getCurrentToken(), n2 = n2 || t2.getCurrentToken(), e2 = e2 || t2.getInputStream(), super({ message: "", recognizer: t2, input: e2, ctx: r2 }), this.deadEndConfigs = i2, this.startToken = n2, this.offendingToken = s2;
        }
      }
      class te {
        constructor(t2) {
          this.defaultMapCtor = t2 || z, this.cacheMap = new this.defaultMapCtor();
        }
        get(t2, e2) {
          const n2 = this.cacheMap.get(t2) || null;
          return null === n2 ? null : n2.get(e2) || null;
        }
        set(t2, e2, n2) {
          let s2 = this.cacheMap.get(t2) || null;
          null === s2 && (s2 = new this.defaultMapCtor(), this.cacheMap.set(t2, s2)), s2.set(e2, n2);
        }
      }
      class ee extends zt {
        constructor(t2, e2, n2, s2) {
          super(e2, s2), this.parser = t2, this.decisionToDFA = n2, this.predictionMode = Qt.LL, this._input = null, this._startIndex = 0, this._outerContext = null, this._dfa = null, this.mergeCache = null, this.debug = false, this.debug_closure = false, this.debug_add = false, this.trace_atn_sim = false, this.dfa_debug = false, this.retry_debug = false;
        }
        reset() {
        }
        adaptivePredict(t2, e2, n2) {
          (this.debug || this.trace_atn_sim) && console.log("adaptivePredict decision " + e2 + " exec LA(1)==" + this.getLookaheadName(t2) + " line " + t2.LT(1).line + ":" + t2.LT(1).column), this._input = t2, this._startIndex = t2.index, this._outerContext = n2;
          const s2 = this.decisionToDFA[e2];
          this._dfa = s2;
          const i2 = t2.mark(), r2 = t2.index;
          try {
            let e3;
            if (e3 = s2.precedenceDfa ? s2.getPrecedenceStartState(this.parser.getPrecedence()) : s2.s0, null === e3) {
              null === n2 && (n2 = F.EMPTY), this.debug && console.log("predictATN decision " + s2.decision + " exec LA(1)==" + this.getLookaheadName(t2) + ", outerContext=" + n2.toString(this.parser.ruleNames));
              const i4 = false;
              let r3 = this.computeStartState(s2.atnStartState, F.EMPTY, i4);
              s2.precedenceDfa ? (s2.s0.configs = r3, r3 = this.applyPrecedenceFilter(r3), e3 = this.addDFAState(s2, new Vt(null, r3)), s2.setPrecedenceStartState(this.parser.getPrecedence(), e3)) : (e3 = this.addDFAState(s2, new Vt(null, r3)), s2.s0 = e3);
            }
            const i3 = this.execATN(s2, e3, t2, r2, n2);
            return this.debug && console.log("DFA after predictATN: " + s2.toString(this.parser.literalNames, this.parser.symbolicNames)), i3;
          } finally {
            this._dfa = null, this.mergeCache = null, t2.seek(r2), t2.release(i2);
          }
        }
        execATN(t2, e2, s2, i2, r2) {
          let o2;
          (this.debug || this.trace_atn_sim) && console.log("execATN decision " + t2.decision + ", DFA state " + e2 + ", LA(1)==" + this.getLookaheadName(s2) + " line " + s2.LT(1).line + ":" + s2.LT(1).column);
          let l2 = e2;
          this.debug && console.log("s0 = " + e2);
          let a2 = s2.LA(1);
          for (; ; ) {
            let e3 = this.getExistingTargetState(l2, a2);
            if (null === e3 && (e3 = this.computeTargetState(t2, l2, a2)), e3 === zt.ERROR) {
              const t3 = this.noViableAlt(s2, r2, l2.configs, i2);
              if (s2.seek(i2), o2 = this.getSynValidOrSemInvalidAltThatFinishedDecisionEntryRule(l2.configs, r2), o2 !== j.INVALID_ALT_NUMBER)
                return o2;
              throw t3;
            }
            if (e3.requiresFullContext && this.predictionMode !== Qt.SLL) {
              let n2 = null;
              if (null !== e3.predicates) {
                this.debug && console.log("DFA state has preds in DFA sim LL failover");
                const t3 = s2.index;
                if (t3 !== i2 && s2.seek(i2), n2 = this.evalSemanticContext(e3.predicates, r2, true), 1 === n2.length)
                  return this.debug && console.log("Full LL avoided"), n2.minValue();
                t3 !== i2 && s2.seek(t3);
              }
              this.dfa_debug && console.log("ctx sensitive state " + r2 + " in " + e3);
              const l3 = true, a3 = this.computeStartState(t2.atnStartState, r2, l3);
              return this.reportAttemptingFullContext(t2, n2, e3.configs, i2, s2.index), o2 = this.execATNWithFullContext(t2, e3, a3, s2, i2, r2), o2;
            }
            if (e3.isAcceptState) {
              if (null === e3.predicates)
                return e3.prediction;
              const n2 = s2.index;
              s2.seek(i2);
              const o3 = this.evalSemanticContext(e3.predicates, r2, true);
              if (0 === o3.length)
                throw this.noViableAlt(s2, r2, e3.configs, i2);
              return 1 === o3.length || this.reportAmbiguity(t2, e3, i2, n2, false, o3, e3.configs), o3.minValue();
            }
            l2 = e3, a2 !== n.EOF && (s2.consume(), a2 = s2.LA(1));
          }
        }
        getExistingTargetState(t2, e2) {
          const n2 = t2.edges;
          return null === n2 ? null : n2[e2 + 1] || null;
        }
        computeTargetState(t2, e2, n2) {
          const s2 = this.computeReachSet(e2.configs, n2, false);
          if (null === s2)
            return this.addDFAEdge(t2, e2, n2, zt.ERROR), zt.ERROR;
          let i2 = new Vt(null, s2);
          const r2 = this.getUniqueAlt(s2);
          if (this.debug) {
            const t3 = Qt.getConflictingAltSubsets(s2);
            console.log("SLL altSubSets=" + c(t3) + ", configs=" + s2 + ", predict=" + r2 + ", allSubsetsConflict=" + Qt.allSubsetsConflict(t3) + ", conflictingAlts=" + this.getConflictingAlts(s2));
          }
          return r2 !== j.INVALID_ALT_NUMBER ? (i2.isAcceptState = true, i2.configs.uniqueAlt = r2, i2.prediction = r2) : Qt.hasSLLConflictTerminatingPrediction(this.predictionMode, s2) && (i2.configs.conflictingAlts = this.getConflictingAlts(s2), i2.requiresFullContext = true, i2.isAcceptState = true, i2.prediction = i2.configs.conflictingAlts.minValue()), i2.isAcceptState && i2.configs.hasSemanticContext && (this.predicateDFAState(i2, this.atn.getDecisionState(t2.decision)), null !== i2.predicates && (i2.prediction = j.INVALID_ALT_NUMBER)), i2 = this.addDFAEdge(t2, e2, n2, i2), i2;
        }
        predicateDFAState(t2, e2) {
          const n2 = e2.transitions.length, s2 = this.getConflictingAltsOrUniqueAlt(t2.configs), i2 = this.getPredsForAmbigAlts(s2, t2.configs, n2);
          null !== i2 ? (t2.predicates = this.getPredicatePredictions(s2, i2), t2.prediction = j.INVALID_ALT_NUMBER) : t2.prediction = s2.minValue();
        }
        execATNWithFullContext(t2, e2, s2, i2, r2, o2) {
          (this.debug || this.trace_atn_sim) && console.log("execATNWithFullContext " + s2);
          let l2, a2 = false, h2 = s2;
          i2.seek(r2);
          let c2 = i2.LA(1), u2 = -1;
          for (; ; ) {
            if (l2 = this.computeReachSet(h2, c2, true), null === l2) {
              const t4 = this.noViableAlt(i2, o2, h2, r2);
              i2.seek(r2);
              const e3 = this.getSynValidOrSemInvalidAltThatFinishedDecisionEntryRule(h2, o2);
              if (e3 !== j.INVALID_ALT_NUMBER)
                return e3;
              throw t4;
            }
            const t3 = Qt.getConflictingAltSubsets(l2);
            if (this.debug && console.log("LL altSubSets=" + t3 + ", predict=" + Qt.getUniqueAlt(t3) + ", resolvesToJustOneViableAlt=" + Qt.resolvesToJustOneViableAlt(t3)), l2.uniqueAlt = this.getUniqueAlt(l2), l2.uniqueAlt !== j.INVALID_ALT_NUMBER) {
              u2 = l2.uniqueAlt;
              break;
            }
            if (this.predictionMode !== Qt.LL_EXACT_AMBIG_DETECTION) {
              if (u2 = Qt.resolvesToJustOneViableAlt(t3), u2 !== j.INVALID_ALT_NUMBER)
                break;
            } else if (Qt.allSubsetsConflict(t3) && Qt.allSubsetsEqual(t3)) {
              a2 = true, u2 = Qt.getSingleViableAlt(t3);
              break;
            }
            h2 = l2, c2 !== n.EOF && (i2.consume(), c2 = i2.LA(1));
          }
          return l2.uniqueAlt !== j.INVALID_ALT_NUMBER ? (this.reportContextSensitivity(t2, u2, l2, r2, i2.index), u2) : (this.reportAmbiguity(t2, e2, r2, i2.index, a2, null, l2), u2);
        }
        computeReachSet(t2, e2, s2) {
          this.debug && console.log("in computeReachSet, starting closure: " + t2), null === this.mergeCache && (this.mergeCache = new te());
          const i2 = new Bt(s2);
          let r2 = null;
          for (let o3 = 0; o3 < t2.items.length; o3++) {
            const l2 = t2.items[o3];
            if (this.debug && console.log("testing " + this.getTokenName(e2) + " at " + l2), l2.state instanceof _)
              (s2 || e2 === n.EOF) && (null === r2 && (r2 = []), r2.push(l2), this.debug_add && console.log("added " + l2 + " to skippedStopStates"));
            else
              for (let t3 = 0; t3 < l2.state.transitions.length; t3++) {
                const n2 = l2.state.transitions[t3], s3 = this.getReachableTarget(n2, e2);
                if (null !== s3) {
                  const t4 = new T({ state: s3 }, l2);
                  i2.add(t4, this.mergeCache), this.debug_add && console.log("added " + t4 + " to intermediate");
                }
              }
          }
          let o2 = null;
          if (null === r2 && e2 !== n.EOF && (1 === i2.items.length || this.getUniqueAlt(i2) !== j.INVALID_ALT_NUMBER) && (o2 = i2), null === o2) {
            o2 = new Bt(s2);
            const t3 = new u(), r3 = e2 === n.EOF;
            for (let e3 = 0; e3 < i2.items.length; e3++)
              this.closure(i2.items[e3], o2, t3, false, s2, r3);
          }
          if (e2 === n.EOF && (o2 = this.removeAllConfigsNotInRuleStopState(o2, o2 === i2)), !(null === r2 || s2 && Qt.hasConfigInRuleStopState(o2)))
            for (let t3 = 0; t3 < r2.length; t3++)
              o2.add(r2[t3], this.mergeCache);
          return this.trace_atn_sim && console.log("computeReachSet " + t2 + " -> " + o2), 0 === o2.items.length ? null : o2;
        }
        removeAllConfigsNotInRuleStopState(t2, e2) {
          if (Qt.allConfigsInRuleStopStates(t2))
            return t2;
          const s2 = new Bt(t2.fullCtx);
          for (let i2 = 0; i2 < t2.items.length; i2++) {
            const r2 = t2.items[i2];
            if (r2.state instanceof _)
              s2.add(r2, this.mergeCache);
            else if (e2 && r2.state.epsilonOnlyTransitions && this.atn.nextTokens(r2.state).contains(n.EPSILON)) {
              const t3 = this.atn.ruleToStopState[r2.state.ruleIndex];
              s2.add(new T({ state: t3 }, r2), this.mergeCache);
            }
          }
          return s2;
        }
        computeStartState(t2, e2, n2) {
          const s2 = q(this.atn, e2), i2 = new Bt(n2);
          this.trace_atn_sim && console.log("computeStartState from ATN state " + t2 + " initialContext=" + s2.toString(this.parser));
          for (let e3 = 0; e3 < t2.transitions.length; e3++) {
            const r2 = t2.transitions[e3].target, o2 = new T({ state: r2, alt: e3 + 1, context: s2 }, null), l2 = new u();
            this.closure(o2, i2, l2, true, n2, false);
          }
          return i2;
        }
        applyPrecedenceFilter(t2) {
          let e2;
          const n2 = [], s2 = new Bt(t2.fullCtx);
          for (let i2 = 0; i2 < t2.items.length; i2++) {
            if (e2 = t2.items[i2], 1 !== e2.alt)
              continue;
            const r2 = e2.semanticContext.evalPrecedence(this.parser, this._outerContext);
            null !== r2 && (n2[e2.state.stateNumber] = e2.context, r2 !== e2.semanticContext ? s2.add(new T({ semanticContext: r2 }, e2), this.mergeCache) : s2.add(e2, this.mergeCache));
          }
          for (let i2 = 0; i2 < t2.items.length; i2++)
            if (e2 = t2.items[i2], 1 !== e2.alt) {
              if (!e2.precedenceFilterSuppressed) {
                const t3 = n2[e2.state.stateNumber] || null;
                if (null !== t3 && t3.equals(e2.context))
                  continue;
              }
              s2.add(e2, this.mergeCache);
            }
          return s2;
        }
        getReachableTarget(t2, e2) {
          return t2.matches(e2, 0, this.atn.maxTokenType) ? t2.target : null;
        }
        getPredsForAmbigAlts(t2, e2, n2) {
          let s2 = [];
          for (let n3 = 0; n3 < e2.items.length; n3++) {
            const i3 = e2.items[n3];
            t2.get(i3.alt) && (s2[i3.alt] = d.orContext(s2[i3.alt] || null, i3.semanticContext));
          }
          let i2 = 0;
          for (let t3 = 1; t3 < n2 + 1; t3++) {
            const e3 = s2[t3] || null;
            null === e3 ? s2[t3] = d.NONE : e3 !== d.NONE && (i2 += 1);
          }
          return 0 === i2 && (s2 = null), this.debug && console.log("getPredsForAmbigAlts result " + c(s2)), s2;
        }
        getPredicatePredictions(t2, e2) {
          const n2 = [];
          let s2 = false;
          for (let i2 = 1; i2 < e2.length; i2++) {
            const r2 = e2[i2];
            null !== t2 && t2.get(i2) && n2.push(new $t(r2, i2)), r2 !== d.NONE && (s2 = true);
          }
          return s2 ? n2 : null;
        }
        getSynValidOrSemInvalidAltThatFinishedDecisionEntryRule(t2, e2) {
          const n2 = this.splitAccordingToSemanticValidity(t2, e2), s2 = n2[0], i2 = n2[1];
          let r2 = this.getAltThatFinishedDecisionEntryRule(s2);
          return r2 !== j.INVALID_ALT_NUMBER || i2.items.length > 0 && (r2 = this.getAltThatFinishedDecisionEntryRule(i2), r2 !== j.INVALID_ALT_NUMBER) ? r2 : j.INVALID_ALT_NUMBER;
        }
        getAltThatFinishedDecisionEntryRule(t2) {
          const e2 = [];
          for (let n2 = 0; n2 < t2.items.length; n2++) {
            const s2 = t2.items[n2];
            (s2.reachesIntoOuterContext > 0 || s2.state instanceof _ && s2.context.hasEmptyPath()) && e2.indexOf(s2.alt) < 0 && e2.push(s2.alt);
          }
          return 0 === e2.length ? j.INVALID_ALT_NUMBER : Math.min.apply(null, e2);
        }
        splitAccordingToSemanticValidity(t2, e2) {
          const n2 = new Bt(t2.fullCtx), s2 = new Bt(t2.fullCtx);
          for (let i2 = 0; i2 < t2.items.length; i2++) {
            const r2 = t2.items[i2];
            r2.semanticContext !== d.NONE ? r2.semanticContext.evaluate(this.parser, e2) ? n2.add(r2) : s2.add(r2) : n2.add(r2);
          }
          return [n2, s2];
        }
        evalSemanticContext(t2, e2, n2) {
          const s2 = new Y();
          for (let i2 = 0; i2 < t2.length; i2++) {
            const r2 = t2[i2];
            if (r2.pred === d.NONE) {
              if (s2.set(r2.alt), !n2)
                break;
              continue;
            }
            const o2 = r2.pred.evaluate(this.parser, e2);
            if ((this.debug || this.dfa_debug) && console.log("eval pred " + r2 + "=" + o2), o2 && ((this.debug || this.dfa_debug) && console.log("PREDICT " + r2.alt), s2.set(r2.alt), !n2))
              break;
          }
          return s2;
        }
        closure(t2, e2, n2, s2, i2, r2) {
          this.closureCheckingStopState(t2, e2, n2, s2, i2, 0, r2);
        }
        closureCheckingStopState(t2, e2, n2, s2, i2, r2, o2) {
          if ((this.trace_atn_sim || this.debug_closure) && console.log("closure(" + t2.toString(this.parser, true) + ")"), t2.state instanceof _) {
            if (!t2.context.isEmpty()) {
              for (let l2 = 0; l2 < t2.context.length; l2++) {
                if (t2.context.getReturnState(l2) === M.EMPTY_RETURN_STATE) {
                  if (i2) {
                    e2.add(new T({ state: t2.state, context: M.EMPTY }, t2), this.mergeCache);
                    continue;
                  }
                  this.debug && console.log("FALLING off rule " + this.getRuleName(t2.state.ruleIndex)), this.closure_(t2, e2, n2, s2, i2, r2, o2);
                  continue;
                }
                const a2 = this.atn.states[t2.context.getReturnState(l2)], h2 = t2.context.getParent(l2), c2 = { state: a2, alt: t2.alt, context: h2, semanticContext: t2.semanticContext }, u2 = new T(c2, null);
                u2.reachesIntoOuterContext = t2.reachesIntoOuterContext, this.closureCheckingStopState(u2, e2, n2, s2, i2, r2 - 1, o2);
              }
              return;
            }
            if (i2)
              return void e2.add(t2, this.mergeCache);
            this.debug && console.log("FALLING off rule " + this.getRuleName(t2.state.ruleIndex));
          }
          this.closure_(t2, e2, n2, s2, i2, r2, o2);
        }
        closure_(t2, e2, n2, s2, i2, r2, o2) {
          const l2 = t2.state;
          l2.epsilonOnlyTransitions || e2.add(t2, this.mergeCache);
          for (let a2 = 0; a2 < l2.transitions.length; a2++) {
            if (0 === a2 && this.canDropLoopEntryEdgeInLeftRecursiveRule(t2))
              continue;
            const h2 = l2.transitions[a2], c2 = s2 && !(h2 instanceof ht), u2 = this.getEpsilonTarget(t2, h2, c2, 0 === r2, i2, o2);
            if (null !== u2) {
              let s3 = r2;
              if (t2.state instanceof _) {
                if (null !== this._dfa && this._dfa.precedenceDfa && h2.outermostPrecedenceReturn === this._dfa.atnStartState.ruleIndex && (u2.precedenceFilterSuppressed = true), u2.reachesIntoOuterContext += 1, n2.getOrAdd(u2) !== u2)
                  continue;
                e2.dipsIntoOuterContext = true, s3 -= 1, this.debug && console.log("dips into outer ctx: " + u2);
              } else {
                if (!h2.isEpsilon && n2.getOrAdd(u2) !== u2)
                  continue;
                h2 instanceof A && s3 >= 0 && (s3 += 1);
              }
              this.closureCheckingStopState(u2, e2, n2, c2, i2, s3, o2);
            }
          }
        }
        canDropLoopEntryEdgeInLeftRecursiveRule(t2) {
          const e2 = t2.state;
          if (e2.stateType !== E.STAR_LOOP_ENTRY)
            return false;
          if (e2.stateType !== E.STAR_LOOP_ENTRY || !e2.isPrecedenceDecision || t2.context.isEmpty() || t2.context.hasEmptyPath())
            return false;
          const n2 = t2.context.length;
          for (let s3 = 0; s3 < n2; s3++)
            if (this.atn.states[t2.context.getReturnState(s3)].ruleIndex !== e2.ruleIndex)
              return false;
          const s2 = e2.transitions[0].target.endState.stateNumber, i2 = this.atn.states[s2];
          for (let s3 = 0; s3 < n2; s3++) {
            const n3 = t2.context.getReturnState(s3), r2 = this.atn.states[n3];
            if (1 !== r2.transitions.length || !r2.transitions[0].isEpsilon)
              return false;
            const o2 = r2.transitions[0].target;
            if (!(r2.stateType === E.BLOCK_END && o2 === e2 || r2 === i2 || o2 === i2 || o2.stateType === E.BLOCK_END && 1 === o2.transitions.length && o2.transitions[0].isEpsilon && o2.transitions[0].target === e2))
              return false;
          }
          return true;
        }
        getRuleName(t2) {
          return null !== this.parser && t2 >= 0 ? this.parser.ruleNames[t2] : "<rule " + t2 + ">";
        }
        getEpsilonTarget(t2, e2, s2, i2, r2, o2) {
          switch (e2.serializationType) {
            case C.RULE:
              return this.ruleTransition(t2, e2);
            case C.PRECEDENCE:
              return this.precedenceTransition(t2, e2, s2, i2, r2);
            case C.PREDICATE:
              return this.predTransition(t2, e2, s2, i2, r2);
            case C.ACTION:
              return this.actionTransition(t2, e2);
            case C.EPSILON:
              return new T({ state: e2.target }, t2);
            case C.ATOM:
            case C.RANGE:
            case C.SET:
              return o2 && e2.matches(n.EOF, 0, 1) ? new T({ state: e2.target }, t2) : null;
            default:
              return null;
          }
        }
        actionTransition(t2, e2) {
          if (this.debug) {
            const t3 = -1 === e2.actionIndex ? 65535 : e2.actionIndex;
            console.log("ACTION edge " + e2.ruleIndex + ":" + t3);
          }
          return new T({ state: e2.target }, t2);
        }
        precedenceTransition(t2, e2, n2, s2, i2) {
          this.debug && (console.log("PRED (collectPredicates=" + n2 + ") " + e2.precedence + ">=_p, ctx dependent=true"), null !== this.parser && console.log("context surrounding pred is " + c(this.parser.getRuleInvocationStack())));
          let r2 = null;
          if (n2 && s2)
            if (i2) {
              const n3 = this._input.index;
              this._input.seek(this._startIndex);
              const s3 = e2.getPredicate().evaluate(this.parser, this._outerContext);
              this._input.seek(n3), s3 && (r2 = new T({ state: e2.target }, t2));
            } else {
              const n3 = d.andContext(t2.semanticContext, e2.getPredicate());
              r2 = new T({ state: e2.target, semanticContext: n3 }, t2);
            }
          else
            r2 = new T({ state: e2.target }, t2);
          return this.debug && console.log("config from pred transition=" + r2), r2;
        }
        predTransition(t2, e2, n2, s2, i2) {
          this.debug && (console.log("PRED (collectPredicates=" + n2 + ") " + e2.ruleIndex + ":" + e2.predIndex + ", ctx dependent=" + e2.isCtxDependent), null !== this.parser && console.log("context surrounding pred is " + c(this.parser.getRuleInvocationStack())));
          let r2 = null;
          if (n2 && (e2.isCtxDependent && s2 || !e2.isCtxDependent))
            if (i2) {
              const n3 = this._input.index;
              this._input.seek(this._startIndex);
              const s3 = e2.getPredicate().evaluate(this.parser, this._outerContext);
              this._input.seek(n3), s3 && (r2 = new T({ state: e2.target }, t2));
            } else {
              const n3 = d.andContext(t2.semanticContext, e2.getPredicate());
              r2 = new T({ state: e2.target, semanticContext: n3 }, t2);
            }
          else
            r2 = new T({ state: e2.target }, t2);
          return this.debug && console.log("config from pred transition=" + r2), r2;
        }
        ruleTransition(t2, e2) {
          this.debug && console.log("CALL rule " + this.getRuleName(e2.target.ruleIndex) + ", ctx=" + t2.context);
          const n2 = e2.followState, s2 = B.create(t2.context, n2.stateNumber);
          return new T({ state: e2.target, context: s2 }, t2);
        }
        getConflictingAlts(t2) {
          const e2 = Qt.getConflictingAltSubsets(t2);
          return Qt.getAlts(e2);
        }
        getConflictingAltsOrUniqueAlt(t2) {
          let e2 = null;
          return t2.uniqueAlt !== j.INVALID_ALT_NUMBER ? (e2 = new Y(), e2.set(t2.uniqueAlt)) : e2 = t2.conflictingAlts, e2;
        }
        getTokenName(t2) {
          if (t2 === n.EOF)
            return "EOF";
          if (null !== this.parser && null !== this.parser.literalNames) {
            if (!(t2 >= this.parser.literalNames.length && t2 >= this.parser.symbolicNames.length))
              return (this.parser.literalNames[t2] || this.parser.symbolicNames[t2]) + "<" + t2 + ">";
            console.log(t2 + " ttype out of range: " + this.parser.literalNames), console.log("" + this.parser.getInputStream().getTokens());
          }
          return "" + t2;
        }
        getLookaheadName(t2) {
          return this.getTokenName(t2.LA(1));
        }
        dumpDeadEndConfigs(t2) {
          console.log("dead end configs: ");
          const e2 = t2.getDeadEndConfigs();
          for (let t3 = 0; t3 < e2.length; t3++) {
            const n2 = e2[t3];
            let s2 = "no edges";
            if (n2.state.transitions.length > 0) {
              const t4 = n2.state.transitions[0];
              t4 instanceof lt ? s2 = "Atom " + this.getTokenName(t4.label) : t4 instanceof N && (s2 = (t4 instanceof k ? "~" : "") + "Set " + t4.set);
            }
            console.error(n2.toString(this.parser, true) + ":" + s2);
          }
        }
        noViableAlt(t2, e2, n2, s2) {
          return new Zt(this.parser, t2, t2.get(s2), t2.LT(1), n2, e2);
        }
        getUniqueAlt(t2) {
          let e2 = j.INVALID_ALT_NUMBER;
          for (let n2 = 0; n2 < t2.items.length; n2++) {
            const s2 = t2.items[n2];
            if (e2 === j.INVALID_ALT_NUMBER)
              e2 = s2.alt;
            else if (s2.alt !== e2)
              return j.INVALID_ALT_NUMBER;
          }
          return e2;
        }
        addDFAEdge(t2, e2, n2, s2) {
          if (this.debug && console.log("EDGE " + e2 + " -> " + s2 + " upon " + this.getTokenName(n2)), null === s2)
            return null;
          if (s2 = this.addDFAState(t2, s2), null === e2 || n2 < -1 || n2 > this.atn.maxTokenType)
            return s2;
          if (null === e2.edges && (e2.edges = []), e2.edges[n2 + 1] = s2, this.debug) {
            const e3 = null === this.parser ? null : this.parser.literalNames, n3 = null === this.parser ? null : this.parser.symbolicNames;
            console.log("DFA=\n" + t2.toString(e3, n3));
          }
          return s2;
        }
        addDFAState(t2, e2) {
          if (e2 === zt.ERROR)
            return e2;
          const n2 = t2.states.get(e2);
          return null !== n2 ? (this.trace_atn_sim && console.log("addDFAState " + e2 + " exists"), n2) : (e2.stateNumber = t2.states.length, e2.configs.readOnly || (e2.configs.optimizeConfigs(this), e2.configs.setReadonly(true)), this.trace_atn_sim && console.log("addDFAState new " + e2), t2.states.add(e2), this.debug && console.log("adding new DFA state: " + e2), e2);
        }
        reportAttemptingFullContext(t2, e2, n2, s2, i2) {
          if (this.debug || this.retry_debug) {
            const e3 = new S(s2, i2 + 1);
            console.log("reportAttemptingFullContext decision=" + t2.decision + ":" + n2 + ", input=" + this.parser.getTokenStream().getText(e3));
          }
          null !== this.parser && this.parser.getErrorListener().reportAttemptingFullContext(this.parser, t2, s2, i2, e2, n2);
        }
        reportContextSensitivity(t2, e2, n2, s2, i2) {
          if (this.debug || this.retry_debug) {
            const e3 = new S(s2, i2 + 1);
            console.log("reportContextSensitivity decision=" + t2.decision + ":" + n2 + ", input=" + this.parser.getTokenStream().getText(e3));
          }
          null !== this.parser && this.parser.getErrorListener().reportContextSensitivity(this.parser, t2, s2, i2, e2, n2);
        }
        reportAmbiguity(t2, e2, n2, s2, i2, r2, o2) {
          if (this.debug || this.retry_debug) {
            const t3 = new S(n2, s2 + 1);
            console.log("reportAmbiguity " + r2 + ":" + o2 + ", input=" + this.parser.getTokenStream().getText(t3));
          }
          null !== this.parser && this.parser.getErrorListener().reportAmbiguity(this.parser, t2, n2, s2, i2, r2, o2);
        }
      }
      class ne {
        constructor() {
          this.cache = new z();
        }
        add(t2) {
          if (t2 === M.EMPTY)
            return M.EMPTY;
          const e2 = this.cache.get(t2) || null;
          return null !== e2 ? e2 : (this.cache.set(t2, t2), t2);
        }
        get(t2) {
          return this.cache.get(t2) || null;
        }
        get length() {
          return this.cache.length;
        }
      }
      const se = { ATN: j, ATNDeserializer: It, LexerATNSimulator: Wt, ParserATNSimulator: ee, PredictionMode: Qt, PredictionContextCache: ne };
      class ie {
        constructor(t2, e2, n2) {
          this.dfa = t2, this.literalNames = e2 || [], this.symbolicNames = n2 || [];
        }
        toString() {
          if (null === this.dfa.s0)
            return null;
          let t2 = "";
          const e2 = this.dfa.sortedStates();
          for (let n2 = 0; n2 < e2.length; n2++) {
            const s2 = e2[n2];
            if (null !== s2.edges) {
              const e3 = s2.edges.length;
              for (let n3 = 0; n3 < e3; n3++) {
                const e4 = s2.edges[n3] || null;
                null !== e4 && 2147483647 !== e4.stateNumber && (t2 = t2.concat(this.getStateString(s2)), t2 = t2.concat("-"), t2 = t2.concat(this.getEdgeLabel(n3)), t2 = t2.concat("->"), t2 = t2.concat(this.getStateString(e4)), t2 = t2.concat("\n"));
              }
            }
          }
          return 0 === t2.length ? null : t2;
        }
        getEdgeLabel(t2) {
          return 0 === t2 ? "EOF" : null !== this.literalNames || null !== this.symbolicNames ? this.literalNames[t2 - 1] || this.symbolicNames[t2 - 1] : String.fromCharCode(t2 - 1);
        }
        getStateString(t2) {
          const e2 = (t2.isAcceptState ? ":" : "") + "s" + t2.stateNumber + (t2.requiresFullContext ? "^" : "");
          return t2.isAcceptState ? null !== t2.predicates ? e2 + "=>" + c(t2.predicates) : e2 + "=>" + t2.prediction.toString() : e2;
        }
      }
      class re extends ie {
        constructor(t2) {
          super(t2, null);
        }
        getEdgeLabel(t2) {
          return "'" + String.fromCharCode(t2) + "'";
        }
      }
      class oe {
        constructor(t2, e2) {
          if (void 0 === e2 && (e2 = 0), this.atnStartState = t2, this.decision = e2, this._states = new u(), this.s0 = null, this.precedenceDfa = false, t2 instanceof st && t2.isPrecedenceDecision) {
            this.precedenceDfa = true;
            const t3 = new Vt(null, new Bt());
            t3.edges = [], t3.isAcceptState = false, t3.requiresFullContext = false, this.s0 = t3;
          }
        }
        getPrecedenceStartState(t2) {
          if (!this.precedenceDfa)
            throw "Only precedence DFAs may contain a precedence start state.";
          return t2 < 0 || t2 >= this.s0.edges.length ? null : this.s0.edges[t2] || null;
        }
        setPrecedenceStartState(t2, e2) {
          if (!this.precedenceDfa)
            throw "Only precedence DFAs may contain a precedence start state.";
          t2 < 0 || (this.s0.edges[t2] = e2);
        }
        setPrecedenceDfa(t2) {
          if (this.precedenceDfa !== t2) {
            if (this._states = new u(), t2) {
              const t3 = new Vt(null, new Bt());
              t3.edges = [], t3.isAcceptState = false, t3.requiresFullContext = false, this.s0 = t3;
            } else
              this.s0 = null;
            this.precedenceDfa = t2;
          }
        }
        sortedStates() {
          return this._states.values().sort(function(t2, e2) {
            return t2.stateNumber - e2.stateNumber;
          });
        }
        toString(t2, e2) {
          return t2 = t2 || null, e2 = e2 || null, null === this.s0 ? "" : new ie(this, t2, e2).toString();
        }
        toLexerString() {
          return null === this.s0 ? "" : new re(this).toString();
        }
        get states() {
          return this._states;
        }
      }
      const le = { DFA: oe, DFASerializer: ie, LexerDFASerializer: re, PredPrediction: $t }, ae = { PredictionContext: M }, he = { Interval: S, IntervalSet: m };
      class ce {
        visitTerminal(t2) {
        }
        visitErrorNode(t2) {
        }
        enterEveryRule(t2) {
        }
        exitEveryRule(t2) {
        }
      }
      class ue {
        visit(t2) {
          return Array.isArray(t2) ? t2.map(function(t3) {
            return t3.accept(this);
          }, this) : t2.accept(this);
        }
        visitChildren(t2) {
          return t2.children ? this.visit(t2.children) : null;
        }
        visitTerminal(t2) {
        }
        visitErrorNode(t2) {
        }
      }
      class de {
        walk(t2, e2) {
          if (e2 instanceof P || void 0 !== e2.isErrorNode && e2.isErrorNode())
            t2.visitErrorNode(e2);
          else if (e2 instanceof w)
            t2.visitTerminal(e2);
          else {
            this.enterRule(t2, e2);
            for (let n2 = 0; n2 < e2.getChildCount(); n2++) {
              const s2 = e2.getChild(n2);
              this.walk(t2, s2);
            }
            this.exitRule(t2, e2);
          }
        }
        enterRule(t2, e2) {
          const n2 = e2.ruleContext;
          t2.enterEveryRule(n2), n2.enterRule(t2);
        }
        exitRule(t2, e2) {
          const n2 = e2.ruleContext;
          n2.exitRule(t2), t2.exitEveryRule(n2);
        }
      }
      de.DEFAULT = new de();
      const ge = { Trees: D, RuleNode: v, ErrorNode: P, TerminalNode: w, ParseTreeListener: ce, ParseTreeVisitor: ue, ParseTreeWalker: de };
      class pe extends bt {
        constructor(t2) {
          super({ message: "", recognizer: t2, input: t2.getInputStream(), ctx: t2._ctx }), this.offendingToken = t2.getCurrentToken();
        }
      }
      class fe extends bt {
        constructor(t2, e2, n2) {
          super({ message: xe(e2, n2 || null), recognizer: t2, input: t2.getInputStream(), ctx: t2._ctx });
          const s2 = t2._interp.atn.states[t2.state].transitions[0];
          s2 instanceof dt ? (this.ruleIndex = s2.ruleIndex, this.predicateIndex = s2.predIndex) : (this.ruleIndex = 0, this.predicateIndex = 0), this.predicate = e2, this.offendingToken = t2.getCurrentToken();
        }
      }
      function xe(t2, e2) {
        return null !== e2 ? e2 : "failed predicate: {" + t2 + "}?";
      }
      class Te extends yt {
        constructor(t2) {
          super(), t2 = t2 || true, this.exactOnly = t2;
        }
        reportAmbiguity(t2, e2, n2, s2, i2, r2, o2) {
          if (this.exactOnly && !i2)
            return;
          const l2 = "reportAmbiguity d=" + this.getDecisionDescription(t2, e2) + ": ambigAlts=" + this.getConflictingAlts(r2, o2) + ", input='" + t2.getTokenStream().getText(new S(n2, s2)) + "'";
          t2.notifyErrorListeners(l2);
        }
        reportAttemptingFullContext(t2, e2, n2, s2, i2, r2) {
          const o2 = "reportAttemptingFullContext d=" + this.getDecisionDescription(t2, e2) + ", input='" + t2.getTokenStream().getText(new S(n2, s2)) + "'";
          t2.notifyErrorListeners(o2);
        }
        reportContextSensitivity(t2, e2, n2, s2, i2, r2) {
          const o2 = "reportContextSensitivity d=" + this.getDecisionDescription(t2, e2) + ", input='" + t2.getTokenStream().getText(new S(n2, s2)) + "'";
          t2.notifyErrorListeners(o2);
        }
        getDecisionDescription(t2, e2) {
          const n2 = e2.decision, s2 = e2.atnStartState.ruleIndex, i2 = t2.ruleNames;
          if (s2 < 0 || s2 >= i2.length)
            return "" + n2;
          const r2 = i2[s2] || null;
          return null === r2 || 0 === r2.length ? "" + n2 : `${n2} (${r2})`;
        }
        getConflictingAlts(t2, e2) {
          if (null !== t2)
            return t2;
          const n2 = new Y();
          for (let t3 = 0; t3 < e2.items.length; t3++)
            n2.set(e2.items[t3].alt);
          return `{${n2.values().join(", ")}}`;
        }
      }
      class Se extends Error {
        constructor() {
          super(), Error.captureStackTrace(this, Se);
        }
      }
      class me {
        reset(t2) {
        }
        recoverInline(t2) {
        }
        recover(t2, e2) {
        }
        sync(t2) {
        }
        inErrorRecoveryMode(t2) {
        }
        reportError(t2) {
        }
      }
      class Ee extends me {
        constructor() {
          super(), this.errorRecoveryMode = false, this.lastErrorIndex = -1, this.lastErrorStates = null, this.nextTokensContext = null, this.nextTokenState = 0;
        }
        reset(t2) {
          this.endErrorCondition(t2);
        }
        beginErrorCondition(t2) {
          this.errorRecoveryMode = true;
        }
        inErrorRecoveryMode(t2) {
          return this.errorRecoveryMode;
        }
        endErrorCondition(t2) {
          this.errorRecoveryMode = false, this.lastErrorStates = null, this.lastErrorIndex = -1;
        }
        reportMatch(t2) {
          this.endErrorCondition(t2);
        }
        reportError(t2, e2) {
          this.inErrorRecoveryMode(t2) || (this.beginErrorCondition(t2), e2 instanceof Zt ? this.reportNoViableAlternative(t2, e2) : e2 instanceof pe ? this.reportInputMismatch(t2, e2) : e2 instanceof fe ? this.reportFailedPredicate(t2, e2) : (console.log("unknown recognition error type: " + e2.constructor.name), console.log(e2.stack), t2.notifyErrorListeners(e2.getOffendingToken(), e2.getMessage(), e2)));
        }
        recover(t2, e2) {
          this.lastErrorIndex === t2.getInputStream().index && null !== this.lastErrorStates && this.lastErrorStates.indexOf(t2.state) >= 0 && t2.consume(), this.lastErrorIndex = t2._input.index, null === this.lastErrorStates && (this.lastErrorStates = []), this.lastErrorStates.push(t2.state);
          const n2 = this.getErrorRecoverySet(t2);
          this.consumeUntil(t2, n2);
        }
        sync(t2) {
          if (this.inErrorRecoveryMode(t2))
            return;
          const e2 = t2._interp.atn.states[t2.state], s2 = t2.getTokenStream().LA(1), i2 = t2.atn.nextTokens(e2);
          if (i2.contains(s2))
            return this.nextTokensContext = null, void (this.nextTokenState = E.INVALID_STATE_NUMBER);
          if (i2.contains(n.EPSILON))
            null === this.nextTokensContext && (this.nextTokensContext = t2._ctx, this.nextTokensState = t2._stateNumber);
          else
            switch (e2.stateType) {
              case E.BLOCK_START:
              case E.STAR_BLOCK_START:
              case E.PLUS_BLOCK_START:
              case E.STAR_LOOP_ENTRY:
                if (null !== this.singleTokenDeletion(t2))
                  return;
                throw new pe(t2);
              case E.PLUS_LOOP_BACK:
              case E.STAR_LOOP_BACK: {
                this.reportUnwantedToken(t2);
                const e3 = new m();
                e3.addSet(t2.getExpectedTokens());
                const n2 = e3.addSet(this.getErrorRecoverySet(t2));
                this.consumeUntil(t2, n2);
              }
            }
        }
        reportNoViableAlternative(t2, e2) {
          const s2 = t2.getTokenStream();
          let i2;
          i2 = null !== s2 ? e2.startToken.type === n.EOF ? "<EOF>" : s2.getText(new S(e2.startToken.tokenIndex, e2.offendingToken.tokenIndex)) : "<unknown input>";
          const r2 = "no viable alternative at input " + this.escapeWSAndQuote(i2);
          t2.notifyErrorListeners(r2, e2.offendingToken, e2);
        }
        reportInputMismatch(t2, e2) {
          const n2 = "mismatched input " + this.getTokenErrorDisplay(e2.offendingToken) + " expecting " + e2.getExpectedTokens().toString(t2.literalNames, t2.symbolicNames);
          t2.notifyErrorListeners(n2, e2.offendingToken, e2);
        }
        reportFailedPredicate(t2, e2) {
          const n2 = "rule " + t2.ruleNames[t2._ctx.ruleIndex] + " " + e2.message;
          t2.notifyErrorListeners(n2, e2.offendingToken, e2);
        }
        reportUnwantedToken(t2) {
          if (this.inErrorRecoveryMode(t2))
            return;
          this.beginErrorCondition(t2);
          const e2 = t2.getCurrentToken(), n2 = "extraneous input " + this.getTokenErrorDisplay(e2) + " expecting " + this.getExpectedTokens(t2).toString(t2.literalNames, t2.symbolicNames);
          t2.notifyErrorListeners(n2, e2, null);
        }
        reportMissingToken(t2) {
          if (this.inErrorRecoveryMode(t2))
            return;
          this.beginErrorCondition(t2);
          const e2 = t2.getCurrentToken(), n2 = "missing " + this.getExpectedTokens(t2).toString(t2.literalNames, t2.symbolicNames) + " at " + this.getTokenErrorDisplay(e2);
          t2.notifyErrorListeners(n2, e2, null);
        }
        recoverInline(t2) {
          const e2 = this.singleTokenDeletion(t2);
          if (null !== e2)
            return t2.consume(), e2;
          if (this.singleTokenInsertion(t2))
            return this.getMissingSymbol(t2);
          throw new pe(t2);
        }
        singleTokenInsertion(t2) {
          const e2 = t2.getTokenStream().LA(1), n2 = t2._interp.atn, s2 = n2.states[t2.state].transitions[0].target;
          return !!n2.nextTokens(s2, t2._ctx).contains(e2) && (this.reportMissingToken(t2), true);
        }
        singleTokenDeletion(t2) {
          const e2 = t2.getTokenStream().LA(2);
          if (this.getExpectedTokens(t2).contains(e2)) {
            this.reportUnwantedToken(t2), t2.consume();
            const e3 = t2.getCurrentToken();
            return this.reportMatch(t2), e3;
          }
          return null;
        }
        getMissingSymbol(t2) {
          const e2 = t2.getCurrentToken(), s2 = this.getExpectedTokens(t2).first();
          let i2;
          i2 = s2 === n.EOF ? "<missing EOF>" : "<missing " + t2.literalNames[s2] + ">";
          let r2 = e2;
          const o2 = t2.getTokenStream().LT(-1);
          return r2.type === n.EOF && null !== o2 && (r2 = o2), t2.getTokenFactory().create(r2.source, s2, i2, n.DEFAULT_CHANNEL, -1, -1, r2.line, r2.column);
        }
        getExpectedTokens(t2) {
          return t2.getExpectedTokens();
        }
        getTokenErrorDisplay(t2) {
          if (null === t2)
            return "<no token>";
          let e2 = t2.text;
          return null === e2 && (e2 = t2.type === n.EOF ? "<EOF>" : "<" + t2.type + ">"), this.escapeWSAndQuote(e2);
        }
        escapeWSAndQuote(t2) {
          return "'" + (t2 = (t2 = (t2 = t2.replace(/\n/g, "\\n")).replace(/\r/g, "\\r")).replace(/\t/g, "\\t")) + "'";
        }
        getErrorRecoverySet(t2) {
          const e2 = t2._interp.atn;
          let s2 = t2._ctx;
          const i2 = new m();
          for (; null !== s2 && s2.invokingState >= 0; ) {
            const t3 = e2.states[s2.invokingState].transitions[0], n2 = e2.nextTokens(t3.followState);
            i2.addSet(n2), s2 = s2.parentCtx;
          }
          return i2.removeOne(n.EPSILON), i2;
        }
        consumeUntil(t2, e2) {
          let s2 = t2.getTokenStream().LA(1);
          for (; s2 !== n.EOF && !e2.contains(s2); )
            t2.consume(), s2 = t2.getTokenStream().LA(1);
        }
      }
      class _e extends Ee {
        constructor() {
          super();
        }
        recover(t2, e2) {
          let n2 = t2._ctx;
          for (; null !== n2; )
            n2.exception = e2, n2 = n2.parentCtx;
          throw new Se(e2);
        }
        recoverInline(t2) {
          this.recover(t2, new pe(t2));
        }
        sync(t2) {
        }
      }
      const Ce = { RecognitionException: bt, NoViableAltException: Zt, LexerNoViableAltException: Dt, InputMismatchException: pe, FailedPredicateException: fe, DiagnosticErrorListener: Te, BailErrorStrategy: _e, DefaultErrorStrategy: Ee, ErrorListener: yt };
      class Ae {
        constructor(t2, e2) {
          if (this.name = "<empty>", this.strdata = t2, this.decodeToUnicodeCodePoints = e2 || false, this._index = 0, this.data = [], this.decodeToUnicodeCodePoints)
            for (let t3 = 0; t3 < this.strdata.length; ) {
              const e3 = this.strdata.codePointAt(t3);
              this.data.push(e3), t3 += e3 <= 65535 ? 1 : 2;
            }
          else {
            this.data = new Array(this.strdata.length);
            for (let t3 = 0; t3 < this.strdata.length; t3++)
              this.data[t3] = this.strdata.charCodeAt(t3);
          }
          this._size = this.data.length;
        }
        reset() {
          this._index = 0;
        }
        consume() {
          if (this._index >= this._size)
            throw "cannot consume EOF";
          this._index += 1;
        }
        LA(t2) {
          if (0 === t2)
            return 0;
          t2 < 0 && (t2 += 1);
          const e2 = this._index + t2 - 1;
          return e2 < 0 || e2 >= this._size ? n.EOF : this.data[e2];
        }
        LT(t2) {
          return this.LA(t2);
        }
        mark() {
          return -1;
        }
        release(t2) {
        }
        seek(t2) {
          t2 <= this._index ? this._index = t2 : this._index = Math.min(t2, this._size);
        }
        getText(t2, e2) {
          if (e2 >= this._size && (e2 = this._size - 1), t2 >= this._size)
            return "";
          if (this.decodeToUnicodeCodePoints) {
            let n2 = "";
            for (let s2 = t2; s2 <= e2; s2++)
              n2 += String.fromCodePoint(this.data[s2]);
            return n2;
          }
          return this.strdata.slice(t2, e2 + 1);
        }
        toString() {
          return this.strdata;
        }
        get index() {
          return this._index;
        }
        get size() {
          return this._size;
        }
      }
      class Ne extends Ae {
        constructor(t2, e2) {
          super(t2, e2);
        }
      }
      const ke = require("fs"), Ie = "undefined" != typeof process && null != process.versions && null != process.versions.node;
      class ye extends Ne {
        static fromPath(t2, e2, n2) {
          if (!Ie)
            throw new Error("FileStream is only available when running in Node!");
          ke.readFile(t2, e2, function(t3, e3) {
            let s2 = null;
            null !== e3 && (s2 = new Ae(e3, true)), n2(t3, s2);
          });
        }
        constructor(t2, e2, n2) {
          if (!Ie)
            throw new Error("FileStream is only available when running in Node!");
          super(ke.readFileSync(t2, e2 || "utf-8"), n2), this.fileName = t2;
        }
      }
      const Le = { fromString: function(t2) {
        return new Ae(t2, true);
      }, fromBlob: function(t2, e2, n2, s2) {
        const i2 = new window.FileReader();
        i2.onload = function(t3) {
          const e3 = new Ae(t3.target.result, true);
          n2(e3);
        }, i2.onerror = s2, i2.readAsText(t2, e2);
      }, fromBuffer: function(t2, e2) {
        return new Ae(t2.toString(e2), true);
      }, fromPath: function(t2, e2, n2) {
        ye.fromPath(t2, e2, n2);
      }, fromPathSync: function(t2, e2) {
        return new ye(t2, e2);
      } }, Oe = { arrayToString: c, stringToCharArray: function(t2) {
        let e2 = new Uint16Array(t2.length);
        for (let n2 = 0; n2 < t2.length; n2++)
          e2[n2] = t2.charCodeAt(n2);
        return e2;
      } };
      class Re {
      }
      class ve extends Re {
        constructor(t2) {
          super(), this.tokenSource = t2, this.tokens = [], this.index = -1, this.fetchedEOF = false;
        }
        mark() {
          return 0;
        }
        release(t2) {
        }
        reset() {
          this.seek(0);
        }
        seek(t2) {
          this.lazyInit(), this.index = this.adjustSeekIndex(t2);
        }
        get size() {
          return this.tokens.length;
        }
        get(t2) {
          return this.lazyInit(), this.tokens[t2];
        }
        consume() {
          let t2 = false;
          if (t2 = this.index >= 0 && (this.fetchedEOF ? this.index < this.tokens.length - 1 : this.index < this.tokens.length), !t2 && this.LA(1) === n.EOF)
            throw "cannot consume EOF";
          this.sync(this.index + 1) && (this.index = this.adjustSeekIndex(this.index + 1));
        }
        sync(t2) {
          const e2 = t2 - this.tokens.length + 1;
          return !(e2 > 0) || this.fetch(e2) >= e2;
        }
        fetch(t2) {
          if (this.fetchedEOF)
            return 0;
          for (let e2 = 0; e2 < t2; e2++) {
            const t3 = this.tokenSource.nextToken();
            if (t3.tokenIndex = this.tokens.length, this.tokens.push(t3), t3.type === n.EOF)
              return this.fetchedEOF = true, e2 + 1;
          }
          return t2;
        }
        getTokens(t2, e2, s2) {
          if (void 0 === s2 && (s2 = null), t2 < 0 || e2 < 0)
            return null;
          this.lazyInit();
          const i2 = [];
          e2 >= this.tokens.length && (e2 = this.tokens.length - 1);
          for (let r2 = t2; r2 < e2; r2++) {
            const t3 = this.tokens[r2];
            if (t3.type === n.EOF)
              break;
            (null === s2 || s2.contains(t3.type)) && i2.push(t3);
          }
          return i2;
        }
        LA(t2) {
          return this.LT(t2).type;
        }
        LB(t2) {
          return this.index - t2 < 0 ? null : this.tokens[this.index - t2];
        }
        LT(t2) {
          if (this.lazyInit(), 0 === t2)
            return null;
          if (t2 < 0)
            return this.LB(-t2);
          const e2 = this.index + t2 - 1;
          return this.sync(e2), e2 >= this.tokens.length ? this.tokens[this.tokens.length - 1] : this.tokens[e2];
        }
        adjustSeekIndex(t2) {
          return t2;
        }
        lazyInit() {
          -1 === this.index && this.setup();
        }
        setup() {
          this.sync(0), this.index = this.adjustSeekIndex(0);
        }
        setTokenSource(t2) {
          this.tokenSource = t2, this.tokens = [], this.index = -1, this.fetchedEOF = false;
        }
        nextTokenOnChannel(t2, e2) {
          if (this.sync(t2), t2 >= this.tokens.length)
            return -1;
          let s2 = this.tokens[t2];
          for (; s2.channel !== e2; ) {
            if (s2.type === n.EOF)
              return -1;
            t2 += 1, this.sync(t2), s2 = this.tokens[t2];
          }
          return t2;
        }
        previousTokenOnChannel(t2, e2) {
          for (; t2 >= 0 && this.tokens[t2].channel !== e2; )
            t2 -= 1;
          return t2;
        }
        getHiddenTokensToRight(t2, e2) {
          if (void 0 === e2 && (e2 = -1), this.lazyInit(), t2 < 0 || t2 >= this.tokens.length)
            throw t2 + " not in 0.." + this.tokens.length - 1;
          const n2 = this.nextTokenOnChannel(t2 + 1, Ft.DEFAULT_TOKEN_CHANNEL), s2 = t2 + 1, i2 = -1 === n2 ? this.tokens.length - 1 : n2;
          return this.filterForChannel(s2, i2, e2);
        }
        getHiddenTokensToLeft(t2, e2) {
          if (void 0 === e2 && (e2 = -1), this.lazyInit(), t2 < 0 || t2 >= this.tokens.length)
            throw t2 + " not in 0.." + this.tokens.length - 1;
          const n2 = this.previousTokenOnChannel(t2 - 1, Ft.DEFAULT_TOKEN_CHANNEL);
          if (n2 === t2 - 1)
            return null;
          const s2 = n2 + 1, i2 = t2 - 1;
          return this.filterForChannel(s2, i2, e2);
        }
        filterForChannel(t2, e2, n2) {
          const s2 = [];
          for (let i2 = t2; i2 < e2 + 1; i2++) {
            const t3 = this.tokens[i2];
            -1 === n2 ? t3.channel !== Ft.DEFAULT_TOKEN_CHANNEL && s2.push(t3) : t3.channel === n2 && s2.push(t3);
          }
          return 0 === s2.length ? null : s2;
        }
        getSourceName() {
          return this.tokenSource.getSourceName();
        }
        getText(t2) {
          this.lazyInit(), this.fill(), t2 || (t2 = new S(0, this.tokens.length - 1));
          let e2 = t2.start;
          e2 instanceof n && (e2 = e2.tokenIndex);
          let s2 = t2.stop;
          if (s2 instanceof n && (s2 = s2.tokenIndex), null === e2 || null === s2 || e2 < 0 || s2 < 0)
            return "";
          s2 >= this.tokens.length && (s2 = this.tokens.length - 1);
          let i2 = "";
          for (let t3 = e2; t3 < s2 + 1; t3++) {
            const e3 = this.tokens[t3];
            if (e3.type === n.EOF)
              break;
            i2 += e3.text;
          }
          return i2;
        }
        fill() {
          for (this.lazyInit(); 1e3 === this.fetch(1e3); )
            ;
        }
      }
      Object.defineProperty(ve, "size", { get: function() {
        return this.tokens.length;
      } });
      class we extends ve {
        constructor(t2, e2) {
          super(t2), this.channel = void 0 === e2 ? n.DEFAULT_CHANNEL : e2;
        }
        adjustSeekIndex(t2) {
          return this.nextTokenOnChannel(t2, this.channel);
        }
        LB(t2) {
          if (0 === t2 || this.index - t2 < 0)
            return null;
          let e2 = this.index, n2 = 1;
          for (; n2 <= t2; )
            e2 = this.previousTokenOnChannel(e2 - 1, this.channel), n2 += 1;
          return e2 < 0 ? null : this.tokens[e2];
        }
        LT(t2) {
          if (this.lazyInit(), 0 === t2)
            return null;
          if (t2 < 0)
            return this.LB(-t2);
          let e2 = this.index, n2 = 1;
          for (; n2 < t2; )
            this.sync(e2 + 1) && (e2 = this.nextTokenOnChannel(e2 + 1, this.channel)), n2 += 1;
          return this.tokens[e2];
        }
        getNumberOfOnChannelTokens() {
          let t2 = 0;
          this.fill();
          for (let e2 = 0; e2 < this.tokens.length; e2++) {
            const s2 = this.tokens[e2];
            if (s2.channel === this.channel && (t2 += 1), s2.type === n.EOF)
              break;
          }
          return t2;
        }
      }
      class Pe extends ce {
        constructor(t2) {
          super(), this.parser = t2;
        }
        enterEveryRule(t2) {
          console.log("enter   " + this.parser.ruleNames[t2.ruleIndex] + ", LT(1)=" + this.parser._input.LT(1).text);
        }
        visitTerminal(t2) {
          console.log("consume " + t2.symbol + " rule " + this.parser.ruleNames[this.parser._ctx.ruleIndex]);
        }
        exitEveryRule(t2) {
          console.log("exit    " + this.parser.ruleNames[t2.ruleIndex] + ", LT(1)=" + this.parser._input.LT(1).text);
        }
      }
      class be extends Rt {
        constructor(t2) {
          super(), this._input = null, this._errHandler = new Ee(), this._precedenceStack = [], this._precedenceStack.push(0), this._ctx = null, this.buildParseTrees = true, this._tracer = null, this._parseListeners = null, this._syntaxErrors = 0, this.setInputStream(t2);
        }
        reset() {
          null !== this._input && this._input.seek(0), this._errHandler.reset(this), this._ctx = null, this._syntaxErrors = 0, this.setTrace(false), this._precedenceStack = [], this._precedenceStack.push(0), null !== this._interp && this._interp.reset();
        }
        match(t2) {
          let e2 = this.getCurrentToken();
          return e2.type === t2 ? (this._errHandler.reportMatch(this), this.consume()) : (e2 = this._errHandler.recoverInline(this), this.buildParseTrees && -1 === e2.tokenIndex && this._ctx.addErrorNode(e2)), e2;
        }
        matchWildcard() {
          let t2 = this.getCurrentToken();
          return t2.type > 0 ? (this._errHandler.reportMatch(this), this.consume()) : (t2 = this._errHandler.recoverInline(this), this.buildParseTrees && -1 === t2.tokenIndex && this._ctx.addErrorNode(t2)), t2;
        }
        getParseListeners() {
          return this._parseListeners || [];
        }
        addParseListener(t2) {
          if (null === t2)
            throw "listener";
          null === this._parseListeners && (this._parseListeners = []), this._parseListeners.push(t2);
        }
        removeParseListener(t2) {
          if (null !== this._parseListeners) {
            const e2 = this._parseListeners.indexOf(t2);
            e2 >= 0 && this._parseListeners.splice(e2, 1), 0 === this._parseListeners.length && (this._parseListeners = null);
          }
        }
        removeParseListeners() {
          this._parseListeners = null;
        }
        triggerEnterRuleEvent() {
          if (null !== this._parseListeners) {
            const t2 = this._ctx;
            this._parseListeners.forEach(function(e2) {
              e2.enterEveryRule(t2), t2.enterRule(e2);
            });
          }
        }
        triggerExitRuleEvent() {
          if (null !== this._parseListeners) {
            const t2 = this._ctx;
            this._parseListeners.slice(0).reverse().forEach(function(e2) {
              t2.exitRule(e2), e2.exitEveryRule(t2);
            });
          }
        }
        getTokenFactory() {
          return this._input.tokenSource._factory;
        }
        setTokenFactory(t2) {
          this._input.tokenSource._factory = t2;
        }
        getATNWithBypassAlts() {
          const t2 = this.getSerializedATN();
          if (null === t2)
            throw "The current parser does not support an ATN with bypass alternatives.";
          let e2 = this.bypassAltsAtnCache[t2];
          if (null === e2) {
            const n2 = new ft();
            n2.generateRuleBypassTransitions = true, e2 = new It(n2).deserialize(t2), this.bypassAltsAtnCache[t2] = e2;
          }
          return e2;
        }
        getInputStream() {
          return this.getTokenStream();
        }
        setInputStream(t2) {
          this.setTokenStream(t2);
        }
        getTokenStream() {
          return this._input;
        }
        setTokenStream(t2) {
          this._input = null, this.reset(), this._input = t2;
        }
        get syntaxErrorsCount() {
          return this._syntaxErrors;
        }
        getCurrentToken() {
          return this._input.LT(1);
        }
        notifyErrorListeners(t2, e2, n2) {
          n2 = n2 || null, null === (e2 = e2 || null) && (e2 = this.getCurrentToken()), this._syntaxErrors += 1;
          const s2 = e2.line, i2 = e2.column;
          this.getErrorListener().syntaxError(this, e2, s2, i2, t2, n2);
        }
        consume() {
          const t2 = this.getCurrentToken();
          t2.type !== n.EOF && this.getInputStream().consume();
          const e2 = null !== this._parseListeners && this._parseListeners.length > 0;
          if (this.buildParseTrees || e2) {
            let n2;
            n2 = this._errHandler.inErrorRecoveryMode(this) ? this._ctx.addErrorNode(t2) : this._ctx.addTokenNode(t2), n2.invokingState = this.state, e2 && this._parseListeners.forEach(function(t3) {
              n2 instanceof P || void 0 !== n2.isErrorNode && n2.isErrorNode() ? t3.visitErrorNode(n2) : n2 instanceof w && t3.visitTerminal(n2);
            });
          }
          return t2;
        }
        addContextToParseTree() {
          null !== this._ctx.parentCtx && this._ctx.parentCtx.addChild(this._ctx);
        }
        enterRule(t2, e2, n2) {
          this.state = e2, this._ctx = t2, this._ctx.start = this._input.LT(1), this.buildParseTrees && this.addContextToParseTree(), this.triggerEnterRuleEvent();
        }
        exitRule() {
          this._ctx.stop = this._input.LT(-1), this.triggerExitRuleEvent(), this.state = this._ctx.invokingState, this._ctx = this._ctx.parentCtx;
        }
        enterOuterAlt(t2, e2) {
          t2.setAltNumber(e2), this.buildParseTrees && this._ctx !== t2 && null !== this._ctx.parentCtx && (this._ctx.parentCtx.removeLastChild(), this._ctx.parentCtx.addChild(t2)), this._ctx = t2;
        }
        getPrecedence() {
          return 0 === this._precedenceStack.length ? -1 : this._precedenceStack[this._precedenceStack.length - 1];
        }
        enterRecursionRule(t2, e2, n2, s2) {
          this.state = e2, this._precedenceStack.push(s2), this._ctx = t2, this._ctx.start = this._input.LT(1), this.triggerEnterRuleEvent();
        }
        pushNewRecursionContext(t2, e2, n2) {
          const s2 = this._ctx;
          s2.parentCtx = t2, s2.invokingState = e2, s2.stop = this._input.LT(-1), this._ctx = t2, this._ctx.start = s2.start, this.buildParseTrees && this._ctx.addChild(s2), this.triggerEnterRuleEvent();
        }
        unrollRecursionContexts(t2) {
          this._precedenceStack.pop(), this._ctx.stop = this._input.LT(-1);
          const e2 = this._ctx, n2 = this.getParseListeners();
          if (null !== n2 && n2.length > 0)
            for (; this._ctx !== t2; )
              this.triggerExitRuleEvent(), this._ctx = this._ctx.parentCtx;
          else
            this._ctx = t2;
          e2.parentCtx = t2, this.buildParseTrees && null !== t2 && t2.addChild(e2);
        }
        getInvokingContext(t2) {
          let e2 = this._ctx;
          for (; null !== e2; ) {
            if (e2.ruleIndex === t2)
              return e2;
            e2 = e2.parentCtx;
          }
          return null;
        }
        precpred(t2, e2) {
          return e2 >= this._precedenceStack[this._precedenceStack.length - 1];
        }
        inContext(t2) {
          return false;
        }
        isExpectedToken(t2) {
          const e2 = this._interp.atn;
          let s2 = this._ctx;
          const i2 = e2.states[this.state];
          let r2 = e2.nextTokens(i2);
          if (r2.contains(t2))
            return true;
          if (!r2.contains(n.EPSILON))
            return false;
          for (; null !== s2 && s2.invokingState >= 0 && r2.contains(n.EPSILON); ) {
            const n2 = e2.states[s2.invokingState].transitions[0];
            if (r2 = e2.nextTokens(n2.followState), r2.contains(t2))
              return true;
            s2 = s2.parentCtx;
          }
          return !(!r2.contains(n.EPSILON) || t2 !== n.EOF);
        }
        getExpectedTokens() {
          return this._interp.atn.getExpectedTokens(this.state, this._ctx);
        }
        getExpectedTokensWithinCurrentRule() {
          const t2 = this._interp.atn, e2 = t2.states[this.state];
          return t2.nextTokens(e2);
        }
        getRuleIndex(t2) {
          const e2 = this.getRuleIndexMap()[t2];
          return null !== e2 ? e2 : -1;
        }
        getRuleInvocationStack(t2) {
          null === (t2 = t2 || null) && (t2 = this._ctx);
          const e2 = [];
          for (; null !== t2; ) {
            const n2 = t2.ruleIndex;
            n2 < 0 ? e2.push("n/a") : e2.push(this.ruleNames[n2]), t2 = t2.parentCtx;
          }
          return e2;
        }
        getDFAStrings() {
          return this._interp.decisionToDFA.toString();
        }
        dumpDFA() {
          let t2 = false;
          for (let e2 = 0; e2 < this._interp.decisionToDFA.length; e2++) {
            const n2 = this._interp.decisionToDFA[e2];
            n2.states.length > 0 && (t2 && console.log(), this.printer.println("Decision " + n2.decision + ":"), this.printer.print(n2.toString(this.literalNames, this.symbolicNames)), t2 = true);
          }
        }
        getSourceName() {
          return this._input.getSourceName();
        }
        setTrace(t2) {
          t2 ? (null !== this._tracer && this.removeParseListener(this._tracer), this._tracer = new Pe(this), this.addParseListener(this._tracer)) : (this.removeParseListener(this._tracer), this._tracer = null);
        }
      }
      be.bypassAltsAtnCache = {};
      class De extends w {
        constructor(t2) {
          super(), this.parentCtx = null, this.symbol = t2;
        }
        getChild(t2) {
          return null;
        }
        getSymbol() {
          return this.symbol;
        }
        getParent() {
          return this.parentCtx;
        }
        getPayload() {
          return this.symbol;
        }
        getSourceInterval() {
          if (null === this.symbol)
            return S.INVALID_INTERVAL;
          const t2 = this.symbol.tokenIndex;
          return new S(t2, t2);
        }
        getChildCount() {
          return 0;
        }
        accept(t2) {
          return t2.visitTerminal(this);
        }
        getText() {
          return this.symbol.text;
        }
        toString() {
          return this.symbol.type === n.EOF ? "<EOF>" : this.symbol.text;
        }
      }
      class Fe extends De {
        constructor(t2) {
          super(t2);
        }
        isErrorNode() {
          return true;
        }
        accept(t2) {
          return t2.visitErrorNode(this);
        }
      }
      class Me extends F {
        constructor(t2, e2) {
          super(t2, e2), this.children = null, this.start = null, this.stop = null, this.exception = null;
        }
        copyFrom(t2) {
          this.parentCtx = t2.parentCtx, this.invokingState = t2.invokingState, this.children = null, this.start = t2.start, this.stop = t2.stop, t2.children && (this.children = [], t2.children.map(function(t3) {
            t3 instanceof Fe && (this.children.push(t3), t3.parentCtx = this);
          }, this));
        }
        enterRule(t2) {
        }
        exitRule(t2) {
        }
        addChild(t2) {
          return null === this.children && (this.children = []), this.children.push(t2), t2;
        }
        removeLastChild() {
          null !== this.children && this.children.pop();
        }
        addTokenNode(t2) {
          const e2 = new De(t2);
          return this.addChild(e2), e2.parentCtx = this, e2;
        }
        addErrorNode(t2) {
          const e2 = new Fe(t2);
          return this.addChild(e2), e2.parentCtx = this, e2;
        }
        getChild(t2, e2) {
          if (e2 = e2 || null, null === this.children || t2 < 0 || t2 >= this.children.length)
            return null;
          if (null === e2)
            return this.children[t2];
          for (let n2 = 0; n2 < this.children.length; n2++) {
            const s2 = this.children[n2];
            if (s2 instanceof e2) {
              if (0 === t2)
                return s2;
              t2 -= 1;
            }
          }
          return null;
        }
        getToken(t2, e2) {
          if (null === this.children || e2 < 0 || e2 >= this.children.length)
            return null;
          for (let n2 = 0; n2 < this.children.length; n2++) {
            const s2 = this.children[n2];
            if (s2 instanceof w && s2.symbol.type === t2) {
              if (0 === e2)
                return s2;
              e2 -= 1;
            }
          }
          return null;
        }
        getTokens(t2) {
          if (null === this.children)
            return [];
          {
            const e2 = [];
            for (let n2 = 0; n2 < this.children.length; n2++) {
              const s2 = this.children[n2];
              s2 instanceof w && s2.symbol.type === t2 && e2.push(s2);
            }
            return e2;
          }
        }
        getTypedRuleContext(t2, e2) {
          return this.getChild(e2, t2);
        }
        getTypedRuleContexts(t2) {
          if (null === this.children)
            return [];
          {
            const e2 = [];
            for (let n2 = 0; n2 < this.children.length; n2++) {
              const s2 = this.children[n2];
              s2 instanceof t2 && e2.push(s2);
            }
            return e2;
          }
        }
        getChildCount() {
          return null === this.children ? 0 : this.children.length;
        }
        getSourceInterval() {
          return null === this.start || null === this.stop ? S.INVALID_INTERVAL : new S(this.start.tokenIndex, this.stop.tokenIndex);
        }
      }
      F.EMPTY = new Me();
      class Ue {
        static DEFAULT_PROGRAM_NAME = "default";
        constructor(t2) {
          this.tokens = t2, this.programs = /* @__PURE__ */ new Map();
        }
        getTokenStream() {
          return this.tokens;
        }
        insertAfter(t2, e2) {
          let n2, s2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : Ue.DEFAULT_PROGRAM_NAME;
          n2 = "number" == typeof t2 ? t2 : t2.tokenIndex;
          let i2 = this.getProgram(s2), r2 = new ze(this.tokens, n2, i2.length, e2);
          i2.push(r2);
        }
        insertBefore(t2, e2) {
          let n2, s2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : Ue.DEFAULT_PROGRAM_NAME;
          n2 = "number" == typeof t2 ? t2 : t2.tokenIndex;
          const i2 = this.getProgram(s2), r2 = new Ve(this.tokens, n2, i2.length, e2);
          i2.push(r2);
        }
        replaceSingle(t2, e2) {
          let n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : Ue.DEFAULT_PROGRAM_NAME;
          this.replace(t2, t2, e2, n2);
        }
        replace(t2, e2, n2) {
          let s2 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : Ue.DEFAULT_PROGRAM_NAME;
          if ("number" != typeof t2 && (t2 = t2.tokenIndex), "number" != typeof e2 && (e2 = e2.tokenIndex), t2 > e2 || t2 < 0 || e2 < 0 || e2 >= this.tokens.size)
            throw new RangeError(`replace: range invalid: ${t2}..${e2}(size=${this.tokens.size})`);
          let i2 = this.getProgram(s2), r2 = new qe(this.tokens, t2, e2, i2.length, n2);
          i2.push(r2);
        }
        delete(t2, e2) {
          let n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : Ue.DEFAULT_PROGRAM_NAME;
          void 0 === e2 && (e2 = t2), this.replace(t2, e2, null, n2);
        }
        getProgram(t2) {
          let e2 = this.programs.get(t2);
          return null == e2 && (e2 = this.initializeProgram(t2)), e2;
        }
        initializeProgram(t2) {
          const e2 = [];
          return this.programs.set(t2, e2), e2;
        }
        getText(t2) {
          let e2, s2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : Ue.DEFAULT_PROGRAM_NAME;
          e2 = t2 instanceof S ? t2 : new S(0, this.tokens.size - 1), "string" == typeof t2 && (s2 = t2);
          const i2 = this.programs.get(s2);
          let r2 = e2.start, o2 = e2.stop;
          if (o2 > this.tokens.size - 1 && (o2 = this.tokens.size - 1), r2 < 0 && (r2 = 0), null == i2 || 0 === i2.length)
            return this.tokens.getText(new S(r2, o2));
          let l2 = [], a2 = this.reduceToSingleOperationPerIndex(i2), h2 = r2;
          for (; h2 <= o2 && h2 < this.tokens.size; ) {
            let t3 = a2.get(h2);
            a2.delete(h2);
            let e3 = this.tokens.get(h2);
            null == t3 ? (e3.type !== n.EOF && l2.push(String(e3.text)), h2++) : h2 = t3.execute(l2);
          }
          if (o2 === this.tokens.size - 1)
            for (const t3 of a2.values())
              t3.index >= this.tokens.size - 1 && l2.push(t3.text.toString());
          return l2.join("");
        }
        reduceToSingleOperationPerIndex(t2) {
          for (let e3 = 0; e3 < t2.length; e3++) {
            let n2 = t2[e3];
            if (null == n2)
              continue;
            if (!(n2 instanceof qe))
              continue;
            let s2 = n2, i2 = this.getKindOfOps(t2, Ve, e3);
            for (let e4 of i2)
              e4.index === s2.index ? (t2[e4.instructionIndex] = void 0, s2.text = e4.text.toString() + (null != s2.text ? s2.text.toString() : "")) : e4.index > s2.index && e4.index <= s2.lastIndex && (t2[e4.instructionIndex] = void 0);
            let r2 = this.getKindOfOps(t2, qe, e3);
            for (let e4 of r2) {
              if (e4.index >= s2.index && e4.lastIndex <= s2.lastIndex) {
                t2[e4.instructionIndex] = void 0;
                continue;
              }
              let n3 = e4.lastIndex < s2.index || e4.index > s2.lastIndex;
              if (null != e4.text || null != s2.text || n3) {
                if (!n3)
                  throw new Error(`replace op boundaries of ${s2} overlap with previous ${e4}`);
              } else
                t2[e4.instructionIndex] = void 0, s2.index = Math.min(e4.index, s2.index), s2.lastIndex = Math.max(e4.lastIndex, s2.lastIndex);
            }
          }
          for (let e3 = 0; e3 < t2.length; e3++) {
            let n2 = t2[e3];
            if (null == n2)
              continue;
            if (!(n2 instanceof Ve))
              continue;
            let s2 = n2, i2 = this.getKindOfOps(t2, Ve, e3);
            for (let e4 of i2)
              e4.index === s2.index && (e4 instanceof ze ? (s2.text = this.catOpText(e4.text, s2.text), t2[e4.instructionIndex] = void 0) : e4 instanceof Ve && (s2.text = this.catOpText(s2.text, e4.text), t2[e4.instructionIndex] = void 0));
            let r2 = this.getKindOfOps(t2, qe, e3);
            for (let n3 of r2)
              if (s2.index !== n3.index) {
                if (s2.index >= n3.index && s2.index <= n3.lastIndex)
                  throw new Error(`insert op ${s2} within boundaries of previous ${n3}`);
              } else
                n3.text = this.catOpText(s2.text, n3.text), t2[e3] = void 0;
          }
          let e2 = /* @__PURE__ */ new Map();
          for (let n2 of t2)
            if (null != n2) {
              if (null != e2.get(n2.index))
                throw new Error("should only be one op per index");
              e2.set(n2.index, n2);
            }
          return e2;
        }
        catOpText(t2, e2) {
          let n2 = "", s2 = "";
          return null != t2 && (n2 = t2.toString()), null != e2 && (s2 = e2.toString()), n2 + s2;
        }
        getKindOfOps(t2, e2, n2) {
          return t2.slice(0, n2).filter((t3) => t3 && t3 instanceof e2);
        }
      }
      class Be {
        constructor(t2, e2, n2, s2) {
          this.tokens = t2, this.instructionIndex = n2, this.index = e2, this.text = void 0 === s2 ? "" : s2;
        }
        toString() {
          let t2 = this.constructor.name;
          const e2 = t2.indexOf("$");
          return t2 = t2.substring(e2 + 1, t2.length), "<" + t2 + "@" + this.tokens.get(this.index) + ':"' + this.text + '">';
        }
      }
      class Ve extends Be {
        constructor(t2, e2, n2, s2) {
          super(t2, e2, n2, s2);
        }
        execute(t2) {
          return this.text && t2.push(this.text.toString()), this.tokens.get(this.index).type !== n.EOF && t2.push(String(this.tokens.get(this.index).text)), this.index + 1;
        }
      }
      class ze extends Ve {
        constructor(t2, e2, n2, s2) {
          super(t2, e2 + 1, n2, s2);
        }
      }
      class qe extends Be {
        constructor(t2, e2, n2, s2, i2) {
          super(t2, e2, s2, i2), this.lastIndex = n2;
        }
        execute(t2) {
          return this.text && t2.push(this.text.toString()), this.lastIndex + 1;
        }
        toString() {
          return null == this.text ? "<DeleteOp@" + this.tokens.get(this.index) + ".." + this.tokens.get(this.lastIndex) + ">" : "<ReplaceOp@" + this.tokens.get(this.index) + ".." + this.tokens.get(this.lastIndex) + ':"' + this.text + '">';
        }
      }
      const He = { atn: se, dfa: le, context: ae, misc: he, tree: ge, error: Ce, Token: n, CommonToken: vt, CharStreams: Le, CharStream: Ae, InputStream: Ne, FileStream: ye, CommonTokenStream: we, Lexer: Ft, Parser: be, ParserRuleContext: Me, Interval: S, IntervalSet: m, LL1Analyzer: G, Utils: Oe, TokenStreamRewriter: Ue };
      var Ke = exports2;
      for (var Ye in e)
        Ke[Ye] = e[Ye];
      e.__esModule && Object.defineProperty(Ke, "__esModule", { value: true });
    })();
  }
});

// server/lib/PangLexer.js
var require_PangLexer = __commonJS({
  "server/lib/PangLexer.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _antlr = _interopRequireDefault(require_antlr4_node());
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    var serializedATN = [4, 0, 38, 221, 6, -1, 2, 0, 7, 0, 2, 1, 7, 1, 2, 2, 7, 2, 2, 3, 7, 3, 2, 4, 7, 4, 2, 5, 7, 5, 2, 6, 7, 6, 2, 7, 7, 7, 2, 8, 7, 8, 2, 9, 7, 9, 2, 10, 7, 10, 2, 11, 7, 11, 2, 12, 7, 12, 2, 13, 7, 13, 2, 14, 7, 14, 2, 15, 7, 15, 2, 16, 7, 16, 2, 17, 7, 17, 2, 18, 7, 18, 2, 19, 7, 19, 2, 20, 7, 20, 2, 21, 7, 21, 2, 22, 7, 22, 2, 23, 7, 23, 2, 24, 7, 24, 2, 25, 7, 25, 2, 26, 7, 26, 2, 27, 7, 27, 2, 28, 7, 28, 2, 29, 7, 29, 2, 30, 7, 30, 2, 31, 7, 31, 2, 32, 7, 32, 2, 33, 7, 33, 2, 34, 7, 34, 2, 35, 7, 35, 2, 36, 7, 36, 2, 37, 7, 37, 2, 38, 7, 38, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 3, 1, 3, 1, 4, 1, 4, 1, 5, 1, 5, 1, 6, 1, 6, 1, 7, 1, 7, 1, 8, 1, 8, 1, 8, 1, 8, 1, 8, 1, 8, 1, 9, 1, 9, 1, 9, 1, 9, 1, 10, 1, 10, 1, 10, 1, 10, 1, 10, 1, 10, 1, 11, 1, 11, 1, 12, 1, 12, 1, 12, 1, 13, 1, 13, 1, 13, 1, 13, 1, 13, 1, 14, 1, 14, 1, 15, 1, 15, 1, 16, 1, 16, 1, 17, 1, 17, 1, 18, 1, 18, 1, 19, 1, 19, 1, 19, 1, 20, 1, 20, 1, 21, 1, 21, 1, 21, 1, 22, 1, 22, 1, 22, 1, 23, 1, 23, 1, 23, 1, 24, 1, 24, 1, 24, 1, 24, 1, 25, 1, 25, 1, 25, 1, 25, 1, 26, 1, 26, 1, 26, 1, 27, 1, 27, 1, 27, 1, 28, 1, 28, 1, 29, 1, 29, 1, 30, 1, 30, 1, 30, 1, 30, 1, 30, 1, 31, 1, 31, 1, 31, 1, 31, 1, 31, 1, 31, 1, 32, 1, 32, 5, 32, 178, 8, 32, 10, 32, 12, 32, 181, 9, 32, 1, 33, 1, 33, 1, 33, 1, 34, 1, 34, 1, 34, 1, 35, 1, 35, 1, 35, 5, 35, 192, 8, 35, 10, 35, 12, 35, 195, 9, 35, 1, 35, 1, 35, 1, 36, 1, 36, 1, 36, 1, 37, 4, 37, 203, 8, 37, 11, 37, 12, 37, 204, 1, 37, 1, 37, 4, 37, 209, 8, 37, 11, 37, 12, 37, 210, 3, 37, 213, 8, 37, 1, 38, 4, 38, 216, 8, 38, 11, 38, 12, 38, 217, 1, 38, 1, 38, 0, 0, 39, 1, 1, 3, 2, 5, 3, 7, 4, 9, 5, 11, 6, 13, 7, 15, 8, 17, 9, 19, 10, 21, 11, 23, 12, 25, 13, 27, 14, 29, 15, 31, 16, 33, 17, 35, 18, 37, 19, 39, 20, 41, 21, 43, 22, 45, 23, 47, 24, 49, 25, 51, 26, 53, 27, 55, 28, 57, 29, 59, 30, 61, 31, 63, 32, 65, 33, 67, 34, 69, 35, 71, 36, 73, 0, 75, 37, 77, 38, 1, 0, 5, 3, 0, 65, 90, 95, 95, 97, 122, 4, 0, 48, 57, 65, 90, 95, 95, 97, 122, 2, 0, 34, 34, 92, 92, 1, 0, 48, 57, 3, 0, 9, 10, 13, 13, 32, 32, 226, 0, 1, 1, 0, 0, 0, 0, 3, 1, 0, 0, 0, 0, 5, 1, 0, 0, 0, 0, 7, 1, 0, 0, 0, 0, 9, 1, 0, 0, 0, 0, 11, 1, 0, 0, 0, 0, 13, 1, 0, 0, 0, 0, 15, 1, 0, 0, 0, 0, 17, 1, 0, 0, 0, 0, 19, 1, 0, 0, 0, 0, 21, 1, 0, 0, 0, 0, 23, 1, 0, 0, 0, 0, 25, 1, 0, 0, 0, 0, 27, 1, 0, 0, 0, 0, 29, 1, 0, 0, 0, 0, 31, 1, 0, 0, 0, 0, 33, 1, 0, 0, 0, 0, 35, 1, 0, 0, 0, 0, 37, 1, 0, 0, 0, 0, 39, 1, 0, 0, 0, 0, 41, 1, 0, 0, 0, 0, 43, 1, 0, 0, 0, 0, 45, 1, 0, 0, 0, 0, 47, 1, 0, 0, 0, 0, 49, 1, 0, 0, 0, 0, 51, 1, 0, 0, 0, 0, 53, 1, 0, 0, 0, 0, 55, 1, 0, 0, 0, 0, 57, 1, 0, 0, 0, 0, 59, 1, 0, 0, 0, 0, 61, 1, 0, 0, 0, 0, 63, 1, 0, 0, 0, 0, 65, 1, 0, 0, 0, 0, 67, 1, 0, 0, 0, 0, 69, 1, 0, 0, 0, 0, 71, 1, 0, 0, 0, 0, 75, 1, 0, 0, 0, 0, 77, 1, 0, 0, 0, 1, 79, 1, 0, 0, 0, 3, 81, 1, 0, 0, 0, 5, 84, 1, 0, 0, 0, 7, 86, 1, 0, 0, 0, 9, 88, 1, 0, 0, 0, 11, 90, 1, 0, 0, 0, 13, 92, 1, 0, 0, 0, 15, 94, 1, 0, 0, 0, 17, 96, 1, 0, 0, 0, 19, 102, 1, 0, 0, 0, 21, 106, 1, 0, 0, 0, 23, 112, 1, 0, 0, 0, 25, 114, 1, 0, 0, 0, 27, 117, 1, 0, 0, 0, 29, 122, 1, 0, 0, 0, 31, 124, 1, 0, 0, 0, 33, 126, 1, 0, 0, 0, 35, 128, 1, 0, 0, 0, 37, 130, 1, 0, 0, 0, 39, 132, 1, 0, 0, 0, 41, 135, 1, 0, 0, 0, 43, 137, 1, 0, 0, 0, 45, 140, 1, 0, 0, 0, 47, 143, 1, 0, 0, 0, 49, 146, 1, 0, 0, 0, 51, 150, 1, 0, 0, 0, 53, 154, 1, 0, 0, 0, 55, 157, 1, 0, 0, 0, 57, 160, 1, 0, 0, 0, 59, 162, 1, 0, 0, 0, 61, 164, 1, 0, 0, 0, 63, 169, 1, 0, 0, 0, 65, 175, 1, 0, 0, 0, 67, 182, 1, 0, 0, 0, 69, 185, 1, 0, 0, 0, 71, 188, 1, 0, 0, 0, 73, 198, 1, 0, 0, 0, 75, 202, 1, 0, 0, 0, 77, 215, 1, 0, 0, 0, 79, 80, 5, 59, 0, 0, 80, 2, 1, 0, 0, 0, 81, 82, 5, 111, 0, 0, 82, 83, 5, 110, 0, 0, 83, 4, 1, 0, 0, 0, 84, 85, 5, 40, 0, 0, 85, 6, 1, 0, 0, 0, 86, 87, 5, 44, 0, 0, 87, 8, 1, 0, 0, 0, 88, 89, 5, 41, 0, 0, 89, 10, 1, 0, 0, 0, 90, 91, 5, 42, 0, 0, 91, 12, 1, 0, 0, 0, 92, 93, 5, 123, 0, 0, 93, 14, 1, 0, 0, 0, 94, 95, 5, 125, 0, 0, 95, 16, 1, 0, 0, 0, 96, 97, 5, 112, 0, 0, 97, 98, 5, 114, 0, 0, 98, 99, 5, 105, 0, 0, 99, 100, 5, 110, 0, 0, 100, 101, 5, 116, 0, 0, 101, 18, 1, 0, 0, 0, 102, 103, 5, 108, 0, 0, 103, 104, 5, 101, 0, 0, 104, 105, 5, 116, 0, 0, 105, 20, 1, 0, 0, 0, 106, 107, 5, 99, 0, 0, 107, 108, 5, 111, 0, 0, 108, 109, 5, 110, 0, 0, 109, 110, 5, 115, 0, 0, 110, 111, 5, 116, 0, 0, 111, 22, 1, 0, 0, 0, 112, 113, 5, 61, 0, 0, 113, 24, 1, 0, 0, 0, 114, 115, 5, 105, 0, 0, 115, 116, 5, 102, 0, 0, 116, 26, 1, 0, 0, 0, 117, 118, 5, 101, 0, 0, 118, 119, 5, 108, 0, 0, 119, 120, 5, 115, 0, 0, 120, 121, 5, 101, 0, 0, 121, 28, 1, 0, 0, 0, 122, 123, 5, 33, 0, 0, 123, 30, 1, 0, 0, 0, 124, 125, 5, 47, 0, 0, 125, 32, 1, 0, 0, 0, 126, 127, 5, 43, 0, 0, 127, 34, 1, 0, 0, 0, 128, 129, 5, 45, 0, 0, 129, 36, 1, 0, 0, 0, 130, 131, 5, 60, 0, 0, 131, 38, 1, 0, 0, 0, 132, 133, 5, 60, 0, 0, 133, 134, 5, 61, 0, 0, 134, 40, 1, 0, 0, 0, 135, 136, 5, 62, 0, 0, 136, 42, 1, 0, 0, 0, 137, 138, 5, 62, 0, 0, 138, 139, 5, 61, 0, 0, 139, 44, 1, 0, 0, 0, 140, 141, 5, 61, 0, 0, 141, 142, 5, 61, 0, 0, 142, 46, 1, 0, 0, 0, 143, 144, 5, 33, 0, 0, 144, 145, 5, 61, 0, 0, 145, 48, 1, 0, 0, 0, 146, 147, 5, 61, 0, 0, 147, 148, 5, 61, 0, 0, 148, 149, 5, 61, 0, 0, 149, 50, 1, 0, 0, 0, 150, 151, 5, 33, 0, 0, 151, 152, 5, 61, 0, 0, 152, 153, 5, 61, 0, 0, 153, 52, 1, 0, 0, 0, 154, 155, 5, 38, 0, 0, 155, 156, 5, 38, 0, 0, 156, 54, 1, 0, 0, 0, 157, 158, 5, 124, 0, 0, 158, 159, 5, 124, 0, 0, 159, 56, 1, 0, 0, 0, 160, 161, 5, 63, 0, 0, 161, 58, 1, 0, 0, 0, 162, 163, 5, 58, 0, 0, 163, 60, 1, 0, 0, 0, 164, 165, 5, 116, 0, 0, 165, 166, 5, 114, 0, 0, 166, 167, 5, 117, 0, 0, 167, 168, 5, 101, 0, 0, 168, 62, 1, 0, 0, 0, 169, 170, 5, 102, 0, 0, 170, 171, 5, 97, 0, 0, 171, 172, 5, 108, 0, 0, 172, 173, 5, 115, 0, 0, 173, 174, 5, 101, 0, 0, 174, 64, 1, 0, 0, 0, 175, 179, 7, 0, 0, 0, 176, 178, 7, 1, 0, 0, 177, 176, 1, 0, 0, 0, 178, 181, 1, 0, 0, 0, 179, 177, 1, 0, 0, 0, 179, 180, 1, 0, 0, 0, 180, 66, 1, 0, 0, 0, 181, 179, 1, 0, 0, 0, 182, 183, 5, 42, 0, 0, 183, 184, 5, 42, 0, 0, 184, 68, 1, 0, 0, 0, 185, 186, 5, 46, 0, 0, 186, 187, 5, 46, 0, 0, 187, 70, 1, 0, 0, 0, 188, 193, 5, 34, 0, 0, 189, 192, 3, 73, 36, 0, 190, 192, 8, 2, 0, 0, 191, 189, 1, 0, 0, 0, 191, 190, 1, 0, 0, 0, 192, 195, 1, 0, 0, 0, 193, 191, 1, 0, 0, 0, 193, 194, 1, 0, 0, 0, 194, 196, 1, 0, 0, 0, 195, 193, 1, 0, 0, 0, 196, 197, 5, 34, 0, 0, 197, 72, 1, 0, 0, 0, 198, 199, 5, 92, 0, 0, 199, 200, 9, 0, 0, 0, 200, 74, 1, 0, 0, 0, 201, 203, 7, 3, 0, 0, 202, 201, 1, 0, 0, 0, 203, 204, 1, 0, 0, 0, 204, 202, 1, 0, 0, 0, 204, 205, 1, 0, 0, 0, 205, 212, 1, 0, 0, 0, 206, 208, 5, 46, 0, 0, 207, 209, 7, 3, 0, 0, 208, 207, 1, 0, 0, 0, 209, 210, 1, 0, 0, 0, 210, 208, 1, 0, 0, 0, 210, 211, 1, 0, 0, 0, 211, 213, 1, 0, 0, 0, 212, 206, 1, 0, 0, 0, 212, 213, 1, 0, 0, 0, 213, 76, 1, 0, 0, 0, 214, 216, 7, 4, 0, 0, 215, 214, 1, 0, 0, 0, 216, 217, 1, 0, 0, 0, 217, 215, 1, 0, 0, 0, 217, 218, 1, 0, 0, 0, 218, 219, 1, 0, 0, 0, 219, 220, 6, 38, 0, 0, 220, 78, 1, 0, 0, 0, 8, 0, 179, 191, 193, 204, 210, 212, 217, 1, 6, 0, 0];
    var atn = new _antlr.default.atn.ATNDeserializer().deserialize(serializedATN);
    var decisionsToDFA = atn.decisionToState.map((ds, index) => new _antlr.default.dfa.DFA(ds, index));
    var PangLexer2 = class extends _antlr.default.Lexer {
      constructor(input) {
        super(input);
        this._interp = new _antlr.default.atn.LexerATNSimulator(this, atn, decisionsToDFA, new _antlr.default.atn.PredictionContextCache());
      }
    };
    __publicField(PangLexer2, "grammarFileName", "Pang.g4");
    __publicField(PangLexer2, "channelNames", ["DEFAULT_TOKEN_CHANNEL", "HIDDEN"]);
    __publicField(PangLexer2, "modeNames", ["DEFAULT_MODE"]);
    __publicField(PangLexer2, "literalNames", [null, "';'", "'on'", "'('", "','", "')'", "'*'", "'{'", "'}'", "'print'", "'let'", "'const'", "'='", "'if'", "'else'", "'!'", "'/'", "'+'", "'-'", "'<'", "'<='", "'>'", "'>='", "'=='", "'!='", "'==='", "'!=='", "'&&'", "'||'", "'?'", "':'", "'true'", "'false'"]);
    __publicField(PangLexer2, "symbolicNames", [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "IDENT", "POWER", "CONCAT", "STRING", "NUMBER", "WS"]);
    __publicField(PangLexer2, "ruleNames", ["T__0", "T__1", "T__2", "T__3", "T__4", "T__5", "T__6", "T__7", "T__8", "T__9", "T__10", "T__11", "T__12", "T__13", "T__14", "T__15", "T__16", "T__17", "T__18", "T__19", "T__20", "T__21", "T__22", "T__23", "T__24", "T__25", "T__26", "T__27", "T__28", "T__29", "T__30", "T__31", "IDENT", "POWER", "CONCAT", "STRING", "ESC", "NUMBER", "WS"]);
    exports2.default = PangLexer2;
    PangLexer2.EOF = _antlr.default.Token.EOF;
    PangLexer2.T__0 = 1;
    PangLexer2.T__1 = 2;
    PangLexer2.T__2 = 3;
    PangLexer2.T__3 = 4;
    PangLexer2.T__4 = 5;
    PangLexer2.T__5 = 6;
    PangLexer2.T__6 = 7;
    PangLexer2.T__7 = 8;
    PangLexer2.T__8 = 9;
    PangLexer2.T__9 = 10;
    PangLexer2.T__10 = 11;
    PangLexer2.T__11 = 12;
    PangLexer2.T__12 = 13;
    PangLexer2.T__13 = 14;
    PangLexer2.T__14 = 15;
    PangLexer2.T__15 = 16;
    PangLexer2.T__16 = 17;
    PangLexer2.T__17 = 18;
    PangLexer2.T__18 = 19;
    PangLexer2.T__19 = 20;
    PangLexer2.T__20 = 21;
    PangLexer2.T__21 = 22;
    PangLexer2.T__22 = 23;
    PangLexer2.T__23 = 24;
    PangLexer2.T__24 = 25;
    PangLexer2.T__25 = 26;
    PangLexer2.T__26 = 27;
    PangLexer2.T__27 = 28;
    PangLexer2.T__28 = 29;
    PangLexer2.T__29 = 30;
    PangLexer2.T__30 = 31;
    PangLexer2.T__31 = 32;
    PangLexer2.IDENT = 33;
    PangLexer2.POWER = 34;
    PangLexer2.CONCAT = 35;
    PangLexer2.STRING = 36;
    PangLexer2.NUMBER = 37;
    PangLexer2.WS = 38;
  }
});

// server/lib/PangListener.js
var require_PangListener = __commonJS({
  "server/lib/PangListener.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _antlr = _interopRequireDefault(require_antlr4_node());
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    var PangListener = class extends _antlr.default.tree.ParseTreeListener {
      // Enter a parse tree produced by PangParser#program.
      enterProgram(ctx) {
      }
      // Exit a parse tree produced by PangParser#program.
      exitProgram(ctx) {
      }
      // Enter a parse tree produced by PangParser#statementItem.
      enterStatementItem(ctx) {
      }
      // Exit a parse tree produced by PangParser#statementItem.
      exitStatementItem(ctx) {
      }
      // Enter a parse tree produced by PangParser#statement.
      enterStatement(ctx) {
      }
      // Exit a parse tree produced by PangParser#statement.
      exitStatement(ctx) {
      }
      // Enter a parse tree produced by PangParser#onCall.
      enterOnCall(ctx) {
      }
      // Exit a parse tree produced by PangParser#onCall.
      exitOnCall(ctx) {
      }
      // Enter a parse tree produced by PangParser#inlineBlock.
      enterInlineBlock(ctx) {
      }
      // Exit a parse tree produced by PangParser#inlineBlock.
      exitInlineBlock(ctx) {
      }
      // Enter a parse tree produced by PangParser#inlineBlockBody.
      enterInlineBlockBody(ctx) {
      }
      // Exit a parse tree produced by PangParser#inlineBlockBody.
      exitInlineBlockBody(ctx) {
      }
      // Enter a parse tree produced by PangParser#inlineStatement.
      enterInlineStatement(ctx) {
      }
      // Exit a parse tree produced by PangParser#inlineStatement.
      exitInlineStatement(ctx) {
      }
      // Enter a parse tree produced by PangParser#block.
      enterBlock(ctx) {
      }
      // Exit a parse tree produced by PangParser#block.
      exitBlock(ctx) {
      }
      // Enter a parse tree produced by PangParser#printCall.
      enterPrintCall(ctx) {
      }
      // Exit a parse tree produced by PangParser#printCall.
      exitPrintCall(ctx) {
      }
      // Enter a parse tree produced by PangParser#varDecl.
      enterVarDecl(ctx) {
      }
      // Exit a parse tree produced by PangParser#varDecl.
      exitVarDecl(ctx) {
      }
      // Enter a parse tree produced by PangParser#assignStmt.
      enterAssignStmt(ctx) {
      }
      // Exit a parse tree produced by PangParser#assignStmt.
      exitAssignStmt(ctx) {
      }
      // Enter a parse tree produced by PangParser#ifStmt.
      enterIfStmt(ctx) {
      }
      // Exit a parse tree produced by PangParser#ifStmt.
      exitIfStmt(ctx) {
      }
      // Enter a parse tree produced by PangParser#expr.
      enterExpr(ctx) {
      }
      // Exit a parse tree produced by PangParser#expr.
      exitExpr(ctx) {
      }
      // Enter a parse tree produced by PangParser#primary.
      enterPrimary(ctx) {
      }
      // Exit a parse tree produced by PangParser#primary.
      exitPrimary(ctx) {
      }
      // Enter a parse tree produced by PangParser#options_.
      enterOptions_(ctx) {
      }
      // Exit a parse tree produced by PangParser#options_.
      exitOptions_(ctx) {
      }
      // Enter a parse tree produced by PangParser#optionPair.
      enterOptionPair(ctx) {
      }
      // Exit a parse tree produced by PangParser#optionPair.
      exitOptionPair(ctx) {
      }
      // Enter a parse tree produced by PangParser#optionKey.
      enterOptionKey(ctx) {
      }
      // Exit a parse tree produced by PangParser#optionKey.
      exitOptionKey(ctx) {
      }
      // Enter a parse tree produced by PangParser#optionValue.
      enterOptionValue(ctx) {
      }
      // Exit a parse tree produced by PangParser#optionValue.
      exitOptionValue(ctx) {
      }
      // Enter a parse tree produced by PangParser#functionCall.
      enterFunctionCall(ctx) {
      }
      // Exit a parse tree produced by PangParser#functionCall.
      exitFunctionCall(ctx) {
      }
    };
    exports2.default = PangListener;
  }
});

// server/lib/PangVisitor.js
var require_PangVisitor = __commonJS({
  "server/lib/PangVisitor.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _antlr = _interopRequireDefault(require_antlr4_node());
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    var PangVisitor2 = class extends _antlr.default.tree.ParseTreeVisitor {
      // Visit a parse tree produced by PangParser#program.
      visitProgram(ctx) {
        return this.visitChildren(ctx);
      }
      // Visit a parse tree produced by PangParser#statementItem.
      visitStatementItem(ctx) {
        return this.visitChildren(ctx);
      }
      // Visit a parse tree produced by PangParser#statement.
      visitStatement(ctx) {
        return this.visitChildren(ctx);
      }
      // Visit a parse tree produced by PangParser#onCall.
      visitOnCall(ctx) {
        return this.visitChildren(ctx);
      }
      // Visit a parse tree produced by PangParser#inlineBlock.
      visitInlineBlock(ctx) {
        return this.visitChildren(ctx);
      }
      // Visit a parse tree produced by PangParser#inlineBlockBody.
      visitInlineBlockBody(ctx) {
        return this.visitChildren(ctx);
      }
      // Visit a parse tree produced by PangParser#inlineStatement.
      visitInlineStatement(ctx) {
        return this.visitChildren(ctx);
      }
      // Visit a parse tree produced by PangParser#block.
      visitBlock(ctx) {
        return this.visitChildren(ctx);
      }
      // Visit a parse tree produced by PangParser#printCall.
      visitPrintCall(ctx) {
        return this.visitChildren(ctx);
      }
      // Visit a parse tree produced by PangParser#varDecl.
      visitVarDecl(ctx) {
        return this.visitChildren(ctx);
      }
      // Visit a parse tree produced by PangParser#assignStmt.
      visitAssignStmt(ctx) {
        return this.visitChildren(ctx);
      }
      // Visit a parse tree produced by PangParser#ifStmt.
      visitIfStmt(ctx) {
        return this.visitChildren(ctx);
      }
      // Visit a parse tree produced by PangParser#expr.
      visitExpr(ctx) {
        return this.visitChildren(ctx);
      }
      // Visit a parse tree produced by PangParser#primary.
      visitPrimary(ctx) {
        return this.visitChildren(ctx);
      }
      // Visit a parse tree produced by PangParser#options_.
      visitOptions_(ctx) {
        return this.visitChildren(ctx);
      }
      // Visit a parse tree produced by PangParser#optionPair.
      visitOptionPair(ctx) {
        return this.visitChildren(ctx);
      }
      // Visit a parse tree produced by PangParser#optionKey.
      visitOptionKey(ctx) {
        return this.visitChildren(ctx);
      }
      // Visit a parse tree produced by PangParser#optionValue.
      visitOptionValue(ctx) {
        return this.visitChildren(ctx);
      }
      // Visit a parse tree produced by PangParser#functionCall.
      visitFunctionCall(ctx) {
        return this.visitChildren(ctx);
      }
    };
    exports2.default = PangVisitor2;
  }
});

// server/lib/PangParser.js
var require_PangParser = __commonJS({
  "server/lib/PangParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _antlr = _interopRequireDefault(require_antlr4_node());
    var _PangListener = _interopRequireDefault(require_PangListener());
    var _PangVisitor = _interopRequireDefault(require_PangVisitor());
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    var serializedATN = [4, 1, 38, 243, 2, 0, 7, 0, 2, 1, 7, 1, 2, 2, 7, 2, 2, 3, 7, 3, 2, 4, 7, 4, 2, 5, 7, 5, 2, 6, 7, 6, 2, 7, 7, 7, 2, 8, 7, 8, 2, 9, 7, 9, 2, 10, 7, 10, 2, 11, 7, 11, 2, 12, 7, 12, 2, 13, 7, 13, 2, 14, 7, 14, 2, 15, 7, 15, 2, 16, 7, 16, 2, 17, 7, 17, 2, 18, 7, 18, 1, 0, 5, 0, 40, 8, 0, 10, 0, 12, 0, 43, 9, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 52, 8, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 3, 2, 60, 8, 2, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 4, 1, 4, 1, 4, 1, 5, 1, 5, 5, 5, 74, 8, 5, 10, 5, 12, 5, 77, 9, 5, 1, 5, 1, 5, 1, 6, 1, 6, 1, 6, 1, 6, 3, 6, 85, 8, 6, 1, 7, 1, 7, 5, 7, 89, 8, 7, 10, 7, 12, 7, 92, 9, 7, 1, 7, 1, 7, 1, 8, 1, 8, 1, 8, 1, 8, 1, 8, 3, 8, 101, 8, 8, 1, 8, 1, 8, 1, 9, 1, 9, 1, 9, 1, 9, 3, 9, 109, 8, 9, 1, 10, 1, 10, 1, 10, 1, 10, 1, 11, 1, 11, 1, 11, 1, 11, 1, 11, 1, 11, 1, 11, 1, 11, 1, 11, 1, 11, 1, 11, 1, 11, 5, 11, 127, 8, 11, 10, 11, 12, 11, 130, 9, 11, 1, 11, 1, 11, 3, 11, 134, 8, 11, 1, 12, 1, 12, 1, 12, 1, 12, 3, 12, 140, 8, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 1, 12, 5, 12, 172, 8, 12, 10, 12, 12, 12, 175, 9, 12, 1, 13, 1, 13, 1, 13, 1, 13, 1, 13, 1, 13, 1, 13, 1, 13, 1, 13, 1, 13, 1, 13, 3, 13, 188, 8, 13, 1, 14, 1, 14, 3, 14, 192, 8, 14, 1, 14, 1, 14, 1, 14, 3, 14, 197, 8, 14, 1, 14, 5, 14, 200, 8, 14, 10, 14, 12, 14, 203, 9, 14, 1, 14, 3, 14, 206, 8, 14, 1, 14, 1, 14, 1, 15, 1, 15, 3, 15, 212, 8, 15, 1, 15, 1, 15, 3, 15, 216, 8, 15, 1, 15, 1, 15, 1, 16, 1, 16, 1, 17, 1, 17, 1, 17, 1, 17, 1, 17, 3, 17, 227, 8, 17, 1, 18, 1, 18, 1, 18, 1, 18, 1, 18, 5, 18, 234, 8, 18, 10, 18, 12, 18, 237, 9, 18, 3, 18, 239, 8, 18, 1, 18, 1, 18, 1, 18, 0, 1, 24, 19, 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 0, 6, 1, 0, 10, 11, 2, 0, 6, 6, 16, 16, 1, 0, 17, 18, 1, 0, 19, 22, 1, 0, 23, 26, 2, 0, 33, 33, 36, 36, 265, 0, 41, 1, 0, 0, 0, 2, 51, 1, 0, 0, 0, 4, 59, 1, 0, 0, 0, 6, 61, 1, 0, 0, 0, 8, 68, 1, 0, 0, 0, 10, 71, 1, 0, 0, 0, 12, 84, 1, 0, 0, 0, 14, 86, 1, 0, 0, 0, 16, 95, 1, 0, 0, 0, 18, 104, 1, 0, 0, 0, 20, 110, 1, 0, 0, 0, 22, 114, 1, 0, 0, 0, 24, 139, 1, 0, 0, 0, 26, 187, 1, 0, 0, 0, 28, 189, 1, 0, 0, 0, 30, 209, 1, 0, 0, 0, 32, 219, 1, 0, 0, 0, 34, 226, 1, 0, 0, 0, 36, 228, 1, 0, 0, 0, 38, 40, 3, 4, 2, 0, 39, 38, 1, 0, 0, 0, 40, 43, 1, 0, 0, 0, 41, 39, 1, 0, 0, 0, 41, 42, 1, 0, 0, 0, 42, 44, 1, 0, 0, 0, 43, 41, 1, 0, 0, 0, 44, 45, 5, 0, 0, 1, 45, 1, 1, 0, 0, 0, 46, 52, 3, 6, 3, 0, 47, 52, 3, 16, 8, 0, 48, 52, 3, 36, 18, 0, 49, 52, 3, 18, 9, 0, 50, 52, 3, 20, 10, 0, 51, 46, 1, 0, 0, 0, 51, 47, 1, 0, 0, 0, 51, 48, 1, 0, 0, 0, 51, 49, 1, 0, 0, 0, 51, 50, 1, 0, 0, 0, 52, 3, 1, 0, 0, 0, 53, 54, 3, 2, 1, 0, 54, 55, 5, 1, 0, 0, 55, 60, 1, 0, 0, 0, 56, 57, 3, 22, 11, 0, 57, 58, 5, 1, 0, 0, 58, 60, 1, 0, 0, 0, 59, 53, 1, 0, 0, 0, 59, 56, 1, 0, 0, 0, 60, 5, 1, 0, 0, 0, 61, 62, 5, 2, 0, 0, 62, 63, 5, 3, 0, 0, 63, 64, 5, 36, 0, 0, 64, 65, 5, 4, 0, 0, 65, 66, 3, 8, 4, 0, 66, 67, 5, 5, 0, 0, 67, 7, 1, 0, 0, 0, 68, 69, 5, 6, 0, 0, 69, 70, 3, 10, 5, 0, 70, 9, 1, 0, 0, 0, 71, 75, 5, 7, 0, 0, 72, 74, 3, 12, 6, 0, 73, 72, 1, 0, 0, 0, 74, 77, 1, 0, 0, 0, 75, 73, 1, 0, 0, 0, 75, 76, 1, 0, 0, 0, 76, 78, 1, 0, 0, 0, 77, 75, 1, 0, 0, 0, 78, 79, 5, 8, 0, 0, 79, 11, 1, 0, 0, 0, 80, 81, 3, 2, 1, 0, 81, 82, 5, 1, 0, 0, 82, 85, 1, 0, 0, 0, 83, 85, 3, 22, 11, 0, 84, 80, 1, 0, 0, 0, 84, 83, 1, 0, 0, 0, 85, 13, 1, 0, 0, 0, 86, 90, 5, 7, 0, 0, 87, 89, 3, 4, 2, 0, 88, 87, 1, 0, 0, 0, 89, 92, 1, 0, 0, 0, 90, 88, 1, 0, 0, 0, 90, 91, 1, 0, 0, 0, 91, 93, 1, 0, 0, 0, 92, 90, 1, 0, 0, 0, 93, 94, 5, 8, 0, 0, 94, 15, 1, 0, 0, 0, 95, 96, 5, 9, 0, 0, 96, 97, 5, 3, 0, 0, 97, 100, 3, 24, 12, 0, 98, 99, 5, 4, 0, 0, 99, 101, 3, 28, 14, 0, 100, 98, 1, 0, 0, 0, 100, 101, 1, 0, 0, 0, 101, 102, 1, 0, 0, 0, 102, 103, 5, 5, 0, 0, 103, 17, 1, 0, 0, 0, 104, 105, 7, 0, 0, 0, 105, 108, 5, 33, 0, 0, 106, 107, 5, 12, 0, 0, 107, 109, 3, 24, 12, 0, 108, 106, 1, 0, 0, 0, 108, 109, 1, 0, 0, 0, 109, 19, 1, 0, 0, 0, 110, 111, 5, 33, 0, 0, 111, 112, 5, 12, 0, 0, 112, 113, 3, 24, 12, 0, 113, 21, 1, 0, 0, 0, 114, 115, 5, 13, 0, 0, 115, 116, 5, 3, 0, 0, 116, 117, 3, 24, 12, 0, 117, 118, 5, 5, 0, 0, 118, 128, 3, 14, 7, 0, 119, 120, 5, 14, 0, 0, 120, 121, 5, 13, 0, 0, 121, 122, 5, 3, 0, 0, 122, 123, 3, 24, 12, 0, 123, 124, 5, 5, 0, 0, 124, 125, 3, 14, 7, 0, 125, 127, 1, 0, 0, 0, 126, 119, 1, 0, 0, 0, 127, 130, 1, 0, 0, 0, 128, 126, 1, 0, 0, 0, 128, 129, 1, 0, 0, 0, 129, 133, 1, 0, 0, 0, 130, 128, 1, 0, 0, 0, 131, 132, 5, 14, 0, 0, 132, 134, 3, 14, 7, 0, 133, 131, 1, 0, 0, 0, 133, 134, 1, 0, 0, 0, 134, 23, 1, 0, 0, 0, 135, 136, 6, 12, -1, 0, 136, 140, 3, 26, 13, 0, 137, 138, 5, 15, 0, 0, 138, 140, 3, 24, 12, 10, 139, 135, 1, 0, 0, 0, 139, 137, 1, 0, 0, 0, 140, 173, 1, 0, 0, 0, 141, 142, 10, 9, 0, 0, 142, 143, 5, 34, 0, 0, 143, 172, 3, 24, 12, 10, 144, 145, 10, 8, 0, 0, 145, 146, 7, 1, 0, 0, 146, 172, 3, 24, 12, 9, 147, 148, 10, 7, 0, 0, 148, 149, 7, 2, 0, 0, 149, 172, 3, 24, 12, 8, 150, 151, 10, 6, 0, 0, 151, 152, 5, 35, 0, 0, 152, 172, 3, 24, 12, 7, 153, 154, 10, 5, 0, 0, 154, 155, 7, 3, 0, 0, 155, 172, 3, 24, 12, 6, 156, 157, 10, 4, 0, 0, 157, 158, 7, 4, 0, 0, 158, 172, 3, 24, 12, 5, 159, 160, 10, 3, 0, 0, 160, 161, 5, 27, 0, 0, 161, 172, 3, 24, 12, 4, 162, 163, 10, 2, 0, 0, 163, 164, 5, 28, 0, 0, 164, 172, 3, 24, 12, 3, 165, 166, 10, 1, 0, 0, 166, 167, 5, 29, 0, 0, 167, 168, 3, 24, 12, 0, 168, 169, 5, 30, 0, 0, 169, 170, 3, 24, 12, 2, 170, 172, 1, 0, 0, 0, 171, 141, 1, 0, 0, 0, 171, 144, 1, 0, 0, 0, 171, 147, 1, 0, 0, 0, 171, 150, 1, 0, 0, 0, 171, 153, 1, 0, 0, 0, 171, 156, 1, 0, 0, 0, 171, 159, 1, 0, 0, 0, 171, 162, 1, 0, 0, 0, 171, 165, 1, 0, 0, 0, 172, 175, 1, 0, 0, 0, 173, 171, 1, 0, 0, 0, 173, 174, 1, 0, 0, 0, 174, 25, 1, 0, 0, 0, 175, 173, 1, 0, 0, 0, 176, 188, 5, 37, 0, 0, 177, 188, 5, 36, 0, 0, 178, 188, 5, 31, 0, 0, 179, 188, 5, 32, 0, 0, 180, 188, 5, 33, 0, 0, 181, 188, 3, 16, 8, 0, 182, 188, 3, 36, 18, 0, 183, 184, 5, 3, 0, 0, 184, 185, 3, 24, 12, 0, 185, 186, 5, 5, 0, 0, 186, 188, 1, 0, 0, 0, 187, 176, 1, 0, 0, 0, 187, 177, 1, 0, 0, 0, 187, 178, 1, 0, 0, 0, 187, 179, 1, 0, 0, 0, 187, 180, 1, 0, 0, 0, 187, 181, 1, 0, 0, 0, 187, 182, 1, 0, 0, 0, 187, 183, 1, 0, 0, 0, 188, 27, 1, 0, 0, 0, 189, 191, 5, 7, 0, 0, 190, 192, 5, 38, 0, 0, 191, 190, 1, 0, 0, 0, 191, 192, 1, 0, 0, 0, 192, 193, 1, 0, 0, 0, 193, 201, 3, 30, 15, 0, 194, 196, 5, 4, 0, 0, 195, 197, 5, 38, 0, 0, 196, 195, 1, 0, 0, 0, 196, 197, 1, 0, 0, 0, 197, 198, 1, 0, 0, 0, 198, 200, 3, 30, 15, 0, 199, 194, 1, 0, 0, 0, 200, 203, 1, 0, 0, 0, 201, 199, 1, 0, 0, 0, 201, 202, 1, 0, 0, 0, 202, 205, 1, 0, 0, 0, 203, 201, 1, 0, 0, 0, 204, 206, 5, 38, 0, 0, 205, 204, 1, 0, 0, 0, 205, 206, 1, 0, 0, 0, 206, 207, 1, 0, 0, 0, 207, 208, 5, 8, 0, 0, 208, 29, 1, 0, 0, 0, 209, 211, 3, 32, 16, 0, 210, 212, 5, 38, 0, 0, 211, 210, 1, 0, 0, 0, 211, 212, 1, 0, 0, 0, 212, 213, 1, 0, 0, 0, 213, 215, 5, 30, 0, 0, 214, 216, 5, 38, 0, 0, 215, 214, 1, 0, 0, 0, 215, 216, 1, 0, 0, 0, 216, 217, 1, 0, 0, 0, 217, 218, 3, 34, 17, 0, 218, 31, 1, 0, 0, 0, 219, 220, 7, 5, 0, 0, 220, 33, 1, 0, 0, 0, 221, 227, 5, 36, 0, 0, 222, 227, 5, 37, 0, 0, 223, 227, 5, 31, 0, 0, 224, 227, 5, 32, 0, 0, 225, 227, 3, 24, 12, 0, 226, 221, 1, 0, 0, 0, 226, 222, 1, 0, 0, 0, 226, 223, 1, 0, 0, 0, 226, 224, 1, 0, 0, 0, 226, 225, 1, 0, 0, 0, 227, 35, 1, 0, 0, 0, 228, 229, 5, 33, 0, 0, 229, 238, 5, 3, 0, 0, 230, 235, 3, 24, 12, 0, 231, 232, 5, 4, 0, 0, 232, 234, 3, 24, 12, 0, 233, 231, 1, 0, 0, 0, 234, 237, 1, 0, 0, 0, 235, 233, 1, 0, 0, 0, 235, 236, 1, 0, 0, 0, 236, 239, 1, 0, 0, 0, 237, 235, 1, 0, 0, 0, 238, 230, 1, 0, 0, 0, 238, 239, 1, 0, 0, 0, 239, 240, 1, 0, 0, 0, 240, 241, 5, 5, 0, 0, 241, 37, 1, 0, 0, 0, 23, 41, 51, 59, 75, 84, 90, 100, 108, 128, 133, 139, 171, 173, 187, 191, 196, 201, 205, 211, 215, 226, 235, 238];
    var atn = new _antlr.default.atn.ATNDeserializer().deserialize(serializedATN);
    var decisionsToDFA = atn.decisionToState.map((ds, index) => new _antlr.default.dfa.DFA(ds, index));
    var sharedContextCache = new _antlr.default.atn.PredictionContextCache();
    var _PangParser = class extends _antlr.default.Parser {
      constructor(input) {
        super(input);
        this._interp = new _antlr.default.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
        this.ruleNames = _PangParser.ruleNames;
        this.literalNames = _PangParser.literalNames;
        this.symbolicNames = _PangParser.symbolicNames;
      }
      sempred(localctx, ruleIndex, predIndex) {
        switch (ruleIndex) {
          case 12:
            return this.expr_sempred(localctx, predIndex);
          default:
            throw "No predicate with index:" + ruleIndex;
        }
      }
      expr_sempred(localctx, predIndex) {
        switch (predIndex) {
          case 0:
            return this.precpred(this._ctx, 9);
          case 1:
            return this.precpred(this._ctx, 8);
          case 2:
            return this.precpred(this._ctx, 7);
          case 3:
            return this.precpred(this._ctx, 6);
          case 4:
            return this.precpred(this._ctx, 5);
          case 5:
            return this.precpred(this._ctx, 4);
          case 6:
            return this.precpred(this._ctx, 3);
          case 7:
            return this.precpred(this._ctx, 2);
          case 8:
            return this.precpred(this._ctx, 1);
          default:
            throw "No predicate with index:" + predIndex;
        }
      }
      program() {
        let localctx = new ProgramContext(this, this._ctx, this.state);
        this.enterRule(localctx, 0, _PangParser.RULE_program);
        var _la = 0;
        try {
          this.enterOuterAlt(localctx, 1);
          this.state = 41;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
          while ((_la - 2 & ~31) === 0 && (1 << _la - 2 & 2147486593) !== 0) {
            this.state = 38;
            this.statement();
            this.state = 43;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
          }
          this.state = 44;
          this.match(_PangParser.EOF);
        } catch (re) {
          if (re instanceof _antlr.default.error.RecognitionException) {
            localctx.exception = re;
            this._errHandler.reportError(this, re);
            this._errHandler.recover(this, re);
          } else {
            throw re;
          }
        } finally {
          this.exitRule();
        }
        return localctx;
      }
      statementItem() {
        let localctx = new StatementItemContext(this, this._ctx, this.state);
        this.enterRule(localctx, 2, _PangParser.RULE_statementItem);
        try {
          this.state = 51;
          this._errHandler.sync(this);
          var la_ = this._interp.adaptivePredict(this._input, 1, this._ctx);
          switch (la_) {
            case 1:
              this.enterOuterAlt(localctx, 1);
              this.state = 46;
              this.onCall();
              break;
            case 2:
              this.enterOuterAlt(localctx, 2);
              this.state = 47;
              this.printCall();
              break;
            case 3:
              this.enterOuterAlt(localctx, 3);
              this.state = 48;
              this.functionCall();
              break;
            case 4:
              this.enterOuterAlt(localctx, 4);
              this.state = 49;
              this.varDecl();
              break;
            case 5:
              this.enterOuterAlt(localctx, 5);
              this.state = 50;
              this.assignStmt();
              break;
          }
        } catch (re) {
          if (re instanceof _antlr.default.error.RecognitionException) {
            localctx.exception = re;
            this._errHandler.reportError(this, re);
            this._errHandler.recover(this, re);
          } else {
            throw re;
          }
        } finally {
          this.exitRule();
        }
        return localctx;
      }
      statement() {
        let localctx = new StatementContext(this, this._ctx, this.state);
        this.enterRule(localctx, 4, _PangParser.RULE_statement);
        try {
          this.state = 59;
          this._errHandler.sync(this);
          switch (this._input.LA(1)) {
            case 2:
            case 9:
            case 10:
            case 11:
            case 33:
              this.enterOuterAlt(localctx, 1);
              this.state = 53;
              this.statementItem();
              this.state = 54;
              this.match(_PangParser.T__0);
              break;
            case 13:
              this.enterOuterAlt(localctx, 2);
              this.state = 56;
              this.ifStmt();
              this.state = 57;
              this.match(_PangParser.T__0);
              break;
            default:
              throw new _antlr.default.error.NoViableAltException(this);
          }
        } catch (re) {
          if (re instanceof _antlr.default.error.RecognitionException) {
            localctx.exception = re;
            this._errHandler.reportError(this, re);
            this._errHandler.recover(this, re);
          } else {
            throw re;
          }
        } finally {
          this.exitRule();
        }
        return localctx;
      }
      onCall() {
        let localctx = new OnCallContext(this, this._ctx, this.state);
        this.enterRule(localctx, 6, _PangParser.RULE_onCall);
        try {
          this.enterOuterAlt(localctx, 1);
          this.state = 61;
          this.match(_PangParser.T__1);
          this.state = 62;
          this.match(_PangParser.T__2);
          this.state = 63;
          this.match(_PangParser.STRING);
          this.state = 64;
          this.match(_PangParser.T__3);
          this.state = 65;
          this.inlineBlock();
          this.state = 66;
          this.match(_PangParser.T__4);
        } catch (re) {
          if (re instanceof _antlr.default.error.RecognitionException) {
            localctx.exception = re;
            this._errHandler.reportError(this, re);
            this._errHandler.recover(this, re);
          } else {
            throw re;
          }
        } finally {
          this.exitRule();
        }
        return localctx;
      }
      inlineBlock() {
        let localctx = new InlineBlockContext(this, this._ctx, this.state);
        this.enterRule(localctx, 8, _PangParser.RULE_inlineBlock);
        try {
          this.enterOuterAlt(localctx, 1);
          this.state = 68;
          this.match(_PangParser.T__5);
          this.state = 69;
          this.inlineBlockBody();
        } catch (re) {
          if (re instanceof _antlr.default.error.RecognitionException) {
            localctx.exception = re;
            this._errHandler.reportError(this, re);
            this._errHandler.recover(this, re);
          } else {
            throw re;
          }
        } finally {
          this.exitRule();
        }
        return localctx;
      }
      inlineBlockBody() {
        let localctx = new InlineBlockBodyContext(this, this._ctx, this.state);
        this.enterRule(localctx, 10, _PangParser.RULE_inlineBlockBody);
        var _la = 0;
        try {
          this.enterOuterAlt(localctx, 1);
          this.state = 71;
          this.match(_PangParser.T__6);
          this.state = 75;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
          while ((_la - 2 & ~31) === 0 && (1 << _la - 2 & 2147486593) !== 0) {
            this.state = 72;
            this.inlineStatement();
            this.state = 77;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
          }
          this.state = 78;
          this.match(_PangParser.T__7);
        } catch (re) {
          if (re instanceof _antlr.default.error.RecognitionException) {
            localctx.exception = re;
            this._errHandler.reportError(this, re);
            this._errHandler.recover(this, re);
          } else {
            throw re;
          }
        } finally {
          this.exitRule();
        }
        return localctx;
      }
      inlineStatement() {
        let localctx = new InlineStatementContext(this, this._ctx, this.state);
        this.enterRule(localctx, 12, _PangParser.RULE_inlineStatement);
        try {
          this.state = 84;
          this._errHandler.sync(this);
          switch (this._input.LA(1)) {
            case 2:
            case 9:
            case 10:
            case 11:
            case 33:
              this.enterOuterAlt(localctx, 1);
              this.state = 80;
              this.statementItem();
              this.state = 81;
              this.match(_PangParser.T__0);
              break;
            case 13:
              this.enterOuterAlt(localctx, 2);
              this.state = 83;
              this.ifStmt();
              break;
            default:
              throw new _antlr.default.error.NoViableAltException(this);
          }
        } catch (re) {
          if (re instanceof _antlr.default.error.RecognitionException) {
            localctx.exception = re;
            this._errHandler.reportError(this, re);
            this._errHandler.recover(this, re);
          } else {
            throw re;
          }
        } finally {
          this.exitRule();
        }
        return localctx;
      }
      block() {
        let localctx = new BlockContext(this, this._ctx, this.state);
        this.enterRule(localctx, 14, _PangParser.RULE_block);
        var _la = 0;
        try {
          this.enterOuterAlt(localctx, 1);
          this.state = 86;
          this.match(_PangParser.T__6);
          this.state = 90;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
          while ((_la - 2 & ~31) === 0 && (1 << _la - 2 & 2147486593) !== 0) {
            this.state = 87;
            this.statement();
            this.state = 92;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
          }
          this.state = 93;
          this.match(_PangParser.T__7);
        } catch (re) {
          if (re instanceof _antlr.default.error.RecognitionException) {
            localctx.exception = re;
            this._errHandler.reportError(this, re);
            this._errHandler.recover(this, re);
          } else {
            throw re;
          }
        } finally {
          this.exitRule();
        }
        return localctx;
      }
      printCall() {
        let localctx = new PrintCallContext(this, this._ctx, this.state);
        this.enterRule(localctx, 16, _PangParser.RULE_printCall);
        var _la = 0;
        try {
          this.enterOuterAlt(localctx, 1);
          this.state = 95;
          this.match(_PangParser.T__8);
          this.state = 96;
          this.match(_PangParser.T__2);
          this.state = 97;
          this.expr(0);
          this.state = 100;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
          if (_la === 4) {
            this.state = 98;
            this.match(_PangParser.T__3);
            this.state = 99;
            this.options_();
          }
          this.state = 102;
          this.match(_PangParser.T__4);
        } catch (re) {
          if (re instanceof _antlr.default.error.RecognitionException) {
            localctx.exception = re;
            this._errHandler.reportError(this, re);
            this._errHandler.recover(this, re);
          } else {
            throw re;
          }
        } finally {
          this.exitRule();
        }
        return localctx;
      }
      varDecl() {
        let localctx = new VarDeclContext(this, this._ctx, this.state);
        this.enterRule(localctx, 18, _PangParser.RULE_varDecl);
        var _la = 0;
        try {
          this.enterOuterAlt(localctx, 1);
          this.state = 104;
          _la = this._input.LA(1);
          if (!(_la === 10 || _la === 11)) {
            this._errHandler.recoverInline(this);
          } else {
            this._errHandler.reportMatch(this);
            this.consume();
          }
          this.state = 105;
          this.match(_PangParser.IDENT);
          this.state = 108;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
          if (_la === 12) {
            this.state = 106;
            this.match(_PangParser.T__11);
            this.state = 107;
            this.expr(0);
          }
        } catch (re) {
          if (re instanceof _antlr.default.error.RecognitionException) {
            localctx.exception = re;
            this._errHandler.reportError(this, re);
            this._errHandler.recover(this, re);
          } else {
            throw re;
          }
        } finally {
          this.exitRule();
        }
        return localctx;
      }
      assignStmt() {
        let localctx = new AssignStmtContext(this, this._ctx, this.state);
        this.enterRule(localctx, 20, _PangParser.RULE_assignStmt);
        try {
          this.enterOuterAlt(localctx, 1);
          this.state = 110;
          this.match(_PangParser.IDENT);
          this.state = 111;
          this.match(_PangParser.T__11);
          this.state = 112;
          this.expr(0);
        } catch (re) {
          if (re instanceof _antlr.default.error.RecognitionException) {
            localctx.exception = re;
            this._errHandler.reportError(this, re);
            this._errHandler.recover(this, re);
          } else {
            throw re;
          }
        } finally {
          this.exitRule();
        }
        return localctx;
      }
      ifStmt() {
        let localctx = new IfStmtContext(this, this._ctx, this.state);
        this.enterRule(localctx, 22, _PangParser.RULE_ifStmt);
        var _la = 0;
        try {
          this.enterOuterAlt(localctx, 1);
          this.state = 114;
          this.match(_PangParser.T__12);
          this.state = 115;
          this.match(_PangParser.T__2);
          this.state = 116;
          this.expr(0);
          this.state = 117;
          this.match(_PangParser.T__4);
          this.state = 118;
          this.block();
          this.state = 128;
          this._errHandler.sync(this);
          var _alt = this._interp.adaptivePredict(this._input, 8, this._ctx);
          while (_alt != 2 && _alt != _antlr.default.atn.ATN.INVALID_ALT_NUMBER) {
            if (_alt === 1) {
              this.state = 119;
              this.match(_PangParser.T__13);
              this.state = 120;
              this.match(_PangParser.T__12);
              this.state = 121;
              this.match(_PangParser.T__2);
              this.state = 122;
              this.expr(0);
              this.state = 123;
              this.match(_PangParser.T__4);
              this.state = 124;
              this.block();
            }
            this.state = 130;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input, 8, this._ctx);
          }
          this.state = 133;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
          if (_la === 14) {
            this.state = 131;
            this.match(_PangParser.T__13);
            this.state = 132;
            this.block();
          }
        } catch (re) {
          if (re instanceof _antlr.default.error.RecognitionException) {
            localctx.exception = re;
            this._errHandler.reportError(this, re);
            this._errHandler.recover(this, re);
          } else {
            throw re;
          }
        } finally {
          this.exitRule();
        }
        return localctx;
      }
      expr(_p) {
        if (_p === void 0) {
          _p = 0;
        }
        const _parentctx = this._ctx;
        const _parentState = this.state;
        let localctx = new ExprContext(this, this._ctx, _parentState);
        let _prevctx = localctx;
        const _startState = 24;
        this.enterRecursionRule(localctx, 24, _PangParser.RULE_expr, _p);
        var _la = 0;
        try {
          this.enterOuterAlt(localctx, 1);
          this.state = 139;
          this._errHandler.sync(this);
          switch (this._input.LA(1)) {
            case 3:
            case 9:
            case 31:
            case 32:
            case 33:
            case 36:
            case 37:
              this.state = 136;
              this.primary();
              break;
            case 15:
              this.state = 137;
              this.match(_PangParser.T__14);
              this.state = 138;
              this.expr(10);
              break;
            default:
              throw new _antlr.default.error.NoViableAltException(this);
          }
          this._ctx.stop = this._input.LT(-1);
          this.state = 173;
          this._errHandler.sync(this);
          var _alt = this._interp.adaptivePredict(this._input, 12, this._ctx);
          while (_alt != 2 && _alt != _antlr.default.atn.ATN.INVALID_ALT_NUMBER) {
            if (_alt === 1) {
              if (this._parseListeners !== null) {
                this.triggerExitRuleEvent();
              }
              _prevctx = localctx;
              this.state = 171;
              this._errHandler.sync(this);
              var la_ = this._interp.adaptivePredict(this._input, 11, this._ctx);
              switch (la_) {
                case 1:
                  localctx = new ExprContext(this, _parentctx, _parentState);
                  this.pushNewRecursionContext(localctx, _startState, _PangParser.RULE_expr);
                  this.state = 141;
                  if (!this.precpred(this._ctx, 9)) {
                    throw new _antlr.default.error.FailedPredicateException(this, "this.precpred(this._ctx, 9)");
                  }
                  this.state = 142;
                  this.match(_PangParser.POWER);
                  this.state = 143;
                  this.expr(10);
                  break;
                case 2:
                  localctx = new ExprContext(this, _parentctx, _parentState);
                  this.pushNewRecursionContext(localctx, _startState, _PangParser.RULE_expr);
                  this.state = 144;
                  if (!this.precpred(this._ctx, 8)) {
                    throw new _antlr.default.error.FailedPredicateException(this, "this.precpred(this._ctx, 8)");
                  }
                  this.state = 145;
                  _la = this._input.LA(1);
                  if (!(_la === 6 || _la === 16)) {
                    this._errHandler.recoverInline(this);
                  } else {
                    this._errHandler.reportMatch(this);
                    this.consume();
                  }
                  this.state = 146;
                  this.expr(9);
                  break;
                case 3:
                  localctx = new ExprContext(this, _parentctx, _parentState);
                  this.pushNewRecursionContext(localctx, _startState, _PangParser.RULE_expr);
                  this.state = 147;
                  if (!this.precpred(this._ctx, 7)) {
                    throw new _antlr.default.error.FailedPredicateException(this, "this.precpred(this._ctx, 7)");
                  }
                  this.state = 148;
                  _la = this._input.LA(1);
                  if (!(_la === 17 || _la === 18)) {
                    this._errHandler.recoverInline(this);
                  } else {
                    this._errHandler.reportMatch(this);
                    this.consume();
                  }
                  this.state = 149;
                  this.expr(8);
                  break;
                case 4:
                  localctx = new ExprContext(this, _parentctx, _parentState);
                  this.pushNewRecursionContext(localctx, _startState, _PangParser.RULE_expr);
                  this.state = 150;
                  if (!this.precpred(this._ctx, 6)) {
                    throw new _antlr.default.error.FailedPredicateException(this, "this.precpred(this._ctx, 6)");
                  }
                  this.state = 151;
                  this.match(_PangParser.CONCAT);
                  this.state = 152;
                  this.expr(7);
                  break;
                case 5:
                  localctx = new ExprContext(this, _parentctx, _parentState);
                  this.pushNewRecursionContext(localctx, _startState, _PangParser.RULE_expr);
                  this.state = 153;
                  if (!this.precpred(this._ctx, 5)) {
                    throw new _antlr.default.error.FailedPredicateException(this, "this.precpred(this._ctx, 5)");
                  }
                  this.state = 154;
                  _la = this._input.LA(1);
                  if (!((_la & ~31) === 0 && (1 << _la & 7864320) !== 0)) {
                    this._errHandler.recoverInline(this);
                  } else {
                    this._errHandler.reportMatch(this);
                    this.consume();
                  }
                  this.state = 155;
                  this.expr(6);
                  break;
                case 6:
                  localctx = new ExprContext(this, _parentctx, _parentState);
                  this.pushNewRecursionContext(localctx, _startState, _PangParser.RULE_expr);
                  this.state = 156;
                  if (!this.precpred(this._ctx, 4)) {
                    throw new _antlr.default.error.FailedPredicateException(this, "this.precpred(this._ctx, 4)");
                  }
                  this.state = 157;
                  _la = this._input.LA(1);
                  if (!((_la & ~31) === 0 && (1 << _la & 125829120) !== 0)) {
                    this._errHandler.recoverInline(this);
                  } else {
                    this._errHandler.reportMatch(this);
                    this.consume();
                  }
                  this.state = 158;
                  this.expr(5);
                  break;
                case 7:
                  localctx = new ExprContext(this, _parentctx, _parentState);
                  this.pushNewRecursionContext(localctx, _startState, _PangParser.RULE_expr);
                  this.state = 159;
                  if (!this.precpred(this._ctx, 3)) {
                    throw new _antlr.default.error.FailedPredicateException(this, "this.precpred(this._ctx, 3)");
                  }
                  this.state = 160;
                  this.match(_PangParser.T__26);
                  this.state = 161;
                  this.expr(4);
                  break;
                case 8:
                  localctx = new ExprContext(this, _parentctx, _parentState);
                  this.pushNewRecursionContext(localctx, _startState, _PangParser.RULE_expr);
                  this.state = 162;
                  if (!this.precpred(this._ctx, 2)) {
                    throw new _antlr.default.error.FailedPredicateException(this, "this.precpred(this._ctx, 2)");
                  }
                  this.state = 163;
                  this.match(_PangParser.T__27);
                  this.state = 164;
                  this.expr(3);
                  break;
                case 9:
                  localctx = new ExprContext(this, _parentctx, _parentState);
                  this.pushNewRecursionContext(localctx, _startState, _PangParser.RULE_expr);
                  this.state = 165;
                  if (!this.precpred(this._ctx, 1)) {
                    throw new _antlr.default.error.FailedPredicateException(this, "this.precpred(this._ctx, 1)");
                  }
                  this.state = 166;
                  this.match(_PangParser.T__28);
                  this.state = 167;
                  this.expr(0);
                  this.state = 168;
                  this.match(_PangParser.T__29);
                  this.state = 169;
                  this.expr(2);
                  break;
              }
            }
            this.state = 175;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input, 12, this._ctx);
          }
        } catch (error) {
          if (error instanceof _antlr.default.error.RecognitionException) {
            localctx.exception = error;
            this._errHandler.reportError(this, error);
            this._errHandler.recover(this, error);
          } else {
            throw error;
          }
        } finally {
          this.unrollRecursionContexts(_parentctx);
        }
        return localctx;
      }
      primary() {
        let localctx = new PrimaryContext(this, this._ctx, this.state);
        this.enterRule(localctx, 26, _PangParser.RULE_primary);
        try {
          this.state = 187;
          this._errHandler.sync(this);
          var la_ = this._interp.adaptivePredict(this._input, 13, this._ctx);
          switch (la_) {
            case 1:
              this.enterOuterAlt(localctx, 1);
              this.state = 176;
              this.match(_PangParser.NUMBER);
              break;
            case 2:
              this.enterOuterAlt(localctx, 2);
              this.state = 177;
              this.match(_PangParser.STRING);
              break;
            case 3:
              this.enterOuterAlt(localctx, 3);
              this.state = 178;
              this.match(_PangParser.T__30);
              break;
            case 4:
              this.enterOuterAlt(localctx, 4);
              this.state = 179;
              this.match(_PangParser.T__31);
              break;
            case 5:
              this.enterOuterAlt(localctx, 5);
              this.state = 180;
              this.match(_PangParser.IDENT);
              break;
            case 6:
              this.enterOuterAlt(localctx, 6);
              this.state = 181;
              this.printCall();
              break;
            case 7:
              this.enterOuterAlt(localctx, 7);
              this.state = 182;
              this.functionCall();
              break;
            case 8:
              this.enterOuterAlt(localctx, 8);
              this.state = 183;
              this.match(_PangParser.T__2);
              this.state = 184;
              this.expr(0);
              this.state = 185;
              this.match(_PangParser.T__4);
              break;
          }
        } catch (re) {
          if (re instanceof _antlr.default.error.RecognitionException) {
            localctx.exception = re;
            this._errHandler.reportError(this, re);
            this._errHandler.recover(this, re);
          } else {
            throw re;
          }
        } finally {
          this.exitRule();
        }
        return localctx;
      }
      options_() {
        let localctx = new Options_Context(this, this._ctx, this.state);
        this.enterRule(localctx, 28, _PangParser.RULE_options_);
        var _la = 0;
        try {
          this.enterOuterAlt(localctx, 1);
          this.state = 189;
          this.match(_PangParser.T__6);
          this.state = 191;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
          if (_la === 38) {
            this.state = 190;
            this.match(_PangParser.WS);
          }
          this.state = 193;
          this.optionPair();
          this.state = 201;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
          while (_la === 4) {
            this.state = 194;
            this.match(_PangParser.T__3);
            this.state = 196;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            if (_la === 38) {
              this.state = 195;
              this.match(_PangParser.WS);
            }
            this.state = 198;
            this.optionPair();
            this.state = 203;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
          }
          this.state = 205;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
          if (_la === 38) {
            this.state = 204;
            this.match(_PangParser.WS);
          }
          this.state = 207;
          this.match(_PangParser.T__7);
        } catch (re) {
          if (re instanceof _antlr.default.error.RecognitionException) {
            localctx.exception = re;
            this._errHandler.reportError(this, re);
            this._errHandler.recover(this, re);
          } else {
            throw re;
          }
        } finally {
          this.exitRule();
        }
        return localctx;
      }
      optionPair() {
        let localctx = new OptionPairContext(this, this._ctx, this.state);
        this.enterRule(localctx, 30, _PangParser.RULE_optionPair);
        var _la = 0;
        try {
          this.enterOuterAlt(localctx, 1);
          this.state = 209;
          this.optionKey();
          this.state = 211;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
          if (_la === 38) {
            this.state = 210;
            this.match(_PangParser.WS);
          }
          this.state = 213;
          this.match(_PangParser.T__29);
          this.state = 215;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
          if (_la === 38) {
            this.state = 214;
            this.match(_PangParser.WS);
          }
          this.state = 217;
          this.optionValue();
        } catch (re) {
          if (re instanceof _antlr.default.error.RecognitionException) {
            localctx.exception = re;
            this._errHandler.reportError(this, re);
            this._errHandler.recover(this, re);
          } else {
            throw re;
          }
        } finally {
          this.exitRule();
        }
        return localctx;
      }
      optionKey() {
        let localctx = new OptionKeyContext(this, this._ctx, this.state);
        this.enterRule(localctx, 32, _PangParser.RULE_optionKey);
        var _la = 0;
        try {
          this.enterOuterAlt(localctx, 1);
          this.state = 219;
          _la = this._input.LA(1);
          if (!(_la === 33 || _la === 36)) {
            this._errHandler.recoverInline(this);
          } else {
            this._errHandler.reportMatch(this);
            this.consume();
          }
        } catch (re) {
          if (re instanceof _antlr.default.error.RecognitionException) {
            localctx.exception = re;
            this._errHandler.reportError(this, re);
            this._errHandler.recover(this, re);
          } else {
            throw re;
          }
        } finally {
          this.exitRule();
        }
        return localctx;
      }
      optionValue() {
        let localctx = new OptionValueContext(this, this._ctx, this.state);
        this.enterRule(localctx, 34, _PangParser.RULE_optionValue);
        try {
          this.state = 226;
          this._errHandler.sync(this);
          var la_ = this._interp.adaptivePredict(this._input, 20, this._ctx);
          switch (la_) {
            case 1:
              this.enterOuterAlt(localctx, 1);
              this.state = 221;
              this.match(_PangParser.STRING);
              break;
            case 2:
              this.enterOuterAlt(localctx, 2);
              this.state = 222;
              this.match(_PangParser.NUMBER);
              break;
            case 3:
              this.enterOuterAlt(localctx, 3);
              this.state = 223;
              this.match(_PangParser.T__30);
              break;
            case 4:
              this.enterOuterAlt(localctx, 4);
              this.state = 224;
              this.match(_PangParser.T__31);
              break;
            case 5:
              this.enterOuterAlt(localctx, 5);
              this.state = 225;
              this.expr(0);
              break;
          }
        } catch (re) {
          if (re instanceof _antlr.default.error.RecognitionException) {
            localctx.exception = re;
            this._errHandler.reportError(this, re);
            this._errHandler.recover(this, re);
          } else {
            throw re;
          }
        } finally {
          this.exitRule();
        }
        return localctx;
      }
      functionCall() {
        let localctx = new FunctionCallContext(this, this._ctx, this.state);
        this.enterRule(localctx, 36, _PangParser.RULE_functionCall);
        var _la = 0;
        try {
          this.enterOuterAlt(localctx, 1);
          this.state = 228;
          this.match(_PangParser.IDENT);
          this.state = 229;
          this.match(_PangParser.T__2);
          this.state = 238;
          this._errHandler.sync(this);
          _la = this._input.LA(1);
          if ((_la & ~31) === 0 && (1 << _la & 2147516936) !== 0 || (_la - 32 & ~31) === 0 && (1 << _la - 32 & 51) !== 0) {
            this.state = 230;
            this.expr(0);
            this.state = 235;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            while (_la === 4) {
              this.state = 231;
              this.match(_PangParser.T__3);
              this.state = 232;
              this.expr(0);
              this.state = 237;
              this._errHandler.sync(this);
              _la = this._input.LA(1);
            }
          }
          this.state = 240;
          this.match(_PangParser.T__4);
        } catch (re) {
          if (re instanceof _antlr.default.error.RecognitionException) {
            localctx.exception = re;
            this._errHandler.reportError(this, re);
            this._errHandler.recover(this, re);
          } else {
            throw re;
          }
        } finally {
          this.exitRule();
        }
        return localctx;
      }
    };
    var PangParser2 = _PangParser;
    __publicField(PangParser2, "grammarFileName", "Pang.g4");
    __publicField(PangParser2, "literalNames", [null, "';'", "'on'", "'('", "','", "')'", "'*'", "'{'", "'}'", "'print'", "'let'", "'const'", "'='", "'if'", "'else'", "'!'", "'/'", "'+'", "'-'", "'<'", "'<='", "'>'", "'>='", "'=='", "'!='", "'==='", "'!=='", "'&&'", "'||'", "'?'", "':'", "'true'", "'false'"]);
    __publicField(PangParser2, "symbolicNames", [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "IDENT", "POWER", "CONCAT", "STRING", "NUMBER", "WS"]);
    __publicField(PangParser2, "ruleNames", ["program", "statementItem", "statement", "onCall", "inlineBlock", "inlineBlockBody", "inlineStatement", "block", "printCall", "varDecl", "assignStmt", "ifStmt", "expr", "primary", "options_", "optionPair", "optionKey", "optionValue", "functionCall"]);
    exports2.default = PangParser2;
    PangParser2.EOF = _antlr.default.Token.EOF;
    PangParser2.T__0 = 1;
    PangParser2.T__1 = 2;
    PangParser2.T__2 = 3;
    PangParser2.T__3 = 4;
    PangParser2.T__4 = 5;
    PangParser2.T__5 = 6;
    PangParser2.T__6 = 7;
    PangParser2.T__7 = 8;
    PangParser2.T__8 = 9;
    PangParser2.T__9 = 10;
    PangParser2.T__10 = 11;
    PangParser2.T__11 = 12;
    PangParser2.T__12 = 13;
    PangParser2.T__13 = 14;
    PangParser2.T__14 = 15;
    PangParser2.T__15 = 16;
    PangParser2.T__16 = 17;
    PangParser2.T__17 = 18;
    PangParser2.T__18 = 19;
    PangParser2.T__19 = 20;
    PangParser2.T__20 = 21;
    PangParser2.T__21 = 22;
    PangParser2.T__22 = 23;
    PangParser2.T__23 = 24;
    PangParser2.T__24 = 25;
    PangParser2.T__25 = 26;
    PangParser2.T__26 = 27;
    PangParser2.T__27 = 28;
    PangParser2.T__28 = 29;
    PangParser2.T__29 = 30;
    PangParser2.T__30 = 31;
    PangParser2.T__31 = 32;
    PangParser2.IDENT = 33;
    PangParser2.POWER = 34;
    PangParser2.CONCAT = 35;
    PangParser2.STRING = 36;
    PangParser2.NUMBER = 37;
    PangParser2.WS = 38;
    PangParser2.RULE_program = 0;
    PangParser2.RULE_statementItem = 1;
    PangParser2.RULE_statement = 2;
    PangParser2.RULE_onCall = 3;
    PangParser2.RULE_inlineBlock = 4;
    PangParser2.RULE_inlineBlockBody = 5;
    PangParser2.RULE_inlineStatement = 6;
    PangParser2.RULE_block = 7;
    PangParser2.RULE_printCall = 8;
    PangParser2.RULE_varDecl = 9;
    PangParser2.RULE_assignStmt = 10;
    PangParser2.RULE_ifStmt = 11;
    PangParser2.RULE_expr = 12;
    PangParser2.RULE_primary = 13;
    PangParser2.RULE_options_ = 14;
    PangParser2.RULE_optionPair = 15;
    PangParser2.RULE_optionKey = 16;
    PangParser2.RULE_optionValue = 17;
    PangParser2.RULE_functionCall = 18;
    var ProgramContext = class extends _antlr.default.ParserRuleContext {
      constructor(parser, parent, invokingState) {
        if (parent === void 0) {
          parent = null;
        }
        if (invokingState === void 0 || invokingState === null) {
          invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = PangParser2.RULE_program;
      }
      EOF() {
        return this.getToken(PangParser2.EOF, 0);
      }
      statement = function(i) {
        if (i === void 0) {
          i = null;
        }
        if (i === null) {
          return this.getTypedRuleContexts(StatementContext);
        } else {
          return this.getTypedRuleContext(StatementContext, i);
        }
      };
      enterRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.enterProgram(this);
        }
      }
      exitRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.exitProgram(this);
        }
      }
      accept(visitor) {
        if (visitor instanceof _PangVisitor.default) {
          return visitor.visitProgram(this);
        } else {
          return visitor.visitChildren(this);
        }
      }
    };
    var StatementItemContext = class extends _antlr.default.ParserRuleContext {
      constructor(parser, parent, invokingState) {
        if (parent === void 0) {
          parent = null;
        }
        if (invokingState === void 0 || invokingState === null) {
          invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = PangParser2.RULE_statementItem;
      }
      onCall() {
        return this.getTypedRuleContext(OnCallContext, 0);
      }
      printCall() {
        return this.getTypedRuleContext(PrintCallContext, 0);
      }
      functionCall() {
        return this.getTypedRuleContext(FunctionCallContext, 0);
      }
      varDecl() {
        return this.getTypedRuleContext(VarDeclContext, 0);
      }
      assignStmt() {
        return this.getTypedRuleContext(AssignStmtContext, 0);
      }
      enterRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.enterStatementItem(this);
        }
      }
      exitRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.exitStatementItem(this);
        }
      }
      accept(visitor) {
        if (visitor instanceof _PangVisitor.default) {
          return visitor.visitStatementItem(this);
        } else {
          return visitor.visitChildren(this);
        }
      }
    };
    var StatementContext = class extends _antlr.default.ParserRuleContext {
      constructor(parser, parent, invokingState) {
        if (parent === void 0) {
          parent = null;
        }
        if (invokingState === void 0 || invokingState === null) {
          invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = PangParser2.RULE_statement;
      }
      statementItem() {
        return this.getTypedRuleContext(StatementItemContext, 0);
      }
      ifStmt() {
        return this.getTypedRuleContext(IfStmtContext, 0);
      }
      enterRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.enterStatement(this);
        }
      }
      exitRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.exitStatement(this);
        }
      }
      accept(visitor) {
        if (visitor instanceof _PangVisitor.default) {
          return visitor.visitStatement(this);
        } else {
          return visitor.visitChildren(this);
        }
      }
    };
    var OnCallContext = class extends _antlr.default.ParserRuleContext {
      constructor(parser, parent, invokingState) {
        if (parent === void 0) {
          parent = null;
        }
        if (invokingState === void 0 || invokingState === null) {
          invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = PangParser2.RULE_onCall;
      }
      STRING() {
        return this.getToken(PangParser2.STRING, 0);
      }
      inlineBlock() {
        return this.getTypedRuleContext(InlineBlockContext, 0);
      }
      enterRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.enterOnCall(this);
        }
      }
      exitRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.exitOnCall(this);
        }
      }
      accept(visitor) {
        if (visitor instanceof _PangVisitor.default) {
          return visitor.visitOnCall(this);
        } else {
          return visitor.visitChildren(this);
        }
      }
    };
    var InlineBlockContext = class extends _antlr.default.ParserRuleContext {
      constructor(parser, parent, invokingState) {
        if (parent === void 0) {
          parent = null;
        }
        if (invokingState === void 0 || invokingState === null) {
          invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = PangParser2.RULE_inlineBlock;
      }
      inlineBlockBody() {
        return this.getTypedRuleContext(InlineBlockBodyContext, 0);
      }
      enterRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.enterInlineBlock(this);
        }
      }
      exitRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.exitInlineBlock(this);
        }
      }
      accept(visitor) {
        if (visitor instanceof _PangVisitor.default) {
          return visitor.visitInlineBlock(this);
        } else {
          return visitor.visitChildren(this);
        }
      }
    };
    var InlineBlockBodyContext = class extends _antlr.default.ParserRuleContext {
      constructor(parser, parent, invokingState) {
        if (parent === void 0) {
          parent = null;
        }
        if (invokingState === void 0 || invokingState === null) {
          invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = PangParser2.RULE_inlineBlockBody;
      }
      inlineStatement = function(i) {
        if (i === void 0) {
          i = null;
        }
        if (i === null) {
          return this.getTypedRuleContexts(InlineStatementContext);
        } else {
          return this.getTypedRuleContext(InlineStatementContext, i);
        }
      };
      enterRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.enterInlineBlockBody(this);
        }
      }
      exitRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.exitInlineBlockBody(this);
        }
      }
      accept(visitor) {
        if (visitor instanceof _PangVisitor.default) {
          return visitor.visitInlineBlockBody(this);
        } else {
          return visitor.visitChildren(this);
        }
      }
    };
    var InlineStatementContext = class extends _antlr.default.ParserRuleContext {
      constructor(parser, parent, invokingState) {
        if (parent === void 0) {
          parent = null;
        }
        if (invokingState === void 0 || invokingState === null) {
          invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = PangParser2.RULE_inlineStatement;
      }
      statementItem() {
        return this.getTypedRuleContext(StatementItemContext, 0);
      }
      ifStmt() {
        return this.getTypedRuleContext(IfStmtContext, 0);
      }
      enterRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.enterInlineStatement(this);
        }
      }
      exitRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.exitInlineStatement(this);
        }
      }
      accept(visitor) {
        if (visitor instanceof _PangVisitor.default) {
          return visitor.visitInlineStatement(this);
        } else {
          return visitor.visitChildren(this);
        }
      }
    };
    var BlockContext = class extends _antlr.default.ParserRuleContext {
      constructor(parser, parent, invokingState) {
        if (parent === void 0) {
          parent = null;
        }
        if (invokingState === void 0 || invokingState === null) {
          invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = PangParser2.RULE_block;
      }
      statement = function(i) {
        if (i === void 0) {
          i = null;
        }
        if (i === null) {
          return this.getTypedRuleContexts(StatementContext);
        } else {
          return this.getTypedRuleContext(StatementContext, i);
        }
      };
      enterRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.enterBlock(this);
        }
      }
      exitRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.exitBlock(this);
        }
      }
      accept(visitor) {
        if (visitor instanceof _PangVisitor.default) {
          return visitor.visitBlock(this);
        } else {
          return visitor.visitChildren(this);
        }
      }
    };
    var PrintCallContext = class extends _antlr.default.ParserRuleContext {
      constructor(parser, parent, invokingState) {
        if (parent === void 0) {
          parent = null;
        }
        if (invokingState === void 0 || invokingState === null) {
          invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = PangParser2.RULE_printCall;
      }
      expr() {
        return this.getTypedRuleContext(ExprContext, 0);
      }
      options_() {
        return this.getTypedRuleContext(Options_Context, 0);
      }
      enterRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.enterPrintCall(this);
        }
      }
      exitRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.exitPrintCall(this);
        }
      }
      accept(visitor) {
        if (visitor instanceof _PangVisitor.default) {
          return visitor.visitPrintCall(this);
        } else {
          return visitor.visitChildren(this);
        }
      }
    };
    var VarDeclContext = class extends _antlr.default.ParserRuleContext {
      constructor(parser, parent, invokingState) {
        if (parent === void 0) {
          parent = null;
        }
        if (invokingState === void 0 || invokingState === null) {
          invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = PangParser2.RULE_varDecl;
      }
      IDENT() {
        return this.getToken(PangParser2.IDENT, 0);
      }
      expr() {
        return this.getTypedRuleContext(ExprContext, 0);
      }
      enterRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.enterVarDecl(this);
        }
      }
      exitRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.exitVarDecl(this);
        }
      }
      accept(visitor) {
        if (visitor instanceof _PangVisitor.default) {
          return visitor.visitVarDecl(this);
        } else {
          return visitor.visitChildren(this);
        }
      }
    };
    var AssignStmtContext = class extends _antlr.default.ParserRuleContext {
      constructor(parser, parent, invokingState) {
        if (parent === void 0) {
          parent = null;
        }
        if (invokingState === void 0 || invokingState === null) {
          invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = PangParser2.RULE_assignStmt;
      }
      IDENT() {
        return this.getToken(PangParser2.IDENT, 0);
      }
      expr() {
        return this.getTypedRuleContext(ExprContext, 0);
      }
      enterRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.enterAssignStmt(this);
        }
      }
      exitRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.exitAssignStmt(this);
        }
      }
      accept(visitor) {
        if (visitor instanceof _PangVisitor.default) {
          return visitor.visitAssignStmt(this);
        } else {
          return visitor.visitChildren(this);
        }
      }
    };
    var IfStmtContext = class extends _antlr.default.ParserRuleContext {
      constructor(parser, parent, invokingState) {
        if (parent === void 0) {
          parent = null;
        }
        if (invokingState === void 0 || invokingState === null) {
          invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = PangParser2.RULE_ifStmt;
      }
      expr = function(i) {
        if (i === void 0) {
          i = null;
        }
        if (i === null) {
          return this.getTypedRuleContexts(ExprContext);
        } else {
          return this.getTypedRuleContext(ExprContext, i);
        }
      };
      block = function(i) {
        if (i === void 0) {
          i = null;
        }
        if (i === null) {
          return this.getTypedRuleContexts(BlockContext);
        } else {
          return this.getTypedRuleContext(BlockContext, i);
        }
      };
      enterRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.enterIfStmt(this);
        }
      }
      exitRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.exitIfStmt(this);
        }
      }
      accept(visitor) {
        if (visitor instanceof _PangVisitor.default) {
          return visitor.visitIfStmt(this);
        } else {
          return visitor.visitChildren(this);
        }
      }
    };
    var ExprContext = class extends _antlr.default.ParserRuleContext {
      constructor(parser, parent, invokingState) {
        if (parent === void 0) {
          parent = null;
        }
        if (invokingState === void 0 || invokingState === null) {
          invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = PangParser2.RULE_expr;
      }
      primary() {
        return this.getTypedRuleContext(PrimaryContext, 0);
      }
      expr = function(i) {
        if (i === void 0) {
          i = null;
        }
        if (i === null) {
          return this.getTypedRuleContexts(ExprContext);
        } else {
          return this.getTypedRuleContext(ExprContext, i);
        }
      };
      POWER() {
        return this.getToken(PangParser2.POWER, 0);
      }
      CONCAT() {
        return this.getToken(PangParser2.CONCAT, 0);
      }
      enterRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.enterExpr(this);
        }
      }
      exitRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.exitExpr(this);
        }
      }
      accept(visitor) {
        if (visitor instanceof _PangVisitor.default) {
          return visitor.visitExpr(this);
        } else {
          return visitor.visitChildren(this);
        }
      }
    };
    var PrimaryContext = class extends _antlr.default.ParserRuleContext {
      constructor(parser, parent, invokingState) {
        if (parent === void 0) {
          parent = null;
        }
        if (invokingState === void 0 || invokingState === null) {
          invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = PangParser2.RULE_primary;
      }
      NUMBER() {
        return this.getToken(PangParser2.NUMBER, 0);
      }
      STRING() {
        return this.getToken(PangParser2.STRING, 0);
      }
      IDENT() {
        return this.getToken(PangParser2.IDENT, 0);
      }
      printCall() {
        return this.getTypedRuleContext(PrintCallContext, 0);
      }
      functionCall() {
        return this.getTypedRuleContext(FunctionCallContext, 0);
      }
      expr() {
        return this.getTypedRuleContext(ExprContext, 0);
      }
      enterRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.enterPrimary(this);
        }
      }
      exitRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.exitPrimary(this);
        }
      }
      accept(visitor) {
        if (visitor instanceof _PangVisitor.default) {
          return visitor.visitPrimary(this);
        } else {
          return visitor.visitChildren(this);
        }
      }
    };
    var Options_Context = class extends _antlr.default.ParserRuleContext {
      constructor(parser, parent, invokingState) {
        if (parent === void 0) {
          parent = null;
        }
        if (invokingState === void 0 || invokingState === null) {
          invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = PangParser2.RULE_options_;
      }
      optionPair = function(i) {
        if (i === void 0) {
          i = null;
        }
        if (i === null) {
          return this.getTypedRuleContexts(OptionPairContext);
        } else {
          return this.getTypedRuleContext(OptionPairContext, i);
        }
      };
      WS = function(i) {
        if (i === void 0) {
          i = null;
        }
        if (i === null) {
          return this.getTokens(PangParser2.WS);
        } else {
          return this.getToken(PangParser2.WS, i);
        }
      };
      enterRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.enterOptions_(this);
        }
      }
      exitRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.exitOptions_(this);
        }
      }
      accept(visitor) {
        if (visitor instanceof _PangVisitor.default) {
          return visitor.visitOptions_(this);
        } else {
          return visitor.visitChildren(this);
        }
      }
    };
    var OptionPairContext = class extends _antlr.default.ParserRuleContext {
      constructor(parser, parent, invokingState) {
        if (parent === void 0) {
          parent = null;
        }
        if (invokingState === void 0 || invokingState === null) {
          invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = PangParser2.RULE_optionPair;
      }
      optionKey() {
        return this.getTypedRuleContext(OptionKeyContext, 0);
      }
      optionValue() {
        return this.getTypedRuleContext(OptionValueContext, 0);
      }
      WS = function(i) {
        if (i === void 0) {
          i = null;
        }
        if (i === null) {
          return this.getTokens(PangParser2.WS);
        } else {
          return this.getToken(PangParser2.WS, i);
        }
      };
      enterRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.enterOptionPair(this);
        }
      }
      exitRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.exitOptionPair(this);
        }
      }
      accept(visitor) {
        if (visitor instanceof _PangVisitor.default) {
          return visitor.visitOptionPair(this);
        } else {
          return visitor.visitChildren(this);
        }
      }
    };
    var OptionKeyContext = class extends _antlr.default.ParserRuleContext {
      constructor(parser, parent, invokingState) {
        if (parent === void 0) {
          parent = null;
        }
        if (invokingState === void 0 || invokingState === null) {
          invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = PangParser2.RULE_optionKey;
      }
      STRING() {
        return this.getToken(PangParser2.STRING, 0);
      }
      IDENT() {
        return this.getToken(PangParser2.IDENT, 0);
      }
      enterRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.enterOptionKey(this);
        }
      }
      exitRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.exitOptionKey(this);
        }
      }
      accept(visitor) {
        if (visitor instanceof _PangVisitor.default) {
          return visitor.visitOptionKey(this);
        } else {
          return visitor.visitChildren(this);
        }
      }
    };
    var OptionValueContext = class extends _antlr.default.ParserRuleContext {
      constructor(parser, parent, invokingState) {
        if (parent === void 0) {
          parent = null;
        }
        if (invokingState === void 0 || invokingState === null) {
          invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = PangParser2.RULE_optionValue;
      }
      STRING() {
        return this.getToken(PangParser2.STRING, 0);
      }
      NUMBER() {
        return this.getToken(PangParser2.NUMBER, 0);
      }
      expr() {
        return this.getTypedRuleContext(ExprContext, 0);
      }
      enterRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.enterOptionValue(this);
        }
      }
      exitRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.exitOptionValue(this);
        }
      }
      accept(visitor) {
        if (visitor instanceof _PangVisitor.default) {
          return visitor.visitOptionValue(this);
        } else {
          return visitor.visitChildren(this);
        }
      }
    };
    var FunctionCallContext = class extends _antlr.default.ParserRuleContext {
      constructor(parser, parent, invokingState) {
        if (parent === void 0) {
          parent = null;
        }
        if (invokingState === void 0 || invokingState === null) {
          invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = PangParser2.RULE_functionCall;
      }
      IDENT() {
        return this.getToken(PangParser2.IDENT, 0);
      }
      expr = function(i) {
        if (i === void 0) {
          i = null;
        }
        if (i === null) {
          return this.getTypedRuleContexts(ExprContext);
        } else {
          return this.getTypedRuleContext(ExprContext, i);
        }
      };
      enterRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.enterFunctionCall(this);
        }
      }
      exitRule(listener) {
        if (listener instanceof _PangListener.default) {
          listener.exitFunctionCall(this);
        }
      }
      accept(visitor) {
        if (visitor instanceof _PangVisitor.default) {
          return visitor.visitFunctionCall(this);
        } else {
          return visitor.visitChildren(this);
        }
      }
    };
    PangParser2.ProgramContext = ProgramContext;
    PangParser2.StatementItemContext = StatementItemContext;
    PangParser2.StatementContext = StatementContext;
    PangParser2.OnCallContext = OnCallContext;
    PangParser2.InlineBlockContext = InlineBlockContext;
    PangParser2.InlineBlockBodyContext = InlineBlockBodyContext;
    PangParser2.InlineStatementContext = InlineStatementContext;
    PangParser2.BlockContext = BlockContext;
    PangParser2.PrintCallContext = PrintCallContext;
    PangParser2.VarDeclContext = VarDeclContext;
    PangParser2.AssignStmtContext = AssignStmtContext;
    PangParser2.IfStmtContext = IfStmtContext;
    PangParser2.ExprContext = ExprContext;
    PangParser2.PrimaryContext = PrimaryContext;
    PangParser2.Options_Context = Options_Context;
    PangParser2.OptionPairContext = OptionPairContext;
    PangParser2.OptionKeyContext = OptionKeyContext;
    PangParser2.OptionValueContext = OptionValueContext;
    PangParser2.FunctionCallContext = FunctionCallContext;
  }
});

// ../pm-blocks/msg/js/en.js
var require_en = __commonJS({
  "../pm-blocks/msg/js/en.js"() {
    "use strict";
    goog.provide("Blockly.Msg.en");
    goog.require("Blockly.Msg");
    Blockly.Msg["CONTROL_FOREVER"] = "forever";
    Blockly.Msg["CONTROL_REPEAT"] = "repeat %1";
    Blockly.Msg["CONTROL_IF"] = "if %1 then";
    Blockly.Msg["CONTROL_ELSE"] = "else";
    Blockly.Msg["CONTROL_STOP"] = "stop";
    Blockly.Msg["CONTROL_STOP_ALL"] = "all";
    Blockly.Msg["CONTROL_STOP_THIS"] = "this script";
    Blockly.Msg["CONTROL_STOP_OTHER"] = "other scripts in sprite";
    Blockly.Msg["CONTROL_WAIT"] = "wait %1 seconds";
    Blockly.Msg["CONTROL_WAITUNTIL"] = "wait until %1";
    Blockly.Msg["CONTROL_REPEATUNTIL"] = "repeat until %1";
    Blockly.Msg["CONTROL_WHILE"] = "while %1";
    Blockly.Msg["CONTROL_FOREACH"] = "for each %1 in %2";
    Blockly.Msg["CONTROL_STARTASCLONE"] = "when I start as a clone";
    Blockly.Msg["CONTROL_CREATECLONEOF"] = "create clone of %1";
    Blockly.Msg["CONTROL_CREATECLONEOF_MYSELF"] = "myself";
    Blockly.Msg["CONTROL_DELETETHISCLONE"] = "delete this clone";
    Blockly.Msg["CONTROL_COUNTER"] = "counter";
    Blockly.Msg["CONTROL_INCRCOUNTER"] = "increment counter";
    Blockly.Msg["CONTROL_CLEARCOUNTER"] = "clear counter";
    Blockly.Msg["CONTROL_ALLATONCE"] = "all at once";
    Blockly.Msg["DATA_SETVARIABLETO"] = "set %1 to %2";
    Blockly.Msg["DATA_CHANGEVARIABLEBY"] = "change %1 by %2";
    Blockly.Msg["DATA_SHOWVARIABLE"] = "show variable %1";
    Blockly.Msg["DATA_HIDEVARIABLE"] = "hide variable %1";
    Blockly.Msg["DATA_ADDTOLIST"] = "add %1 to %2";
    Blockly.Msg["DATA_DELETEOFLIST"] = "delete %1 of %2";
    Blockly.Msg["DATA_DELETEALLOFLIST"] = "delete all of %1";
    Blockly.Msg["DATA_INSERTATLIST"] = "insert %1 at %2 of %3";
    Blockly.Msg["DATA_REPLACEITEMOFLIST"] = "replace item %1 of %2 with %3";
    Blockly.Msg["DATA_ITEMOFLIST"] = "item %1 of %2";
    Blockly.Msg["DATA_ITEMNUMOFLIST"] = "item # of %1 in %2";
    Blockly.Msg["DATA_LENGTHOFLIST"] = "length of %1";
    Blockly.Msg["DATA_LISTCONTAINSITEM"] = "%1 contains %2?";
    Blockly.Msg["DATA_SHOWLIST"] = "show list %1";
    Blockly.Msg["DATA_HIDELIST"] = "hide list %1";
    Blockly.Msg["DATA_INDEX_ALL"] = "all";
    Blockly.Msg["DATA_INDEX_LAST"] = "last";
    Blockly.Msg["DATA_INDEX_RANDOM"] = "random";
    Blockly.Msg["EVENT_WHENFLAGCLICKED"] = "when %1 clicked";
    Blockly.Msg["EVENT_WHENANYTHING"] = "when %1";
    Blockly.Msg["EVENT_WHENTHISSPRITECLICKED"] = "when this sprite clicked";
    Blockly.Msg["EVENT_WHENSTAGECLICKED"] = "when stage clicked";
    Blockly.Msg["EVENT_WHENTOUCHINGOBJECT"] = "when this sprite touches %1";
    Blockly.Msg["EVENT_WHENBROADCASTRECEIVED"] = "when I receive %1";
    Blockly.Msg["EVENT_WHENBACKDROPSWITCHESTO"] = "when backdrop switches to %1";
    Blockly.Msg["EVENT_WHENGREATERTHAN"] = "when %1 > %2";
    Blockly.Msg["EVENT_WHENGREATERTHAN_TIMER"] = "timer";
    Blockly.Msg["EVENT_WHENGREATERTHAN_LOUDNESS"] = "loudness";
    Blockly.Msg["EVENT_BROADCAST"] = "broadcast %1";
    Blockly.Msg["EVENT_BROADCASTANDWAIT"] = "broadcast %1 and wait";
    Blockly.Msg["EVENT_WHENKEYPRESSED"] = "when %1 key pressed";
    Blockly.Msg["EVENT_WHENKEYPRESSED_SPACE"] = "space";
    Blockly.Msg["EVENT_WHENKEYPRESSED_LEFT"] = "left arrow";
    Blockly.Msg["EVENT_WHENKEYPRESSED_RIGHT"] = "right arrow";
    Blockly.Msg["EVENT_WHENKEYPRESSED_DOWN"] = "down arrow";
    Blockly.Msg["EVENT_WHENKEYPRESSED_UP"] = "up arrow";
    Blockly.Msg["EVENT_WHENKEYPRESSED_ANY"] = "any";
    Blockly.Msg["LOOKS_SAYFORSECS"] = "say %1 for %2 seconds";
    Blockly.Msg["LOOKS_SAY"] = "say %1";
    Blockly.Msg["LOOKS_HELLO"] = "Hello!";
    Blockly.Msg["LOOKS_THINKFORSECS"] = "think %1 for %2 seconds";
    Blockly.Msg["LOOKS_THINK"] = "think %1";
    Blockly.Msg["LOOKS_HMM"] = "Hmm...";
    Blockly.Msg["LOOKS_SHOW"] = "show";
    Blockly.Msg["LOOKS_HIDE"] = "hide";
    Blockly.Msg["LOOKS_HIDEALLSPRITES"] = "hide all sprites";
    Blockly.Msg["LOOKS_EFFECT_COLOR"] = "color";
    Blockly.Msg["LOOKS_EFFECT_FISHEYE"] = "fisheye";
    Blockly.Msg["LOOKS_EFFECT_WHIRL"] = "whirl";
    Blockly.Msg["LOOKS_EFFECT_PIXELATE"] = "pixelate";
    Blockly.Msg["LOOKS_EFFECT_MOSAIC"] = "mosaic";
    Blockly.Msg["LOOKS_EFFECT_BRIGHTNESS"] = "brightness";
    Blockly.Msg["LOOKS_EFFECT_GHOST"] = "ghost";
    Blockly.Msg["LOOKS_CHANGEEFFECTBY"] = "change %1 effect by %2";
    Blockly.Msg["LOOKS_SETEFFECTTO"] = "set %1 effect to %2";
    Blockly.Msg["LOOKS_CLEARGRAPHICEFFECTS"] = "clear graphic effects";
    Blockly.Msg["LOOKS_CHANGESIZEBY"] = "change size by %1";
    Blockly.Msg["LOOKS_SETSIZETO"] = "set size to %1 %";
    Blockly.Msg["LOOKS_SIZE"] = "size";
    Blockly.Msg["LOOKS_CHANGESTRETCHBY"] = "change stretch by %1";
    Blockly.Msg["LOOKS_SETSTRETCHTO"] = "set stretch to %1 %";
    Blockly.Msg["LOOKS_SWITCHCOSTUMETO"] = "switch costume to %1";
    Blockly.Msg["LOOKS_NEXTCOSTUME"] = "next costume";
    Blockly.Msg["LOOKS_PREVIOUSCOSTUME"] = "previous costume";
    Blockly.Msg["LOOKS_RANDOMCOSTUME"] = "random costume";
    Blockly.Msg["LOOKS_SWITCHBACKDROPTO"] = "switch backdrop to %1";
    Blockly.Msg["LOOKS_GOTOFRONTBACK"] = "go to %1 layer";
    Blockly.Msg["LOOKS_GOTOFRONTBACK_FRONT"] = "front";
    Blockly.Msg["LOOKS_GOTOFRONTBACK_BACK"] = "back";
    Blockly.Msg["LOOKS_GOFORWARDBACKWARDLAYERS"] = "go %1 %2 layers";
    Blockly.Msg["LOOKS_GOFORWARDBACKWARDLAYERS_FORWARD"] = "forward";
    Blockly.Msg["LOOKS_GOFORWARDBACKWARDLAYERS_BACKWARD"] = "backward";
    Blockly.Msg["LOOKS_BACKDROPNUMBERNAME"] = "backdrop %1";
    Blockly.Msg["LOOKS_COSTUMENUMBERNAME"] = "costume %1";
    Blockly.Msg["LOOKS_NUMBERNAME_NUMBER"] = "number";
    Blockly.Msg["LOOKS_NUMBERNAME_NAME"] = "name";
    Blockly.Msg["LOOKS_SWITCHBACKDROPTOANDWAIT"] = "switch backdrop to %1 and wait";
    Blockly.Msg["LOOKS_NEXTBACKDROP_BLOCK"] = "next backdrop";
    Blockly.Msg["LOOKS_NEXTBACKDROP"] = "next backdrop";
    Blockly.Msg["LOOKS_PREVIOUSBACKDROP"] = "previous backdrop";
    Blockly.Msg["LOOKS_RANDOMBACKDROP"] = "random backdrop";
    Blockly.Msg["MOTION_MOVESTEPS"] = "move %1 steps";
    Blockly.Msg["MOTION_TURNLEFT"] = "turn %1 %2 degrees";
    Blockly.Msg["MOTION_TURNRIGHT"] = "turn %1 %2 degrees";
    Blockly.Msg["MOTION_POINTINDIRECTION"] = "point in direction %1";
    Blockly.Msg["MOTION_POINTTOWARDS"] = "point towards %1";
    Blockly.Msg["MOTION_POINTTOWARDS_POINTER"] = "mouse-pointer";
    Blockly.Msg["MOTION_POINTTOWARDS_RANDOM"] = "random direction";
    Blockly.Msg["MOTION_GOTO"] = "go to %1";
    Blockly.Msg["MOTION_GOTO_POINTER"] = "mouse-pointer";
    Blockly.Msg["MOTION_GOTO_RANDOM"] = "random position";
    Blockly.Msg["MOTION_GOTOXY"] = "go to x: %1 y: %2";
    Blockly.Msg["MOTION_GLIDESECSTOXY"] = "glide %1 secs to x: %2 y: %3";
    Blockly.Msg["MOTION_GLIDETO"] = "glide %1 secs to %2";
    Blockly.Msg["MOTION_GLIDETO_POINTER"] = "mouse-pointer";
    Blockly.Msg["MOTION_GLIDETO_RANDOM"] = "random position";
    Blockly.Msg["MOTION_CHANGEXBY"] = "change x by %1";
    Blockly.Msg["MOTION_SETX"] = "set x to %1";
    Blockly.Msg["MOTION_CHANGEYBY"] = "change y by %1";
    Blockly.Msg["MOTION_SETY"] = "set y to %1";
    Blockly.Msg["MOTION_IFONEDGEBOUNCE"] = "if on edge, bounce";
    Blockly.Msg["MOTION_SETROTATIONSTYLE"] = "set rotation style %1";
    Blockly.Msg["MOTION_SETROTATIONSTYLE_LEFTRIGHT"] = "left-right";
    Blockly.Msg["MOTION_SETROTATIONSTYLE_DONTROTATE"] = "don't rotate";
    Blockly.Msg["MOTION_SETROTATIONSTYLE_ALLAROUND"] = "all around";
    Blockly.Msg["MOTION_XPOSITION"] = "x position";
    Blockly.Msg["MOTION_YPOSITION"] = "y position";
    Blockly.Msg["MOTION_DIRECTION"] = "direction";
    Blockly.Msg["MOTION_SCROLLRIGHT"] = "scroll right %1";
    Blockly.Msg["MOTION_SCROLLUP"] = "scroll up %1";
    Blockly.Msg["MOTION_ALIGNSCENE"] = "align scene %1";
    Blockly.Msg["MOTION_ALIGNSCENE_BOTTOMLEFT"] = "bottom-left";
    Blockly.Msg["MOTION_ALIGNSCENE_BOTTOMRIGHT"] = "bottom-right";
    Blockly.Msg["MOTION_ALIGNSCENE_MIDDLE"] = "middle";
    Blockly.Msg["MOTION_ALIGNSCENE_TOPLEFT"] = "top-left";
    Blockly.Msg["MOTION_ALIGNSCENE_TOPRIGHT"] = "top-right";
    Blockly.Msg["MOTION_XSCROLL"] = "x scroll";
    Blockly.Msg["MOTION_YSCROLL"] = "y scroll";
    Blockly.Msg["MOTION_STAGE_SELECTED"] = "Stage selected: no motion blocks";
    Blockly.Msg["OPERATORS_ADD"] = "%1 + %2";
    Blockly.Msg["OPERATORS_SUBTRACT"] = "%1 - %2";
    Blockly.Msg["OPERATORS_MULTIPLY"] = "%1 * %2";
    Blockly.Msg["OPERATORS_DIVIDE"] = "%1 / %2";
    Blockly.Msg["OPERATORS_RANDOM"] = "pick random %1 to %2";
    Blockly.Msg["OPERATORS_GT"] = "%1 > %2";
    Blockly.Msg["OPERATORS_LT"] = "%1 < %2";
    Blockly.Msg["OPERATORS_EQUALS"] = "%1 = %2";
    Blockly.Msg["OPERATORS_AND"] = "%1 and %2";
    Blockly.Msg["OPERATORS_OR"] = "%1 or %2";
    Blockly.Msg["OPERATORS_NOT"] = "not %1";
    Blockly.Msg["OPERATORS_JOIN"] = "join %1 %2";
    Blockly.Msg["OPERATORS_JOIN3"] = "join %1 %2 %3";
    Blockly.Msg["OPERATORS_JOIN_APPLE"] = "apple";
    Blockly.Msg["OPERATORS_JOIN_BANANA"] = "banana";
    Blockly.Msg["OPERATORS_LETTERSFROMTOIN"] = "letters from %1 to %2 in %3";
    Blockly.Msg["OPERATORS_LETTEROF"] = "letter %1 of %2";
    Blockly.Msg["OPERATORS_LETTEROF_APPLE"] = "a";
    Blockly.Msg["OPERATORS_LENGTH"] = "length of %1";
    Blockly.Msg["OPERATORS_CONTAINS"] = "%1 contains %2?";
    Blockly.Msg["OPERATORS_MOD"] = "%1 mod %2";
    Blockly.Msg["OPERATORS_ROUND"] = "round %1";
    Blockly.Msg["OPERATORS_MATHOP"] = "%1 of %2";
    Blockly.Msg["OPERATORS_MATHOP_ABS"] = "abs";
    Blockly.Msg["OPERATORS_MATHOP_FLOOR"] = "floor";
    Blockly.Msg["OPERATORS_MATHOP_CEILING"] = "ceiling";
    Blockly.Msg["OPERATORS_MATHOP_SQRT"] = "sqrt";
    Blockly.Msg["OPERATORS_MATHOP_SIN"] = "sin";
    Blockly.Msg["OPERATORS_MATHOP_COS"] = "cos";
    Blockly.Msg["OPERATORS_MATHOP_TAN"] = "tan";
    Blockly.Msg["OPERATORS_MATHOP_ASIN"] = "asin";
    Blockly.Msg["OPERATORS_MATHOP_ACOS"] = "acos";
    Blockly.Msg["OPERATORS_MATHOP_ATAN"] = "atan";
    Blockly.Msg["OPERATORS_MATHOP_LN"] = "ln";
    Blockly.Msg["OPERATORS_MATHOP_LOG"] = "log";
    Blockly.Msg["OPERATORS_MATHOP_EEXP"] = "e ^";
    Blockly.Msg["OPERATORS_MATHOP_10EXP"] = "10 ^";
    Blockly.Msg["OPERATORS_ADVLOG"] = "log %1 %2";
    Blockly.Msg["PROCEDURES_DEFINITION"] = "define %1";
    Blockly.Msg["SENSING_TOUCHINGOBJECT"] = "touching %1?";
    Blockly.Msg["SENSING_TOUCHINGOBJECT_POINTER"] = "mouse-pointer";
    Blockly.Msg["SENSING_TOUCHINGOBJECT_EDGE"] = "edge";
    Blockly.Msg["SENSING_TOUCHINGCOLOR"] = "touching color %1?";
    Blockly.Msg["SENSING_COLORISTOUCHINGCOLOR"] = "color %1 is touching %2?";
    Blockly.Msg["SENSING_DISTANCETO"] = "distance to %1";
    Blockly.Msg["SENSING_DISTANCETO_POINTER"] = "mouse-pointer";
    Blockly.Msg["SENSING_ASKANDWAIT"] = "ask %1 and wait";
    Blockly.Msg["SENSING_ASK_TEXT"] = "What's your name?";
    Blockly.Msg["SENSING_ANSWER"] = "answer";
    Blockly.Msg["SENSING_KEYPRESSED"] = "key %1 pressed?";
    Blockly.Msg["SENSING_MOUSEDOWN"] = "mouse down?";
    Blockly.Msg["SENSING_MOUSEX"] = "mouse x";
    Blockly.Msg["SENSING_MOUSEY"] = "mouse y";
    Blockly.Msg["SENSING_SETDRAGMODE"] = "set drag mode %1";
    Blockly.Msg["SENSING_SETDRAGMODE_DRAGGABLE"] = "draggable";
    Blockly.Msg["SENSING_SETDRAGMODE_NOTDRAGGABLE"] = "not draggable";
    Blockly.Msg["SENSING_CLIPBOARDITEM"] = "clipboard item";
    Blockly.Msg["SENSING_ADDTOCLIPBOARD"] = "add %1 to clipboard";
    Blockly.Msg["SENSING_LOUDNESS"] = "loudness";
    Blockly.Msg["SENSING_LOUD"] = "loud?";
    Blockly.Msg["SENSING_TIMER"] = "timer";
    Blockly.Msg["SENSING_RESETTIMER"] = "reset timer";
    Blockly.Msg["SENSING_OF"] = "%1 of %2";
    Blockly.Msg["SENSING_OF_XPOSITION"] = "x position";
    Blockly.Msg["SENSING_OF_YPOSITION"] = "y position";
    Blockly.Msg["SENSING_OF_DIRECTION"] = "direction";
    Blockly.Msg["SENSING_OF_COSTUMENUMBER"] = "costume #";
    Blockly.Msg["SENSING_OF_COSTUMENAME"] = "costume name";
    Blockly.Msg["SENSING_OF_SIZE"] = "size";
    Blockly.Msg["SENSING_OF_VOLUME"] = "volume";
    Blockly.Msg["SENSING_OF_BACKDROPNUMBER"] = "backdrop #";
    Blockly.Msg["SENSING_OF_BACKDROPNAME"] = "backdrop name";
    Blockly.Msg["SENSING_OF_STAGE"] = "Stage";
    Blockly.Msg["SENSING_CURRENT"] = "current %1";
    Blockly.Msg["SENSING_CURRENT_YEAR"] = "year";
    Blockly.Msg["SENSING_CURRENT_MONTH"] = "month";
    Blockly.Msg["SENSING_CURRENT_DATE"] = "date";
    Blockly.Msg["SENSING_CURRENT_DAYOFWEEK"] = "day of week";
    Blockly.Msg["SENSING_CURRENT_HOUR"] = "hour";
    Blockly.Msg["SENSING_CURRENT_MINUTE"] = "minute";
    Blockly.Msg["SENSING_CURRENT_SECOND"] = "second";
    Blockly.Msg["SENSING_DAYSSINCE2000"] = "days since 2000";
    Blockly.Msg["SENSING_USERNAME"] = "username";
    Blockly.Msg["SENSING_USERID"] = "user id";
    Blockly.Msg["SOUND_PLAY"] = "start sound %1";
    Blockly.Msg["SOUND_PLAYUNTILDONE"] = "play sound %1 until done";
    Blockly.Msg["SOUND_STOPALLSOUNDS"] = "stop all sounds";
    Blockly.Msg["SOUND_SETEFFECTO"] = "set %1 effect to %2";
    Blockly.Msg["SOUND_CHANGEEFFECTBY"] = "change %1 effect by %2";
    Blockly.Msg["SOUND_CLEAREFFECTS"] = "clear sound effects";
    Blockly.Msg["SOUND_EFFECTS_PITCH"] = "pitch";
    Blockly.Msg["SOUND_EFFECTS_PAN"] = "pan left/right";
    Blockly.Msg["SOUND_CHANGEVOLUMEBY"] = "change volume by %1";
    Blockly.Msg["SOUND_SETVOLUMETO"] = "set volume to %1%";
    Blockly.Msg["SOUND_VOLUME"] = "volume";
    Blockly.Msg["SOUND_RECORD"] = "record...";
    Blockly.Msg["CATEGORY_MOTION"] = "Motion";
    Blockly.Msg["CATEGORY_LOOKS"] = "Looks";
    Blockly.Msg["CATEGORY_SOUND"] = "Sound";
    Blockly.Msg["CATEGORY_EVENTS"] = "Events";
    Blockly.Msg["CATEGORY_CONTROL"] = "Control";
    Blockly.Msg["CATEGORY_SENSING"] = "Sensing";
    Blockly.Msg["CATEGORY_OPERATORS"] = "Operators";
    Blockly.Msg["CATEGORY_VARIABLES"] = "Variables";
    Blockly.Msg["CATEGORY_MYBLOCKS"] = "My Blocks";
    Blockly.Msg["DUPLICATE"] = "Duplicate";
    Blockly.Msg["DELETE"] = "Delete";
    Blockly.Msg["ADD_COMMENT"] = "Add Comment";
    Blockly.Msg["REMOVE_COMMENT"] = "Remove Comment";
    Blockly.Msg["DELETE_BLOCK"] = "Delete Block";
    Blockly.Msg["DELETE_X_BLOCKS"] = "Delete %1 Blocks";
    Blockly.Msg["DELETE_ALL_BLOCKS"] = "Delete all %1 blocks?";
    Blockly.Msg["CLEAN_UP"] = "Clean up Blocks";
    Blockly.Msg["HELP"] = "Help";
    Blockly.Msg["UNDO"] = "Undo";
    Blockly.Msg["REDO"] = "Redo";
    Blockly.Msg["EDIT_PROCEDURE"] = "Edit";
    Blockly.Msg["SHOW_PROCEDURE_DEFINITION"] = "Go to definition";
    Blockly.Msg["WORKSPACE_COMMENT_DEFAULT_TEXT"] = "Say something...";
    Blockly.Msg["COLOUR_HUE_LABEL"] = "Color";
    Blockly.Msg["COLOUR_SATURATION_LABEL"] = "Saturation";
    Blockly.Msg["COLOUR_BRIGHTNESS_LABEL"] = "Brightness";
    Blockly.Msg["CHANGE_VALUE_TITLE"] = "Change value:";
    Blockly.Msg["RENAME_VARIABLE"] = "Rename variable";
    Blockly.Msg["RENAME_VARIABLE_TITLE"] = 'Rename all "%1" variables to:';
    Blockly.Msg["RENAME_VARIABLE_MODAL_TITLE"] = "Rename Variable";
    Blockly.Msg["NEW_VARIABLE"] = "Make a Variable";
    Blockly.Msg["NEW_VARIABLE_TITLE"] = "New variable name:";
    Blockly.Msg["VARIABLE_MODAL_TITLE"] = "New Variable";
    Blockly.Msg["VARIABLE_ALREADY_EXISTS"] = 'A variable named "%1" already exists.';
    Blockly.Msg["VARIABLE_ALREADY_EXISTS_FOR_ANOTHER_TYPE"] = 'A variable named "%1" already exists for another variable of type "%2".';
    Blockly.Msg["DELETE_VARIABLE_CONFIRMATION"] = 'Delete %1 uses of the "%2" variable?';
    Blockly.Msg["CANNOT_DELETE_VARIABLE_PROCEDURE"] = `Can't delete the variable "%1" because it's part of the definition of the function "%2"`;
    Blockly.Msg["DELETE_VARIABLE"] = 'Delete the "%1" variable';
    Blockly.Msg["NEW_PROCEDURE"] = "Make a Block";
    Blockly.Msg["PROCEDURE_ALREADY_EXISTS"] = 'A procedure named "%1" already exists.';
    Blockly.Msg["PROCEDURE_DEFAULT_NAME"] = "block name";
    Blockly.Msg["PROCEDURE_USED"] = "To delete a block definition, first remove all uses of the block";
    Blockly.Msg["NEW_LIST"] = "Make a List";
    Blockly.Msg["NEW_LIST_TITLE"] = "New list name:";
    Blockly.Msg["LIST_MODAL_TITLE"] = "New List";
    Blockly.Msg["LIST_ALREADY_EXISTS"] = 'A list named "%1" already exists.';
    Blockly.Msg["RENAME_LIST_TITLE"] = 'Rename all "%1" lists to:';
    Blockly.Msg["RENAME_LIST_MODAL_TITLE"] = "Rename List";
    Blockly.Msg["DEFAULT_LIST_ITEM"] = "thing";
    Blockly.Msg["DELETE_LIST"] = 'Delete the "%1" list';
    Blockly.Msg["RENAME_LIST"] = "Rename list";
    Blockly.Msg["NEW_BROADCAST_MESSAGE"] = "New message";
    Blockly.Msg["NEW_BROADCAST_MESSAGE_TITLE"] = "New message name:";
    Blockly.Msg["BROADCAST_MODAL_TITLE"] = "New Message";
    Blockly.Msg["DEFAULT_BROADCAST_MESSAGE_NAME"] = "message1";
  }
});

// ../pm-blocks/core/constants.js
var require_constants = __commonJS({
  "../pm-blocks/core/constants.js"() {
    "use strict";
    goog.provide("Blockly.constants");
    Blockly.DRAG_RADIUS = 3;
    Blockly.FLYOUT_DRAG_RADIUS = 10;
    Blockly.SNAP_RADIUS = 48;
    Blockly.CONNECTING_SNAP_RADIUS = 68;
    Blockly.CURRENT_CONNECTION_PREFERENCE = 20;
    Blockly.BUMP_DELAY = 0;
    Blockly.COLLAPSE_CHARS = 30;
    Blockly.LONGPRESS = 750;
    Blockly.LINE_SCROLL_MULTIPLIER = 15;
    Blockly.SOUND_LIMIT = 100;
    Blockly.DRAG_STACK = true;
    Blockly.HSV_SATURATION = 0.45;
    Blockly.HSV_VALUE = 0.65;
    Blockly.SPRITE = {
      width: 96,
      height: 124,
      url: "sprites.png"
    };
    Blockly.SVG_NS = "http://www.w3.org/2000/svg";
    Blockly.HTML_NS = "http://www.w3.org/1999/xhtml";
    Blockly.INPUT_VALUE = 1;
    Blockly.OUTPUT_VALUE = 2;
    Blockly.NEXT_STATEMENT = 3;
    Blockly.PREVIOUS_STATEMENT = 4;
    Blockly.DUMMY_INPUT = 5;
    Blockly.ALIGN_LEFT = -1;
    Blockly.ALIGN_CENTRE = 0;
    Blockly.ALIGN_RIGHT = 1;
    Blockly.DRAG_NONE = 0;
    Blockly.DRAG_STICKY = 1;
    Blockly.DRAG_BEGIN = 1;
    Blockly.DRAG_FREE = 2;
    Blockly.OPPOSITE_TYPE = [];
    Blockly.OPPOSITE_TYPE[Blockly.INPUT_VALUE] = Blockly.OUTPUT_VALUE;
    Blockly.OPPOSITE_TYPE[Blockly.OUTPUT_VALUE] = Blockly.INPUT_VALUE;
    Blockly.OPPOSITE_TYPE[Blockly.NEXT_STATEMENT] = Blockly.PREVIOUS_STATEMENT;
    Blockly.OPPOSITE_TYPE[Blockly.PREVIOUS_STATEMENT] = Blockly.NEXT_STATEMENT;
    Blockly.TOOLBOX_AT_TOP = 0;
    Blockly.TOOLBOX_AT_BOTTOM = 1;
    Blockly.TOOLBOX_AT_LEFT = 2;
    Blockly.TOOLBOX_AT_RIGHT = 3;
    Blockly.OUTPUT_SHAPE_HEXAGONAL = 1;
    Blockly.OUTPUT_SHAPE_ROUND = 2;
    Blockly.OUTPUT_SHAPE_SQUARE = 3;
    Blockly.OUTPUT_SHAPE_LEAF = 4;
    Blockly.OUTPUT_SHAPE_PLUS = 5;
    Blockly.OUTPUT_SHAPE_OCTAGONAL = 6;
    Blockly.OUTPUT_SHAPE_BUMPED = 7;
    Blockly.OUTPUT_SHAPE_INDENTED = 8;
    Blockly.OUTPUT_SHAPE_SCRAPPED = 9;
    Blockly.OUTPUT_SHAPE_ARROW = 10;
    Blockly.OUTPUT_SHAPE_TICKET = 11;
    Blockly.Categories = {
      "motion": "motion",
      "looks": "looks",
      "sound": "sounds",
      "pen": "pen",
      "data": "data",
      "dataLists": "data-lists",
      "event": "events",
      "control": "control",
      "sensing": "sensing",
      "operators": "operators",
      "more": "more"
    };
    Blockly.DELETE_AREA_NONE = null;
    Blockly.DELETE_AREA_TRASH = 1;
    Blockly.DELETE_AREA_TOOLBOX = 2;
    Blockly.VARIABLE_CATEGORY_NAME = "VARIABLE";
    Blockly.LIST_CATEGORY_NAME = "LIST";
    Blockly.PROCEDURE_CATEGORY_NAME = "PROCEDURE";
    Blockly.RENAME_VARIABLE_ID = "RENAME_VARIABLE_ID";
    Blockly.DELETE_VARIABLE_ID = "DELETE_VARIABLE_ID";
    Blockly.NEW_BROADCAST_MESSAGE_ID = "NEW_BROADCAST_MESSAGE_ID";
    Blockly.BROADCAST_MESSAGE_VARIABLE_TYPE = "broadcast_msg";
    Blockly.LIST_VARIABLE_TYPE = "list";
    Blockly.SCALAR_VARIABLE_TYPE = "";
    Blockly.PROCEDURES_DEFINITION_BLOCK_TYPE = "procedures_definition";
    Blockly.PROCEDURES_PROTOTYPE_BLOCK_TYPE = "procedures_prototype";
    Blockly.PROCEDURES_CALL_BLOCK_TYPE = "procedures_call";
    Blockly.StatusButtonState = {
      "READY": "ready",
      "NOT_READY": "not ready"
    };
  }
});

// ../pm-blocks/core/colours.js
var require_colours = __commonJS({
  "../pm-blocks/core/colours.js"() {
    "use strict";
    goog.provide("Blockly.Colours");
    Blockly.Colours = {
      // SVG colours: these must be specificed in #RRGGBB style
      // To add an opacity, this must be specified as a separate property (for SVG fill-opacity)
      "motion": {
        "primary": "#4C97FF",
        "secondary": "#4280D7",
        "tertiary": "#3373CC"
      },
      "looks": {
        "primary": "#9966FF",
        "secondary": "#855CD6",
        "tertiary": "#774DCB"
      },
      "sounds": {
        "primary": "#CF63CF",
        "secondary": "#C94FC9",
        "tertiary": "#BD42BD"
      },
      "control": {
        "primary": "#FFAB19",
        "secondary": "#EC9C13",
        "tertiary": "#CF8B17"
      },
      "event": {
        "primary": "#FFBF00",
        "secondary": "#E6AC00",
        "tertiary": "#CC9900"
      },
      "sensing": {
        "primary": "#5CB1D6",
        "secondary": "#47A8D1",
        "tertiary": "#2E8EB8"
      },
      "pen": {
        "primary": "#0fBD8C",
        "secondary": "#0DA57A",
        "tertiary": "#0B8E69"
      },
      "operators": {
        "primary": "#59C059",
        "secondary": "#46B946",
        "tertiary": "#389438"
      },
      "data": {
        "primary": "#FF8C1A",
        "secondary": "#FF8000",
        "tertiary": "#DB6E00"
      },
      // This is not a new category, but rather for differentiation
      // between lists and scalar variables.
      "data_lists": {
        "primary": "#FF661A",
        "secondary": "#FF5500",
        "tertiary": "#E64D00"
      },
      "more": {
        "primary": "#FF6680",
        "secondary": "#FF4D6A",
        "tertiary": "#FF3355"
      },
      "text": "#575E75",
      "workspace": "#F9F9F9",
      "toolboxHover": "#4C97FF",
      "toolboxSelected": "#e9eef2",
      "toolboxText": "#575E75",
      "toolbox": "#FFFFFF",
      "flyout": "#F9F9F9",
      "scrollbar": "#CECDCE",
      "scrollbarHover": "#CECDCE",
      "textField": "#FFFFFF",
      "insertionMarker": "#000000",
      "insertionMarkerOpacity": 0.2,
      "dragShadowOpacity": 0.3,
      "stackGlow": "#FFF200",
      "stackGlowSize": 4,
      "stackGlowOpacity": 1,
      "replacementGlow": "#FFFFFF",
      "replacementGlowSize": 2,
      "replacementGlowOpacity": 1,
      "colourPickerStroke": "#FFFFFF",
      // CSS colours: support RGBA
      "fieldShadow": "rgba(0,0,0,0.1)",
      "dropDownShadow": "rgba(0, 0, 0, .3)",
      "numPadBackground": "#547AB2",
      "numPadBorder": "#435F91",
      "numPadActiveBackground": "#435F91",
      "numPadText": "white",
      // Do not use hex here, it cannot be inlined with data-uri SVG
      "valueReportBackground": "#FFFFFF",
      "valueReportBorder": "#AAAAAA",
      "blockError": "#FF0000"
    };
    Blockly.Colours.overrideColours = function(colours) {
      if (colours) {
        for (var colourProperty in colours) {
          if (colours.hasOwnProperty(colourProperty) && Blockly.Colours.hasOwnProperty(colourProperty)) {
            var colourPropertyValue = colours[colourProperty];
            if (goog.isObject(colourPropertyValue)) {
              for (var colourSequence in colourPropertyValue) {
                if (colourPropertyValue.hasOwnProperty(colourSequence) && Blockly.Colours[colourProperty].hasOwnProperty(colourSequence)) {
                  Blockly.Colours[colourProperty][colourSequence] = colourPropertyValue[colourSequence];
                }
              }
            } else {
              Blockly.Colours[colourProperty] = colourPropertyValue;
            }
          }
        }
      }
    };
  }
});

// ../pm-blocks/blocks_vertical/control.js
var require_control = __commonJS({
  "../pm-blocks/blocks_vertical/control.js"() {
    "use strict";
    goog.provide("Blockly.Blocks.control");
    goog.require("Blockly.Blocks");
    goog.require("Blockly.Colours");
    goog.require("Blockly.ScratchBlocks.VerticalExtensions");
    Blockly.Blocks["control_forever"] = {
      /**
       * Block for repeat n times (external number).
       * https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#5eke39
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "id": "control_forever",
          "message0": Blockly.Msg.CONTROL_FOREVER,
          "message1": "%1",
          // Statement
          "message2": "%1",
          // Icon
          "lastDummyAlign2": "RIGHT",
          "args1": [
            {
              "type": "input_statement",
              "check": "normal",
              "name": "SUBSTACK"
            }
          ],
          "args2": [
            {
              "type": "field_image",
              "src": Blockly.mainWorkspace.options.pathToMedia + "repeat.svg",
              "width": 24,
              "height": 24,
              "alt": "\u2934",
              "flip_rtl": true
            }
          ],
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_statement"]
        });
        this.setNextStatement(false);
        this.hasBreak_ = false;
      },
      mutationToDom: function() {
        var container = document.createElement("mutation");
        container.setAttribute("hasbreak", this.hasBreak_);
        return container;
      },
      domToMutation: function(xmlElement) {
        var hasNext = xmlElement.getAttribute("hasbreak") == "true";
        this.hasBreak_ = hasNext;
        this.setNextStatement(hasNext, "normal");
      }
    };
    Blockly.Blocks["control_repeat"] = {
      /**
       * Block for repeat n times (external number).
       * https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#so57n9
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "id": "control_repeat",
          "message0": Blockly.Msg.CONTROL_REPEAT,
          "message1": "%1",
          // Statement
          "message2": "%1",
          // Icon
          "lastDummyAlign2": "RIGHT",
          "args0": [
            {
              "type": "input_value",
              "name": "TIMES"
            }
          ],
          "args1": [
            {
              "type": "input_statement",
              "check": "normal",
              "name": "SUBSTACK"
            }
          ],
          "args2": [
            {
              "type": "field_image",
              "src": Blockly.mainWorkspace.options.pathToMedia + "repeat.svg",
              "width": 24,
              "height": 24,
              "alt": "\u2934",
              "flip_rtl": true
            }
          ],
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["control_repeatForSeconds"] = {
      /**
       * pm: Block to repeat for n seconds (external number).
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "id": "control_repeatForSeconds",
          "message0": "repeat for %1 seconds",
          "message1": "%1",
          // Statement
          "message2": "%1",
          // Icon
          "lastDummyAlign2": "RIGHT",
          "args0": [
            {
              "type": "input_value",
              "name": "TIMES"
            }
          ],
          "args1": [
            {
              "type": "input_statement",
              "check": "normal",
              "name": "SUBSTACK"
            }
          ],
          "args2": [
            {
              "type": "field_image",
              "src": Blockly.mainWorkspace.options.pathToMedia + "repeat.svg",
              "width": 24,
              "height": 24,
              "alt": "\u2934",
              "flip_rtl": true
            }
          ],
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["control_if"] = {
      /**
       * Block for if-then.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "type": "control_if",
          "message0": Blockly.Msg.CONTROL_IF,
          "message1": "%1",
          // Statement
          "args0": [
            {
              "type": "input_value",
              "name": "CONDITION",
              "check": "Boolean"
            }
          ],
          "args1": [
            {
              "type": "input_statement",
              "check": "normal",
              "name": "SUBSTACK"
            }
          ],
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["control_if_else"] = {
      /**
       * Block for if-else.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "type": "control_if_else",
          "message0": Blockly.Msg.CONTROL_IF,
          "message1": "%1",
          "message2": Blockly.Msg.CONTROL_ELSE,
          "message3": "%1",
          "args0": [
            {
              "type": "input_value",
              "name": "CONDITION",
              "check": "Boolean"
            }
          ],
          "args1": [
            {
              "type": "input_statement",
              "check": "normal",
              "name": "SUBSTACK"
            }
          ],
          "args3": [
            {
              "type": "input_statement",
              "check": "normal",
              "name": "SUBSTACK2"
            }
          ],
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["control_expandableIf"] = {
      /**
       * pm: Block for expandable if else
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "hidden %1 %2",
          "args0": [
            {
              "type": "field_expandable_remove",
              "name": "REMOVE"
            },
            {
              "type": "field_expandable_add",
              "name": "ADD"
            }
          ],
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_statement"]
        });
        this.branches_ = 0;
        this.nextIsElse = true;
        this.endsInElse = false;
      },
      fillInBlock: Blockly.scratchBlocksUtils.generateMutatorShadow,
      fixupButtons: function() {
        const expandableInput = this.getInput("");
        this.inputList.splice(this.inputList.indexOf(expandableInput), 1);
        this.inputList.push(expandableInput);
        expandableInput.setAlign(1);
        const hiddenBtn = expandableInput.fieldRow[0];
        hiddenBtn.size_.width = 0.5;
        hiddenBtn.size_.height = Blockly.BlockSvg.INPUT_SHAPE_HEIGHT + 16;
        hiddenBtn.setVisible(false);
      },
      addCase: function(shouldPopulate) {
        if (this.nextIsElse) {
          this.appendDummyInput(`TEXTSTART${this.branches_}`).appendField("else");
          this.appendStatementInput(`SUBSTACK${this.branches_}`).setCheck("normal");
          this.endsInElse = true;
        } else {
          const prevText = this.getInput(`TEXTSTART${this.branches_}`);
          if (prevText)
            prevText.appendField("if");
          else
            this.appendDummyInput(`TEXTSTART${this.branches_}`).appendField("if");
          const input = this.appendValueInput(`BOOL${this.branches_}`).setCheck("Boolean");
          if (!this.isInsertionMarker_) {
            input.init();
            input.initOutlinePath(this.svgGroup_);
            input.outlinePath.setAttribute("fill", this.getColourTertiary());
          }
          if (shouldPopulate)
            this.fillInBlock(input.connection, "checkbox");
          this.appendDummyInput(`TEXTEND${this.branches_}`).appendField("then");
          const prevBranch = this.getInput(`SUBSTACK${this.branches_}`);
          const newBranch = this.appendStatementInput(`SUBSTACK${this.branches_}`).setCheck("normal");
          if (this.branches_ > 1) {
            const prevBranchBlock = prevBranch.connection.targetBlock();
            if (prevBranchBlock)
              newBranch.connection.connect(prevBranchBlock.previousConnection);
            this.removeInput(`SUBSTACK${this.branches_}`);
          }
          this.endsInElse = false;
        }
        this.fixupButtons();
      },
      mutationToDom: function() {
        const container = document.createElement("mutation");
        container.setAttribute("branches", String(this.branches_));
        container.setAttribute("ends-in-else", String(this.endsInElse));
        return container;
      },
      domToMutation: function(xmlElement) {
        const inputCount = Number(xmlElement.getAttribute("branches"));
        let branchCount = isNaN(inputCount) ? 0 : inputCount;
        let needsActionConnect = false, oldConnections;
        if (this.inputList.length - 1 > 0) {
          needsActionConnect = true;
          oldConnections = this.getConnections_().map((c) => c.targetBlock());
          for (var i = this.inputList.length - 1; i--; ) {
            const input = this.inputList[i];
            if (input.name.startsWith("SUBSTACK") || input.name.startsWith("BOOL")) {
              if (input.connection.targetBlock())
                input.connection.disconnect();
            }
            this.removeInput(input.name);
          }
        }
        if (branchCount > 1) {
          branchCount = branchCount * 2 - 1;
          if (xmlElement.getAttribute("ends-in-else") === "true")
            branchCount -= 1;
        }
        this.nextIsElse = false;
        this.endsInElse = false;
        this.branches_ = 1;
        for (let i2 = 0; i2 < branchCount; i2++) {
          if (this.nextIsElse)
            this.branches_++;
          this.addCase(false);
          this.nextIsElse = !this.nextIsElse;
        }
        this.fixupButtons();
        if (needsActionConnect) {
          let index = 2;
          for (var i = 0; i < this.inputList.length; i++) {
            const input = this.inputList[i];
            if (input.name.startsWith("SUBSTACK") || input.name.startsWith("BOOL")) {
              const oldBlock = oldConnections[index];
              if (oldBlock) {
                try {
                  const connector = oldBlock.outputConnection ? oldBlock.outputConnection : oldBlock.previousConnection;
                  input.connection.connect(connector);
                } catch (e) {
                }
              }
              index++;
            }
          }
          for (var i = index - 1; i < oldConnections.length; i++) {
            if (oldConnections[i] && oldConnections[i].type === "checkbox")
              oldConnections[i].dispose();
          }
        }
      },
      onExpandableButtonClicked_: function(isAdding) {
        if (this.isInFlyout)
          return;
        Blockly.Events.setGroup(true);
        var oldMutation = Blockly.Xml.domToText(this.mutationToDom());
        if (isAdding) {
          if (this.nextIsElse)
            this.branches_++;
          this.addCase(true);
          this.nextIsElse = !this.nextIsElse;
        } else if (this.branches_ > 1) {
          const boolInput = this.getInput(`BOOL${this.branches_}`);
          if (boolInput) {
            const block = boolInput.connection.targetBlock();
            if (block.type === "checkbox")
              block.dispose();
            else
              block.outputConnection.disconnect();
          }
          this.removeInput(`BOOL${this.branches_}`);
          this.removeInput(`SUBSTACK${this.branches_}`);
          this.removeInput(`TEXTSTART${this.branches_}`);
          this.removeInput(`TEXTEND${this.branches_}`);
          this.branches_--;
          this.nextIsElse = true;
          this.endsInElse = false;
        }
        this.initSvg();
        if (this.rendered)
          this.render();
        var newMutation = Blockly.Xml.domToText(this.mutationToDom());
        Blockly.Events.fire(new Blockly.Events.BlockChange(
          this,
          "mutation",
          null,
          oldMutation,
          newMutation
        ));
        Blockly.Events.setGroup(false);
      }
    };
    Blockly.Blocks["control_try_catch"] = {
      /**
       * Block for try-catch.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "type": "control_try_catch",
          "message0": "try to do",
          "message1": "%1",
          "message2": "if a block errors",
          "message3": "%1",
          "args1": [
            {
              "type": "input_statement",
              "check": "normal",
              "name": "SUBSTACK"
            }
          ],
          "args3": [
            {
              "type": "input_statement",
              "check": "normal",
              "name": "SUBSTACK2"
            }
          ],
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["control_throw_error"] = {
      init: function() {
        this.jsonInit({
          "message0": "throw error %1",
          "args0": [
            {
              "type": "input_value",
              "name": "ERROR"
            }
          ],
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_end"]
        });
      }
    };
    Blockly.Blocks["control_error"] = {
      /**
       * pm: Block to get a try catch error.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "error",
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "output_string"]
        });
      }
    };
    Blockly.Blocks["control_stop"] = {
      /**
       * Block for stop all scripts.
       * @this Blockly.Block
       */
      init: function() {
        var ALL_SCRIPTS = "all";
        var THIS_SCRIPT = "this script";
        var OTHER_SCRIPTS = "other scripts in sprite";
        var stopDropdown = new Blockly.FieldDropdown(function() {
          if (this.sourceBlock_ && this.sourceBlock_.nextConnection && this.sourceBlock_.nextConnection.isConnected()) {
            return [
              [Blockly.Msg.CONTROL_STOP_OTHER, OTHER_SCRIPTS]
            ];
          }
          return [
            [Blockly.Msg.CONTROL_STOP_ALL, ALL_SCRIPTS],
            [Blockly.Msg.CONTROL_STOP_THIS, THIS_SCRIPT],
            [Blockly.Msg.CONTROL_STOP_OTHER, OTHER_SCRIPTS]
          ];
        }, function(option) {
          Blockly.Events.setGroup(true);
          var oldMutation = Blockly.Xml.domToText(this.sourceBlock_.mutationToDom());
          this.sourceBlock_.setNextStatement(option == OTHER_SCRIPTS, "normal");
          var newMutation = Blockly.Xml.domToText(this.sourceBlock_.mutationToDom());
          Blockly.Events.fire(new Blockly.Events.BlockChange(
            this.sourceBlock_,
            "mutation",
            null,
            oldMutation,
            newMutation
          ));
          this.setValue(option);
          Blockly.Events.setGroup(false);
          return null;
        });
        this.appendDummyInput().appendField(Blockly.Msg.CONTROL_STOP).appendField(stopDropdown, "STOP_OPTION");
        this.setCategory(Blockly.Categories.control);
        this.setColour(
          Blockly.Colours.control.primary,
          Blockly.Colours.control.secondary,
          Blockly.Colours.control.tertiary
        );
        this.setPreviousStatement(true, "normal");
      },
      mutationToDom: function() {
        var container = document.createElement("mutation");
        container.setAttribute("hasnext", this.nextConnection != null);
        return container;
      },
      domToMutation: function(xmlElement) {
        var hasNext = xmlElement.getAttribute("hasnext") == "true";
        this.setNextStatement(hasNext, "normal");
      }
    };
    Blockly.Blocks["control_wait"] = {
      /**
       * Block to wait (pause) stack.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "id": "control_wait",
          "message0": Blockly.Msg.CONTROL_WAIT,
          "args0": [
            {
              "type": "input_value",
              "name": "DURATION"
            }
          ],
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["control_waitsecondsoruntil"] = {
      /**
       * pm: Block to wait (pause) stack for a specified amount of seconds, or until a condition is met.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "id": "control_waitsecondsoruntil",
          "message0": "wait %1 seconds or until %2",
          "args0": [
            {
              "type": "input_value",
              "name": "DURATION"
            },
            {
              "type": "input_value",
              "name": "CONDITION",
              "check": "Boolean"
            }
          ],
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["control_waittick"] = {
      /**
       * pm: Block to wait (pause) stack until the next runtime tick.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "id": "control_waittick",
          "message0": "wait until next tick",
          "args0": [],
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["control_wait_until"] = {
      /**
       * Block to wait until a condition becomes true.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.CONTROL_WAITUNTIL,
          "args0": [
            {
              "type": "input_value",
              "name": "CONDITION",
              "check": "Boolean"
            }
          ],
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["control_repeat_until"] = {
      /**
       * Block to repeat until a condition becomes true.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.CONTROL_REPEATUNTIL,
          "message1": "%1",
          "message2": "%1",
          "lastDummyAlign2": "RIGHT",
          "args0": [
            {
              "type": "input_value",
              "name": "CONDITION",
              "check": "Boolean"
            }
          ],
          "args1": [
            {
              "type": "input_statement",
              "check": "normal",
              "name": "SUBSTACK"
            }
          ],
          "args2": [
            {
              "type": "field_image",
              "src": Blockly.mainWorkspace.options.pathToMedia + "repeat.svg",
              "width": 24,
              "height": 24,
              "alt": "\u2934",
              "flip_rtl": true
            }
          ],
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["control_while"] = {
      /**
       * pm: Block to repeat until a condition becomes false.
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.CONTROL_WHILE,
          "message1": "%1",
          "message2": "%1",
          "lastDummyAlign2": "RIGHT",
          "args0": [
            {
              "type": "input_value",
              "name": "CONDITION",
              "check": "Boolean"
            }
          ],
          "args1": [
            {
              "type": "input_statement",
              "check": "normal",
              "name": "SUBSTACK"
            }
          ],
          "args2": [
            {
              "type": "field_image",
              "src": Blockly.mainWorkspace.options.pathToMedia + "repeat.svg",
              "width": 24,
              "height": 24,
              "alt": "\u2934",
              "flip_rtl": true
            }
          ],
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["control_for_each"] = {
      /**
       * pm: Block for for-each loops.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "type": "control_for_each",
          "message0": Blockly.Msg.CONTROL_FOREACH,
          "message1": "%1",
          "message2": "%1",
          "lastDummyAlign2": "RIGHT",
          "args0": [
            {
              "type": "field_variable",
              "name": "VARIABLE"
            },
            {
              "type": "input_value",
              "name": "VALUE"
            }
          ],
          "args1": [
            {
              "type": "input_statement",
              "check": "normal",
              "name": "SUBSTACK"
            }
          ],
          "args2": [
            {
              "type": "field_image",
              "src": Blockly.mainWorkspace.options.pathToMedia + "repeat.svg",
              "width": 24,
              "height": 24,
              "alt": "\u2934",
              "flip_rtl": true
            }
          ],
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["control_start_as_clone"] = {
      /**
       * Block for "when I start as a clone" hat.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "id": "control_start_as_clone",
          "message0": Blockly.Msg.CONTROL_STARTASCLONE,
          "args0": [],
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_hat"]
        });
      }
    };
    Blockly.Blocks["control_create_clone_of_menu"] = {
      /**
       * Create-clone drop-down menu.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1",
          "args0": [
            {
              "type": "field_dropdown",
              "name": "CLONE_OPTION",
              "options": [
                [Blockly.Msg.CONTROL_CREATECLONEOF_MYSELF, "_myself_"]
              ]
            }
          ],
          "extensions": ["colours_control", "output_string"]
        });
      }
    };
    Blockly.Blocks["control_create_clone_of"] = {
      /**
       * Block for "create clone of..."
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "id": "control_start_as_clone",
          "message0": Blockly.Msg.CONTROL_CREATECLONEOF,
          "args0": [
            {
              "type": "input_value",
              "name": "CLONE_OPTION"
            }
          ],
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["control_delete_clones_of"] = {
      /**
       * pm: Block for "delete clones of..."
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "id": "control_delete_clones_of",
          "message0": "delete clones of %1",
          "args0": [
            {
              "type": "input_value",
              "name": "CLONE_OPTION"
            }
          ],
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["control_delete_this_clone"] = {
      /**
       * Block for "delete this clone."
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.CONTROL_DELETETHISCLONE,
          "args0": [],
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_end"]
        });
      }
    };
    Blockly.Blocks["control_is_clone"] = {
      /**
       * pm: Block to check if a sprite is a clone.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "is clone?",
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["control_stop_sprite_menu"] = {
      /**
       * pm: Stop-sprite drop-down menu.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1",
          "args0": [
            {
              "type": "field_dropdown",
              "name": "STOP_OPTION",
              "options": [
                ["stage", "_stage_"]
              ]
            }
          ],
          "extensions": ["colours_control", "output_string"]
        });
      }
    };
    Blockly.Blocks["control_stop_sprite"] = {
      /**
       * pm: Block for "stop (...)"
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "id": "control_stop_sprite",
          "message0": "stop %1",
          "args0": [
            {
              "type": "input_value",
              "name": "STOP_OPTION"
            }
          ],
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["control_run_as_sprite_menu"] = {
      /**
       * pm: Run-as-sprite drop-down menu.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1",
          "args0": [
            {
              "type": "field_dropdown",
              "name": "RUN_AS_OPTION",
              "options": [
                ["Stage", "_stage_"]
              ]
            }
          ],
          "extensions": ["colours_control", "output_string"]
        });
      }
    };
    Blockly.Blocks["control_run_as_sprite"] = {
      init: function() {
        this.jsonInit({
          "message0": "as %1 do",
          "message1": "%1",
          "args0": [
            {
              "type": "input_value",
              "name": "RUN_AS_OPTION"
            }
          ],
          "args1": [
            {
              "type": "input_statement",
              "check": "normal",
              "name": "SUBSTACK"
            }
          ],
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["control_inline_stack_output"] = {
      /**
       * pm: Block to run a stack and output a return from it.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "inline block",
          "message1": "%1",
          "args1": [
            {
              "type": "input_statement",
              "check": "normal",
              "name": "SUBSTACK"
            }
          ],
          "category": Blockly.Categories.control,
          "output": null,
          "outputShape": Blockly.OUTPUT_SHAPE_SQUARE,
          "extensions": ["colours_control"]
        });
      }
    };
    Blockly.Blocks["control_get_counter"] = {
      /**
       * pm: Block to get the counter value.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.CONTROL_COUNTER,
          "category": Blockly.Categories.control,
          "checkboxInFlyout": true,
          "extensions": ["colours_control", "output_number"]
        });
      }
    };
    Blockly.Blocks["control_incr_counter"] = {
      /**
       * pm: Block to add one to the counter value.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.CONTROL_INCRCOUNTER,
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["control_decr_counter"] = {
      /**
       * pm: Block to subtract one from the counter value.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "decrement counter",
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["control_set_counter"] = {
      /**
       * pm: Block to set the counter value.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "set counter to %1",
          "args0": [
            {
              "type": "input_value",
              "name": "VALUE"
            }
          ],
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["control_clear_counter"] = {
      /**
       * pm: Block to clear the counter value.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.CONTROL_CLEARCOUNTER,
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["control_all_at_once"] = {
      /**
       * Block to run the contained script. This is an obsolete block that is
       * implemented for compatibility with Scratch 2.0 projects. Note that
       * this was originally designed to run all of the contained blocks
       * (sequentially, like normal) within a single frame, but this feature
       * was removed in place of custom blocks marked "run without screen
       * refresh". The "all at once" block was changed to run the contained
       * blocks ordinarily, functioning the same way as an "if" block with a
       * reporter that is always true (e.g. "if 1 = 1"). Also note that the
       * Scratch 2.0 spec for this block is "warpSpeed", but the label shows
       * "all at once".
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.CONTROL_ALLATONCE,
          "message1": "%1",
          // Statement
          "args1": [
            {
              "type": "input_statement",
              "check": "normal",
              "name": "SUBSTACK"
            }
          ],
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["control_new_script"] = {
      init: function() {
        this.jsonInit({
          "message0": "new script",
          "message1": "%1",
          // Statement
          "args1": [
            {
              "type": "input_statement",
              "check": "normal",
              "name": "SUBSTACK"
            }
          ],
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["control_backToGreenFlag"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "run %1",
          "args0": [
            {
              "type": "field_image",
              "src": Blockly.mainWorkspace.options.pathToMedia + "blue-flag.svg",
              "width": 24,
              "height": 24,
              "alt": "flag",
              "flip_rtl": false
            }
          ],
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["control_if_return_else_return"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "if %1 then %2 else %3",
          "args0": [
            {
              "type": "input_value",
              "name": "boolean",
              "check": "Boolean"
            },
            {
              "type": "input_value",
              "name": "TEXT1"
            },
            {
              "type": "input_value",
              "name": "TEXT2"
            }
          ],
          "output": null,
          "category": Blockly.Categories.control,
          "extensions": ["colours_control"],
          "outputShape": Blockly.OUTPUT_SHAPE_ROUND
        });
      }
    };
    Blockly.Blocks["control_switch"] = {
      init: function() {
        this.jsonInit({
          "message0": "switch %1",
          "message1": "%1",
          "args0": [
            {
              "type": "input_value",
              "name": "CONDITION"
            }
          ],
          "args1": [
            {
              "type": "input_statement",
              "name": "SUBSTACK",
              "check": "switchCase"
            }
          ],
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["control_switch_default"] = {
      init: function() {
        this.jsonInit({
          "message0": "switch %1",
          "message1": "%1",
          "message2": "default",
          "message3": "%1",
          "args0": [
            {
              "type": "input_value",
              "name": "CONDITION"
            }
          ],
          "args1": [
            {
              "type": "input_statement",
              "name": "SUBSTACK1",
              "check": "switchCase"
            }
          ],
          "args3": [
            {
              "type": "input_statement",
              "check": "normal",
              "name": "SUBSTACK2"
            }
          ],
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["control_case"] = {
      init: function() {
        this.jsonInit({
          "message0": "case %1",
          "message1": "%1",
          "args0": [
            {
              "type": "input_value",
              "name": "CONDITION"
            }
          ],
          "args1": [
            {
              "type": "input_statement",
              "check": "normal",
              "name": "SUBSTACK"
            }
          ],
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_case"]
        });
      }
    };
    Blockly.Blocks["control_case_next"] = {
      init: function() {
        this.jsonInit({
          "message0": "run next case when %1",
          "args0": [
            {
              "type": "input_value",
              "name": "CONDITION"
            }
          ],
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_case"]
        });
      }
    };
    Blockly.Blocks["control_exitCase"] = {
      init: function() {
        this.jsonInit({
          "message0": "exit case %1",
          "args0": [
            {
              "type": "field_image",
              "src": Blockly.mainWorkspace.options.pathToMedia + "arrow-down.svg",
              "width": 24,
              "height": 24,
              "alt": "\u2193",
              "flip_rtl": true
            }
          ],
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_end"]
        });
      }
    };
    Blockly.Blocks["control_exitLoop"] = {
      init: function() {
        this.jsonInit({
          "message0": "escape loop %1",
          "args0": [
            {
              "type": "field_image",
              "src": Blockly.mainWorkspace.options.pathToMedia + "arrow-down.svg",
              "width": 24,
              "height": 24,
              "alt": "\u2193",
              "flip_rtl": true
            }
          ],
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_end"]
        });
        this.oldLoopBlock = null;
        this.originalSetDraggingFunc = this.setDragging;
        this.setDragging = function(adding) {
          this.originalSetDraggingFunc.call(this, adding);
          if (adding) {
            if (!this.getParent() && this.oldLoopBlock) {
              this.setForeverNub(this.oldLoopBlock, false, true);
            }
          } else {
            queueMicrotask(() => this.climbBlockTree((block) => {
              this.setForeverNub(block, true, true);
            }));
          }
        };
        this.originalSetParent = this.setParent;
        this.setParent = function(...args) {
          this.originalSetParent.call(this, ...args);
          if (this.isInsertionMarker_)
            return;
          queueMicrotask(() => {
            if (args[0])
              this.climbBlockTree((block) => this.setForeverNub(block, true, true));
            else {
              if (!this.oldLoopBlock || this.workspace === null)
                return;
              this.setForeverNub(this.oldLoopBlock, false, false);
            }
          });
        };
      },
      climbBlockTree: function(callback) {
        let parent = this.getParent();
        while (parent !== null) {
          if (parent.type === "control_forever") {
            var childPos = this.getRelativeToSurfaceXY();
            var parentPos = parent.getRelativeToSurfaceXY();
            if (Math.round(childPos.x) !== Math.round(parentPos.x)) {
              callback(parent);
              return;
            }
          }
          parent = parent.getParent();
        }
      },
      setForeverNub: function(block, adding, callMutation) {
        var oldMutation = Blockly.Xml.domToText(block.mutationToDom());
        if (adding) {
          block.setNextStatement(true, "normal");
          block.hasBreak_ = true;
          this.oldLoopBlock = block;
          this.updateForeverMutation(oldMutation, this.oldLoopBlock);
        } else {
          this.oldLoopBlock.setNextStatement(false);
          this.oldLoopBlock.hasBreak_ = false;
          if (callMutation)
            this.updateForeverMutation(oldMutation, this.oldLoopBlock);
          this.oldLoopBlock = null;
        }
      },
      updateForeverMutation: function(oldMutation, foreverBlock) {
        var newMutation = Blockly.Xml.domToText(foreverBlock.mutationToDom());
        Blockly.Events.fire(new Blockly.Events.BlockChange(
          foreverBlock,
          "mutation",
          null,
          oldMutation,
          newMutation
        ));
      }
    };
    Blockly.Blocks["control_continueLoop"] = {
      init: function() {
        this.jsonInit({
          "message0": "continue loop %1",
          "args0": [
            {
              "type": "field_image",
              "src": Blockly.mainWorkspace.options.pathToMedia + "repeat.svg",
              "width": 24,
              "height": 24,
              "alt": "\u2934",
              "flip_rtl": true
            }
          ],
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_end"]
        });
      }
    };
    Blockly.Blocks["control_javascript_command"] = {
      /**
       * pm: Block to run javascript code.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "javascript %1",
          "args0": [
            {
              "type": "input_value",
              "name": "JS"
            }
          ],
          "category": Blockly.Categories.control,
          "extensions": ["colours_control", "shape_statement"]
        });
      }
    };
  }
});

// ../pm-blocks/blocks_vertical/event.js
var require_event = __commonJS({
  "../pm-blocks/blocks_vertical/event.js"() {
    "use strict";
    goog.provide("Blockly.Blocks.event");
    goog.require("Blockly.Blocks");
    goog.require("Blockly.Colours");
    goog.require("Blockly.constants");
    goog.require("Blockly.ScratchBlocks.VerticalExtensions");
    Blockly.Blocks["event_whentouchingobject"] = {
      /**
       * Block for when a sprite is touching an object.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.EVENT_WHENTOUCHINGOBJECT,
          "args0": [
            {
              "type": "input_value",
              "name": "TOUCHINGOBJECTMENU"
            }
          ],
          "category": Blockly.Categories.event,
          "extensions": ["colours_event", "shape_hat"]
        });
      }
    };
    Blockly.Blocks["event_touchingobjectmenu"] = {
      /**
       * "Touching [Object]" Block Menu.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1",
          "args0": [
            {
              "type": "field_dropdown",
              "name": "TOUCHINGOBJECTMENU",
              "options": [
                [Blockly.Msg.SENSING_TOUCHINGOBJECT_POINTER, "_mouse_"],
                [Blockly.Msg.SENSING_TOUCHINGOBJECT_EDGE, "_edge_"]
              ]
            }
          ],
          "extensions": ["colours_event", "output_string"]
        });
      }
    };
    Blockly.Blocks["event_whenflagclicked"] = {
      /**
       * Block for when flag clicked.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "id": "event_whenflagclicked",
          "message0": Blockly.Msg.EVENT_WHENFLAGCLICKED,
          "args0": [
            {
              "type": "field_image",
              "src": Blockly.mainWorkspace.options.pathToMedia + "blue-flag.svg",
              "width": 24,
              "height": 24,
              "alt": "flag"
            }
          ],
          "category": Blockly.Categories.event,
          "extensions": ["colours_event", "shape_hat"]
        });
      }
    };
    Blockly.Blocks["event_whenstopclicked"] = {
      /**
       * pm: Block for when stop button clicked.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "id": "event_whenstopclicked",
          "message0": "when %1 clicked",
          "args0": [
            {
              "type": "field_image",
              "src": Blockly.mainWorkspace.options.pathToMedia + "/icons/control_stop.svg",
              "width": 24,
              "height": 24,
              "alt": "stop"
            }
          ],
          "category": Blockly.Categories.event,
          "extensions": ["colours_event", "shape_hat"]
        });
      }
    };
    Blockly.Blocks["event_whenthisspriteclicked"] = {
      /**
       * Block for when this sprite clicked.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.EVENT_WHENTHISSPRITECLICKED,
          "category": Blockly.Categories.event,
          "extensions": ["colours_event", "shape_hat"]
        });
      }
    };
    Blockly.Blocks["event_whenstageclicked"] = {
      /**
       * Block for when the stage is clicked.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.EVENT_WHENSTAGECLICKED,
          "category": Blockly.Categories.event,
          "extensions": ["colours_event", "shape_hat"]
        });
      }
    };
    Blockly.Blocks["event_whenbroadcastreceived"] = {
      /**
       * Block for when broadcast received.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "id": "event_whenbroadcastreceived",
          "message0": Blockly.Msg.EVENT_WHENBROADCASTRECEIVED,
          "args0": [
            {
              "type": "field_variable",
              "name": "BROADCAST_OPTION",
              "variableTypes": [Blockly.BROADCAST_MESSAGE_VARIABLE_TYPE],
              "variable": Blockly.Msg.DEFAULT_BROADCAST_MESSAGE_NAME
            }
          ],
          "category": Blockly.Categories.event,
          "extensions": ["colours_event", "shape_hat"]
        });
      }
    };
    Blockly.Blocks["event_whenbackdropswitchesto"] = {
      /**
       * Block for when the current backdrop switched to a selected backdrop.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.EVENT_WHENBACKDROPSWITCHESTO,
          "args0": [
            {
              "type": "field_dropdown",
              "name": "BACKDROP",
              "options": [
                ["backdrop1", "BACKDROP1"]
              ]
            }
          ],
          "category": Blockly.Categories.event,
          "extensions": ["colours_event", "shape_hat"]
        });
      }
    };
    Blockly.Blocks["event_whengreaterthan"] = {
      /**
       * Block for when loudness/timer/video motion is greater than the value.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.EVENT_WHENGREATERTHAN,
          "args0": [
            {
              "type": "field_dropdown",
              "name": "WHENGREATERTHANMENU",
              "options": [
                [Blockly.Msg.EVENT_WHENGREATERTHAN_LOUDNESS, "LOUDNESS"],
                [Blockly.Msg.EVENT_WHENGREATERTHAN_TIMER, "TIMER"]
              ]
            },
            {
              "type": "input_value",
              "name": "VALUE"
            }
          ],
          "category": Blockly.Categories.event,
          "extensions": ["colours_event", "shape_hat"]
        });
      }
    };
    Blockly.Blocks["event_broadcast_menu"] = {
      /**
       * Broadcast drop-down menu.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1",
          "args0": [
            {
              "type": "field_variable",
              "name": "BROADCAST_OPTION",
              "variableTypes": [Blockly.BROADCAST_MESSAGE_VARIABLE_TYPE],
              "variable": Blockly.Msg.DEFAULT_BROADCAST_MESSAGE_NAME
            }
          ],
          "colour": Blockly.Colours.event.secondary,
          "colourSecondary": Blockly.Colours.event.secondary,
          "colourTertiary": Blockly.Colours.event.tertiary,
          "extensions": ["output_string"]
        });
      }
    };
    Blockly.Blocks["event_broadcast"] = {
      /**
       * Block to send a broadcast.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "id": "event_broadcast",
          "message0": Blockly.Msg.EVENT_BROADCAST,
          "args0": [
            {
              "type": "input_value",
              "name": "BROADCAST_INPUT"
            }
          ],
          "category": Blockly.Categories.event,
          "extensions": ["colours_event", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["event_broadcastandwait"] = {
      /**
       * Block to send a broadcast.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.EVENT_BROADCASTANDWAIT,
          "args0": [
            {
              "type": "input_value",
              "name": "BROADCAST_INPUT"
            }
          ],
          "category": Blockly.Categories.event,
          "extensions": ["colours_event", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["event_whenkeypressed"] = {
      /**
       * Block to send a broadcast.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "id": "event_whenkeypressed",
          "message0": Blockly.Msg.EVENT_WHENKEYPRESSED,
          "args0": [
            {
              "type": "field_dropdown",
              "name": "KEY_OPTION",
              "options": [
                [Blockly.Msg.EVENT_WHENKEYPRESSED_SPACE, "space"],
                [Blockly.Msg.EVENT_WHENKEYPRESSED_UP, "up arrow"],
                [Blockly.Msg.EVENT_WHENKEYPRESSED_DOWN, "down arrow"],
                [Blockly.Msg.EVENT_WHENKEYPRESSED_RIGHT, "right arrow"],
                [Blockly.Msg.EVENT_WHENKEYPRESSED_LEFT, "left arrow"],
                [Blockly.Msg.EVENT_WHENKEYPRESSED_ANY, "any"],
                ["a", "a"],
                ["b", "b"],
                ["c", "c"],
                ["d", "d"],
                ["e", "e"],
                ["f", "f"],
                ["g", "g"],
                ["h", "h"],
                ["i", "i"],
                ["j", "j"],
                ["k", "k"],
                ["l", "l"],
                ["m", "m"],
                ["n", "n"],
                ["o", "o"],
                ["p", "p"],
                ["q", "q"],
                ["r", "r"],
                ["s", "s"],
                ["t", "t"],
                ["u", "u"],
                ["v", "v"],
                ["w", "w"],
                ["x", "x"],
                ["y", "y"],
                ["z", "z"],
                ["0", "0"],
                ["1", "1"],
                ["2", "2"],
                ["3", "3"],
                ["4", "4"],
                ["5", "5"],
                ["6", "6"],
                ["7", "7"],
                ["8", "8"],
                ["9", "9"]
              ]
            }
          ],
          "category": Blockly.Categories.event,
          "extensions": ["colours_event", "shape_hat"]
        });
      }
    };
    Blockly.Blocks["event_whenkeyhit"] = {
      /**
       * Block to send a broadcast.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "id": "event_whenkeyhit",
          "message0": "when %1 key hit",
          "args0": [
            {
              "type": "field_dropdown",
              "name": "KEY_OPTION",
              "options": [
                [Blockly.Msg.EVENT_WHENKEYPRESSED_SPACE, "space"],
                [Blockly.Msg.EVENT_WHENKEYPRESSED_UP, "up arrow"],
                [Blockly.Msg.EVENT_WHENKEYPRESSED_DOWN, "down arrow"],
                [Blockly.Msg.EVENT_WHENKEYPRESSED_RIGHT, "right arrow"],
                [Blockly.Msg.EVENT_WHENKEYPRESSED_LEFT, "left arrow"],
                [Blockly.Msg.EVENT_WHENKEYPRESSED_ANY, "any"],
                ["a", "a"],
                ["b", "b"],
                ["c", "c"],
                ["d", "d"],
                ["e", "e"],
                ["f", "f"],
                ["g", "g"],
                ["h", "h"],
                ["i", "i"],
                ["j", "j"],
                ["k", "k"],
                ["l", "l"],
                ["m", "m"],
                ["n", "n"],
                ["o", "o"],
                ["p", "p"],
                ["q", "q"],
                ["r", "r"],
                ["s", "s"],
                ["t", "t"],
                ["u", "u"],
                ["v", "v"],
                ["w", "w"],
                ["x", "x"],
                ["y", "y"],
                ["z", "z"],
                ["0", "0"],
                ["1", "1"],
                ["2", "2"],
                ["3", "3"],
                ["4", "4"],
                ["5", "5"],
                ["6", "6"],
                ["7", "7"],
                ["8", "8"],
                ["9", "9"]
              ]
            }
          ],
          "category": Blockly.Categories.event,
          "extensions": ["colours_event", "shape_hat"]
        });
      }
    };
    Blockly.Blocks["event_whenmousescrolled"] = {
      /**
       * pm: Block to send a broadcast when the mouse is scrolled in a direction.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "id": "event_whenmousescrolled",
          "message0": "when mouse is scrolled %1",
          "args0": [
            {
              "type": "field_dropdown",
              "name": "KEY_OPTION",
              "options": [
                ["up", "up"],
                ["down", "down"]
              ]
            }
          ],
          "category": Blockly.Categories.event,
          "extensions": ["colours_event", "shape_hat"]
        });
      }
    };
    Blockly.Blocks["event_always"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "always",
          "args0": [],
          "category": Blockly.Categories.event,
          "extensions": ["colours_event", "shape_hat"]
        });
      }
    };
    Blockly.Blocks["event_whenanything"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "when %1",
          "args0": [
            {
              "type": "input_value",
              "name": "ANYTHING",
              "check": "Boolean"
            }
          ],
          "category": Blockly.Categories.event,
          "extensions": ["colours_event", "shape_hat"]
        });
      }
    };
    Blockly.Blocks["event_whenjavascript"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "when javascript %1 === true",
          "args0": [
            {
              "type": "input_value",
              "name": "JS"
            }
          ],
          "category": Blockly.Categories.event,
          "extensions": ["colours_event", "shape_hat"]
        });
      }
    };
  }
});

// ../pm-blocks/blocks_vertical/looks.js
var require_looks = __commonJS({
  "../pm-blocks/blocks_vertical/looks.js"() {
    "use strict";
    goog.provide("Blockly.Blocks.looks");
    goog.require("Blockly.Blocks");
    goog.require("Blockly.Colours");
    goog.require("Blockly.constants");
    goog.require("Blockly.ScratchBlocks.VerticalExtensions");
    Blockly.Blocks["looks_sayforsecs"] = {
      /**
       * Block to say for some time.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.LOOKS_SAYFORSECS,
          "args0": [
            {
              "type": "input_value",
              "name": "MESSAGE"
            },
            {
              "type": "input_value",
              "name": "SECS"
            }
          ],
          "category": Blockly.Categories.looks,
          "extensions": ["colours_looks", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["looks_say"] = {
      /**
       * Block to say.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.LOOKS_SAY,
          "args0": [
            {
              "type": "input_value",
              "name": "MESSAGE"
            }
          ],
          "category": Blockly.Categories.looks,
          "extensions": ["colours_looks", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["looks_thinkforsecs"] = {
      /**
       * Block to think for some time.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.LOOKS_THINKFORSECS,
          "args0": [
            {
              "type": "input_value",
              "name": "MESSAGE"
            },
            {
              "type": "input_value",
              "name": "SECS"
            }
          ],
          "category": Blockly.Categories.looks,
          "extensions": ["colours_looks", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["looks_think"] = {
      /**
       * Block to think.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.LOOKS_THINK,
          "args0": [
            {
              "type": "input_value",
              "name": "MESSAGE"
            }
          ],
          "category": Blockly.Categories.looks,
          "extensions": ["colours_looks", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["looks_setFont"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "args0": [
            {
              "type": "input_value",
              "name": "font"
            },
            {
              "type": "input_value",
              "name": "size"
            }
          ],
          "message0": "set font to %1 with font size %2",
          "category": Blockly.Categories.looks,
          "extensions": ["colours_looks", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["looks_setColor"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "args0": [
            {
              "type": "field_dropdown",
              "name": "prop",
              "options": [
                ["border", "BUBBLE_STROKE"],
                ["fill", "BUBBLE_FILL"],
                ["text", "TEXT_FILL"]
              ]
            },
            {
              "type": "input_value",
              "name": "color"
            }
          ],
          "message0": "set %1 color to %2",
          "category": Blockly.Categories.looks,
          "extensions": ["colours_looks", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["looks_setShape"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "args0": [
            {
              "type": "field_dropdown",
              "name": "prop",
              "options": [
                ["minimum width", "MIN_WIDTH"],
                ["maximum width", "MAX_LINE_WIDTH"],
                ["border line width", "STROKE_WIDTH"],
                ["padding size", "PADDING"],
                ["corner radius", "CORNER_RADIUS"],
                ["tail height", "TAIL_HEIGHT"],
                ["font pading percent", "FONT_HEIGHT_RATIO"],
                ["text length limit", "texlim"]
              ]
            },
            {
              "type": "input_value",
              "name": "color"
            }
          ],
          "message0": "set text bubble %1 to %2",
          "category": Blockly.Categories.looks,
          "extensions": ["colours_looks", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["looks_show"] = {
      /**
       * Show block.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.LOOKS_SHOW,
          "category": Blockly.Categories.looks,
          "extensions": ["colours_looks", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["looks_hide"] = {
      /**
       * Hide block.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.LOOKS_HIDE,
          "category": Blockly.Categories.looks,
          "extensions": ["colours_looks", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["looks_changeVisibilityOfSprite_menu"] = {
      /**
       * pm: changeVisibilityOfSprite drop-down menu.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1",
          "args0": [
            {
              "type": "field_dropdown",
              "name": "VISIBLE_OPTION",
              "options": [
                ["myself", "_myself_"]
              ]
            }
          ],
          "extensions": ["colours_looks", "output_string"]
        });
      }
    };
    Blockly.Blocks["looks_changeVisibilityOfSprite"] = {
      /**
       * pm: changeVisibilityOfSprite block.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1 %2",
          "inputsInline": true,
          "args0": [
            {
              "type": "field_dropdown",
              "name": "VISIBLE_TYPE",
              "options": [
                ["show", "show"],
                ["hide", "hide"]
              ]
            },
            {
              "type": "input_value",
              "name": "VISIBLE_OPTION"
            }
          ],
          "category": Blockly.Categories.looks,
          "extensions": ["colours_looks", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["looks_changeVisibilityOfSpriteShow"] = {
      /**
       * pm: changeVisibilityOfSprite block.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "show %1",
          "inputsInline": true,
          "args0": [
            {
              "type": "input_value",
              "name": "VISIBLE_OPTION"
            }
          ],
          "category": Blockly.Categories.looks,
          "extensions": ["colours_looks", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["looks_changeVisibilityOfSpriteHide"] = {
      /**
       * pm: changeVisibilityOfSprite block.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "hide %1",
          "inputsInline": true,
          "args0": [
            {
              "type": "input_value",
              "name": "VISIBLE_OPTION"
            }
          ],
          "category": Blockly.Categories.looks,
          "extensions": ["colours_looks", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["looks_hideallsprites"] = {
      /**
       * Hide-all-sprites block. Does not actually do anything. This is an
       * obsolete block that is implemented for compatibility with Scratch 2.0
       * projects.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.LOOKS_HIDEALLSPRITES,
          "category": Blockly.Categories.looks,
          "extensions": ["colours_looks", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["looks_setTintColor"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "args0": [
            {
              "type": "input_value",
              "name": "color"
            }
          ],
          "message0": "set tint color to %1",
          "category": Blockly.Categories.looks,
          "extensions": ["colours_looks", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["looks_tintColor"] = {
      /**
       * pm: Block to report the tint color effect in hex code
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "tint color",
          "category": Blockly.Categories.looks,
          "checkboxInFlyout": true,
          "extensions": ["colours_looks", "output_string"]
        });
      }
    };
    Blockly.Blocks["looks_changeeffectby"] = {
      /**
       * Block to change graphic effect.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.LOOKS_CHANGEEFFECTBY,
          "args0": [
            {
              "type": "field_dropdown",
              "name": "EFFECT",
              "options": [
                [Blockly.Msg.LOOKS_EFFECT_COLOR, "COLOR"],
                [Blockly.Msg.LOOKS_EFFECT_FISHEYE, "FISHEYE"],
                [Blockly.Msg.LOOKS_EFFECT_WHIRL, "WHIRL"],
                [Blockly.Msg.LOOKS_EFFECT_PIXELATE, "PIXELATE"],
                [Blockly.Msg.LOOKS_EFFECT_MOSAIC, "MOSAIC"],
                [Blockly.Msg.LOOKS_EFFECT_BRIGHTNESS, "BRIGHTNESS"],
                [Blockly.Msg.LOOKS_EFFECT_GHOST, "GHOST"],
                ["saturation", "SATURATION"],
                ["red", "RED"],
                ["green", "GREEN"],
                ["blue", "BLUE"],
                ["opaque", "OPAQUE"]
              ]
            },
            {
              "type": "input_value",
              "name": "CHANGE"
            }
          ],
          "category": Blockly.Categories.looks,
          "extensions": ["colours_looks", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["looks_seteffectto"] = {
      /**
       * Block to set graphic effect.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.LOOKS_SETEFFECTTO,
          "args0": [
            {
              "type": "field_dropdown",
              "name": "EFFECT",
              "options": [
                [Blockly.Msg.LOOKS_EFFECT_COLOR, "COLOR"],
                [Blockly.Msg.LOOKS_EFFECT_FISHEYE, "FISHEYE"],
                [Blockly.Msg.LOOKS_EFFECT_WHIRL, "WHIRL"],
                [Blockly.Msg.LOOKS_EFFECT_PIXELATE, "PIXELATE"],
                [Blockly.Msg.LOOKS_EFFECT_MOSAIC, "MOSAIC"],
                [Blockly.Msg.LOOKS_EFFECT_BRIGHTNESS, "BRIGHTNESS"],
                [Blockly.Msg.LOOKS_EFFECT_GHOST, "GHOST"],
                ["saturation", "SATURATION"],
                ["red", "RED"],
                ["green", "GREEN"],
                ["blue", "BLUE"],
                ["opaque", "OPAQUE"]
              ]
            },
            {
              "type": "input_value",
              "name": "VALUE"
            }
          ],
          "category": Blockly.Categories.looks,
          "extensions": ["colours_looks", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["looks_cleargraphiceffects"] = {
      /**
       * Block to clear graphic effects.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.LOOKS_CLEARGRAPHICEFFECTS,
          "category": Blockly.Categories.looks,
          "extensions": ["colours_looks", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["looks_changesizeby"] = {
      /**
       * Block to change size
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.LOOKS_CHANGESIZEBY,
          "args0": [
            {
              "type": "input_value",
              "name": "CHANGE"
            }
          ],
          "category": Blockly.Categories.looks,
          "extensions": ["colours_looks", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["looks_setsizeto"] = {
      /**
       * Block to set size
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.LOOKS_SETSIZETO,
          "args0": [
            {
              "type": "input_value",
              "name": "SIZE"
            }
          ],
          "category": Blockly.Categories.looks,
          "extensions": ["colours_looks", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["looks_size"] = {
      /**
       * Block to report size
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.LOOKS_SIZE,
          "category": Blockly.Categories.looks,
          "checkboxInFlyout": true,
          "extensions": ["colours_looks", "output_number"]
        });
      }
    };
    Blockly.Blocks["looks_changestretchby"] = {
      /**
       * Block to change stretch. Does not actually do anything. This is an
       * obsolete block that is implemented for compatibility with Scratch 1.4
       * projects as well as 2.0 projects that still have the block.
       * The "stretch" blocks were introduced in very early versions of Scratch,
       * but their functionality was removed shortly later. They still appeared
       * correctly up until (and including) Scratch 1.4 - as "change stretch by"
       * and "set stretch to" - but were removed altogether in Scratch 2.0, and
       * displayed as red "undefined" blocks. Some Scratch projects still contain
       * these blocks, however, and they don't open in 3.0 unless the blocks
       * actually exist (though they still don't funcitonally do anything).
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.LOOKS_CHANGESTRETCHBY,
          "args0": [
            {
              "type": "input_value",
              "name": "CHANGE"
            }
          ],
          "category": Blockly.Categories.looks,
          "extensions": ["colours_looks", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["looks_setstretchto"] = {
      /**
       * Block to set stretch. Does not actually do anything. This is an obsolete
       * block that is implemented for compatibility with Scratch 1.4 projects
       * (see looks_changestretchby).
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.LOOKS_SETSTRETCHTO,
          "args0": [
            {
              "type": "input_value",
              "name": "STRETCH"
            }
          ],
          "category": Blockly.Categories.looks,
          "extensions": ["colours_looks", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["looks_costume"] = {
      /**
       * Costumes drop-down menu.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1",
          "args0": [
            {
              "type": "field_dropdown",
              "name": "COSTUME",
              "options": [
                ["costume1", "COSTUME1"],
                ["costume2", "COSTUME2"]
              ]
            }
          ],
          "colour": Blockly.Colours.looks.secondary,
          "colourSecondary": Blockly.Colours.looks.secondary,
          "colourTertiary": Blockly.Colours.looks.tertiary,
          "extensions": ["output_string"]
        });
      }
    };
    Blockly.Blocks["looks_switchcostumeto"] = {
      /**
       * Block to switch the sprite's costume to the selected one.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.LOOKS_SWITCHCOSTUMETO,
          "args0": [
            {
              "type": "input_value",
              "name": "COSTUME"
            }
          ],
          "category": Blockly.Categories.looks,
          "extensions": ["colours_looks", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["looks_nextcostume"] = {
      /**
       * Block to switch the sprite's costume to the next one.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.LOOKS_NEXTCOSTUME,
          "category": Blockly.Categories.looks,
          "extensions": ["colours_looks", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["looks_previouscostume"] = {
      /**
       * pm: Block to switch the sprite's costume to the previous one.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "previous costume",
          "category": Blockly.Categories.looks,
          "extensions": ["colours_looks", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["looks_switchbackdropto"] = {
      /**
       * Block to switch the backdrop to the selected one.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.LOOKS_SWITCHBACKDROPTO,
          "args0": [
            {
              "type": "input_value",
              "name": "BACKDROP"
            }
          ],
          "category": Blockly.Categories.looks,
          "extensions": ["colours_looks", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["looks_backdrops"] = {
      /**
       * Backdrop list
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "id": "looks_backdrops",
          "message0": "%1",
          "args0": [
            {
              "type": "field_dropdown",
              "name": "BACKDROP",
              "options": [
                ["backdrop1", "BACKDROP1"]
              ]
            }
          ],
          "colour": Blockly.Colours.looks.secondary,
          "colourSecondary": Blockly.Colours.looks.secondary,
          "colourTertiary": Blockly.Colours.looks.tertiary,
          "extensions": ["output_string"]
        });
      }
    };
    Blockly.Blocks["looks_gotofrontback"] = {
      /**
       * "Go to front/back" Block.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.LOOKS_GOTOFRONTBACK,
          "args0": [
            {
              "type": "field_dropdown",
              "name": "FRONT_BACK",
              "options": [
                [Blockly.Msg.LOOKS_GOTOFRONTBACK_FRONT, "front"],
                [Blockly.Msg.LOOKS_GOTOFRONTBACK_BACK, "back"]
              ]
            }
          ],
          "category": Blockly.Categories.looks,
          "extensions": ["colours_looks", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["looks_goforwardbackwardlayers"] = {
      /**
       * "Go forward/backward [Number] Layers" Block.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.LOOKS_GOFORWARDBACKWARDLAYERS,
          "args0": [
            {
              "type": "field_dropdown",
              "name": "FORWARD_BACKWARD",
              "options": [
                [Blockly.Msg.LOOKS_GOFORWARDBACKWARDLAYERS_FORWARD, "forward"],
                [Blockly.Msg.LOOKS_GOFORWARDBACKWARDLAYERS_BACKWARD, "backward"]
              ]
            },
            {
              "type": "input_value",
              "name": "NUM"
            }
          ],
          "category": Blockly.Categories.looks,
          "extensions": ["colours_looks", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["looks_goTargetLayer"] = {
      /**
       * "Go infront/behind [sprite]" Block.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "go %1 %2",
          "args0": [
            {
              "type": "field_dropdown",
              "name": "FORWARD_BACKWARD",
              "options": [
                ["infront", "infront"],
                ["behind", "behind"]
              ]
            },
            {
              "type": "input_value",
              "name": "VISIBLE_OPTION"
            }
          ],
          "category": Blockly.Categories.looks,
          "extensions": ["colours_looks", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["looks_layersSetLayer"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "category": "looks",
          "message0": "go to layer %1",
          "args0": [
            {
              "type": "input_value",
              "name": "NUM"
            }
          ],
          "extensions": [
            "shape_statement",
            "colours_looks"
          ]
        });
      }
    };
    Blockly.Blocks["looks_layersGetLayer"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "category": "looks",
          "message0": "layer",
          "checkboxInFlyout": true,
          "extensions": [
            "output_number",
            "colours_looks"
          ]
        });
      }
    };
    Blockly.Blocks["looks_backdropnumbername"] = {
      /**
       * Block to report backdrop's number or name
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.LOOKS_BACKDROPNUMBERNAME,
          "args0": [
            {
              "type": "field_dropdown",
              "name": "NUMBER_NAME",
              "options": [
                [Blockly.Msg.LOOKS_NUMBERNAME_NUMBER, "number"],
                [Blockly.Msg.LOOKS_NUMBERNAME_NAME, "name"]
              ]
            }
          ],
          "category": Blockly.Categories.looks,
          "checkboxInFlyout": true,
          "extensions": ["colours_looks", "output_number"]
        });
      }
    };
    Blockly.Blocks["looks_costumenumbername"] = {
      /**
       * Block to report costume's number or name
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.LOOKS_COSTUMENUMBERNAME,
          "args0": [
            {
              "type": "field_dropdown",
              "name": "NUMBER_NAME",
              "options": [
                [Blockly.Msg.LOOKS_NUMBERNAME_NUMBER, "number"],
                [Blockly.Msg.LOOKS_NUMBERNAME_NAME, "name"]
              ]
            }
          ],
          "category": Blockly.Categories.looks,
          "checkboxInFlyout": true,
          "extensions": ["colours_looks", "output_number"]
        });
      }
    };
    Blockly.Blocks["looks_switchbackdroptoandwait"] = {
      /**
       * Block to switch the backdrop to the selected one and wait.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.LOOKS_SWITCHBACKDROPTOANDWAIT,
          "args0": [
            {
              "type": "input_value",
              "name": "BACKDROP"
            }
          ],
          "category": Blockly.Categories.looks,
          "extensions": ["colours_looks", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["looks_nextbackdrop"] = {
      /**
       * Block to switch the backdrop to the next one.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.LOOKS_NEXTBACKDROP_BLOCK,
          "category": Blockly.Categories.looks,
          "extensions": ["colours_looks", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["looks_previousbackdrop"] = {
      /**
       * pm: Block to switch the backdrop to the previous one.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "previous backdrop",
          "category": Blockly.Categories.looks,
          "extensions": ["colours_looks", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["looks_setStretch"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "category": "looks",
          "args0": [
            {
              "type": "input_value",
              "name": "X"
            },
            {
              "type": "input_value",
              "name": "Y"
            }
          ],
          "message0": "set stretch to x: %1 y: %2",
          "extensions": [
            "shape_statement",
            "colours_looks"
          ]
        });
      }
    };
    Blockly.Blocks["looks_changeStretch"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "category": "looks",
          "args0": [
            {
              "type": "input_value",
              "name": "X"
            },
            {
              "type": "input_value",
              "name": "Y"
            }
          ],
          "message0": "change stretch by x: %1 y: %2",
          "extensions": [
            "shape_statement",
            "colours_looks"
          ]
        });
      }
    };
    Blockly.Blocks["looks_stretchGetX"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "checkboxInFlyout": true,
          "category": "looks",
          "message0": "x stretch",
          "extensions": [
            "output_string",
            "colours_looks"
          ]
        });
      }
    };
    Blockly.Blocks["looks_stretchGetY"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "checkboxInFlyout": true,
          "category": "looks",
          "message0": "y stretch",
          "extensions": [
            "output_string",
            "colours_looks"
          ]
        });
      }
    };
    Blockly.Blocks["looks_getSpriteVisible"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "category": "looks",
          "message0": "visible?",
          "checkboxInFlyout": true,
          "extensions": [
            "output_boolean",
            "colours_looks"
          ]
        });
      }
    };
    Blockly.Blocks["looks_getOtherSpriteVisible_menu"] = {
      /**
       * pm: Sprite-visible drop-down menu.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1",
          "args0": [
            {
              "type": "field_dropdown",
              "name": "VISIBLE_OPTION",
              "options": [
                ["myself", "_myself_"]
              ]
            }
          ],
          "extensions": ["colours_looks", "output_string"]
        });
      }
    };
    Blockly.Blocks["looks_getOtherSpriteVisible"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "category": "looks",
          "message0": "is %1 visible?",
          "args0": [
            {
              "type": "input_value",
              "name": "VISIBLE_OPTION"
            }
          ],
          "extensions": [
            "output_boolean",
            "colours_looks"
          ]
        });
      }
    };
    Blockly.Blocks["looks_getEffectValue"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "category": "looks",
          "message0": "%1 effect",
          "checkboxInFlyout": true,
          "args0": [
            {
              "type": "field_dropdown",
              "name": "EFFECT",
              "options": [
                [Blockly.Msg.LOOKS_EFFECT_COLOR, "COLOR"],
                [Blockly.Msg.LOOKS_EFFECT_FISHEYE, "FISHEYE"],
                [Blockly.Msg.LOOKS_EFFECT_WHIRL, "WHIRL"],
                [Blockly.Msg.LOOKS_EFFECT_PIXELATE, "PIXELATE"],
                [Blockly.Msg.LOOKS_EFFECT_MOSAIC, "MOSAIC"],
                [Blockly.Msg.LOOKS_EFFECT_BRIGHTNESS, "BRIGHTNESS"],
                [Blockly.Msg.LOOKS_EFFECT_GHOST, "GHOST"],
                ["saturation", "SATURATION"],
                ["red", "RED"],
                ["green", "GREEN"],
                ["blue", "BLUE"],
                ["opaque", "OPAQUE"]
              ]
            }
          ],
          "extensions": [
            "output_number",
            "colours_looks"
          ]
        });
      }
    };
    Blockly.Blocks["looks_sayHeight"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "category": "looks",
          "message0": "bubble height",
          "checkboxInFlyout": true,
          "extensions": [
            "output_string",
            "colours_looks"
          ]
        });
      }
    };
    Blockly.Blocks["looks_sayWidth"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "category": "looks",
          "message0": "bubble width",
          "checkboxInFlyout": true,
          "extensions": [
            "output_string",
            "colours_looks"
          ]
        });
      }
    };
    Blockly.Blocks["looks_stoptalking"] = {
      /**
       * pm: Block to stop talking/thinking.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "stop speaking",
          "category": Blockly.Categories.looks,
          "extensions": ["colours_looks", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["looks_getinputofcostume"] = {
      /**
       * pm: Block to report an attribute on a costume
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1 of %2",
          "args0": [
            {
              "type": "input_value",
              "name": "INPUT"
            },
            {
              "type": "input_value",
              "name": "COSTUME"
            }
          ],
          "category": Blockly.Categories.looks,
          "inputsInline": true,
          "extensions": ["colours_looks", "output_number"]
        });
      }
    };
    Blockly.Blocks["looks_getinput_menu"] = {
      /**
       * pm: List of options for the first input of looks_getinputofcostume.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1",
          "args0": [
            {
              "type": "field_dropdown",
              "name": "INPUT",
              "options": [
                ["width", "width"],
                ["height", "height"],
                ["rotation center x", "rotation center x"],
                ["rotation center y", "rotation center y"],
                ["drawing mode", "drawing mode"]
              ]
            }
          ],
          "extensions": ["colours_looks", "output_string"]
        });
      }
    };
  }
});

// ../pm-blocks/blocks_vertical/motion.js
var require_motion = __commonJS({
  "../pm-blocks/blocks_vertical/motion.js"() {
    "use strict";
    goog.provide("Blockly.Blocks.motion");
    goog.require("Blockly.Blocks");
    goog.require("Blockly.Colours");
    goog.require("Blockly.constants");
    goog.require("Blockly.ScratchBlocks.VerticalExtensions");
    Blockly.Blocks["motion_movesteps"] = {
      /**
       * Block to move steps.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.MOTION_MOVESTEPS,
          "args0": [
            {
              "type": "input_value",
              "name": "STEPS"
            }
          ],
          "category": Blockly.Categories.motion,
          "extensions": ["colours_motion", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["motion_movebacksteps"] = {
      /**
       * pm: Block to move back steps.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "move back %1 steps",
          "args0": [
            {
              "type": "input_value",
              "name": "STEPS"
            }
          ],
          "category": Blockly.Categories.motion,
          "extensions": ["colours_motion", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["motion_moveupdownsteps"] = {
      /**
       * pm: Block to move up or down steps.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "move %1 %2 steps",
          "args0": [
            {
              "type": "field_dropdown",
              "name": "DIRECTION",
              "options": [
                ["up", "up"],
                ["down", "down"]
              ]
            },
            {
              "type": "input_value",
              "name": "STEPS"
            }
          ],
          "category": Blockly.Categories.motion,
          "extensions": ["colours_motion", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["motion_turnright"] = {
      /**
       * Block to turn right.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.MOTION_TURNRIGHT,
          "args0": [
            {
              "type": "field_image",
              "src": Blockly.mainWorkspace.options.pathToMedia + "rotate-right.svg",
              "width": 24,
              "height": 24
            },
            {
              "type": "input_value",
              "name": "DEGREES"
            }
          ],
          "category": Blockly.Categories.motion,
          "extensions": ["colours_motion", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["motion_turnleft"] = {
      /**
       * Block to turn left.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.MOTION_TURNLEFT,
          "args0": [
            {
              "type": "field_image",
              "src": Blockly.mainWorkspace.options.pathToMedia + "rotate-left.svg",
              "width": 24,
              "height": 24
            },
            {
              "type": "input_value",
              "name": "DEGREES"
            }
          ],
          "category": Blockly.Categories.motion,
          "extensions": ["colours_motion", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["motion_turnrightaroundxy"] = {
      /**
       * pm: Block to turn right around a certain point.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "turn %1 %2 degrees around x: %3 y: %4",
          "args0": [
            {
              "type": "field_image",
              "src": Blockly.mainWorkspace.options.pathToMedia + "rotate-right.svg",
              "width": 24,
              "height": 24
            },
            {
              "type": "input_value",
              "name": "DEGREES"
            },
            {
              "type": "input_value",
              "name": "X"
            },
            {
              "type": "input_value",
              "name": "Y"
            }
          ],
          "category": Blockly.Categories.motion,
          "extensions": ["colours_motion", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["motion_turnleftaroundxy"] = {
      /**
       * pm: Block to turn left around a certain point.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "turn %1 %2 degrees around x: %3 y: %4",
          "args0": [
            {
              "type": "field_image",
              "src": Blockly.mainWorkspace.options.pathToMedia + "rotate-left.svg",
              "width": 24,
              "height": 24
            },
            {
              "type": "input_value",
              "name": "DEGREES"
            },
            {
              "type": "input_value",
              "name": "X"
            },
            {
              "type": "input_value",
              "name": "Y"
            }
          ],
          "category": Blockly.Categories.motion,
          "extensions": ["colours_motion", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["motion_pointindirection"] = {
      /**
       * Block to point in direction.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.MOTION_POINTINDIRECTION,
          "args0": [
            {
              "type": "input_value",
              "name": "DIRECTION"
            }
          ],
          "category": Blockly.Categories.motion,
          "extensions": ["colours_motion", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["motion_pointtowards_menu"] = {
      /**
       * Point towards drop-down menu.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1",
          "args0": [
            {
              "type": "field_dropdown",
              "name": "TOWARDS",
              "options": [
                [Blockly.Msg.MOTION_POINTTOWARDS_POINTER, "_mouse_"],
                [Blockly.Msg.MOTION_POINTTOWARDS_RANDOM, "_random_"]
              ]
            }
          ],
          "colour": Blockly.Colours.motion.secondary,
          "colourSecondary": Blockly.Colours.motion.secondary,
          "colourTertiary": Blockly.Colours.motion.tertiary,
          "extensions": ["output_string"]
        });
      }
    };
    Blockly.Blocks["motion_turnaround"] = {
      /**
       * pm: Block to point in the opposite direction.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "turn around",
          "category": Blockly.Categories.motion,
          "extensions": ["colours_motion", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["motion_pointinrandomdirection"] = {
      /**
       * pm: Block to point in a random direction.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "point in random direction",
          "category": Blockly.Categories.motion,
          "extensions": ["colours_motion", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["motion_pointtowardsxy"] = {
      /**
       * pm: Block to point towards an x and y position.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "point towards x: %1 y: %2",
          "args0": [
            {
              "type": "input_value",
              "name": "X"
            },
            {
              "type": "input_value",
              "name": "Y"
            }
          ],
          "category": Blockly.Categories.motion,
          "extensions": ["colours_motion", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["motion_pointtowards"] = {
      /**
       * Block to point in direction.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.MOTION_POINTTOWARDS,
          "args0": [
            {
              "type": "input_value",
              "name": "TOWARDS"
            }
          ],
          "category": Blockly.Categories.motion,
          "extensions": ["colours_motion", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["motion_goto_menu"] = {
      /**
       * Go to drop-down menu.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1",
          "args0": [
            {
              "type": "field_dropdown",
              "name": "TO",
              "options": [
                [Blockly.Msg.MOTION_GOTO_POINTER, "_mouse_"],
                [Blockly.Msg.MOTION_GOTO_RANDOM, "_random_"]
              ]
            }
          ],
          "colour": Blockly.Colours.motion.secondary,
          "colourSecondary": Blockly.Colours.motion.secondary,
          "colourTertiary": Blockly.Colours.motion.tertiary,
          "extensions": ["output_string"]
        });
      }
    };
    Blockly.Blocks["motion_gotoxy"] = {
      /**
       * Block to go to X, Y.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.MOTION_GOTOXY,
          "args0": [
            {
              "type": "input_value",
              "name": "X"
            },
            {
              "type": "input_value",
              "name": "Y"
            }
          ],
          "category": Blockly.Categories.motion,
          "extensions": ["colours_motion", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["motion_goto"] = {
      /**
       * Block to go to a menu item.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.MOTION_GOTO,
          "args0": [
            {
              "type": "input_value",
              "name": "TO"
            }
          ],
          "category": Blockly.Categories.motion,
          "extensions": ["colours_motion", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["motion_glidesecstoxy"] = {
      /**
       * Block to glide for a specified time.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.MOTION_GLIDESECSTOXY,
          "args0": [
            {
              "type": "input_value",
              "name": "SECS"
            },
            {
              "type": "input_value",
              "name": "X"
            },
            {
              "type": "input_value",
              "name": "Y"
            }
          ],
          "category": Blockly.Categories.motion,
          "extensions": ["colours_motion", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["motion_glidedirectionstepsinseconds"] = {
      /**
       * pm: Block to glide for a specified time in a specified direction.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "glide %1 steps %2 in %3 secs",
          "args0": [
            {
              "type": "input_value",
              "name": "STEPS"
            },
            {
              "type": "field_dropdown",
              "name": "DIRECTION",
              "options": [
                ["forwards", "forwards"],
                ["backwards", "backwards"],
                ["up", "up"],
                ["down", "down"]
              ]
            },
            {
              "type": "input_value",
              "name": "SECS"
            }
          ],
          "category": Blockly.Categories.motion,
          "extensions": ["colours_motion", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["motion_glideto_menu"] = {
      /**
       * Glide to drop-down menu
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1",
          "args0": [
            {
              "type": "field_dropdown",
              "name": "TO",
              "options": [
                [Blockly.Msg.MOTION_GLIDETO_POINTER, "_mouse_"],
                [Blockly.Msg.MOTION_GLIDETO_RANDOM, "_random_"]
              ]
            }
          ],
          "colour": Blockly.Colours.motion.secondary,
          "colourSecondary": Blockly.Colours.motion.secondary,
          "colourTertiary": Blockly.Colours.motion.tertiary,
          "extensions": ["output_string"]
        });
      }
    };
    Blockly.Blocks["motion_glideto"] = {
      /**
       * Block to glide to a menu item
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.MOTION_GLIDETO,
          "args0": [
            {
              "type": "input_value",
              "name": "SECS"
            },
            {
              "type": "input_value",
              "name": "TO"
            }
          ],
          "category": Blockly.Categories.motion,
          "extensions": ["colours_motion", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["motion_changebyxy"] = {
      /**
       * pm: Block to change X and Y at the same time.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "change by x: %1 y: %2",
          "args0": [
            {
              "type": "input_value",
              "name": "DX"
            },
            {
              "type": "input_value",
              "name": "DY"
            }
          ],
          "category": Blockly.Categories.motion,
          "extensions": ["colours_motion", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["motion_changexby"] = {
      /**
       * Block to change X.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.MOTION_CHANGEXBY,
          "args0": [
            {
              "type": "input_value",
              "name": "DX"
            }
          ],
          "category": Blockly.Categories.motion,
          "extensions": ["colours_motion", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["motion_setx"] = {
      /**
       * Block to set X.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.MOTION_SETX,
          "args0": [
            {
              "type": "input_value",
              "name": "X"
            }
          ],
          "category": Blockly.Categories.motion,
          "extensions": ["colours_motion", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["motion_changeyby"] = {
      /**
       * Block to change Y.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.MOTION_CHANGEYBY,
          "args0": [
            {
              "type": "input_value",
              "name": "DY"
            }
          ],
          "category": Blockly.Categories.motion,
          "extensions": ["colours_motion", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["motion_sety"] = {
      /**
       * Block to set Y.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.MOTION_SETY,
          "args0": [
            {
              "type": "input_value",
              "name": "Y"
            }
          ],
          "category": Blockly.Categories.motion,
          "extensions": ["colours_motion", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["motion_ifonedgebounce"] = {
      /**
       * Block to bounce on edge.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.MOTION_IFONEDGEBOUNCE,
          "category": Blockly.Categories.motion,
          "extensions": ["colours_motion", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["motion_ifonspritebounce"] = {
      /**
       * pm: Block to bounce on a sprite.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "if touching %1, bounce",
          "args0": [
            {
              "type": "input_value",
              "name": "SPRITE"
            }
          ],
          "category": Blockly.Categories.motion,
          "extensions": ["colours_motion", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["motion_ifonxybounce"] = {
      /**
       * pm: Block to bounce on x and y.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "if touching x: %1 y: %2, bounce",
          "args0": [
            {
              "type": "input_value",
              "name": "X"
            },
            {
              "type": "input_value",
              "name": "Y"
            }
          ],
          "category": Blockly.Categories.motion,
          "extensions": ["colours_motion", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["motion_setrotationstyle"] = {
      /**
       * Block to set rotation style.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.MOTION_SETROTATIONSTYLE,
          "args0": [
            {
              "type": "field_dropdown",
              "name": "STYLE",
              "options": [
                [Blockly.Msg.MOTION_SETROTATIONSTYLE_LEFTRIGHT, "left-right"],
                ["up-down", "up-down"],
                ["look at", "look at"],
                [Blockly.Msg.MOTION_SETROTATIONSTYLE_DONTROTATE, "don't rotate"],
                [Blockly.Msg.MOTION_SETROTATIONSTYLE_ALLAROUND, "all around"]
              ]
            }
          ],
          "category": Blockly.Categories.motion,
          "extensions": ["colours_motion", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["motion_xposition"] = {
      /**
       * Block to report X.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.MOTION_XPOSITION,
          "category": Blockly.Categories.motion,
          "checkboxInFlyout": true,
          "extensions": ["colours_motion", "output_number"]
        });
      }
    };
    Blockly.Blocks["motion_yposition"] = {
      /**
       * Block to report Y.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.MOTION_YPOSITION,
          "category": Blockly.Categories.motion,
          "checkboxInFlyout": true,
          "extensions": ["colours_motion", "output_number"]
        });
      }
    };
    Blockly.Blocks["motion_direction"] = {
      /**
       * Block to report direction.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.MOTION_DIRECTION,
          "category": Blockly.Categories.motion,
          "checkboxInFlyout": true,
          "extensions": ["colours_motion", "output_number"]
        });
      }
    };
    Blockly.Blocks["motion_scroll_right"] = {
      /**
       * Block to scroll the stage right. Does not actually do anything. This is
       * an obsolete block that is implemented for compatibility with Scratch 2.0
       * projects.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.MOTION_SCROLLRIGHT,
          "args0": [
            {
              "type": "input_value",
              "name": "DISTANCE"
            }
          ],
          "category": Blockly.Categories.motion,
          "extensions": ["colours_motion", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["motion_scroll_up"] = {
      /**
       * Block to scroll the stage up. Does not actually do anything. This is an
       * obsolete block that is implemented for compatibility with Scratch 2.0
       * projects.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.MOTION_SCROLLUP,
          "args0": [
            {
              "type": "input_value",
              "name": "DISTANCE"
            }
          ],
          "category": Blockly.Categories.motion,
          "extensions": ["colours_motion", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["motion_move_sprite_to_scene_side"] = {
      /**
       * pm: Block to move the sprite to the stage's side.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "move to stage %1",
          "args0": [
            {
              "type": "field_dropdown",
              "name": "ALIGNMENT",
              "options": [
                [Blockly.Msg.MOTION_ALIGNSCENE_BOTTOMLEFT, "bottom-left"],
                ["bottom", "bottom"],
                [Blockly.Msg.MOTION_ALIGNSCENE_BOTTOMRIGHT, "bottom-right"],
                [Blockly.Msg.MOTION_ALIGNSCENE_MIDDLE, "middle"],
                [Blockly.Msg.MOTION_ALIGNSCENE_TOPLEFT, "top-left"],
                ["top", "top"],
                [Blockly.Msg.MOTION_ALIGNSCENE_TOPRIGHT, "top-right"],
                ["left", "left"],
                ["right", "right"]
              ]
            }
          ],
          "category": Blockly.Categories.motion,
          "extensions": ["colours_motion", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["motion_align_scene"] = {
      /**
       * Block to change the stage's scrolling alignment. Does not actually do
       * anything. This is an obsolete block that is implemented for compatibility
       * with Scratch 2.0 projects.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.MOTION_ALIGNSCENE,
          "args0": [
            {
              "type": "field_dropdown",
              "name": "ALIGNMENT",
              "options": [
                [Blockly.Msg.MOTION_ALIGNSCENE_BOTTOMLEFT, "bottom-left"],
                [Blockly.Msg.MOTION_ALIGNSCENE_BOTTOMRIGHT, "bottom-right"],
                [Blockly.Msg.MOTION_ALIGNSCENE_MIDDLE, "middle"],
                [Blockly.Msg.MOTION_ALIGNSCENE_TOPLEFT, "top-left"],
                [Blockly.Msg.MOTION_ALIGNSCENE_TOPRIGHT, "top-right"]
              ]
            }
          ],
          "category": Blockly.Categories.motion,
          "extensions": ["colours_motion", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["motion_xscroll"] = {
      /**
       * Block to report the stage's scroll position's X value. Does not actually
       * do anything. This is an obsolete block that is implemented for
       * compatibility with Scratch 2.0 projects.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.MOTION_XSCROLL,
          "category": Blockly.Categories.motion,
          "extensions": ["colours_motion", "output_number"]
        });
      }
    };
    Blockly.Blocks["motion_yscroll"] = {
      /**
       * Block to report the stage's scroll position's Y value. Does not actually
       * do anything. This is an obsolete block that is implemented for
       * compatibility with Scratch 2.0 projects.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.MOTION_YSCROLL,
          "category": Blockly.Categories.motion,
          "extensions": ["colours_motion", "output_number"]
        });
      }
    };
  }
});

// ../pm-blocks/blocks_vertical/operators.js
var require_operators = __commonJS({
  "../pm-blocks/blocks_vertical/operators.js"() {
    "use strict";
    goog.provide("Blockly.Blocks.operators");
    goog.require("Blockly.Blocks");
    goog.require("Blockly.Colours");
    goog.require("Blockly.constants");
    goog.require("Blockly.ScratchBlocks.VerticalExtensions");
    Blockly.Blocks["operator_add"] = {
      /**
       * Block for adding two numbers.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.OPERATORS_ADD,
          "args0": [
            {
              "type": "input_value",
              "name": "NUM1"
            },
            {
              "type": "input_value",
              "name": "NUM2"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_number"]
        });
      }
    };
    Blockly.Blocks["operator_subtract"] = {
      /**
       * Block for subtracting two numbers.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.OPERATORS_SUBTRACT,
          "args0": [
            {
              "type": "input_value",
              "name": "NUM1"
            },
            {
              "type": "input_value",
              "name": "NUM2"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_number"]
        });
      }
    };
    Blockly.Blocks["operator_multiply"] = {
      /**
       * Block for multiplying two numbers.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.OPERATORS_MULTIPLY,
          "args0": [
            {
              "type": "input_value",
              "name": "NUM1"
            },
            {
              "type": "input_value",
              "name": "NUM2"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_number"]
        });
      }
    };
    Blockly.Blocks["operator_divide"] = {
      /**
       * Block for dividing two numbers.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.OPERATORS_DIVIDE,
          "args0": [
            {
              "type": "input_value",
              "name": "NUM1"
            },
            {
              "type": "input_value",
              "name": "NUM2"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_number"]
        });
      }
    };
    Blockly.Blocks["operator_expandableMath"] = {
      /**
       * pm: Block for performing multiple math operations (determined by user)
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1 %2",
          "args0": [
            {
              "type": "field_expandable_remove",
              "name": "REMOVE"
            },
            {
              "type": "field_expandable_add",
              "name": "ADD"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_number"]
        });
        this.inputs_ = 0;
      },
      fillInBlock: Blockly.scratchBlocksUtils.generateMutatorShadow,
      menuGenerator: function() {
        const dropdown = new Blockly.FieldDropdown(function() {
          return [
            ["+", "+"],
            ["-", "-"],
            ["*", "*"],
            ["/", "/"],
            ["^", "^"]
          ];
        });
        const ogSetValue = dropdown.setValue;
        dropdown.setValue = function(value, omitMutation) {
          const srcBlock = this.sourceBlock_;
          let oldMutation;
          if (!omitMutation)
            oldMutation = Blockly.Xml.domToText(srcBlock.mutationToDom());
          ogSetValue.call(this, value);
          if (!omitMutation) {
            const newMutation = Blockly.Xml.domToText(srcBlock.mutationToDom());
            Blockly.Events.fire(new Blockly.Events.BlockChange(
              srcBlock,
              "mutation",
              null,
              oldMutation,
              newMutation
            ));
          }
        };
        return dropdown;
      },
      mutationToDom: function() {
        const container = document.createElement("mutation");
        container.setAttribute("inputcount", String(this.inputs_));
        let orderedOperations = "";
        for (var i = 1; i < this.inputList.length; i++) {
          const input = this.inputList[i];
          if (input.fieldRow[0])
            orderedOperations += input.fieldRow[0].getValue();
        }
        container.setAttribute("menuvalues", orderedOperations);
        return container;
      },
      domToMutation: function(xmlElement) {
        const inputCount = Number(xmlElement.getAttribute("inputcount"));
        const menuValues = String(xmlElement.getAttribute("menuvalues"));
        this.inputs_ = isNaN(inputCount) ? 0 : inputCount;
        let repeatPreventer = false;
        if (this.inputList.length > 1) {
          if (this.inputList.length - 1 === menuValues.length)
            repeatPreventer = true;
          else {
            const lastInput = this.inputList[this.inputList.length - 1];
            const innerBlock = lastInput.connection.targetBlock();
            if (innerBlock.isShadow())
              innerBlock.dispose();
            this.removeInput(lastInput.name);
            return;
          }
        }
        for (let i = 0; i < this.inputs_; i++) {
          if (repeatPreventer && this.getInput(`NUM${i + 1}`))
            continue;
          const input = this.appendValueInput(`NUM${i + 1}`);
          if (i > 0) {
            const menu = input.appendField(this.menuGenerator());
            menu.fieldRow[0].setValue(menuValues[i - 1] ? menuValues[i - 1] : "+", true);
          }
        }
      },
      onExpandableButtonClicked_: function(isAdding) {
        Blockly.Events.setGroup(true);
        var oldMutation = Blockly.Xml.domToText(this.mutationToDom());
        if (isAdding) {
          this.inputs_++;
          const number = this.inputs_;
          const newInput = this.appendValueInput(`NUM${number}`);
          newInput.appendField(this.menuGenerator());
          this.fillInBlock(newInput.connection, "math_number");
        } else if (this.inputs_ > 1) {
          const number = this.inputs_;
          this.removeInput(`NUM${number}`);
          this.inputs_--;
        }
        this.initSvg();
        if (this.rendered)
          this.render();
        const newMutation = Blockly.Xml.domToText(this.mutationToDom());
        Blockly.Events.fire(new Blockly.Events.BlockChange(
          this,
          "mutation",
          null,
          oldMutation,
          newMutation
        ));
        Blockly.Events.setGroup(false);
      }
    };
    Blockly.Blocks["operator_random"] = {
      /**
       * Block for picking a random number.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.OPERATORS_RANDOM,
          "args0": [
            {
              "type": "input_value",
              "name": "FROM"
            },
            {
              "type": "input_value",
              "name": "TO"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_number"]
        });
      }
    };
    Blockly.Blocks["operator_lt"] = {
      /**
       * Block for less than comparator.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.OPERATORS_LT,
          "args0": [
            {
              "type": "input_value",
              "name": "OPERAND1"
            },
            {
              "type": "input_value",
              "name": "OPERAND2"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["operator_equals"] = {
      /**
       * Block for equals comparator.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.OPERATORS_EQUALS,
          "args0": [
            {
              "type": "input_value",
              "name": "OPERAND1"
            },
            {
              "type": "input_value",
              "name": "OPERAND2"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["operator_gt"] = {
      /**
       * Block for greater than comparator.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.OPERATORS_GT,
          "args0": [
            {
              "type": "input_value",
              "name": "OPERAND1"
            },
            {
              "type": "input_value",
              "name": "OPERAND2"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["operator_gtorequal"] = {
      /**
       * pm: Block for greater than or equal comparator.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1 \u2265 %2",
          "args0": [
            {
              "type": "input_value",
              "name": "OPERAND1"
            },
            {
              "type": "input_value",
              "name": "OPERAND2"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["operator_ltorequal"] = {
      /**
       * pm: Block for less than or equal comparator.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1 \u2264 %2",
          "args0": [
            {
              "type": "input_value",
              "name": "OPERAND1"
            },
            {
              "type": "input_value",
              "name": "OPERAND2"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["operator_notequal"] = {
      /**
       * pm: Block for not equal comparator.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1 \u2260 %2",
          "args0": [
            {
              "type": "input_value",
              "name": "OPERAND1"
            },
            {
              "type": "input_value",
              "name": "OPERAND2"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["operator_and"] = {
      /**
       * Block for "and" boolean comparator.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.OPERATORS_AND,
          "args0": [
            {
              "type": "input_value",
              "name": "OPERAND1",
              "check": "Boolean"
            },
            {
              "type": "input_value",
              "name": "OPERAND2",
              "check": "Boolean"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["operator_nand"] = {
      /**
       * pm: Block for "nand" boolean comparator.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1 nand %2",
          "args0": [
            {
              "type": "input_value",
              "name": "OPERAND1",
              "check": "Boolean"
            },
            {
              "type": "input_value",
              "name": "OPERAND2",
              "check": "Boolean"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["operator_nor"] = {
      /**
       * pm: Block for "nor" boolean comparator.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1 nor %2",
          "args0": [
            {
              "type": "input_value",
              "name": "OPERAND1",
              "check": "Boolean"
            },
            {
              "type": "input_value",
              "name": "OPERAND2",
              "check": "Boolean"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["operator_xor"] = {
      /**
       * pm: Block for "xor" boolean comparator.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1 xor %2",
          "args0": [
            {
              "type": "input_value",
              "name": "OPERAND1",
              "check": "Boolean"
            },
            {
              "type": "input_value",
              "name": "OPERAND2",
              "check": "Boolean"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["operator_xnor"] = {
      /**
       * pm: Block for "nor" boolean comparator.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1 xnor %2",
          "args0": [
            {
              "type": "input_value",
              "name": "OPERAND1",
              "check": "Boolean"
            },
            {
              "type": "input_value",
              "name": "OPERAND2",
              "check": "Boolean"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["operator_or"] = {
      /**
       * Block for "or" boolean comparator.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.OPERATORS_OR,
          "args0": [
            {
              "type": "input_value",
              "name": "OPERAND1",
              "check": "Boolean"
            },
            {
              "type": "input_value",
              "name": "OPERAND2",
              "check": "Boolean"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["operator_not"] = {
      /**
       * Block for "not" unary boolean operator.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.OPERATORS_NOT,
          "args0": [
            {
              "type": "input_value",
              "name": "OPERAND",
              "check": "Boolean"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["operator_join"] = {
      /**
       * Block for string join operator.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.OPERATORS_JOIN,
          "args0": [
            {
              "type": "input_value",
              "name": "STRING1"
            },
            {
              "type": "input_value",
              "name": "STRING2"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_string"]
        });
      }
    };
    Blockly.Blocks["operator_join3"] = {
      /**
       * pm: Block for joining 3 strings together.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.OPERATORS_JOIN3,
          "args0": [
            {
              "type": "input_value",
              "name": "STRING1"
            },
            {
              "type": "input_value",
              "name": "STRING2"
            },
            {
              "type": "input_value",
              "name": "STRING3"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_string"]
        });
      }
    };
    Blockly.Blocks["operator_expandablejoininputs"] = {
      /**
       * pm: Block for joining n number of strings together
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "join %1 %2",
          "args0": [
            {
              "type": "field_expandable_remove",
              "name": "REMOVE"
            },
            {
              "type": "field_expandable_add",
              "name": "ADD"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_string"]
        });
        this.messageList = ["apple", "banana", "pear", "orange", "mango", "strawberry", "pineapple", "grape", "kiwi"];
        this.inputs_ = 0;
      },
      fillInBlock: Blockly.scratchBlocksUtils.generateMutatorShadow,
      mutationToDom: function() {
        const container = document.createElement("mutation");
        container.setAttribute("inputcount", String(this.inputs_));
        return container;
      },
      domToMutation: function(xmlElement) {
        const inputCount = Number(xmlElement.getAttribute("inputcount"));
        if (this.inputList.length > 1) {
          if (this.inputs_ > inputCount) {
            const lastInput = this.inputList[this.inputList.length - 1];
            const innerBlock = lastInput.connection.targetBlock();
            if (innerBlock.isShadow())
              innerBlock.dispose();
            this.removeInput(lastInput.name);
          }
        }
        this.inputs_ = isNaN(inputCount) ? 0 : inputCount;
        for (let i = 0; i < this.inputs_; i++) {
          if (!this.getInput(`INPUT${i + 1}`))
            this.appendValueInput(`INPUT${i + 1}`);
        }
      },
      onExpandableButtonClicked_: function(isAdding) {
        Blockly.Events.setGroup(true);
        var oldMutation = Blockly.Xml.domToText(this.mutationToDom());
        if (isAdding) {
          this.inputs_++;
          const number = this.inputs_;
          const newInput = this.appendValueInput(`INPUT${number}`);
          const text = this.messageList[number - 1];
          this.fillInBlock(newInput.connection, "text", text ? text : "...", "TEXT");
        } else if (this.inputs_ > 1) {
          this.removeInput(`INPUT${this.inputs_}`);
          this.inputs_--;
        }
        this.initSvg();
        if (this.rendered)
          this.render();
        var newMutation = Blockly.Xml.domToText(this.mutationToDom());
        Blockly.Events.fire(new Blockly.Events.BlockChange(
          this,
          "mutation",
          null,
          oldMutation,
          newMutation
        ));
        Blockly.Events.setGroup(false);
      }
    };
    Blockly.Blocks["operator_letter_of"] = {
      /**
       * Block for "letter _ of _" operator.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.OPERATORS_LETTEROF,
          "args0": [
            {
              "type": "input_value",
              "name": "LETTER"
            },
            {
              "type": "input_value",
              "name": "STRING"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_string"]
        });
      }
    };
    Blockly.Blocks["operator_length"] = {
      /**
       * Block for string length operator.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.OPERATORS_LENGTH,
          "args0": [
            {
              "type": "input_value",
              "name": "STRING"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_string"]
        });
      }
    };
    Blockly.Blocks["operator_contains"] = {
      /**
       * Block for _ contains _ operator
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.OPERATORS_CONTAINS,
          "args0": [
            {
              "type": "input_value",
              "name": "STRING1"
            },
            {
              "type": "input_value",
              "name": "STRING2"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["operator_mod"] = {
      /**
       * Block for mod two numbers.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.OPERATORS_MOD,
          "args0": [
            {
              "type": "input_value",
              "name": "NUM1"
            },
            {
              "type": "input_value",
              "name": "NUM2"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_number"]
        });
      }
    };
    Blockly.Blocks["operator_round"] = {
      /**
       * Block for rounding a numbers.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.OPERATORS_ROUND,
          "args0": [
            {
              "type": "input_value",
              "name": "NUM"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_number"]
        });
      }
    };
    Blockly.Blocks["operator_mathop"] = {
      /**
       * Block for "advanced" math ops on a number.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.OPERATORS_MATHOP,
          "args0": [
            {
              "type": "field_dropdown",
              "name": "OPERATOR",
              "options": [
                [Blockly.Msg.OPERATORS_MATHOP_ABS, "abs"],
                [Blockly.Msg.OPERATORS_MATHOP_FLOOR, "floor"],
                [Blockly.Msg.OPERATORS_MATHOP_CEILING, "ceiling"],
                ["sign", "sign"],
                [Blockly.Msg.OPERATORS_MATHOP_SQRT, "sqrt"],
                [Blockly.Msg.OPERATORS_MATHOP_SIN, "sin"],
                [Blockly.Msg.OPERATORS_MATHOP_COS, "cos"],
                [Blockly.Msg.OPERATORS_MATHOP_TAN, "tan"],
                [Blockly.Msg.OPERATORS_MATHOP_ASIN, "asin"],
                [Blockly.Msg.OPERATORS_MATHOP_ACOS, "acos"],
                [Blockly.Msg.OPERATORS_MATHOP_ATAN, "atan"],
                [Blockly.Msg.OPERATORS_MATHOP_LN, "ln"],
                [Blockly.Msg.OPERATORS_MATHOP_LOG, "log"],
                ["log2", "log2"],
                [Blockly.Msg.OPERATORS_MATHOP_EEXP, "e ^"],
                [Blockly.Msg.OPERATORS_MATHOP_10EXP, "10 ^"]
              ]
            },
            {
              "type": "input_value",
              "name": "NUM"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_number"]
        });
      }
    };
    Blockly.Blocks["operator_advlog"] = {
      /**
       * Block for better use of logarithm
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.OPERATORS_ADVLOG,
          "args0": [
            {
              "type": "input_value",
              "name": "NUM1"
            },
            {
              "type": "input_value",
              "name": "NUM2"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_number"]
        });
      }
    };
    Blockly.Blocks["operator_regexmatch"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "match %1 with regex %2 %3",
          "args0": [
            {
              "type": "input_value",
              "name": "text"
            },
            {
              "type": "input_value",
              "name": "reg"
            },
            {
              "type": "input_value",
              "name": "regrule"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_string"]
        });
      }
    };
    Blockly.Blocks["operator_replaceAll"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "in %1 replace all %2 with %3",
          "args0": [
            {
              "type": "input_value",
              "name": "text"
            },
            {
              "type": "input_value",
              "name": "term"
            },
            {
              "type": "input_value",
              "name": "res"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_string"]
        });
      }
    };
    Blockly.Blocks["operator_replaceFirst"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "in %1 replace first %2 with %3",
          "args0": [
            {
              "type": "input_value",
              "name": "text"
            },
            {
              "type": "input_value",
              "name": "term"
            },
            {
              "type": "input_value",
              "name": "res"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_string"]
        });
      }
    };
    Blockly.Blocks["operator_getLettersFromIndexToIndexInText"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "letters from %1 up to before %2 in %3",
          "args0": [
            {
              "type": "input_value",
              "name": "INDEX1"
            },
            {
              "type": "input_value",
              "name": "INDEX2"
            },
            {
              "type": "input_value",
              "name": "TEXT"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_string"]
        });
      }
    };
    Blockly.Blocks["operator_getLettersFromIndexToIndexInTextFixed"] = {
      /**
       * pm: Duplicate of operator_getLettersFromIndexToIndexInText to prevent breaking old projects.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": Blockly.Msg.OPERATORS_LETTERSFROMTOIN,
          "args0": [
            {
              "type": "input_value",
              "name": "INDEX1"
            },
            {
              "type": "input_value",
              "name": "INDEX2"
            },
            {
              "type": "input_value",
              "name": "TEXT"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_string"]
        });
      }
    };
    Blockly.Blocks["operator_readLineInMultilineText"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "read line %1 in %2",
          "args0": [
            {
              "type": "input_value",
              "name": "LINE"
            },
            {
              "type": "input_value",
              "name": "TEXT"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_string"]
        });
      }
    };
    Blockly.Blocks["operator_newLine"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "new line",
          "args0": [],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_string"]
        });
      }
    };
    Blockly.Blocks["operator_tabCharacter"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "tab character",
          "args0": [],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_string"]
        });
      }
    };
    Blockly.Blocks["operator_stringify"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "%1",
          "args0": [
            {
              "type": "input_value",
              "name": "ONE"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_string"]
        });
      }
    };
    Blockly.Blocks["operator_boolify"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "%1",
          "args0": [
            {
              "type": "input_value",
              "name": "ONE"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["operator_character_to_code"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "character %1 to id",
          "args0": [
            {
              "type": "input_value",
              "name": "ONE"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_number"]
        });
      }
    };
    Blockly.Blocks["operator_code_to_character"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "id %1 to character",
          "args0": [
            {
              "type": "input_value",
              "name": "ONE"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_string"]
        });
      }
    };
    Blockly.Blocks["operator_lerpFunc"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "interpolate %1 to %2 by %3",
          "args0": [
            {
              "type": "input_value",
              "name": "ONE"
            },
            {
              "type": "input_value",
              "name": "TWO"
            },
            {
              "type": "input_value",
              "name": "AMOUNT"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_string"]
        });
      }
    };
    Blockly.Blocks["operator_advMath"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "%1 %2 %3",
          "args0": [
            {
              "type": "input_value",
              "name": "ONE"
            },
            {
              "type": "field_dropdown",
              "name": "OPTION",
              "options": [
                ["^", "^"],
                ["root", "root"],
                ["log", "log"]
              ]
            },
            {
              "type": "input_value",
              "name": "TWO"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_string"]
        });
      }
    };
    Blockly.Blocks["operator_advMathExpanded"] = {
      /**
       * pm: Duplicate of operator_advMath to prevent breaking old projects.
       * Updated to split power and root + log, while also allowing extra params for them
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "%1 * %2 %3 %4",
          "args0": [
            {
              "type": "input_value",
              "name": "ONE"
            },
            {
              "type": "input_value",
              "name": "TWO"
            },
            {
              "type": "field_dropdown",
              "name": "OPTION",
              "options": [
                ["root", "root"],
                ["log", "log"]
              ]
            },
            {
              "type": "input_value",
              "name": "THREE"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_number"]
        });
      }
    };
    Blockly.Blocks["operator_power"] = {
      /**
       * pm: Block for getting a ^ b.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1 ^ %2",
          "args0": [
            {
              "type": "input_value",
              "name": "NUM1"
            },
            {
              "type": "input_value",
              "name": "NUM2"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_number"]
        });
      }
    };
    Blockly.Blocks["operator_constrainnumber"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "constrain %1 min %2 max %3",
          "args0": [
            {
              "type": "input_value",
              "name": "inp"
            },
            {
              "type": "input_value",
              "name": "min"
            },
            {
              "type": "input_value",
              "name": "max"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_string"]
        });
      }
    };
    Blockly.Blocks["operator_trueBoolean"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "true",
          "args0": [],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["operator_falseBoolean"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "false",
          "args0": [],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["operator_randomBoolean"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "random",
          "args0": [],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["operator_indexOfTextInText"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "index of %1 in %2",
          "args0": [
            {
              "type": "input_value",
              "name": "TEXT1"
            },
            {
              "type": "input_value",
              "name": "TEXT2"
            }
          ],
          "category": Blockly.Categories.operator,
          "extensions": ["colours_operators", "output_number"]
        });
      }
    };
    Blockly.Blocks["operator_lastIndexOfTextInText"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "last index of %1 in %2",
          "args0": [
            {
              "type": "input_value",
              "name": "TEXT1"
            },
            {
              "type": "input_value",
              "name": "TEXT2"
            }
          ],
          "category": Blockly.Categories.operator,
          "extensions": ["colours_operators", "output_number"]
        });
      }
    };
    Blockly.Blocks["operator_countAppearTimes"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "amount of times %1 appears in %2",
          "args0": [
            {
              "type": "input_value",
              "name": "TEXT1"
            },
            {
              "type": "input_value",
              "name": "TEXT2"
            }
          ],
          "category": Blockly.Categories.operator,
          "extensions": ["colours_operators", "output_number"]
        });
      }
    };
    Blockly.Blocks["operator_textIncludesLetterFrom"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "%1 includes a letter from %2?",
          "args0": [
            {
              "type": "input_value",
              "name": "TEXT1"
            },
            {
              "type": "input_value",
              "name": "TEXT2"
            }
          ],
          "category": Blockly.Categories.operator,
          "extensions": ["colours_operators", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["operator_textStartsOrEndsWith"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "%1 %2 with %3?",
          "args0": [
            {
              "type": "input_value",
              "name": "TEXT1"
            },
            {
              "type": "field_dropdown",
              "name": "OPTION",
              "options": [
                ["starts", "starts"],
                ["ends", "ends"]
              ]
            },
            {
              "type": "input_value",
              "name": "TEXT2"
            }
          ],
          "category": Blockly.Categories.operator,
          "extensions": ["colours_operators", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["operator_toUpperLowerCase"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "%1 to %2",
          "args0": [
            {
              "type": "input_value",
              "name": "TEXT"
            },
            {
              "type": "field_dropdown",
              "name": "OPTION",
              "options": [
                ["uppercase", "upper"],
                ["lowercase", "lower"]
              ]
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_string"]
        });
      }
    };
    Blockly.Blocks["operator_javascript_output"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "javascript %1",
          "args0": [
            {
              "type": "input_value",
              "name": "JS"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_string"]
        });
      }
    };
    Blockly.Blocks["operator_javascript_boolean"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "javascript %1",
          "args0": [
            {
              "type": "input_value",
              "name": "JS"
            }
          ],
          "category": Blockly.Categories.operators,
          "extensions": ["colours_operators", "output_boolean"]
        });
      }
    };
  }
});

// ../pm-blocks/blocks_vertical/sound.js
var require_sound = __commonJS({
  "../pm-blocks/blocks_vertical/sound.js"() {
    "use strict";
    goog.provide("Blockly.Blocks.sound");
    goog.require("Blockly.Blocks");
    goog.require("Blockly.Colours");
    goog.require("Blockly.constants");
    goog.require("Blockly.ScratchBlocks.VerticalExtensions");
    Blockly.Blocks["sound_sounds_menu"] = {
      /**
       * Sound effects drop-down menu.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1",
          "args0": [
            {
              "type": "field_dropdown",
              "name": "SOUND_MENU",
              "options": [
                ["1", "0"],
                ["2", "1"],
                ["3", "2"],
                ["4", "3"],
                ["5", "4"],
                ["6", "5"],
                ["7", "6"],
                ["8", "7"],
                ["9", "8"],
                ["10", "9"],
                [
                  "call a function",
                  function() {
                    window.alert("function called!");
                  }
                ]
              ]
            }
          ],
          "colour": Blockly.Colours.sounds.secondary,
          "colourSecondary": Blockly.Colours.sounds.secondary,
          "colourTertiary": Blockly.Colours.sounds.tertiary,
          "extensions": ["output_string"]
        });
      }
    };
    Blockly.Blocks["sound_play"] = {
      /**
       * Block to play sound.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.SOUND_PLAY,
          "args0": [
            {
              "type": "input_value",
              "name": "SOUND_MENU"
            }
          ],
          "category": Blockly.Categories.sound,
          "extensions": ["colours_sounds", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["sound_playuntildone"] = {
      /**
       * Block to play sound until done.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.SOUND_PLAYUNTILDONE,
          "args0": [
            {
              "type": "input_value",
              "name": "SOUND_MENU"
            }
          ],
          "category": Blockly.Categories.sound,
          "extensions": ["colours_sounds", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["sound_stop"] = {
      /**
       * pm: Block to stop a sound.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "stop sound %1",
          "args0": [
            {
              "type": "input_value",
              "name": "SOUND_MENU"
            }
          ],
          "category": Blockly.Categories.sound,
          "extensions": ["colours_sounds", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["sound_pause"] = {
      /**
       * pm: Block to pause a sound.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "pause sound %1",
          "args0": [
            {
              "type": "input_value",
              "name": "SOUND_MENU"
            }
          ],
          "category": Blockly.Categories.sound,
          "extensions": ["colours_sounds", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["sound_set_stop_fadeout_to"] = {
      /**
       * pm: Block to set the fadeout time on a sound.
       * The fadeout time is used when the sound is stopped in any way.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "set fade out to %1 seconds on %2",
          "args0": [
            {
              "type": "input_value",
              "name": "VALUE"
            },
            {
              "type": "input_value",
              "name": "SOUND_MENU"
            }
          ],
          "category": Blockly.Categories.sound,
          "extensions": ["colours_sounds", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["sound_play_at_seconds"] = {
      /**
       * pm: Block to start a sound at a specific time position.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "start sound %1 at %2 seconds",
          "args0": [
            {
              "type": "input_value",
              "name": "SOUND_MENU"
            },
            {
              "type": "input_value",
              "name": "VALUE"
            }
          ],
          "category": Blockly.Categories.sound,
          "extensions": ["colours_sounds", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["sound_play_at_seconds_until_done"] = {
      /**
       * pm: Block to start a sound at a specific time position.
       * This block will wait until the sound is actually finished
       * before continuing the stack.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "play sound %1 starting at %2 seconds until done",
          "args0": [
            {
              "type": "input_value",
              "name": "SOUND_MENU"
            },
            {
              "type": "input_value",
              "name": "VALUE"
            }
          ],
          "category": Blockly.Categories.sound,
          "extensions": ["colours_sounds", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["sound_stopallsounds"] = {
      /**
       * Block to stop all sounds
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.SOUND_STOPALLSOUNDS,
          "category": Blockly.Categories.sound,
          "extensions": ["colours_sounds", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["sound_pauseallsounds"] = {
      /**
       * pm: Block to pause all sounds
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "pause all sounds",
          "category": Blockly.Categories.sound,
          "extensions": ["colours_sounds", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["sound_playallsounds"] = {
      /**
       * pm: Block to play all sounds
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "play all sounds",
          "category": Blockly.Categories.sound,
          "extensions": ["colours_sounds", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["sound_seteffectto"] = {
      /**
       * Block to set the audio effect
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.SOUND_SETEFFECTO,
          "args0": [
            {
              "type": "field_dropdown",
              "name": "EFFECT",
              "options": [
                [Blockly.Msg.SOUND_EFFECTS_PITCH, "PITCH"],
                [Blockly.Msg.SOUND_EFFECTS_PAN, "PAN"]
              ]
            },
            {
              "type": "input_value",
              "name": "VALUE"
            }
          ],
          "category": Blockly.Categories.sound,
          "extensions": ["colours_sounds", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["sound_changeeffectby"] = {
      /**
       * Block to change the audio effect
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.SOUND_CHANGEEFFECTBY,
          "args0": [
            {
              "type": "field_dropdown",
              "name": "EFFECT",
              "options": [
                [Blockly.Msg.SOUND_EFFECTS_PITCH, "PITCH"],
                [Blockly.Msg.SOUND_EFFECTS_PAN, "PAN"]
              ]
            },
            {
              "type": "input_value",
              "name": "VALUE"
            }
          ],
          "category": Blockly.Categories.sound,
          "extensions": ["colours_sounds", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["sound_cleareffects"] = {
      /**
       * Block to clear audio effects
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.SOUND_CLEAREFFECTS,
          "category": Blockly.Categories.sound,
          "extensions": ["colours_sounds", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["sound_getEffectValue"] = {
      /**
       * pm: Block to report sound effect values
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "%1 effect",
          "checkboxInFlyout": true,
          "category": Blockly.Categories.sound,
          "args0": [
            {
              "type": "field_dropdown",
              "name": "EFFECT",
              "options": [
                [Blockly.Msg.SOUND_EFFECTS_PITCH, "PITCH"],
                [Blockly.Msg.SOUND_EFFECTS_PAN, "PAN"]
              ]
            }
          ],
          "extensions": ["colours_sounds", "output_number"]
        });
      }
    };
    Blockly.Blocks["sound_changevolumeby"] = {
      /**
       * Block to change the sprite's volume by a certain value
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.SOUND_CHANGEVOLUMEBY,
          "args0": [
            {
              "type": "input_value",
              "name": "VOLUME"
            }
          ],
          "category": Blockly.Categories.sound,
          "extensions": ["colours_sounds", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["sound_setvolumeto"] = {
      /**
       * Block to set the sprite's volume to a certain percent
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.SOUND_SETVOLUMETO,
          "args0": [
            {
              "type": "input_value",
              "name": "VOLUME"
            }
          ],
          "category": Blockly.Categories.sound,
          "extensions": ["colours_sounds", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["sound_volume"] = {
      /**
       * Block to report volume
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.SOUND_VOLUME,
          "category": Blockly.Categories.sound,
          "checkboxInFlyout": true,
          "extensions": ["colours_sounds", "output_number"]
        });
      }
    };
    Blockly.Blocks["sound_isSoundPlaying"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "category": Blockly.Categories.sound,
          "message0": "is %1 playing?",
          "args0": [
            {
              "type": "input_value",
              "name": "SOUND_MENU"
            }
          ],
          "extensions": [
            "output_boolean",
            "colours_sounds"
          ]
        });
      }
    };
    Blockly.Blocks["sound_getLength"] = {
      /**
       * pm: Block to report the length of a sound.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "length of %1",
          "args0": [
            {
              "type": "input_value",
              "name": "SOUND_MENU"
            }
          ],
          "category": Blockly.Categories.sound,
          "extensions": ["colours_sounds", "output_number"]
        });
      }
    };
    Blockly.Blocks["sound_getTimePosition"] = {
      /**
       * pm: Block to report the current time position of a sound.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "current time position of %1",
          "args0": [
            {
              "type": "input_value",
              "name": "SOUND_MENU"
            }
          ],
          "category": Blockly.Categories.sound,
          "extensions": ["colours_sounds", "output_number"]
        });
      }
    };
    Blockly.Blocks["sound_getSoundVolume"] = {
      /**
       * pm: Block to report the volume of a sound at the current position.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "current volume of %1",
          "args0": [
            {
              "type": "input_value",
              "name": "SOUND_MENU"
            }
          ],
          "category": Blockly.Categories.sound,
          "extensions": ["colours_sounds", "output_number"]
        });
      }
    };
  }
});

// ../pm-blocks/blocks_vertical/sensing.js
var require_sensing = __commonJS({
  "../pm-blocks/blocks_vertical/sensing.js"() {
    "use strict";
    goog.provide("Blockly.Blocks.sensing");
    goog.require("Blockly.Blocks");
    goog.require("Blockly.Colours");
    goog.require("Blockly.constants");
    goog.require("Blockly.ScratchBlocks.VerticalExtensions");
    Blockly.Blocks["sensing_touchingobject"] = {
      /**
       * Block to Report if its touching a Object.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.SENSING_TOUCHINGOBJECT,
          "args0": [
            {
              "type": "input_value",
              "name": "TOUCHINGOBJECTMENU"
            }
          ],
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["sensing_objecttouchingclonesprite"] = {
      /**
       * pm: Block to Report if an Object is touching a clone of another sprite.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1 touching clone of %2?",
          "args0": [
            {
              "type": "input_value",
              "name": "FULLTOUCHINGOBJECTMENU"
            },
            {
              "type": "input_value",
              "name": "SPRITETOUCHINGOBJECTMENU"
            }
          ],
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["sensing_objecttouchingobject"] = {
      /**
       * pm" Block to Report if an Object is touching another Object.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1 touching %2?",
          "args0": [
            {
              "type": "input_value",
              "name": "FULLTOUCHINGOBJECTMENU"
            },
            {
              "type": "input_value",
              "name": "SPRITETOUCHINGOBJECTMENU"
            }
          ],
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["sensing_touchingobjectmenu"] = {
      /**
       * "Touching [Object]" Block Menu.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1",
          "args0": [
            {
              "type": "field_dropdown",
              "name": "TOUCHINGOBJECTMENU",
              "options": [
                [Blockly.Msg.SENSING_TOUCHINGOBJECT_POINTER, "_mouse_"],
                [Blockly.Msg.SENSING_TOUCHINGOBJECT_EDGE, "_edge_"]
              ]
            }
          ],
          "extensions": ["colours_sensing", "output_string"]
        });
      }
    };
    Blockly.Blocks["sensing_fulltouchingobjectmenu"] = {
      /**
       * pm: "Touching [Object]" Block Menu with more options.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1",
          "args0": [
            {
              "type": "field_dropdown",
              "name": "FULLTOUCHINGOBJECTMENU",
              "options": [
                ["mouse-pointer", "_mouse_"],
                ["edge", "_edge_"],
                ["this sprite", "_myself_"]
              ]
            }
          ],
          "extensions": ["colours_sensing", "output_string"]
        });
      }
    };
    Blockly.Blocks["sensing_touchingobjectmenusprites"] = {
      /**
       * pm: "Touching [Object]" Block Menu with sprite options.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1",
          "args0": [
            {
              "type": "field_dropdown",
              "name": "SPRITETOUCHINGOBJECTMENU",
              "options": [
                ["this sprite", "_myself_"]
              ]
            }
          ],
          "extensions": ["colours_sensing", "output_string"]
        });
      }
    };
    Blockly.Blocks["sensing_touchingcolor"] = {
      /**
       * Block to Report if its touching a certain Color.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.SENSING_TOUCHINGCOLOR,
          "args0": [
            {
              "type": "input_value",
              "name": "COLOR"
            }
          ],
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["sensing_coloristouchingcolor"] = {
      /**
       * Block to Report if a color is touching a certain Color.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.SENSING_COLORISTOUCHINGCOLOR,
          "args0": [
            {
              "type": "input_value",
              "name": "COLOR"
            },
            {
              "type": "input_value",
              "name": "COLOR2"
            }
          ],
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["sensing_distanceto"] = {
      /**
       * Block to Report distance to another Object.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.SENSING_DISTANCETO,
          "args0": [
            {
              "type": "input_value",
              "name": "DISTANCETOMENU"
            }
          ],
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "output_number"]
        });
      }
    };
    Blockly.Blocks["sensing_distancetomenu"] = {
      /**
       * "Distance to [Object]" Block Menu.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1",
          "args0": [
            {
              "type": "field_dropdown",
              "name": "DISTANCETOMENU",
              "options": [
                [Blockly.Msg.SENSING_DISTANCETO_POINTER, "_mouse_"]
              ]
            }
          ],
          "extensions": ["colours_sensing", "output_string"]
        });
      }
    };
    Blockly.Blocks["sensing_askandwait"] = {
      /**
       * Block to ask a question and wait
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.SENSING_ASKANDWAIT,
          "args0": [
            {
              "type": "input_value",
              "name": "QUESTION"
            }
          ],
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["sensing_answer"] = {
      /**
       * Block to report answer
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.SENSING_ANSWER,
          "category": Blockly.Categories.sensing,
          "checkboxInFlyout": true,
          "extensions": ["colours_sensing", "output_number"]
        });
      }
    };
    Blockly.Blocks["sensing_keypressed"] = {
      /**
       * Block to Report if a key is pressed.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.SENSING_KEYPRESSED,
          "args0": [
            {
              "type": "input_value",
              "name": "KEY_OPTION"
            }
          ],
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["sensing_keyhit"] = {
      /**
       * pm: Block to Report if a key is hit on the same tick.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "key %1 hit?",
          "args0": [
            {
              "type": "input_value",
              "name": "KEY_OPTION"
            }
          ],
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["sensing_mousescrolling"] = {
      /**
       * pm: Block to report if the mouse is scrolling in a direction.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "is mouse scrolling %1?",
          "args0": [
            {
              "type": "input_value",
              "name": "SCROLL_OPTION"
            }
          ],
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["sensing_scrolldirections"] = {
      /**
       * pm: Options for scroll direction
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1",
          "args0": [
            {
              "type": "field_dropdown",
              "name": "SCROLL_OPTION",
              "options": [
                ["up", "up"],
                ["down", "down"]
              ]
            }
          ],
          "extensions": ["colours_sensing", "output_string"]
        });
      }
    };
    Blockly.Blocks["sensing_keyoptions"] = {
      /**
       * Options for Keys
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1",
          "args0": [
            {
              "type": "field_dropdown",
              "name": "KEY_OPTION",
              "options": [
                [Blockly.Msg.EVENT_WHENKEYPRESSED_SPACE, "space"],
                [Blockly.Msg.EVENT_WHENKEYPRESSED_UP, "up arrow"],
                [Blockly.Msg.EVENT_WHENKEYPRESSED_DOWN, "down arrow"],
                [Blockly.Msg.EVENT_WHENKEYPRESSED_RIGHT, "right arrow"],
                [Blockly.Msg.EVENT_WHENKEYPRESSED_LEFT, "left arrow"],
                [Blockly.Msg.EVENT_WHENKEYPRESSED_ANY, "any"],
                ["a", "a"],
                ["b", "b"],
                ["c", "c"],
                ["d", "d"],
                ["e", "e"],
                ["f", "f"],
                ["g", "g"],
                ["h", "h"],
                ["i", "i"],
                ["j", "j"],
                ["k", "k"],
                ["l", "l"],
                ["m", "m"],
                ["n", "n"],
                ["o", "o"],
                ["p", "p"],
                ["q", "q"],
                ["r", "r"],
                ["s", "s"],
                ["t", "t"],
                ["u", "u"],
                ["v", "v"],
                ["w", "w"],
                ["x", "x"],
                ["y", "y"],
                ["z", "z"],
                ["0", "0"],
                ["1", "1"],
                ["2", "2"],
                ["3", "3"],
                ["4", "4"],
                ["5", "5"],
                ["6", "6"],
                ["7", "7"],
                ["8", "8"],
                ["9", "9"]
              ]
            }
          ],
          "extensions": ["colours_sensing", "output_string"]
        });
      }
    };
    Blockly.Blocks["sensing_fingeroptions"] = {
      /**
       * pm: Options for Fingers
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1",
          "args0": [
            {
              "type": "field_dropdown",
              "name": "FINGER_OPTION",
              "options": [
                ["1", "1"],
                ["2", "2"],
                ["3", "3"],
                ["4", "4"],
                ["5", "5"]
              ]
            }
          ],
          "extensions": ["colours_sensing", "output_string"]
        });
      }
    };
    Blockly.Blocks["sensing_mousedown"] = {
      /**
       * Block to Report if the mouse is down.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.SENSING_MOUSEDOWN,
          "category": Blockly.Categories.sensing,
          "checkboxInFlyout": true,
          "extensions": ["colours_sensing", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["sensing_mouseclicked"] = {
      /**
       * pm: Block to Report if the mouse is clicked on the same tick.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "mouse clicked?",
          "category": Blockly.Categories.sensing,
          "checkboxInFlyout": true,
          "extensions": ["colours_sensing", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["sensing_fingerdown"] = {
      /**
       * pm: Block to Report if the specified finger is down.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "finger %1 down?",
          "args0": [
            {
              "type": "input_value",
              "name": "FINGER_OPTION"
            }
          ],
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["sensing_fingertapped"] = {
      /**
       * pm: Block to Report if the specified finger has tapped on this frame.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "finger %1 tapped?",
          "args0": [
            {
              "type": "input_value",
              "name": "FINGER_OPTION"
            }
          ],
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["sensing_mousex"] = {
      /**
       * Block to report mouse's x position
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.SENSING_MOUSEX,
          "category": Blockly.Categories.sensing,
          "checkboxInFlyout": true,
          "extensions": ["colours_sensing", "output_number"]
        });
      }
    };
    Blockly.Blocks["sensing_mousey"] = {
      /**
       * Block to report mouse's y position
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.SENSING_MOUSEY,
          "category": Blockly.Categories.sensing,
          "checkboxInFlyout": true,
          "extensions": ["colours_sensing", "output_number"]
        });
      }
    };
    Blockly.Blocks["sensing_fingerx"] = {
      /**
       * pm: Block to report finger #<options>'s x position
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "finger %1 x",
          "args0": [
            {
              "type": "input_value",
              "name": "FINGER_OPTION"
            }
          ],
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "output_number"]
        });
      }
    };
    Blockly.Blocks["sensing_fingery"] = {
      /**
       * pm: Block to report finger #<options>'s y position
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "finger %1 y",
          "args0": [
            {
              "type": "input_value",
              "name": "FINGER_OPTION"
            }
          ],
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "output_number"]
        });
      }
    };
    Blockly.Blocks["sensing_setclipboard"] = {
      /**
       * pm: Block to add an item to the Clipboard
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.SENSING_ADDTOCLIPBOARD,
          "args0": [
            {
              "type": "input_value",
              "name": "ITEM"
            }
          ],
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["sensing_getclipboard"] = {
      /**
       * pm: Block to report the current item in the Clipboard
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.SENSING_CLIPBOARDITEM,
          "category": Blockly.Categories.sensing,
          "checkboxInFlyout": true,
          "extensions": ["colours_sensing", "output_string"]
        });
      }
    };
    Blockly.Blocks["sensing_setdragmode"] = {
      /**
       * Block to set drag mode.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.SENSING_SETDRAGMODE,
          "args0": [
            {
              "type": "field_dropdown",
              "name": "DRAG_MODE",
              "options": [
                [Blockly.Msg.SENSING_SETDRAGMODE_DRAGGABLE, "draggable"],
                [Blockly.Msg.SENSING_SETDRAGMODE_NOTDRAGGABLE, "not draggable"]
              ]
            }
          ],
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["sensing_getdragmode"] = {
      /**
       * pm: Block to report drag mode.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "draggable?",
          "category": Blockly.Categories.sensing,
          "checkboxInFlyout": true,
          "extensions": ["colours_sensing", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["sensing_loudness"] = {
      /**
       * Block to report loudness
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.SENSING_LOUDNESS,
          "category": Blockly.Categories.sensing,
          "checkboxInFlyout": true,
          "extensions": ["colours_sensing", "output_number"]
        });
      }
    };
    Blockly.Blocks["sensing_loud"] = {
      /**
       * Block to report if the loudness is "loud" (greater than 10). This is an
       * obsolete block that is implemented for compatibility with Scratch 2.0 and
       * 1.4 projects.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.SENSING_LOUD,
          "category": Blockly.Categories.sensing,
          "checkboxInFlyout": true,
          "extensions": ["colours_sensing", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["sensing_timer"] = {
      /**
       * Block to report timer
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.SENSING_TIMER,
          "category": Blockly.Categories.sensing,
          "checkboxInFlyout": true,
          "extensions": ["colours_sensing", "output_number"]
        });
      }
    };
    Blockly.Blocks["sensing_resettimer"] = {
      /**
       * Block to reset timer
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.SENSING_RESETTIMER,
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["sensing_of_object_menu"] = {
      /**
       * "* of _" object menu.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1",
          "args0": [
            {
              "type": "field_dropdown",
              "name": "OBJECT",
              "options": [
                ["Sprite1", "Sprite1"],
                ["Stage", "_stage_"]
              ]
            }
          ],
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "output_string"]
        });
      }
    };
    Blockly.Blocks["sensing_of"] = {
      /**
       * Block to report properties of sprites.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.SENSING_OF,
          "args0": [
            {
              "type": "field_dropdown",
              "name": "PROPERTY",
              "options": [
                [Blockly.Msg.SENSING_OF_XPOSITION, "x position"],
                [Blockly.Msg.SENSING_OF_YPOSITION, "y position"],
                [Blockly.Msg.SENSING_OF_DIRECTION, "direction"],
                [Blockly.Msg.SENSING_OF_COSTUMENUMBER, "costume #"],
                [Blockly.Msg.SENSING_OF_COSTUMENAME, "costume name"],
                [Blockly.Msg.SENSING_OF_SIZE, "size"],
                [Blockly.Msg.SENSING_OF_VOLUME, "volume"],
                [Blockly.Msg.SENSING_OF_BACKDROPNUMBER, "backdrop #"],
                [Blockly.Msg.SENSING_OF_BACKDROPNAME, "backdrop name"]
              ]
            },
            {
              "type": "input_value",
              "name": "OBJECT"
            }
          ],
          "category": Blockly.Categories.sensing,
          "outputShape": Blockly.OUTPUT_SHAPE_ROUND,
          "output": null,
          "extensions": ["colours_sensing"]
        });
      }
    };
    Blockly.Blocks["sensing_set_of"] = {
      /**
       * Block to set properties of sprites.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "set %1 of %2 to %3",
          "args0": [
            {
              "type": "field_dropdown",
              "name": "PROPERTY",
              "options": [
                [Blockly.Msg.SENSING_OF_XPOSITION, "x position"],
                [Blockly.Msg.SENSING_OF_YPOSITION, "y position"],
                [Blockly.Msg.SENSING_OF_DIRECTION, "direction"],
                [Blockly.Msg.SENSING_OF_COSTUMENUMBER, "costume #"],
                [Blockly.Msg.SENSING_OF_COSTUMENAME, "costume name"],
                [Blockly.Msg.SENSING_OF_SIZE, "size"],
                [Blockly.Msg.SENSING_OF_VOLUME, "volume"],
                [Blockly.Msg.SENSING_OF_BACKDROPNUMBER, "backdrop #"],
                [Blockly.Msg.SENSING_OF_BACKDROPNAME, "backdrop name"]
              ]
            },
            {
              "type": "input_value",
              "name": "OBJECT"
            },
            {
              "type": "input_value",
              "name": "VALUE"
            }
          ],
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["sensing_current"] = {
      /**
       * Block to Report the current option.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.SENSING_CURRENT,
          "args0": [
            {
              "type": "field_dropdown",
              "name": "CURRENTMENU",
              "options": [
                [Blockly.Msg.SENSING_CURRENT_YEAR, "YEAR"],
                [Blockly.Msg.SENSING_CURRENT_MONTH, "MONTH"],
                [Blockly.Msg.SENSING_CURRENT_DATE, "DATE"],
                [Blockly.Msg.SENSING_CURRENT_DAYOFWEEK, "DAYOFWEEK"],
                [Blockly.Msg.SENSING_CURRENT_HOUR, "HOUR"],
                [Blockly.Msg.SENSING_CURRENT_MINUTE, "MINUTE"],
                [Blockly.Msg.SENSING_CURRENT_SECOND, "SECOND"],
                ["js timestamp", "TIMESTAMP"]
              ]
            }
          ],
          "category": Blockly.Categories.sensing,
          "checkboxInFlyout": true,
          "extensions": ["colours_sensing", "output_number"]
        });
      }
    };
    Blockly.Blocks["sensing_dayssince2000"] = {
      /**
       * Block to report days since 2000
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.SENSING_DAYSSINCE2000,
          "category": Blockly.Categories.sensing,
          "checkboxInFlyout": true,
          "extensions": ["colours_sensing", "output_number"]
        });
      }
    };
    Blockly.Blocks["sensing_username"] = {
      /**
       * Block to report user's username
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.SENSING_USERNAME,
          "category": Blockly.Categories.sensing,
          "checkboxInFlyout": true,
          "extensions": ["colours_sensing", "output_number"]
        });
      }
    };
    Blockly.Blocks["sensing_loggedin"] = {
      /**
       * pm: Block to report if a user is logged in.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "logged in?",
          "category": Blockly.Categories.sensing,
          "checkboxInFlyout": true,
          "extensions": ["colours_sensing", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["sensing_userid"] = {
      /**
       * Block to report user's ID. Does not actually do anything. This is an
       * obsolete block that is implemented for compatibility with Scratch 2.0
       * projects.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.SENSING_USERID,
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "output_number"]
        });
      }
    };
    Blockly.Blocks["sensing_regextest"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "test regex %2 %3 with text %1",
          "args0": [
            {
              "type": "input_value",
              "name": "text"
            },
            {
              "type": "input_value",
              "name": "reg"
            },
            {
              "type": "input_value",
              "name": "regrule"
            }
          ],
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["sensing_thing_is_number"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "%1 is number?",
          "args0": [
            {
              "type": "input_value",
              "name": "TEXT1"
            }
          ],
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["sensing_thing_has_text"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "%1 has text?",
          "args0": [
            {
              "type": "input_value",
              "name": "TEXT1"
            }
          ],
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["sensing_thing_has_number"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "%1 has number?",
          "args0": [
            {
              "type": "input_value",
              "name": "TEXT1"
            }
          ],
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["sensing_mobile"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "mobile?",
          "args0": [],
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["sensing_thing_is_text"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "%1 is text?",
          "args0": [
            {
              "type": "input_value",
              "name": "TEXT1"
            }
          ],
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["sensing_getspritewithattrib"] = {
      init: function() {
        this.jsonInit({
          "inputsInline": true,
          "message0": "get sprite with %1 set to %2",
          "args0": [
            {
              "type": "input_value",
              "name": "var"
            },
            {
              "type": "input_value",
              "name": "val"
            }
          ],
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "output_string"]
        });
      }
    };
    Blockly.Blocks["sensing_distanceTo"] = {
      init: function() {
        this.jsonInit({
          "message0": "distance from %1 %2 to %3 %4",
          "args0": [
            {
              "type": "input_value",
              "name": "x1"
            },
            {
              "type": "input_value",
              "name": "y1"
            },
            {
              "type": "input_value",
              "name": "x2"
            },
            {
              "type": "input_value",
              "name": "y2"
            }
          ],
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "output_number"]
        });
      }
    };
    Blockly.Blocks["sensing_directionTo"] = {
      init: function() {
        this.jsonInit({
          "message0": "direction to %1 %2 from %3 %4",
          "args0": [
            {
              "type": "input_value",
              "name": "x2"
            },
            {
              "type": "input_value",
              "name": "y2"
            },
            {
              "type": "input_value",
              "name": "x1"
            },
            {
              "type": "input_value",
              "name": "y1"
            }
          ],
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "output_number"]
        });
      }
    };
    Blockly.Blocks["sensing_isUpperCase"] = {
      init: function() {
        this.jsonInit({
          "message0": "is character %1 uppercase?",
          "args0": [
            {
              "type": "input_value",
              "name": "text"
            }
          ],
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["sensing_getoperatingsystem"] = {
      /**
       * pm: Block to report the users Operating System
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "operating system",
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "output_string"]
        });
      }
    };
    Blockly.Blocks["sensing_getbrowser"] = {
      /**
       * pm: Block to report the users Operating System
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "browser",
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "output_string"]
        });
      }
    };
    Blockly.Blocks["sensing_geturl"] = {
      /**
       * pm: Block to report the users Operating System
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "url",
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "output_string"]
        });
      }
    };
    Blockly.Blocks["sensing_getxyoftouchingsprite"] = {
      /**
       * Block to set drag mode.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1 of touching %2 point",
          "args0": [
            {
              "type": "field_dropdown",
              "name": "XY",
              "options": [
                ["x", "x"],
                ["y", "y"]
              ]
            },
            {
              "type": "input_value",
              "name": "SPRITE"
            }
          ],
          "category": Blockly.Categories.sensing,
          "extensions": ["colours_sensing", "output_number"]
        });
      }
    };
  }
});

// ../pm-blocks/blocks_vertical/data.js
var require_data = __commonJS({
  "../pm-blocks/blocks_vertical/data.js"() {
    "use strict";
    goog.provide("Blockly.Blocks.data");
    goog.provide("Blockly.Constants.Data");
    goog.require("Blockly.Blocks");
    goog.require("Blockly.Colours");
    goog.require("Blockly.constants");
    goog.require("Blockly.ScratchBlocks.VerticalExtensions");
    Blockly.Blocks["data_variable"] = {
      /**
       * Block of Variables
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1",
          "lastDummyAlign0": "CENTRE",
          "args0": [
            {
              "type": "field_variable_getter",
              "text": "",
              "name": "VARIABLE",
              "variableType": ""
            }
          ],
          "output": null,
          "category": Blockly.Categories.data,
          "checkboxInFlyout": true,
          "extensions": ["contextMenu_getVariableBlock", "colours_data"],
          "outputShape": Blockly.OUTPUT_SHAPE_ROUND
        });
      }
    };
    Blockly.Blocks["data_setvariableto"] = {
      /**
       * Block to set variable to a certain value
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.DATA_SETVARIABLETO,
          "args0": [
            {
              "type": "field_variable",
              "name": "VARIABLE"
            },
            {
              "type": "input_value",
              "name": "VALUE"
            }
          ],
          "category": Blockly.Categories.data,
          "extensions": ["colours_data", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["data_changevariableby"] = {
      /**
       * Block to change variable by a certain value
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.DATA_CHANGEVARIABLEBY,
          "args0": [
            {
              "type": "field_variable",
              "name": "VARIABLE"
            },
            {
              "type": "input_value",
              "name": "VALUE"
            }
          ],
          "category": Blockly.Categories.data,
          "extensions": ["colours_data", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["data_showvariable"] = {
      /**
       * Block to show a variable
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.DATA_SHOWVARIABLE,
          "args0": [
            {
              "type": "field_variable",
              "name": "VARIABLE"
            }
          ],
          "category": Blockly.Categories.data,
          "colour": Blockly.Colours.data.primary,
          "colourSecondary": Blockly.Colours.data.secondary,
          "colourTertiary": Blockly.Colours.data.tertiary,
          "extensions": ["shape_statement"]
        });
      }
    };
    Blockly.Blocks["data_hidevariable"] = {
      /**
       * Block to hide a variable
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.DATA_HIDEVARIABLE,
          "args0": [
            {
              "type": "field_variable",
              "name": "VARIABLE"
            }
          ],
          "category": Blockly.Categories.data,
          "colour": Blockly.Colours.data.primary,
          "colourSecondary": Blockly.Colours.data.secondary,
          "colourTertiary": Blockly.Colours.data.tertiary,
          "extensions": ["shape_statement"]
        });
      }
    };
    Blockly.Blocks["data_listcontents"] = {
      /**
       * List reporter.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1",
          "args0": [
            {
              "type": "field_variable_getter",
              "text": "",
              "name": "LIST",
              "variableType": Blockly.LIST_VARIABLE_TYPE
            }
          ],
          "category": Blockly.Categories.dataLists,
          "extensions": ["contextMenu_getListBlock", "colours_data_lists", "output_string"],
          "checkboxInFlyout": true
        });
      }
    };
    Blockly.Blocks["data_listindexall"] = {
      /**
       * List index menu, with all option.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1",
          "args0": [
            {
              "type": "field_numberdropdown",
              "name": "INDEX",
              "value": "1",
              "min": 1,
              "precision": 1,
              "options": [
                ["1", "1"],
                [Blockly.Msg.DATA_INDEX_LAST, "last"],
                [Blockly.Msg.DATA_INDEX_ALL, "all"]
              ]
            }
          ],
          "category": Blockly.Categories.data,
          "extensions": ["colours_textfield", "output_string"]
        });
      }
    };
    Blockly.Blocks["data_listindexrandom"] = {
      /**
       * List index menu, with random option.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "%1",
          "args0": [
            {
              "type": "field_numberdropdown",
              "name": "INDEX",
              "value": "1",
              "min": 1,
              "precision": 1,
              "options": [
                ["1", "1"],
                [Blockly.Msg.DATA_INDEX_LAST, "last"],
                [Blockly.Msg.DATA_INDEX_RANDOM, "random"]
              ]
            }
          ],
          "category": Blockly.Categories.data,
          "extensions": ["colours_textfield", "output_string"]
        });
      }
    };
    Blockly.Blocks["data_addtolist"] = {
      /**
       * Block to add item to list.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.DATA_ADDTOLIST,
          "args0": [
            {
              "type": "input_value",
              "name": "ITEM"
            },
            {
              "type": "field_variable",
              "name": "LIST",
              "variableTypes": [Blockly.LIST_VARIABLE_TYPE]
            }
          ],
          "category": Blockly.Categories.dataLists,
          "extensions": ["colours_data_lists", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["data_deleteoflist"] = {
      /**
       * Block to delete item from list.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.DATA_DELETEOFLIST,
          "args0": [
            {
              "type": "input_value",
              "name": "INDEX"
            },
            {
              "type": "field_variable",
              "name": "LIST",
              "variableTypes": [Blockly.LIST_VARIABLE_TYPE]
            }
          ],
          "category": Blockly.Categories.dataLists,
          "extensions": ["colours_data_lists", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["data_deletealloflist"] = {
      /**
       * Block to delete all items from list.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.DATA_DELETEALLOFLIST,
          "args0": [
            {
              "type": "field_variable",
              "name": "LIST",
              "variableTypes": [Blockly.LIST_VARIABLE_TYPE]
            }
          ],
          "category": Blockly.Categories.dataLists,
          "extensions": ["colours_data_lists", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["data_shiftlist"] = {
      /**
       * Block to delete all items from list.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "shift %1 by %2",
          "args0": [
            {
              "type": "field_variable",
              "name": "LIST",
              "variableTypes": [Blockly.LIST_VARIABLE_TYPE]
            },
            {
              "type": "input_value",
              "name": "INDEX"
            }
          ],
          "category": Blockly.Categories.dataLists,
          "extensions": ["colours_data_lists", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["data_insertatlist"] = {
      /**
       * Block to insert item to list.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.DATA_INSERTATLIST,
          "args0": [
            {
              "type": "input_value",
              "name": "ITEM"
            },
            {
              "type": "input_value",
              "name": "INDEX"
            },
            {
              "type": "field_variable",
              "name": "LIST",
              "variableTypes": [Blockly.LIST_VARIABLE_TYPE]
            }
          ],
          "category": Blockly.Categories.dataLists,
          "extensions": ["colours_data_lists", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["data_replaceitemoflist"] = {
      /**
       * Block to insert item to list.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.DATA_REPLACEITEMOFLIST,
          "args0": [
            {
              "type": "input_value",
              "name": "INDEX"
            },
            {
              "type": "field_variable",
              "name": "LIST",
              "variableTypes": [Blockly.LIST_VARIABLE_TYPE]
            },
            {
              "type": "input_value",
              "name": "ITEM"
            }
          ],
          "category": Blockly.Categories.dataLists,
          "extensions": ["colours_data_lists", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["data_itemoflist"] = {
      /**
       * Block for reporting item of list.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.DATA_ITEMOFLIST,
          "args0": [
            {
              "type": "input_value",
              "name": "INDEX"
            },
            {
              "type": "field_variable",
              "name": "LIST",
              "variableTypes": [Blockly.LIST_VARIABLE_TYPE]
            }
          ],
          "output": null,
          "category": Blockly.Categories.dataLists,
          "extensions": ["colours_data_lists"],
          "outputShape": Blockly.OUTPUT_SHAPE_ROUND
        });
      }
    };
    Blockly.Blocks["data_itemnumoflist"] = {
      /**
       * Block for reporting the item # of a string in a list.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.DATA_ITEMNUMOFLIST,
          "args0": [
            {
              "type": "input_value",
              "name": "ITEM"
            },
            {
              "type": "field_variable",
              "name": "LIST",
              "variableTypes": [Blockly.LIST_VARIABLE_TYPE]
            }
          ],
          "output": null,
          "category": Blockly.Categories.dataLists,
          "extensions": ["colours_data_lists"],
          "outputShape": Blockly.OUTPUT_SHAPE_ROUND
        });
      }
    };
    Blockly.Blocks["data_lengthoflist"] = {
      /**
       * Block for reporting length of list.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.DATA_LENGTHOFLIST,
          "args0": [
            {
              "type": "field_variable",
              "name": "LIST",
              "variableTypes": [Blockly.LIST_VARIABLE_TYPE]
            }
          ],
          "category": Blockly.Categories.dataLists,
          "extensions": ["colours_data_lists", "output_number"]
        });
      }
    };
    Blockly.Blocks["data_listcontainsitem"] = {
      /**
       * Block to report whether list contains item.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.DATA_LISTCONTAINSITEM,
          "args0": [
            {
              "type": "field_variable",
              "name": "LIST",
              "variableTypes": [Blockly.LIST_VARIABLE_TYPE]
            },
            {
              "type": "input_value",
              "name": "ITEM"
            }
          ],
          "category": Blockly.Categories.dataLists,
          "extensions": ["colours_data_lists", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["data_showlist"] = {
      /**
       * Block to show a list.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.DATA_SHOWLIST,
          "args0": [
            {
              "type": "field_variable",
              "name": "LIST",
              "variableTypes": [Blockly.LIST_VARIABLE_TYPE]
            }
          ],
          "category": Blockly.Categories.dataLists,
          "extensions": ["colours_data_lists", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["data_hidelist"] = {
      /**
       * Block to hide a list.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": Blockly.Msg.DATA_HIDELIST,
          "args0": [
            {
              "type": "field_variable",
              "name": "LIST",
              "variableTypes": [Blockly.LIST_VARIABLE_TYPE]
            }
          ],
          "category": Blockly.Categories.dataLists,
          "extensions": ["colours_data_lists", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["data_reverselist"] = {
      init: function() {
        this.jsonInit({
          "message0": "reverse %1",
          "args0": [
            {
              "type": "field_variable",
              "name": "LIST",
              "variableTypes": [Blockly.LIST_VARIABLE_TYPE]
            }
          ],
          "category": Blockly.Categories.dataLists,
          "extensions": ["colours_data_lists", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["data_itemexistslist"] = {
      init: function() {
        this.jsonInit({
          "message0": "item %1 exists in %2 ?",
          "args0": [
            {
              "type": "input_value",
              "name": "INDEX"
            },
            {
              "type": "field_variable",
              "name": "LIST",
              "variableTypes": [Blockly.LIST_VARIABLE_TYPE]
            }
          ],
          "category": Blockly.Categories.dataLists,
          "extensions": ["colours_data_lists", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["data_listisempty"] = {
      /**
       * Block to hide a list.
       * @this Blockly.Block
       */
      init: function() {
        this.jsonInit({
          "message0": "is %1 empty?",
          "args0": [
            {
              "type": "field_variable",
              "name": "LIST",
              "variableTypes": [Blockly.LIST_VARIABLE_TYPE]
            }
          ],
          "category": Blockly.Categories.dataLists,
          "extensions": ["colours_data_lists", "output_boolean"]
        });
      }
    };
    Blockly.Blocks["data_listarray"] = {
      init: function() {
        this.jsonInit({
          "message0": "get list %1 as an array",
          "args0": [
            {
              "type": "field_variable",
              "name": "LIST",
              "variableTypes": [Blockly.LIST_VARIABLE_TYPE]
            }
          ],
          "category": Blockly.Categories.dataLists,
          "extensions": ["colours_data_lists", "output_string"]
        });
      }
    };
    Blockly.Blocks["data_amountinlist"] = {
      init: function() {
        this.jsonInit({
          "message0": "amount of %1 in %2",
          "args0": [
            {
              "type": "input_value",
              "name": "VALUE"
            },
            {
              "type": "field_variable",
              "name": "LIST",
              "variableTypes": [Blockly.LIST_VARIABLE_TYPE]
            }
          ],
          "category": Blockly.Categories.dataLists,
          "extensions": ["colours_data_lists", "output_number"]
        });
      }
    };
    Blockly.Blocks["data_filterlistitem"] = {
      init: function() {
        this.jsonInit({
          "message0": "item",
          "args0": [],
          "category": Blockly.Categories.dataLists,
          "extensions": ["colours_data_lists", "output_string"],
          "canDragDuplicate": true
        });
      }
    };
    Blockly.Blocks["data_filterlistindex"] = {
      init: function() {
        this.jsonInit({
          "message0": "index",
          "args0": [],
          "category": Blockly.Categories.dataLists,
          "extensions": ["colours_data_lists", "output_string"],
          "canDragDuplicate": true
        });
      }
    };
    Blockly.Blocks["data_filterlist"] = {
      init: function() {
        this.jsonInit({
          "message0": "filter %1 by %2 %3 %4",
          "args0": [
            {
              "type": "field_variable",
              "name": "LIST",
              "variableTypes": [Blockly.LIST_VARIABLE_TYPE]
            },
            {
              "type": "input_value",
              "name": "INDEX"
            },
            {
              "type": "input_value",
              "name": "ITEM"
            },
            {
              "type": "input_value",
              "name": "BOOL",
              "check": "Boolean"
            }
          ],
          "category": Blockly.Categories.dataLists,
          "extensions": ["colours_data_lists", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["data_arraylist"] = {
      init: function() {
        this.jsonInit({
          "message0": "set %2 to array %1",
          "args0": [
            {
              "type": "input_value",
              "name": "VALUE"
            },
            {
              "type": "field_variable",
              "name": "LIST",
              "variableTypes": [Blockly.LIST_VARIABLE_TYPE]
            }
          ],
          "category": Blockly.Categories.dataLists,
          "extensions": ["colours_data_lists", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["data_listforeachnum"] = {
      init: function() {
        this.jsonInit({
          "message0": "for each index: %2 in %1",
          "message1": "%1",
          "message2": "%1",
          "lastDummyAlign2": "RIGHT",
          "args0": [
            {
              "type": "field_variable",
              "name": "LIST",
              "variableTypes": [Blockly.LIST_VARIABLE_TYPE]
            },
            {
              "type": "field_variable",
              "name": "VARIABLE"
            }
          ],
          "args1": [
            {
              "type": "input_statement",
              "check": "normal",
              "name": "SUBSTACK"
            }
          ],
          "args2": [
            {
              "type": "field_image",
              "src": Blockly.mainWorkspace.options.pathToMedia + "repeat.svg",
              "width": 24,
              "height": 24,
              "alt": "*",
              "flip_rtl": true
            }
          ],
          "category": Blockly.Categories.dataLists,
          "extensions": ["colours_data_lists", "shape_statement"]
        });
      }
    };
    Blockly.Blocks["data_listforeachitem"] = {
      init: function() {
        this.jsonInit({
          "message0": "for each value: %2 in %1",
          "message1": "%1",
          "message2": "%1",
          "lastDummyAlign2": "RIGHT",
          "args0": [
            {
              "type": "field_variable",
              "name": "LIST",
              "variableTypes": [Blockly.LIST_VARIABLE_TYPE]
            },
            {
              "type": "field_variable",
              "name": "VARIABLE"
            }
          ],
          "args1": [
            {
              "type": "input_statement",
              "check": "normal",
              "name": "SUBSTACK"
            }
          ],
          "args2": [
            {
              "type": "field_image",
              "src": Blockly.mainWorkspace.options.pathToMedia + "repeat.svg",
              "width": 24,
              "height": 24,
              "alt": "*",
              "flip_rtl": true
            }
          ],
          "category": Blockly.Categories.dataLists,
          "extensions": ["colours_data_lists", "shape_statement"]
        });
      }
    };
    Blockly.Constants.Data.EXTENSION_VARIABLE_GETTER_MENU = {
      /**
       * Add context menu option to change the selected variable.
       * @param {!Array} options List of menu options to add to.
       * @this Blockly.Block
       */
      customContextMenu: function(options) {
        var varField = this.inputList[0].fieldRow[0];
        if (this.isCollapsed()) {
          return;
        }
        var currentVarName = varField.text_;
        if (!this.isInFlyout) {
          var variablesList = this.workspace.getVariablesOfType(varField.variable_.type);
          variablesList.sort(function(a, b) {
            return Blockly.scratchBlocksUtils.compareStrings(a.name, b.name);
          });
          for (var i = 0; i < variablesList.length; i++) {
            var varName = variablesList[i].name;
            if (varName == currentVarName)
              continue;
            var option = { enabled: true };
            option.text = varName;
            option.callback = Blockly.Constants.Data.VARIABLE_OPTION_CALLBACK_FACTORY(
              this,
              variablesList[i].getId(),
              varField.name
            );
            options.push(option);
          }
        } else {
          var renameOption = {
            text: Blockly.Msg.RENAME_VARIABLE,
            enabled: true,
            callback: Blockly.Constants.Data.RENAME_OPTION_CALLBACK_FACTORY(
              this,
              varField.name
            )
          };
          var deleteOption = {
            text: Blockly.Msg.DELETE_VARIABLE.replace("%1", currentVarName),
            enabled: true,
            callback: Blockly.Constants.Data.DELETE_OPTION_CALLBACK_FACTORY(
              this,
              varField.name
            )
          };
          options.push(renameOption);
          options.push(deleteOption);
        }
      }
    };
    Blockly.Extensions.registerMixin(
      "contextMenu_getVariableBlockAnyType",
      Blockly.Constants.Data.EXTENSION_VARIABLE_GETTER_MENU
    );
    Blockly.Constants.Data.CUSTOM_CONTEXT_MENU_GET_VARIABLE_MIXIN = {
      /**
       * Add context menu option to change the selected variable.
       * @param {!Array} options List of menu options to add to.
       * @this Blockly.Block
       */
      customContextMenu: function(options) {
        var fieldName = "VARIABLE";
        if (this.isCollapsed()) {
          return;
        }
        var currentVarName = this.getField(fieldName).text_;
        if (!this.isInFlyout) {
          var variablesList = this.workspace.getVariablesOfType("");
          variablesList.sort(function(a, b) {
            return Blockly.scratchBlocksUtils.compareStrings(a.name, b.name);
          });
          for (var i = 0; i < variablesList.length; i++) {
            var varName = variablesList[i].name;
            if (varName == currentVarName)
              continue;
            var option = { enabled: true };
            option.text = varName;
            option.callback = Blockly.Constants.Data.VARIABLE_OPTION_CALLBACK_FACTORY(
              this,
              variablesList[i].getId(),
              fieldName
            );
            options.push(option);
          }
        } else {
          var renameOption = {
            text: Blockly.Msg.RENAME_VARIABLE,
            enabled: true,
            callback: Blockly.Constants.Data.RENAME_OPTION_CALLBACK_FACTORY(
              this,
              fieldName
            )
          };
          var deleteOption = {
            text: Blockly.Msg.DELETE_VARIABLE.replace("%1", currentVarName),
            enabled: true,
            callback: Blockly.Constants.Data.DELETE_OPTION_CALLBACK_FACTORY(
              this,
              fieldName
            )
          };
          options.push(renameOption);
          options.push(deleteOption);
        }
      }
    };
    Blockly.Extensions.registerMixin(
      "contextMenu_getVariableBlock",
      Blockly.Constants.Data.CUSTOM_CONTEXT_MENU_GET_VARIABLE_MIXIN
    );
    Blockly.Constants.Data.CUSTOM_CONTEXT_MENU_GET_LIST_MIXIN = {
      /**
       * Add context menu option to change the selected list.
       * @param {!Array} options List of menu options to add to.
       * @this Blockly.Block
       */
      customContextMenu: function(options) {
        var fieldName = "LIST";
        if (this.isCollapsed()) {
          return;
        }
        var currentVarName = this.getField(fieldName).text_;
        if (!this.isInFlyout) {
          var variablesList = this.workspace.getVariablesOfType("list");
          variablesList.sort(function(a, b) {
            return Blockly.scratchBlocksUtils.compareStrings(a.name, b.name);
          });
          for (var i = 0; i < variablesList.length; i++) {
            var varName = variablesList[i].name;
            if (varName == currentVarName)
              continue;
            var option = { enabled: true };
            option.text = varName;
            option.callback = Blockly.Constants.Data.VARIABLE_OPTION_CALLBACK_FACTORY(
              this,
              variablesList[i].getId(),
              fieldName
            );
            options.push(option);
          }
        } else {
          var renameOption = {
            text: Blockly.Msg.RENAME_LIST,
            enabled: true,
            callback: Blockly.Constants.Data.RENAME_OPTION_CALLBACK_FACTORY(
              this,
              fieldName
            )
          };
          var deleteOption = {
            text: Blockly.Msg.DELETE_LIST.replace("%1", currentVarName),
            enabled: true,
            callback: Blockly.Constants.Data.DELETE_OPTION_CALLBACK_FACTORY(
              this,
              fieldName
            )
          };
          options.push(renameOption);
          options.push(deleteOption);
        }
      }
    };
    Blockly.Extensions.registerMixin(
      "contextMenu_getListBlock",
      Blockly.Constants.Data.CUSTOM_CONTEXT_MENU_GET_LIST_MIXIN
    );
    Blockly.Constants.Data.VARIABLE_OPTION_CALLBACK_FACTORY = function(block, id, fieldName) {
      return function() {
        var variableField = block.getField(fieldName);
        if (!variableField) {
          console.log("Tried to get a variable field on the wrong type of block.");
        }
        variableField.setValue(id);
      };
    };
    Blockly.Constants.Data.RENAME_OPTION_CALLBACK_FACTORY = function(block, fieldName) {
      return function() {
        var workspace = block.workspace;
        var variable = block.getField(fieldName).getVariable();
        Blockly.Variables.renameVariable(workspace, variable);
      };
    };
    Blockly.Constants.Data.DELETE_OPTION_CALLBACK_FACTORY = function(block, fieldName) {
      return function() {
        var workspace = block.workspace;
        var variable = block.getField(fieldName).getVariable();
        workspace.deleteVariableById(variable.getId());
      };
    };
  }
});

// ../blocks.js
var require_blocks = __commonJS({
  "../blocks.js"(exports2, module2) {
    globalThis.goog = globalThis.goog || {
      require: () => {
      },
      provide: () => {
      }
    };
    globalThis.Blockly = globalThis.Blockly || {
      // @ts-ignore
      Blocks: {},
      Constants: {
        // @ts-ignore
        Data: {}
      },
      Extensions: {
        registerMixin: () => {
        }
      },
      ScratchBlocks: {
        // @ts-ignore
        ProcedureUtils: {
          // @ts-ignore
          parseReturnMutation: () => {
          }
        }
      },
      // @ts-ignore
      Msg: {},
      mainWorkspace: {
        options: {
          pathToMedia: ""
        },
        enableProcedureReturns() {
        }
      },
      // @ts-ignore
      Categories: {},
      FieldDropdown: class FieldDropdown {
      }
    };
    Blockly.scratchBlocksUtils = Blockly.scratchBlocksUtils || {
      generateMutatorShadow: function() {
        return null;
      },
      // other helpers pm-blocks may reference can be added as no-ops
      createVariableField: function() {
        return null;
      }
    };
    require_en();
    require_constants();
    require_colours();
    module2.exports.blockly = Blockly;
    require_control();
    require_event();
    require_looks();
    require_motion();
    require_operators();
    require_sound();
    require_sensing();
    require_data();
    function jsBlocksToJSON(jsblocks = globalThis.Blockly.Blocks) {
      const blocks = {};
      for (const [opcode, data] of Object.entries(jsblocks)) {
        let blockdata = {};
        const fakeThis = {
          jsonInit(d) {
            blockdata = d;
          },
          appendDummyInput() {
            return {
              appendField() {
                return this;
              }
            };
          },
          appendValueInput() {
            return { appendField() {
              return this;
            } };
          },
          appendStatementInput() {
            return { appendField() {
              return this;
            } };
          },
          setPreviousStatement() {
          },
          setNextStatement() {
          },
          setOutput() {
          },
          setColour() {
          },
          setCategory() {
          },
          setTooltip() {
          },
          setHelpUrl() {
          },
          // @ts-ignore
          workspace: Blockly.mainWorkspace
        };
        if (typeof data.init === "function")
          data.init.call(fakeThis);
        blocks[opcode] = blockdata;
      }
      const processedBlocks = Object.fromEntries(
        Object.entries(blocks).map(([opcode, block]) => {
          const args = Object.keys(block).filter((a) => a.startsWith("args")).map((n) => block[n]).filter((a) => {
            var _a;
            return a && ((_a = a[0]) == null ? void 0 : _a.type) != "field_image";
          });
          if (args.find((k) => k.type == "input_statement")) {
            const params2 = (args[0] ?? []).map((arg) => {
              if (arg.type == "field_dropdown") {
                return {
                  name: arg.name,
                  type: 1,
                  field: arg.name,
                  options: arg.options,
                  variableTypes: arg.variableTypes
                };
              } else if (arg.type == "field_image") {
                return null;
              } else if (arg.type == "field_variable") {
                return {
                  name: arg.name,
                  type: 1,
                  options: arg.options,
                  variableTypes: arg.variableTypes
                };
              } else if (arg.type == "field_variable_getter") {
                return null;
              } else if (arg.type == "field_numberdropdown") {
                return { name: arg.name, type: 1, variableTypes: arg.variableTypes };
              } else if (arg.type == "input_statement") {
                return {};
              }
              return {
                name: arg.name,
                // treat input_value as value input (1); treat any field_* or unknown as field (1)
                type: arg.type == "input_value" ? 1 : 1,
                variableTypes: arg.variableTypes
              };
            }) ?? [];
            return [opcode, [params2, "branch", args.filter((k) => k.type == "input_statement").map((i) => i.name)]];
          }
          const params = (args[0] ?? []).map((arg) => {
            if (arg.type == "field_dropdown") {
              return {
                name: arg.name,
                type: 1,
                field: arg.name,
                options: arg.options,
                variableTypes: arg.variableTypes
              };
            } else if (arg.type == "field_image") {
              return null;
            } else if (arg.type == "field_variable") {
              return {
                name: arg.name,
                type: 1,
                field: arg.name,
                variableTypes: arg.variableTypes
              };
            } else if (arg.type == "field_variable_getter") {
              return null;
            } else if (arg.type == "field_numberdropdown") {
              return { name: arg.name, type: 1 };
            } else if (arg.type == "input_statement") {
              return {};
            }
            return {
              name: arg.name,
              type: arg.type == "input_value" ? 1 : 1,
              variableTypes: arg.variableTypes
            };
          }) ?? [];
          const shape = (block.extensions ?? []).includes("shape_hat") ? "hat" : "reporter";
          return [opcode, [params, shape]];
        })
      );
      return processedBlocks;
    }
    module2.exports.processedBlocks = jsBlocksToJSON();
    Object.assign(module2.exports.processedBlocks, {
      pmOperatorsExpansion_shiftLeft: [[
        { name: "num1", type: "number" },
        { name: "num2", type: "number" }
      ]],
      pmOperatorsExpansion_shiftRight: [[
        { name: "num1", type: "number" },
        { name: "num2", type: "number" }
      ]],
      pmOperatorsExpansion_binnaryAnd: [[
        { name: "num1", type: "number" },
        { name: "num2", type: "number" }
      ]],
      pmOperatorsExpansion_binnaryOr: [[
        { name: "num1", type: "number" },
        { name: "num2", type: "number" }
      ]],
      pmOperatorsExpansion_binnaryXor: [[
        { name: "num1", type: "number" },
        { name: "num2", type: "number" }
      ]],
      pmOperatorsExpansion_binnaryNot: [[
        { name: "num1", type: "number" }
      ]]
    });
  }
});

// server/server.js
var {
  createConnection,
  ProposedFeatures,
  TextDocuments,
  DiagnosticSeverity
} = require_node3();
var antlr4 = require_antlr4_node();
var fs = require("fs");
var path = require("path");
var PangLexer;
var PangParser;
var PangVisitor;
try {
  PangLexer = require_PangLexer().default;
  PangParser = require_PangParser().default;
  try {
    PangVisitor = require_PangVisitor().default;
  } catch (e) {
    PangVisitor = null;
  }
} catch (e) {
  try {
    const libPath = pathResolveLib();
    PangLexer = require(libPath + "/PangLexer").default;
    PangParser = require(libPath + "/PangParser").default;
    try {
      PangVisitor = require(libPath + "/PangVisitor").default;
    } catch (ee) {
      PangVisitor = null;
    }
  } catch (ee) {
    PangLexer = null;
    PangParser = null;
    PangVisitor = null;
  }
}
function pathResolveLib() {
  const packaged = path.join(__dirname, "lib");
  if (fs.existsSync(packaged))
    return packaged;
  const repoLib = path.join(__dirname, "..", "..", "lib");
  return repoLib;
}
var connection = typeof process.send === "function" ? createConnection(ProposedFeatures.all) : createConnection(ProposedFeatures.all, process.stdin, process.stdout);
var documents = new TextDocuments();
connection.onInitialize(() => {
  return {
    capabilities: {
      textDocumentSync: documents.syncKind,
      completionProvider: { resolveProvider: false },
      definitionProvider: true,
      hoverProvider: true
      // ← add this
    }
  };
});
var CollectingErrorListener = class {
  constructor(errors) {
    this.errors = errors;
  }
  syntaxError(recognizer, offendingSymbol, line, column, msg) {
    this.errors.push({ line, column, msg });
  }
  reportAttemptingFullContext(recognizer, dfa, startIndex, stopIndex, conflictingAlts, configs) {
  }
  reportContextSensitivity(recognizer, dfa, startIndex, stopIndex, prediction, configs) {
  }
  reportAmbiguity(recognizer, dfa, startIndex, stopIndex, exact, ambigAlts, configs) {
  }
};
function validateText(text, uri) {
  const diagnostics = [];
  if (!PangLexer || !PangParser) {
    diagnostics.push({
      severity: DiagnosticSeverity.Error,
      range: { start: { line: 0, character: 0 }, end: { line: 0, character: 1 } },
      message: "Pang parser not found. Generate parser with ANTLR and ensure lib/PangParser.js exists.",
      source: "pang"
    });
    return diagnostics;
  }
  try {
    const chars = new antlr4.InputStream(text);
    const lexer = new PangLexer(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const errors = [];
    const listener = new CollectingErrorListener(errors);
    lexer.removeErrorListeners();
    lexer.addErrorListener(listener);
    const parser = new PangParser(tokens);
    parser.removeErrorListeners();
    parser.addErrorListener(listener);
    parser.buildParseTrees = true;
    parser.program();
    for (const e of errors) {
      const diag = {
        severity: DiagnosticSeverity.Error,
        range: {
          start: { line: Math.max(0, e.line - 1), character: Math.max(0, e.column) },
          end: { line: Math.max(0, e.line - 1), character: Math.max(0, e.column + 1) }
        },
        message: e.msg,
        source: "pang"
      };
      diagnostics.push(diag);
    }
    const keywords = /* @__PURE__ */ new Set(["on", "let", "const", "if", "else", "print", "ask", "return", "true", "false"]);
    const builtins = /* @__PURE__ */ new Set(["print", "ask", "on"]);
    const declared = /* @__PURE__ */ new Map();
    const lines = text.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const declRe = /\b(?:let|const)\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;
      let m;
      while (m = declRe.exec(line)) {
        const name = m[1];
        declared.set(name, {
          line: i,
          start: m.index + m[0].indexOf(name),
          end: m.index + m[0].indexOf(name) + name.length
        });
      }
      const assignRe = /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=/;
      const am = assignRe.exec(line);
      if (am) {
        const name = am[1];
        const idx = line.indexOf(name);
        declared.set(name, { line: i, start: idx, end: idx + name.length });
      }
    }
    const identRe = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      let processed = "";
      let inString = false;
      let escaped = false;
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (inString) {
          if (escaped) {
            escaped = false;
            processed += " ";
          } else if (char === "\\") {
            escaped = true;
            processed += " ";
          } else if (char === '"') {
            inString = false;
            processed += '"';
          } else {
            processed += " ";
          }
        } else {
          if (char === '"') {
            inString = true;
            processed += '"';
          } else {
            processed += char;
          }
        }
      }
      line = processed;
      let m2;
      let lastEnd = 0;
      while (m2 = identRe.exec(line)) {
        const name = m2[1];
        const start = m2.index;
        const end = m2.index + name.length;
        if (keywords.has(name) || builtins.has(name))
          continue;
        const nextChar = line[end];
        if (nextChar === "." || nextChar === "(")
          continue;
        const afterIdent = line.slice(end).match(/^\s*:/);
        if (afterIdent)
          continue;
        if (!declared.has(name)) {
          const diag = {
            severity: DiagnosticSeverity.Warning,
            range: { start: { line: i, character: start }, end: { line: i, character: end } },
            message: `Undeclared variable '${name}' \u2014 consider 'let ${name}' or implicit assignment.`,
            source: "pang"
          };
          diagnostics.push(diag);
        }
        lastEnd = end;
      }
    }
    diagnostics._declared = declared;
  } catch (err) {
    diagnostics.push({
      severity: DiagnosticSeverity.Error,
      range: { start: { line: 0, character: 0 }, end: { line: 0, character: 1 } },
      message: "Parser runtime error: " + (err && err.message ? err.message : String(err)),
      source: "pang"
    });
  }
  return diagnostics;
}
var cursorPositions = /* @__PURE__ */ new Map();
function validateAllDocuments() {
  for (const doc of documents.all()) {
    validateDocument(doc);
  }
}
function validateDocument(doc) {
  const text = doc.getText();
  let diags = validateText(text, doc.uri);
  const cursorPos = cursorPositions.get(doc.uri);
  if (cursorPos) {
    const lines = text.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let inString = false;
      let escaped = false;
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (escaped) {
          escaped = false;
        } else if (char === "\\") {
          escaped = true;
        } else if (char === '"') {
          inString = !inString;
        }
      }
      if (inString && i !== cursorPos.line) {
        diags.push({
          severity: DiagnosticSeverity.Error,
          range: {
            start: { line: i, character: 0 },
            end: { line: i, character: line.length }
          },
          message: "Unclosed string literal",
          source: "pang"
        });
      }
    }
  }
  if (cursorPos) {
    diags = diags.filter(
      (d) => !(d.message.includes("Unclosed string") && d.range.start.line === cursorPos.line)
    );
  }
  connection.sendDiagnostics({ uri: doc.uri, diagnostics: diags });
}
var validateTimeout = null;
var lastChangeVersion = /* @__PURE__ */ new Map();
documents.onDidChangeContent((e) => {
  lastChangeVersion.set(e.document.uri, e.document.version);
  clearTimeout(validateTimeout);
  validateTimeout = setTimeout(() => {
    validateDocument(e.document);
  }, 200);
});
connection.onNotification("custom/cursorMoved", (params) => {
  const { uri, position } = params;
  cursorPositions.set(uri, position);
  const doc = documents.get(uri);
  if (doc && doc.version === lastChangeVersion.get(uri)) {
    validateDocument(doc);
  }
});
connection.onInitialized(() => {
  setInterval(() => {
    validateAllDocuments();
  }, 1e3);
});
var blocksMeta = null;
try {
  blocksMeta = require(pathResolveLib().replace("/lib", "") + "/blocks").processedBlocks;
} catch (e) {
  try {
    blocksMeta = require_blocks().processedBlocks;
  } catch (ee) {
    blocksMeta = null;
  }
}
connection.onCompletion((textDocumentPosition) => {
  try {
    const doc = documents.get(textDocumentPosition.textDocument.uri);
    const text = doc ? doc.getText() : "";
    const items = [];
    try {
      const snippetPath = path.join(__dirname, "..", "snippets", "pang.json");
      if (fs.existsSync(snippetPath)) {
        const raw = fs.readFileSync(snippetPath, "utf8");
        const sn = JSON.parse(raw);
        for (const key of Object.keys(sn)) {
          const s = sn[key];
          const label = s.prefix || key;
          const insert = Array.isArray(s.body) ? s.body.join("\n") : s.body;
          items.push({
            label,
            kind: 15,
            insertText: insert,
            insertTextFormat: 2,
            detail: s.description || "snippet",
            sortText: "000"
          });
        }
      }
    } catch (e) {
    }
    const declared = /* @__PURE__ */ new Set();
    const lines = text.split(/\r?\n/);
    const declRe = /\b(?:let|const)\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;
    const assignRe = /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=/;
    for (let i = 0; i < lines.length; i++) {
      let m;
      while (m = declRe.exec(lines[i]))
        declared.add(m[1]);
      const am = assignRe.exec(lines[i]);
      if (am)
        declared.add(am[1]);
    }
    for (const v of declared)
      items.push({ label: v, kind: 6, sortText: "100" });
    if (blocksMeta) {
      for (const k of Object.keys(blocksMeta))
        items.push({ label: k, kind: 12, sortText: "200" });
    }
    return items;
  } catch (e) {
    return [];
  }
});
module.exports = module.exports || {};
module.exports.validateText = validateText;
if (require.main === module) {
  documents.listen(connection);
  connection.listen();
}
connection.onDefinition((params) => {
  try {
    const doc = documents.get(params.textDocument.uri);
    if (!doc)
      return null;
    const line = doc.getText().split(/\r?\n/)[params.position.line] || "";
    const re = /[a-zA-Z_][a-zA-Z0-9_]*/g;
    let match;
    let found = null;
    while (match = re.exec(line)) {
      const start = match.index;
      const end = start + match[0].length;
      if (params.position.character >= start && params.position.character <= end) {
        found = match[0];
        break;
      }
    }
    if (!found)
      return null;
    const diags = validateText(doc.getText(), params.textDocument.uri);
    const declared = diags._declared || /* @__PURE__ */ new Map();
    if (declared.has(found)) {
      const pos = declared.get(found);
      return [
        {
          uri: params.textDocument.uri,
          range: {
            start: { line: pos.line, character: pos.start },
            end: { line: pos.line, character: pos.end }
          }
        }
      ];
    }
    const allLines = doc.getText().split(/\r?\n/);
    for (let i = 0; i < allLines.length; i++) {
      const l = allLines[i];
      const m = new RegExp("\\b(?:let|const)\\s+" + found + "\\b").exec(l);
      if (m) {
        const idx = l.indexOf(found);
        return [
          {
            uri: params.textDocument.uri,
            range: { start: { line: i, character: idx }, end: { line: i, character: idx + found.length } }
          }
        ];
      }
    }
    return null;
  } catch (e) {
    return null;
  }
});
/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2016 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2016 Massachusetts Institute of Technology
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
