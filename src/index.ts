import waitfor from 'esqlate-waitfor';

export interface Cache<K> {
    (...p: any[]): Promise<K>;
}

export default function getCache<K>(f: Cache<K>): Cache<K> {

    let retreiving: Set<string> = new Set();
    let values: Map<string, K> = new Map();
    let errors: Map<string, any> = new Map();

    function getWaitForF(k: string) {
        return () => {
            if (retreiving.has(k)) {
                return Promise.resolve({ complete: false });
            }
            return Promise.resolve({ complete: true, value: true });
        };
    }

    return function getCacheImpl(...args: any[]): Promise<K> {
        const cacheKey = JSON.stringify(args);
        if (values.has(cacheKey)) {
            return Promise.resolve(values.get(cacheKey) as K);
        }
        if (retreiving.has(cacheKey)) {
            return waitfor(getWaitForF(cacheKey), (_n) => 50).then(() => {
                if (values.has(cacheKey)) {
                    return Promise.resolve(values.get(cacheKey) as K);
                }
                if (errors.has(cacheKey)) {
                    return Promise.reject(errors.get(cacheKey));
                }
                throw new Error("Esqlate Cache: WaitFor: Ended without success or error?");
            });
        }
        retreiving.add(cacheKey);
        return f.apply(null, args)
            .then((value: K) => {
                values.set(cacheKey, value);
                retreiving.delete(cacheKey);
                return value;
            })
            .catch((e: Error) => {
                errors.set(cacheKey, e);
                throw e;
            })
    };
}
