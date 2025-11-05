var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

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

// extension.js
var path = require("path");
var fs = require("fs");
var { workspace, window: window2, commands, languages, Uri } = require("vscode");
var outputChannel;
function log(msg) {
  if (!outputChannel)
    outputChannel = window2.createOutputChannel("Pang Language");
  outputChannel.appendLine(`${(/* @__PURE__ */ new Date()).toISOString()} - ${msg}`);
}
var antlr4 = (() => {
  try {
    return require(path.join(__dirname, "lib", "antlr4"));
  } catch (e) {
    try {
      return require_antlr4_node();
    } catch (ee) {
      return null;
    }
  }
})();
var PangLexer = null;
var PangParser = null;
var serverModule = null;
function tryLoadParsers(extensionPath) {
  const candidates = [];
  if (extensionPath) {
    try {
      const serverBundle = path.join(
        extensionPath,
        "server",
        "dist",
        "server.js"
      );
      if (fs.existsSync(serverBundle)) {
        try {
          const mod = require(serverBundle);
          if (mod && typeof mod.validateText === "function") {
            serverModule = mod;
            log(
              `Using bundled server validateText from ${serverBundle}`
            );
            return true;
          }
        } catch (e) {
          log(
            `Failed requiring bundled server at ${serverBundle}: ${String(
              e
            )}`
          );
        }
      }
    } catch (e) {
    }
    candidates.push(path.join(extensionPath, "lib"));
    candidates.push(path.join(extensionPath, "server", "dist", "lib"));
    candidates.push(path.join(extensionPath, "dist", "lib"));
  }
  candidates.push(path.join(__dirname, "lib"));
  try {
    const wsFolders = workspace.workspaceFolders || [];
    for (const f of wsFolders)
      candidates.push(path.join(f.uri.fsPath, "lib"));
  } catch (e) {
  }
  for (const c of candidates) {
    try {
      if (!c)
        continue;
      const p = path.join(c, "PangParser.js");
      if (fs.existsSync(p)) {
        const lex = require(path.join(c, "PangLexer"));
        const pars = require(path.join(c, "PangParser"));
        PangLexer = lex && (lex.default || lex);
        PangParser = pars && (pars.default || pars);
        if (PangLexer && PangParser) {
          log(`Loaded Pang parser from ${c}`);
          return true;
        }
      }
    } catch (err) {
      log(`Failed loading parser from ${c}: ${String(err)}`);
    }
  }
  PangLexer = null;
  PangParser = null;
  return false;
}
function validateText(text) {
  const diagnostics = [];
  if (!PangLexer || !PangParser || !antlr4) {
    if (serverModule && typeof serverModule.validateText === "function") {
      try {
        const serverResult = serverModule.validateText(text);
        const sd = Array.isArray(serverResult) ? serverResult : serverResult.diagnostics || [];
        const declared2 = serverResult && serverResult._declared ? serverResult._declared : sd._declared || /* @__PURE__ */ new Map();
        return { diagnostics: sd, _declared: declared2 };
      } catch (e) {
        diagnostics.push({
          severity: 0,
          range: {
            start: { line: 0, character: 0 },
            end: { line: 0, character: 1 }
          },
          message: "Bundled server validation failed: " + String(e),
          source: "pang"
        });
        return { diagnostics, _declared: /* @__PURE__ */ new Map() };
      }
    }
    diagnostics.push({
      severity: 0,
      // Error
      range: {
        start: { line: 0, character: 0 },
        end: { line: 0, character: 1 }
      },
      message: "Pang parser not found. Generate parser with ANTLR and ensure lib/PangParser.js exists next to the extension or in the workspace lib/.",
      source: "pang"
    });
    return { diagnostics, _declared: /* @__PURE__ */ new Map() };
  }
  try {
    const chars = new antlr4.InputStream(text);
    const lexer = new PangLexer(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const errors = [];
    const listener = {
      syntaxError: (recognizer, offendingSymbol, line, column, msg) => errors.push({ line, column, msg }),
      reportAmbiguity: () => {
      },
      reportAttemptingFullContext: () => {
      },
      reportContextSensitivity: () => {
      }
    };
    lexer.removeErrorListeners && lexer.removeErrorListeners();
    lexer.addErrorListener && lexer.addErrorListener(listener);
    const parser = new PangParser(tokens);
    parser.removeErrorListeners && parser.removeErrorListeners();
    parser.addErrorListener && parser.addErrorListener(listener);
    parser.buildParseTrees = true;
    if (typeof parser.program === "function")
      parser.program();
    for (const e of errors) {
      diagnostics.push({
        severity: 0,
        range: {
          start: {
            line: Math.max(0, e.line - 1),
            character: Math.max(0, e.column)
          },
          end: {
            line: Math.max(0, e.line - 1),
            character: Math.max(0, e.column + 1)
          }
        },
        message: e.msg,
        source: "pang"
      });
    }
  } catch (err) {
    diagnostics.push({
      severity: 0,
      range: {
        start: { line: 0, character: 0 },
        end: { line: 0, character: 1 }
      },
      message: "Parser runtime error: " + (err && err.message ? err.message : String(err)),
      source: "pang"
    });
  }
  const keywords = /* @__PURE__ */ new Set([
    "on",
    "let",
    "const",
    "if",
    "else",
    "print",
    "ask",
    "return",
    "true",
    "false"
  ]);
  const builtins = /* @__PURE__ */ new Set(["print", "ask", "on"]);
  const declared = /* @__PURE__ */ new Map();
  const lines = text.split(/\r?\n/);
  function stripStrings(s) {
    return s.replace(
      /'[^']*'|"[^"]*"|`[^`]*`/g,
      (m) => " ".repeat(m.length)
    );
  }
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const declRe = /\b(?:let|const)\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;
    let m;
    while (m = declRe.exec(line))
      declared.set(m[1], {
        line: i,
        start: m.index + m[0].indexOf(m[1]),
        end: m.index + m[0].indexOf(m[1]) + m[1].length
      });
    const assignRe = /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=/;
    const am = assignRe.exec(line);
    if (am)
      declared.set(am[1], {
        line: i,
        start: line.indexOf(am[1]),
        end: line.indexOf(am[1]) + am[1].length
      });
  }
  const identRe = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = stripStrings(rawLine);
    const codeLine = line.split("//")[0];
    let m2;
    while (m2 = identRe.exec(codeLine)) {
      const name = m2[1];
      if (keywords.has(name) || builtins.has(name))
        continue;
      const afterIndex = m2.index + name.length;
      const rest = rawLine.slice(afterIndex);
      const nextChar = rest.length ? rest[0] : void 0;
      if (nextChar === "." || nextChar === "(")
        continue;
      if (/^\s*:/.test(rest))
        continue;
      if (!declared.has(name)) {
        diagnostics.push({
          severity: 2,
          range: {
            start: { line: i, character: m2.index },
            end: { line: i, character: m2.index + name.length }
          },
          message: `Undeclared variable '${name}' \u2014 consider 'let ${name}' or implicit assignment.`,
          source: "pang"
        });
      }
    }
  }
  return { diagnostics, _declared: declared };
}
var diagnosticCollection = null;
function registerProviders(context) {
  diagnosticCollection = languages.createDiagnosticCollection("pang");
  context.subscriptions.push(diagnosticCollection);
  let currentCursorPosition = null;
  context.subscriptions.push(
    window2.onDidChangeTextEditorSelection((e) => {
      if (e.textEditor.document.languageId === "pang" || e.textEditor.document.fileName.endsWith(".ps")) {
        const pos = e.selections[0].active;
        currentCursorPosition = pos;
        runValidate(e.textEditor.document, pos);
      }
    })
  );
  context.subscriptions.push(
    workspace.onDidOpenTextDocument((doc) => {
      if (doc.languageId === "pang" || doc.fileName.endsWith(".ps")) {
        const editor = window2.activeTextEditor;
        const cursorPos = editor && editor.document === doc ? editor.selection.active : null;
        runValidate(doc, cursorPos);
      }
    })
  );
  context.subscriptions.push(
    workspace.onDidChangeTextDocument((e) => {
      if (e.document.languageId === "pang" || e.document.fileName.endsWith(".ps")) {
        runValidate(e.document, currentCursorPosition);
      }
    })
  );
  context.subscriptions.push(
    workspace.onDidSaveTextDocument((doc) => {
      if (doc.languageId === "pang" || doc.fileName.endsWith(".ps")) {
        const editor = window2.activeTextEditor;
        const cursorPos = editor && editor.document === doc ? editor.selection.active : null;
        runValidate(doc, cursorPos);
      }
    })
  );
  for (const doc of workspace.textDocuments)
    if (doc.languageId === "pang" || doc.fileName.endsWith(".ps"))
      runValidate(doc);
  context.subscriptions.push(
    languages.registerCompletionItemProvider(
      { scheme: "file", language: "pang" },
      {
        provideCompletionItems(document, position) {
          try {
            const text = document.getText();
            const items = [];
            try {
              const snippetPath = path.join(
                context.extensionPath || __dirname,
                "snippets",
                "pang.json"
              );
              if (fs.existsSync(snippetPath)) {
                const raw = fs.readFileSync(
                  snippetPath,
                  "utf8"
                );
                const sn = JSON.parse(raw);
                for (const key of Object.keys(sn)) {
                  const s = sn[key];
                  const label = s.prefix || key;
                  const insert = Array.isArray(s.body) ? s.body.join("\n") : s.body;
                  items.push(
                    new (require("vscode")).CompletionItem(
                      label,
                      require("vscode").CompletionItemKind.Snippet
                    )
                  );
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
              items.push(
                new (require("vscode")).CompletionItem(
                  v,
                  require("vscode").CompletionItemKind.Variable
                )
              );
            return items;
          } catch (e) {
            return [];
          }
        }
      },
      ".",
      "(",
      " "
    )
  );
  context.subscriptions.push(
    languages.registerDefinitionProvider(
      { scheme: "file", language: "pang" },
      {
        provideDefinition(document, position) {
          try {
            const line = document.getText().split(/\r?\n/)[position.line] || "";
            const re = /[a-zA-Z_][a-zA-Z0-9_]*/g;
            let match;
            let found = null;
            while (match = re.exec(line)) {
              const start = match.index;
              const end = start + match[0].length;
              if (position.character >= start && position.character <= end) {
                found = match[0];
                break;
              }
            }
            if (!found)
              return null;
            const out = validateText(document.getText());
            const declared = out._declared || /* @__PURE__ */ new Map();
            if (declared.has(found)) {
              const pos = declared.get(found);
              return [
                {
                  uri: document.uri,
                  range: new (require("vscode")).Range(
                    pos.line,
                    pos.start,
                    pos.line,
                    pos.end
                  )
                }
              ];
            }
            return null;
          } catch (e) {
            return null;
          }
        }
      }
    )
  );
}
function runValidate(document, cursorPos) {
  try {
    if (serverModule && typeof serverModule.validateText === "function") {
      const res = validateText(document.getText(), cursorPos);
      const diags = res.diagnostics.map(
        (d) => new (require("vscode")).Diagnostic(
          new (require("vscode")).Range(
            d.range.start.line,
            d.range.start.character,
            d.range.end.line,
            d.range.end.character
          ),
          d.message,
          d.severity === 0 ? require("vscode").DiagnosticSeverity.Error : d.severity === 2 ? require("vscode").DiagnosticSeverity.Warning : require("vscode").DiagnosticSeverity.Information
        )
      );
      diagnosticCollection.set(document.uri, diags);
    } else {
      const res = validateText(document.getText());
      const diags = res.diagnostics.map(
        (d) => new (require("vscode")).Diagnostic(
          new (require("vscode")).Range(
            d.range.start.line,
            d.range.start.character,
            d.range.end.line,
            d.range.end.character
          ),
          d.message,
          d.severity === 0 ? require("vscode").DiagnosticSeverity.Error : d.severity === 2 ? require("vscode").DiagnosticSeverity.Warning : require("vscode").DiagnosticSeverity.Information
        )
      );
      diagnosticCollection.set(document.uri, diags);
    }
  } catch (e) {
    log("Validation error: " + String(e));
  }
}
function activate(context) {
  outputChannel = window2.createOutputChannel("Pang Language");
  log("Extension activate called (in-process providers)");
  try {
    tryLoadParsers(context.extensionPath || __dirname);
    const builtinDocs = {
      on: `Defines an event handler.
Valid events are any hat opcodes(only works with hats without arguments),
as well as the following defined ones:
- "flag": when the blue flag is clicked
- "stop" || "stopped": when the stop button is clicked
- "click" || "clicked": when the sprite is clicked
Example: \`on("flag", *{ /* code here */ });\`
`,
      ask: `Prompts the user for input and returns their response.
Uses the ask and wait block
Example: \`let name = ask("Your name?");\`
`,
      print: `Generates a say or a say for seconds block(if you provide the seconds option)
Example: \`print("Hello!", {seconds: 2});\`
`,
      true: `Boolean literal \`true\`.
`,
      false: `Boolean literal \`false\`.
`
    };
    context.subscriptions.push(
      languages.registerHoverProvider(
        { scheme: "file", language: "pang" },
        {
          provideHover(document, position) {
            const line = document.lineAt(position.line).text;
            const re = /[a-zA-Z_][a-zA-Z0-9_]*/g;
            let match;
            while (match = re.exec(line)) {
              const start = match.index;
              const end = start + match[0].length;
              if (position.character >= start && position.character < end) {
                const name = match[0];
                const docText = builtinDocs[name];
                if (!docText)
                  return null;
                const {
                  MarkdownString,
                  Hover
                } = require("vscode");
                const md = new MarkdownString();
                md.isTrusted = true;
                const codeRegex = /```pang\s*([\s\S]*?)```|`([^`\n]+)`/g;
                let lastIndex = 0;
                let cbMatch;
                while ((cbMatch = codeRegex.exec(docText)) !== null) {
                  if (cbMatch.index > lastIndex) {
                    md.appendMarkdown(
                      docText.slice(
                        lastIndex,
                        cbMatch.index
                      )
                    );
                  }
                  if (cbMatch[1] !== void 0) {
                    md.appendCodeblock(cbMatch[1], "pang");
                  } else if (cbMatch[2] !== void 0) {
                    md.appendCodeblock(cbMatch[2], "pang");
                  }
                  lastIndex = cbMatch.index + cbMatch[0].length;
                }
                if (lastIndex < docText.length) {
                  md.appendMarkdown(docText.slice(lastIndex));
                }
                return new Hover(md);
              }
            }
            return null;
          }
        }
      )
    );
    registerProviders(context);
    log("Registered in-process language providers for Pang");
  } catch (e) {
    log("Failed to register providers: " + String(e));
  }
}
function deactivate() {
  if (diagnosticCollection)
    diagnosticCollection.dispose();
}
module.exports = { activate, deactivate };
