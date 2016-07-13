module.exports = {
    options: {
        mangle: {
            except: [
                'Gauge', 'Value', 'CanvasSize', 'Size', 'Section', 'Labels', 'LabelsOutside'
            ]
        }
    },
    dist: {
        files: {
            'dist/gauge.min.js': ['dist/gauge.js']
        }
    }
};