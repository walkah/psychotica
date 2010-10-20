var mongoose = require('mongoose').Mongoose,
    db = mongoose.connect('mongodb://localhost/psychotica');

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

module.exports = db.model('Activity');