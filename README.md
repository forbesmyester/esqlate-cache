# WaitFor TS

A simple TypeScript function will wait for a condition to be satisfied.

## Why

The Esqlate project, which is a way to design an API using PostgreSQL is modelled as a queue based system, so when you issue a request, you don't get back the result immediately, you need to poll to monitor you request. WaitFor TS was created as a to manage that polling.

## How

To use this WaitFor TS you need to supply a function which will return `Ready<X>`, where `X` is the result you wish to finally receive. A `Ready` is somewhat like a Promise, but instead of it being resolved or not, the `Ready` can be in a state of `{ complete: true, value: "TheValueYouWant" }` or `{ complete: false }`. This is similar to an [Algebraic data type](https://en.wikipedia.org/wiki/Algebraic_data_type) from [Haskell's Maybe](https://wiki.haskell.org/Maybe) or may [Rust's Result](https://doc.rust-lang.org/std/result/).

## Installation

```bash
npm install --save waitfor-ts
```

## Usage

A Ready is defined like the following:

```typescript
export interface Ready<X> {
    value?: X;
    complete: boolean;
}
```

Therefore main thing we need to do is define a function which returns a `Ready`, in this case `getReady()`. aside from this we need to add a function to control how the back-off works when attempts are unsuccessful, similar to `calcuateNewDelay()`.

```javascript
let location = "http://localhost:8803/request/get_customer/wbzAClFJ

// Returns a `Ready`.
function getReady() {
    return fetch(location)
        .then(resp => resp.json())
        .then((j) => {
            if (j.status == "complete") {
                return { complete: true, value: j.location };
            }
            return { complete: false };
        });
}

// Gets the amount of time to wait before a new attempt starts.
function calculateNewDelay(attemptsSoFar) { return attemptsSoFar * 300; }

return waitFor(getReady, calculateNewDelay)
    .then((loc) => {
        window.location = loc;
    });
```
