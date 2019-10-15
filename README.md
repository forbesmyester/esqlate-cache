# Esqlate Cache

## Why does this exist?

Esqlate Cache is a really basic in-memory cache which has a few interesting properties:

 * You initialize the cache with the function to retrieve the value from the original source, enabling you to write `cache(params)` everywhere, whether the item is cached or not. The reason for this is that I found that anything which I wanted to cache was nearly always something that was IO based that I wanted to dependency inject anyway and I would always DI both the cache and the IO operation. Would it not be better to dependency inject one thing?
 * It handles race conditions nicely. If a result for a set of parameters is already in the process of being acquired, it will not not start acquiring another, but will return the one result to both requesters. 
 * It realistically only caches the result from one (promise based) function. I think this is a good thing because it helps TypeScript typing and thus, greatly helps readability.

## How do you use it?

Usage is quite simple:


```js
import getCache, { EsqlateCache } from "esqlate-cache";

// Parameters can be whatever you like, and however many you wish, but they must be JSON serializable.
function getStatusCodeForUrl(p: string): Promise<number> {
    fetch(url).then((resp) => resp.status);
}


const cache: EsqlateCache<number> = getCache(getStatusCodeForUrl);

const uncachedResult = await cache("http://www.google.com");
const cachedResult = await cache("http://www.google.com");
const anotherUncachedResult = await cache("http://duckduckgo.com");
```

## How do I install it?

The code is clone-able from here but it you would normally `npm install esqlate-cache`.

## What is the license?

It's MIT licensed.
