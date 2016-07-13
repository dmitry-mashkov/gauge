var Gauge;
(function (_Gauge) {
    _Gauge.CSSClasses = {
        Gauge: 'g-gauge',
        Canvas: 'g-canvas',
        Pointer: 'g-pointer',
        Sector: 'g-sector',
        Label: 'g-label'
    };
})(Gauge || (Gauge = {}));
var Gauge;
(function (Gauge) {
    var Size = (function () {
        function Size(Width, Height) {
            if (typeof Width === "undefined") { Width = 0; }
            if (typeof Height === "undefined") { Height = 0; }
            this.Width = Width;
            this.Height = Height;
        }
        return Size;
    })();
    Gauge.Size = Size;
})(Gauge || (Gauge = {}));
var Gauge;
(function (Gauge) {
    Gauge.SVGHelper = {
        PolarToCartesian: function (centerX, centerY, radius, angleInDegrees) {
            var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

            return {
                x: centerX + (radius * Math.cos(angleInRadians)),
                y: centerY + (radius * Math.sin(angleInRadians))
            };
        },
        DescribeArc: function (x, y, radius, startAngle, endAngle) {
            var start = Gauge.SVGHelper.PolarToCartesian(x, y, radius, endAngle);
            var end = Gauge.SVGHelper.PolarToCartesian(x, y, radius, startAngle);

            var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

            var d = [
                "M", start.x, start.y,
                "A", radius, radius, 0, arcSweep, 0, end.x, end.y
            ].join(" ");

            return d;
        },
        GetTextMetric: function (text) {
            if (typeof text === "undefined") { text = 'W'; }
            var textEmpty = false;
            if (text === '') {
                text = 'W';
                textEmpty = true;
            }
            var textElement = document.createElement('span');
            textElement.style.display = 'inline-block';
            textElement.style.lineHeight = '1';
            textElement.innerHTML = text;

            var body = document.getElementsByTagName('body')[0];
            body.appendChild(textElement);

            var result = new Gauge.Size(textElement.offsetWidth, textElement.offsetHeight);

            if (textEmpty)
                result.Width = Math.round(result.Width * 0.8);

            body.removeChild(textElement);

            return result;
        }
    };
})(Gauge || (Gauge = {}));
var Gauge;
(function (Gauge) {
    var Sector = (function () {
        function Sector(percentage, color) {
            this.color = null;
            if (percentage <= 0 || percentage > 100)
                throw new Error('Width of a sector must be valid percentage.');

            this.percentage = percentage;

            if (color)
                this.color = color;
        }
        Object.defineProperty(Sector.prototype, "Color", {
            get: function () {
                return this.color;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Sector.prototype, "Percentage", {
            get: function () {
                return this.percentage;
            },
            enumerable: true,
            configurable: true
        });
        return Sector;
    })();
    Gauge.Sector = Sector;
})(Gauge || (Gauge = {}));
var Gauge;
(function (_Gauge) {
    var Gauge = (function () {
        function Gauge() {
            this.targetElement = null;
            this.gaugeElement = null;
            this.canvasElement = null;
            this.labelsOutside = true;
            this.canvasSize = new _Gauge.Size(450, 450);
            this.value = 0;
            this.labels = ['0', '1', '2', '3', '4', '5', '6'];
            this.sectors = null;
            this.availableDegrees = 260;
            this._svgCanvas = null;
            this._pointerElement = null;
            this.sectors = [
                new _Gauge.Sector(70),
                new _Gauge.Sector(20),
                new _Gauge.Sector(10)
            ];

            this.Value = 65;
        }
        Object.defineProperty(Gauge.prototype, "LabelsOutside", {
            get: function () {
                return this.labelsOutside;
            },
            set: function (v) {
                if (this.labelsOutside !== v) {
                    this.labelsOutside = v;
                    this.redrawCanvas();
                }
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Gauge.prototype, "scaleRadius", {
            get: function () {
                return (Math.min(this.canvasSize.Width, this.canvasSize.Height) * 0.9 / 2);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Gauge.prototype, "CanvasSize", {
            get: function () {
                return this.canvasSize;
            },
            set: function (v) {
                if (v.Width !== this.canvasSize.Width && v.Height !== this.canvasSize.Height) {
                    this.canvasSize = v;
                    this.redrawCanvas();
                }
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Gauge.prototype, "Value", {
            get: function () {
                return this.value;
            },
            set: function (v) {
                if (v !== this.value && v >= 0 && v <= 100) {
                    this.value = v;
                    this.redrawCanvas();
                }
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Gauge.prototype, "Labels", {
            get: function () {
                return this.labels;
            },
            set: function (v) {
                this.labels = v;
                this.redrawCanvas();
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Gauge.prototype, "Sectors", {
            get: function () {
                return this.sectors;
            },
            set: function (v) {
                var total = 0;
                for (var i in v) {
                    total += v[i].Percentage;
                    if (total > 100)
                        throw new Error('The entire sectors width must not be more than 100%.');
                }
                this.sectors = v;
                this.redrawCanvas();
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Gauge.prototype, "AvailableDegrees", {
            get: function () {
                return this.availableDegrees;
            },
            set: function (v) {
                if (this.availableDegrees !== v) {
                    this.availableDegrees = v;
                    this.redrawCanvas();
                }
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Gauge.prototype, "svgCanvas", {
            get: function () {
                if (this._svgCanvas === null) {
                    this._svgCanvas = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    this._svgCanvas.setAttribute('width', this.canvasSize.Width + '');
                    this._svgCanvas.setAttribute('height', this.canvasSize.Height + '');
                }
                return this._svgCanvas;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Gauge.prototype, "pointerElement", {
            get: function () {
                if (this._pointerElement === null) {
                    this._pointerElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    this._pointerElement.setAttribute('class', _Gauge.CSSClasses.Pointer);
                }
                return this._pointerElement;
            },
            enumerable: true,
            configurable: true
        });

        Gauge.prototype.Init = function (targetElement) {
            this.targetElement = targetElement;
            if (this.targetElement === null || !(this.targetElement instanceof HTMLElement))
                throw new Error("Target HTML element not specified.");

            this.gaugeElement = document.createElement('div');
            this.gaugeElement.classList.add(_Gauge.CSSClasses.Gauge);

            this.canvasElement = document.createElement('div');
            this.canvasElement.className = _Gauge.CSSClasses.Canvas;

            this.gaugeElement.appendChild(this.canvasElement);
            this.targetElement.appendChild(this.gaugeElement);

            this.redrawCanvas();
        };

        Gauge.prototype.redrawCanvas = function (force) {
            if (typeof force === "undefined") { force = false; }
            if (!force && this.canvasElement === null)
                return;

            while (this.canvasElement.firstChild) {
                this.canvasElement.removeChild(this.canvasElement.firstChild);
            }

            var startPoint = 360 - this.availableDegrees / 2, scaleCenterX = this.canvasSize.Width / 2, scaleCenterY = this.canvasSize.Height / 2;

            var offsetPercent = 0;
            for (var i in this.sectors) {
                var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                p.setAttribute('class', _Gauge.CSSClasses.Sector);

                var start = startPoint + this.AvailableDegrees * offsetPercent / 100;
                if (start > 360)
                    start -= 360;
                var end = start + this.AvailableDegrees * this.sectors[i].Percentage / 100;
                if (end > 360)
                    end -= 360;

                p.setAttribute('d', _Gauge.SVGHelper.DescribeArc(scaleCenterX, scaleCenterY, this.scaleRadius, start, end));
                if (this.sectors[i].Color)
                    p['style']['stroke'] = this.sectors[i].Color;

                this.svgCanvas.appendChild(p);

                offsetPercent += this.sectors[i].Percentage;
            }

            for (var i in this.labels) {
                var angle = 360 - this.availableDegrees / 2 + (this.availableDegrees / (this.labels.length - 1)) * i;
                if (angle > 360)
                    angle -= 360;

                var labelOffset = this.labelsOutside ? 15 : -15;

                var labelPoint = _Gauge.SVGHelper.PolarToCartesian(scaleCenterX, scaleCenterY, this.scaleRadius + labelOffset, angle);

                var textSize = _Gauge.SVGHelper.GetTextMetric(this.labels[i]);

                var t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                t.setAttribute('class', _Gauge.CSSClasses.Label);
                t.setAttribute('x', (labelPoint.x - textSize.Width / 2) + '');
                t.setAttribute('y', (labelPoint.y + textSize.Height / 2) + '');
                t.textContent = this.labels[i];

                this.svgCanvas.appendChild(t);
            }

            this.canvasElement.appendChild(this.svgCanvas);

            this.redrawPointer();
        };

        Gauge.prototype.redrawPointer = function () {
            var scaleCenterX = this.canvasSize.Width / 2, scaleCenterY = this.canvasSize.Height / 2;

            var p = this.pointerElement;

            var valueDiff = this.availableDegrees * this.value / 100;
            var valueAngle = 360 - this.availableDegrees / 2 + valueDiff;
            if (valueAngle > 360)
                valueAngle -= 360;

            var tipPoint = _Gauge.SVGHelper.PolarToCartesian(scaleCenterX, scaleCenterY, this.scaleRadius + 5, valueAngle);

            var startAngle = valueAngle + 30;
            if (startAngle > 360)
                startAngle -= 360;
            startAngle -= 360;

            p.setAttribute('d', _Gauge.SVGHelper.DescribeArc(scaleCenterX, scaleCenterY, 10, startAngle, valueAngle - 30) + ' L ' + tipPoint.x + ' ' + tipPoint.y + ' Z');

            this.svgCanvas.appendChild(p);
        };
        return Gauge;
    })();
    _Gauge.Gauge = Gauge;
})(Gauge || (Gauge = {}));
//# sourceMappingURL=gauge.js.map
