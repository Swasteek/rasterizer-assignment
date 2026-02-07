// Wu's anti-aliased line drawing algorithm implementation
class WuRasterizer {
    rasterize(p1, p2) {
        // Returns array of [x, y, intensity] arrays

        const points = [];

        let x0 = p1.x;
        let y0 = p1.y;
        let x1 = p2.x;
        let y1 = p2.y;

        // Helper functions
        const fpart = x => x - Math.floor(x);
        const rfpart = x => 1 - fpart(x);

        const steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);

        // Swap coordinates if steep
        if (steep) {
            [x0, y0] = [y0, x0];
            [x1, y1] = [y1, x1];
        }

        // Ensure left to right
        if (x0 > x1) {
            [x0, x1] = [x1, x0];
            [y0, y1] = [y1, y0];
        }

        const dx = x1 - x0;
        const dy = y1 - y0;

        // Handle vertical line
        if (dx === 0) {
            const yStart = Math.min(y0, y1);
            const yEnd = Math.max(y0, y1);
            for (let y = yStart; y <= yEnd; y++) {
                if (steep) {
                    points.push([y, x0, 1.0]);
                } else {
                    points.push([x0, y, 1.0]);
                }
            }
            return points;
        }

        const gradient = dy / dx;

        // Process first endpoint
        let xend = Math.round(x0);
        let yend = y0 + gradient * (xend - x0);
        let xgap = rfpart(x0 + 0.5);
        let xpxl1 = xend;
        let ypxl1 = Math.floor(yend);

        if (steep) {
            points.push([ypxl1, xpxl1, rfpart(yend) * xgap]);
            points.push([ypxl1 + 1, xpxl1, fpart(yend) * xgap]);
        } else {
            points.push([xpxl1, ypxl1, rfpart(yend) * xgap]);
            points.push([xpxl1, ypxl1 + 1, fpart(yend) * xgap]);
        }

        let intery = yend + gradient;

        // Process second endpoint
        xend = Math.round(x1);
        yend = y1 + gradient * (xend - x1);
        xgap = fpart(x1 + 0.5);
        let xpxl2 = xend;
        let ypxl2 = Math.floor(yend);

        if (steep) {
            points.push([ypxl2, xpxl2, rfpart(yend) * xgap]);
            points.push([ypxl2 + 1, xpxl2, fpart(yend) * xgap]);
        } else {
            points.push([xpxl2, ypxl2, rfpart(yend) * xgap]);
            points.push([xpxl2, ypxl2 + 1, fpart(yend) * xgap]);
        }

        // Main loop
        for (let x = xpxl1 + 1; x < xpxl2; x++) {
            if (steep) {
                points.push([Math.floor(intery), x, rfpart(intery)]);
                points.push([Math.floor(intery) + 1, x, fpart(intery)]);
            } else {
                points.push([x, Math.floor(intery), rfpart(intery)]);
                points.push([x, Math.floor(intery) + 1, fpart(intery)]);
            }
            intery += gradient;
        }

        return points;
    }
}