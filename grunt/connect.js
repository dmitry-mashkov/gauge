module.exports = {
    options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
    },
    livereload: {
        options: {
            open: true,
            middleware: function (connect) {
                return [
                    /*connect().use(
                        '/bower_components',
                        connect.static('./bower_components')
                    ),*/
                    connect.static('./src')
                ];
            }
        }
    },
    tmp: {
        options: {
            port: 9002,
            open: true,
            base: 'tmp'
        }
    },
    dist: {
        options: {
            open: true,
            base: '<%= yeoman.dist %>',
            middleware: function (connect) {
                return [
                    connect.static('./dist')
                    /*connect().use(
                        '/api',
                        connect.static('./api')
                    )*/
                ];
            }
        }
    }
};