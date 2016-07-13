module Gauge
{
    export class Sector
    {

        constructor(percentage: number, color?: string)
        {
            if (percentage <= 0 || percentage > 100)
                throw new Error('Width of a sector must be valid percentage.');

            this.percentage = percentage;

            if (color)
                this.color = color;
        }

        private color: string = null;
        public get Color(): string
        {
            return this.color;
        }

        private percentage: number;
        public get Percentage(): number
        {
            return this.percentage;
        }

    }
}