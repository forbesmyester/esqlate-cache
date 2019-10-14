# Esqlate Cache

## Why does this exist?

Esqlate Cache is a really basic in-memory cache which has a few interesting properties:

 * You supply the function to get the value, enabling you to write `cache.get(params)` everywhere, whether the item is cached or not. You'll probably find that anything which you would want to cache is also something that you would want to dependency inject... why pass two things around?
 * It handles race conditions nicely. If a result for a set of parameters is already in the process of being acquired, it will not not start another, but rather return the one result to both requesters. 
 * It realistically only caches the result from one (promise based) function.

## How do you use it?

Usage is quite simple:


```js
import {getCache} from "esqlate-cache";

// There will be a function that goes and actually gets a result and returns a promise.
// In real life this would be a database call, HTTP requst or similar.
// Parameters can be whatever you like, and however many you wish, but they must be JSON serializable.
function getValueLetters(p: string) {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (p == "abc") {
                resolve(123);
            }
            resolve(456);
        }, 1000);
    });
}


const cache = getCache(getValueLetters);

const uncachedResult = await cache.get("abc");
const cachedResult = await cache.get("abc");
const anotherUncachedResult = await cache.get("def");
```

## How do I install it?

The code is clone-able from here but it you would normally `npm install esqlate-cache`.

## What is the license?

It's MIT licensed as seen in the [package.json](./package.json)
