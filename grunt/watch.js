module.exports = {
    js: {
        files: [
            '<%= yeoman.app %>/js/{,*}*.js'
        ],
        options: {
            livereload: '<%= connect.options.livereload %>'
        }
    },
    gruntfile: {
        files: ['gruntfile.js', 'grunt/*.js']
    },
    livereload: {
        options: {
            livereload: '<%= connect.options.livereload %>'
        },
        files: [
            '.tmp/styles/{,*/}*.css',
            '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
    }/*,
    compass: {
        files: ['<%= yeoman.app %>/styles/sass/{,*//*}*.{scss,sass}'],
        tasks: ['compass:server'],
        options: {
            livereload: '<%= connect.options.livereload %>'
        }
    }*/
};