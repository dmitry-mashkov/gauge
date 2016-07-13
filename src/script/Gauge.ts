module Gauge {

    export class Gauge {

        private targetElement:HTMLElement = null;
        private gaugeElement:HTMLElement = null;
        private canvasElement:HTMLElement = null;


        constructor() {
            this.sectors = [
                new Sector(70),
                new Sector(20),
                new Sector(10)
            ];

            this.Value = 65;
        }


        private labelsOutside = true;
        public get LabelsOutside(): boolean
        {
            return this.labelsOutside;
        }
        public set LabelsOutside(v: boolean)
        {
            if (this.labelsOutside !== v)
            {
                this.labelsOutside = v;
                this.redrawCanvas();
            }
        }

        private get scaleRadius():number {
            // Here we negotiate the 10% margin
            return (Math.min(this.canvasSize.Width, this.canvasSize.Height) * 0.9 / 2);
        }

        private canvasSize:Size = new Size(450, 450);
        public get CanvasSize():Size {
            return this.canvasSize;
        }
        public set CanvasSize(v:Size) {
            if (v.Width !== this.canvasSize.Width && v.Height !== this.canvasSize.Height) {
                this.canvasSize = v;
                this.redrawCanvas();
            }
        }

        /**
         * Value in percentage
         *
         * @type {number}
         */
        private value:number = 0;

        public get Value():number {
            return this.value;
        }

        public set Value(v:number) {
            if (v !== this.value && v >= 0 && v <= 100) {
                this.value = v;
                this.redrawCanvas();
            }
        }

        private labels:string[] = ['0', '1', '2', '3', '4', '5', '6'];

        public get Labels():string[] {
            return this.labels;
        }
        public set Labels(v:string[]) {
            this.labels = v;
            this.redrawCanvas();
        }

        private sectors:Sector[] = null;
        public get Sectors():Sector[] {
            return this.sectors;
        }
        public set Sectors(v:Sector[]) {
            var total = 0;
            for (var i in v) {
                total += v[i].Percentage;
                if (total > 100)
                    throw new Error('The entire sectors width must not be more than 100%.');
            }
            this.sectors = v;
            this.redrawCanvas();
        }

        private availableDegrees:number = 260;
        public get AvailableDegrees():number {
            return this.availableDegrees;
        }
        public set AvailableDegrees(v:number) {
            if (this.availableDegrees !== v) {
                this.availableDegrees = v;
                this.redrawCanvas();
            }
        }

        private _svgCanvas:Element = null;
        private get svgCanvas():Element {
            if (this._svgCanvas === null) {
                this._svgCanvas = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                this._svgCanvas.setAttribute('width', this.canvasSize.Width + '');
                this._svgCanvas.setAttribute('height', this.canvasSize.Height + '');
            }
            return this._svgCanvas;
        }

        private _pointerElement:Element = null;
        private get pointerElement():Element {
            if (this._pointerElement === null) {
                this._pointerElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                this._pointerElement.setAttribute('class', CSSClasses.Pointer);
            }
            return this._pointerElement;
        }


        public Init(targetElement:HTMLElement) {
            this.targetElement = targetElement;
            if (this.targetElement === null || !(this.targetElement instanceof HTMLElement))
                throw new Error("Target HTML element not specified.");

            this.gaugeElement = document.createElement('div');
            this.gaugeElement.classList.add(CSSClasses.Gauge);

            this.canvasElement = document.createElement('div');
            this.canvasElement.className = CSSClasses.Canvas;

            this.gaugeElement.appendChild(this.canvasElement);
            this.targetElement.appendChild(this.gaugeElement);

            this.redrawCanvas();
        }


        private redrawCanvas(force = false) {
            if (!force && this.canvasElement === null)
                return;

            // Clear canvas
            while (this.canvasElement.firstChild) {
                this.canvasElement.removeChild(this.canvasElement.firstChild);
            }

            var startPoint = 360 - this.availableDegrees / 2,
                scaleCenterX = this.canvasSize.Width / 2,
                scaleCenterY = this.canvasSize.Height / 2;


            // Draw sectors
            var offsetPercent = 0;
            for (var i in this.sectors) {
                var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                p.setAttribute('class', CSSClasses.Sector);

                var start = startPoint + this.AvailableDegrees * offsetPercent / 100;
                if (start > 360)
                    start -= 360;
                var end = start + this.AvailableDegrees * this.sectors[i].Percentage / 100;
                if (end > 360)
                    end -= 360;

                // Draw a sector
                p.setAttribute('d', SVGHelper.DescribeArc(
                    scaleCenterX,
                    scaleCenterY,
                    this.scaleRadius,
                    start,
                    end
                ));
                if (this.sectors[i].Color)
                    p['style']['stroke'] = this.sectors[i].Color;

                this.svgCanvas.appendChild(p);

                offsetPercent += this.sectors[i].Percentage;
            }


            // Draw labels
            for (var i in this.labels) {
                var angle = 360 - this.availableDegrees / 2 + (this.availableDegrees / (this.labels.length - 1)) * i;
                if (angle > 360)
                    angle -= 360;

                var labelOffset = this.labelsOutside ? 15 : -15;

                var labelPoint = SVGHelper.PolarToCartesian(
                    scaleCenterX,
                    scaleCenterY,
                    this.scaleRadius + labelOffset,
                    angle
                );

                var textSize = SVGHelper.GetTextMetric(this.labels[i]);

                var t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                t.setAttribute('class', CSSClasses.Label);
                t.setAttribute('x', (labelPoint.x - textSize.Width / 2) + '');
                t.setAttribute('y', (labelPoint.y + textSize.Height / 2) + '');
                t.textContent = this.labels[i];

                this.svgCanvas.appendChild(t);
            }

            this.canvasElement.appendChild(this.svgCanvas);

            this.redrawPointer();
        }

        private redrawPointer() {
            var scaleCenterX = this.canvasSize.Width / 2,
                scaleCenterY = this.canvasSize.Height / 2;

            var p = this.pointerElement;

            var valueDiff = this.availableDegrees * this.value / 100;
            var valueAngle = 360 - this.availableDegrees / 2 + valueDiff;
            if (valueAngle > 360)
                valueAngle -= 360;

            var tipPoint = SVGHelper.PolarToCartesian(scaleCenterX, scaleCenterY, this.scaleRadius + 5, valueAngle);

            // Start point places farther on the right than the end point
            var startAngle = valueAngle + 30;
            if (startAngle > 360)
                startAngle -= 360;
            startAngle -= 360;

            p.setAttribute('d', SVGHelper.DescribeArc(
                    scaleCenterX, scaleCenterY, 10, startAngle, valueAngle - 30) +
                ' L ' + tipPoint.x + ' ' + tipPoint.y + ' Z'
            );

            this.svgCanvas.appendChild(p);
        }

    }
}
