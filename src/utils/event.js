//event.js
class Event {
    constructor()  {
        this.events = {};
    }
    on (name, callback, ctx) {
        if (typeof callback != "function") {
            console.error('fn must be a function')
            return
        }
        
        var tuple = [ctx, callback];
        var callbacks = this.events[name];
        if (Array.isArray(callbacks)) {
            callbacks.push(tuple);
        }
        else {
            this.events[name] = [tuple];
        }
    }
    emit (name, data) {
        var callbacks = this.events[name];
        if (Array.isArray(callbacks)) {
            callbacks.map((tuple) => {
                var self = tuple[0];
                var callback = tuple[1];
                callback.call(self, data);
            })
        }
    }
    off (name, ctx) {
        var callbacks = this.events[name];
        if (Array.isArray(callbacks)) {
            this.events[name] = callbacks.filter((tuple) => {
                return tuple[0] != ctx;
            })
        }
    }
};
  export default Event;