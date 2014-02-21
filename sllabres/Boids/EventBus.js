var Boids;
(function (Boids) {
    (function (EventType) {
        EventType[EventType["DrawBoid"] = 0] = "DrawBoid";
    })(Boids.EventType || (Boids.EventType = {}));
    var EventType = Boids.EventType;

    var EventBus = (function () {
        function EventBus() {
            this.subscribers = [];
        }
        EventBus.getInstance = function () {
            if (EventBus._instance === null) {
                EventBus._instance = new EventBus();
            }
            return EventBus._instance;
        };

        EventBus.prototype.subscribe = function (eventName, callback) {
            if (this.subscribers[eventName] === undefined) {
                this.subscribers[eventName] = [];
            }

            this.subscribers[eventName].push(callback);
        };

        EventBus.prototype.notify = function (eventName, parameters) {
            for (var i = 0; i < this.subscribers[eventName].length; i++) {
                this.subscribers[eventName][i](parameters);
            }
        };
        EventBus._instance = null;
        return EventBus;
    })();
    Boids.EventBus = EventBus;
})(Boids || (Boids = {}));
