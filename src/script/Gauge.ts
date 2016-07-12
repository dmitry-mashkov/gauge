module Gauge
{
    declare var $: any;


    export class Gauge
    {

        private targetElement: HTMLElement = null;
        private gaugeElement: HTMLElement = null;
        private containerElement: HTMLElement = null;


        constructor()
        {
            super(['OnShown', 'OnClosed']);
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
                this.redrawPointer();
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

            this.targetElement = options.targetElement;
            if (this.targetElement === null && !(this.targetElement instanceof HTMLElement))
                throw new Error("Target HTML element not specified.");

            this.gaugeElement = document.createElement('div');
            this.gaugeElement.classList.add(CSSClasses.Gauge);
            if (this.isReadOnly)
                this.gaugeElement.classList.add(CSSClasses.ReadOnly);

            this.containerElement = document.createElement('div');
            this.containerElement.className = CSSClasses.Container;

            this.gaugeElement.appendChild(this.containerElement);
            this.targetElement.appendChild(this.gaugeElement);

            if (this.DrawingContext === null)
            {
                this.drawingContext = new DrawingContext(this.containerElement);
            }

            this.redrawCanvas();
            this.redrawPointer();
        }


        private redrawCanvas()
        {

        }

        private redrawPointer()
        {

        }

    }
}
