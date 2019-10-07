"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var esqlate_waitfor_1 = __importDefault(require("esqlate-waitfor"));
function getCache(f) {
    var retreiving = new Set();
    var values = new Map();
    var errors = new Map();
    function getWaitForF(k) {
        return function () {
            if (retreiving.has(k)) {
                return Promise.resolve({ complete: false });
            }
            return Promise.resolve({ complete: true, value: true });
        };
    }
    return function getCacheImpl() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var cacheKey = JSON.stringify(args);
        if (values.has(cacheKey)) {
            return Promise.resolve(values.get(cacheKey));
        }
        if (retreiving.has(cacheKey)) {
            return esqlate_waitfor_1.default(getWaitForF(cacheKey), function (_n) { return 50; }).then(function () {
                if (values.has(cacheKey)) {
                    return Promise.resolve(values.get(cacheKey));
                }
                if (errors.has(cacheKey)) {
                    return Promise.reject(errors.get(cacheKey));
                }
                throw new Error("Esqlate Cache: WaitFor: Ended without success or error?");
            });
        }
        retreiving.add(cacheKey);
        return f.apply(null, args)
            .then(function (value) {
            values.set(cacheKey, value);
            retreiving.delete(cacheKey);
            return value;
        })
            .catch(function (e) {
            errors.set(cacheKey, e);
            throw e;
        });
    };
}
exports.default = getCache;
