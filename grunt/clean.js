module.exports = {
    dist: {
        files: [{
            dot: true,
            src: [
                '<%= yeoman.dist %>/{,*/}*',
                '!<%= yeoman.dist %>/.git{,*/}*'
            ]
        }]
    }
};