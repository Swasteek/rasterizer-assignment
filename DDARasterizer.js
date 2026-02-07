// DDA (Digital Differential Analyzer) line drawing algorithm implementation
class DDARasterizer {
    rasterize(p1, p2) {
        const points = [];

        let x0 = p1.x;
        let y0 = p1.y;
        let x1 = p2.x;
        let y1 = p2.y;

        const dx = x1 - x0;
        const dy = y1 - y0;

        // Calculate number of steps
        const steps = Math.max(Math.abs(dx), Math.abs(dy));

        // Handle single point
        if (steps === 0) {
            points.push(new Point(x0, y0));
            return points;
        }

        // Calculate increments
        const xIncrement = dx / steps;
        const yIncrement = dy / steps;

        // Add first point
        let x = x0;
        let y = y0;
        points.push(new Point(Math.round(x), Math.round(y)));

        // Generate intermediate points
        for (let i = 0; i < steps; i++) {
            x += xIncrement;
            y += yIncrement;
            points.push(new Point(Math.round(x), Math.round(y)));
        }

        return points;
    }
}