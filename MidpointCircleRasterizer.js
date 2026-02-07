// Midpoint circle drawing algorithm implementation
class MidpointCircleRasterizer {
    rasterize(p1, p2) {
        // p1 and p2 are diameter endpoints
        // Calculate center and radius
        const centerX = (p1.x + p2.x) / 2;
        const centerY = (p1.y + p2.y) / 2;
        const radius = Math.sqrt(
            Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
        ) / 2;

        return this.rasterizeCircle(new Point(centerX, centerY), radius);
    }

    rasterizeCircle(center, radius) {
        const points = [];
        const xc = Math.round(center.x);
        const yc = Math.round(center.y);
        const r = Math.round(radius);

        let x = 0;
        let y = r;
        let d = 1 - r;

        // Plot initial points
        this.plotCirclePoints(xc, yc, x, y, points);

        while (x < y) {
            x++;

            if (d < 0) {
                d = d + 2 * x + 1;
            } else {
                y--;
                d = d + 2 * (x - y) + 1;
            }

            this.plotCirclePoints(xc, yc, x, y, points);
        }

        return points;
    }

    plotCirclePoints(xc, yc, x, y, points) {
        // All 8 octants
        points.push(new Point(xc + x, yc + y));
        points.push(new Point(xc - x, yc + y));
        points.push(new Point(xc + x, yc - y));
        points.push(new Point(xc - x, yc - y));
        points.push(new Point(xc + y, yc + x));
        points.push(new Point(xc - y, yc + x));
        points.push(new Point(xc + y, yc - x));
        points.push(new Point(xc - y, yc - x));
    }
}