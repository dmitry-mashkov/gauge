module Gauge
{
    declare var $: any;


    export class Gauge
    {

        private targetElement: HTMLElement = null;
        private gaugeElement: HTMLElement = null;
        private canvasElement: HTMLElement = null;
        private pointerElement: HTMLElement = null;


        constructor()
        {
            //super(['OnShown', 'OnClosed']);
            this.sectors = [
                {
                    color: 'green'
                },
                {
                    color: 'yellow'
                },
                {
                    color: 'red'
                }
            ]
        }


        private isReadOnly = false;
        public get IsReadOnly()
        {
            return this.isReadOnly;
        }

        /**
         * Value in percentage
         *
         * @type {number}
         */
        private value: number = 0;
        public get Value(): number
        {
            return this.value;
        }
        public set Value(v: number)
        {
            if (v !== this.value && v >= 0 && v <= 100)
            {
                this.value = v;
                this.redrawPointer();
            }
        }

        private labels: Array = [1, 2, 3, 4, 5, 6];
        public get Labels(): Array
        {
            return this.labels;
        }
        public set Labels(v: Array)
        {
            this.labels = v;
            this.redrawCanvas();
        }

        private sectors: Array = [];
        public get Sectors(): Array
        {
            return this.sectors;
        }
        public set Sectors(v: Array)
        {
            this.sectors = v;
            this.redrawCanvas();
        }

        private drawingContext: DrawingContext = null;
        public get DrawingContext(): DrawingContext
        {
            return this.drawingContext;
        }

        private availableDegrees: number = 260;
        public get AvailableDegrees(): number
        {
            return this.availableDegrees;
        }
        public set AvailableDegrees(v: number)
        {
            if (this.availableDegrees !== v)
            {
                this.availableDegrees = v;
                this.redrawCanvas();
            }
        }

        private _svgCanvas: Element = null;
        private get svgCanvas(): Element
        {
            if (this._svgCanvas === null)
            {
                this._svgCanvas = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                this._svgCanvas.setAttribute('width', '325');
                this._svgCanvas.setAttribute('height', '325');
            }
            return this._svgCanvas;
        }


        public Init(options)
        {
            options = options || {};
            if (typeof (options.isReadOnly) !== 'undefined')
                this.isReadOnly = options.isReadOnly === true;

            this.targetElement = options.targetElement;
            if (this.targetElement === null && !(this.targetElement instanceof HTMLElement))
                throw new Error("Target HTML element not specified.");

            this.gaugeElement = document.createElement('div');
            this.gaugeElement.classList.add(CSSClasses.Gauge);
            if (this.isReadOnly)
                this.gaugeElement.classList.add(CSSClasses.ReadOnly);

            this.canvasElement = document.createElement('div');
            this.canvasElement.className = CSSClasses.Canvas;

            this.pointerElement = document.createElement('div');
            this.pointerElement.className = CSSClasses.Pointer;

            this.gaugeElement.appendChild(this.canvasElement);
            this.gaugeElement.appendChild(this.pointerElement);
            this.targetElement.appendChild(this.gaugeElement);

            if (this.DrawingContext === null)
            {
                this.drawingContext = new DrawingContext(this.canvasElement);
            }

            this.redrawCanvas();
            this.redrawPointer();
        }


        private redrawCanvas(force = false)
        {
            if (!force && this.DrawingContext === null)
                return;

            // Clear canvas
            while (this.canvasElement.firstChild) {
                this.canvasElement.removeChild(this.canvasElement.firstChild);
            }

            var sectorDuration = this.availableDegrees / this.sectors.length,
                startPoint = 360 - this.availableDegrees / 2,
                fakeScale = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            // Fake scale is done in sake of labels binding
            fakeScale.setAttribute('d', SVGHelper.DescribeArc(150, 150, 110, 230, 130));
            fakeScale.setAttribute('id', 'fake_scale');
            fakeScale['style']['fill'] = 'transparent';
            fakeScale['style']['stroke'] = 'black';
            this.svgCanvas.appendChild(fakeScale);


            for (var i in this.sectors)
            {
                var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                var start = i * sectorDuration + startPoint;
                if (start > 360)
                    start -= 360;
                var end = start + sectorDuration;
                if (end > 360)
                    end -= 360;

                // Draw a sector
                p.setAttribute('d', SVGHelper.DescribeArc(150, 150, 100, start, end));
                p['style']['stroke'] = this.sectors[i].color;
                p['style']['fill'] = 'transparent';
                p['style']['stroke-width'] = '3';

                this.svgCanvas.appendChild(p);
            }


            for (var i in this.labels)
            {
                var l = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                //l.setAttribute('x', '20');
                //l.setAttribute('y', '20');
                //l.textContent = this.labels[i];

                var t = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
                t.setAttribute('xlink:href', '#fake_scale');

                l.appendChild(t);

                this.svgCanvas.appendChild(l);
            }

            this.canvasElement.appendChild(this.svgCanvas);
        }

        private redrawPointer(force = false)
        {
            if (!force && this.DrawingContext === null)
                return;

            var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            p.setAttribute('d', 'M230 80 A 45 45, 0, 1, 0, 275 125 L 275 80 Z');
            p['style']['fill'] = 'blue';

            this.svgCanvas.appendChild(p);
        }

    }
}
