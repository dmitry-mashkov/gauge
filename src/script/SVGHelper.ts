module Gauge {


    export var SVGHelper =
    {
        PolarToCartesian: (centerX, centerY, radius, angleInDegrees) => {
            var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

            return {
                x: centerX + (radius * Math.cos(angleInRadians)),
                y: centerY + (radius * Math.sin(angleInRadians))
            };
        },
        DescribeArc: (x, y, radius, startAngle, endAngle) => {

            var start = SVGHelper.PolarToCartesian(x, y, radius, endAngle);
            var end = SVGHelper.PolarToCartesian(x, y, radius, startAngle);

            var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

            var d = [
                "M", start.x, start.y,
                "A", radius, radius, 0, arcSweep, 0, end.x, end.y
            ].join(" ");

            return d;
        }
    }

}