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
        },
        GetTextMetric: function (text: string = 'W')
        {
            var textEmpty = false;
            if (text === '')
            {
                text = 'W';
                textEmpty = true;
            }
            var textElement = document.createElement('span');
            textElement.style.display = 'inline-block';
            textElement.style.lineHeight = '1';
            textElement.innerHTML = text;

            var body = document.getElementsByTagName('body')[0];
            body.appendChild(textElement);

            var result = new Size(textElement.offsetWidth, textElement.offsetHeight);

            if (textEmpty)
                result.Width = Math.round(result.Width * 0.8);

            body.removeChild(textElement);

            return result;
        }
    }

}