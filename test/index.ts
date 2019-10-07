import test from 'tape';
import getCache from "../src/index";

test('race condition then non race', function(assert) {

    assert.plan(5);

    let calls: string[] = [];

    function record(arg: string) {
        calls.push(arg);
    }

    function getValueLetters(p: string) {
        console.log("getValueLetters: ", p);
        record(p);
        return new Promise((resolve) => {
            setTimeout(() => {
                if (p == "abc") {
                    resolve(123);
                }
                resolve(456);
            }, 1000);
        });
    }


    const cached = getCache(getValueLetters);

    Promise.all([cached("abc"), cached("abc"), cached("def")])
        .then(([abc1, abc2, def]) => {
            assert.is(abc1, 123);
            assert.is(abc2, 123);
            assert.is(def, 456);
            cached("def")
                .then((def2) => {
                    assert.is(def2, 456);
                    assert.deepEqual(calls, ["abc", "def"]);
                    assert.end();
                })
                .catch((e) => {
                    console.log(e);
                    assert.fail();
                });
        })
        .catch((e) => {
            console.log(e);
            assert.fail();
        })




});
