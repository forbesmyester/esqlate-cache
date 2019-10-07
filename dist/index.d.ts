interface Cache<K> {
    (...p: any[]): Promise<K>;
}
export default function getCache<K>(f: Cache<K>): Cache<K>;
export {};
