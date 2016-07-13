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
        }


        private isReadOnly = false;
        public get IsReadOnly()
        {
            return this.isReadOnly;
        }

        private value: number = 0;
        public get Value(): number
        {
            return this.value;
        }
        public set Value(v: number)
        {
            if (v !== this.value && v > 0 && v < 180)
            {
                this.value = v;
                this.onValueChanged();
            }
        }

        private drawingContext: DrawingContext = null;
        public get DrawingContext(): DrawingContext
        {
            return this.drawingContext;
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


        private redrawCanvas()
        {
            // Clear canvas
            while (this.canvasElement.firstChild) {
                this.canvasElement.removeChild(this.canvasElement.firstChild);
            }

            var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
                path = document.createElementNS('http://www.w3.org/2000/svg', 'path'),
                text = document.createElementNS('http://www.w3.org/2000/svg', 'text');

            // Draw arc
            path.setAttribute('d', "M180 180 A 50 50 0 0 0 20 180");
            path['style']['stroke'] = 'green';
            path['style']['fill'] = 'transparent';
            path['style']['stroke-width'] = '3';

            // Set numbers
            //<text x="10" y="10">Hello World!</text>
            text.setAttribute('x', '20');
            text.setAttribute('y', '20');
            text.textContent = "Hello";

            svg.setAttribute('width', '325');
            svg.setAttribute('height', '325');
            svg.appendChild(path);
            svg.appendChild(text);

            this.canvasElement.appendChild(svg);

        }

        private redrawPointer()
        {

        }

        private onValueChanged()
        {
            if (this.DrawingContext !== null)
                this.redrawPointer();
        }

    }
}
