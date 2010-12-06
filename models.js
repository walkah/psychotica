var mongoose = require('mongoose').Mongoose;

mongoose.model('Activity', {
    collection: 'activity',

    properties: [
        'body',
        'verb',
        'created_at'
    ],

    methods: {
        save: function (fn) {
            this.created_at = new Date();
            this.__super__(fn);
        }
    }
});

exports.Activity = function(db) {
    return db.model('Activity');
}