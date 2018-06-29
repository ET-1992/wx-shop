// event.js
class Event {
    constructor() {
        this.events = {};
    }
    on(name, callback, ctx) {
        if (typeof callback !== 'function') {
            console.error('fn must be a function');
            return;
        }

        let tuple = [ctx, callback];
        let callbacks = this.events[name];
        if (Array.isArray(callbacks)) {
            callbacks.push(tuple);
        }
        else {
            this.events[name] = [tuple];
        }
    }
    emit(name, data) {
        let callbacks = this.events[name];
        if (Array.isArray(callbacks)) {
            callbacks.map((tuple) => {
                let self = tuple[0];
                let callback = tuple[1];
                callback.call(self, data);
            });
        }
    }
    off(name, ctx) {
        let callbacks = this.events[name];
        if (Array.isArray(callbacks)) {
            this.events[name] = callbacks.filter((tuple) => {
                return tuple[0] !== ctx;
            });
        }
    }
}
export default Event;