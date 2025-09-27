document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('pro-honeycomb');
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const hexSize = 30; // hex radius
    const hexWidth = Math.sqrt(3) * hexSize;
    const hexHeight = hexSize * 1.5;
    const hexLayers = 3; // multi-layer depth effect
    const hexagons = [];

    const colors = ['#8a2be2', '#c71585', '#00ffff', '#ff00ff', '#7fff00'];

    class Hexagon {
        constructor(x, y, baseColor, layer) {
            this.x = x;
            this.y = y;
            this.baseColor = baseColor;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.phase = Math.random() * Math.PI * 2;
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
            this.layer = layer; // depth layer
        }

        update(mouse) {
            this.phase += this.pulseSpeed;
            this.opacity = 0.2 + 0.8 * Math.abs(Math.sin(this.phase));

            // hover effect
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                this.opacity = Math.min(this.opacity + (150 - dist) / 200, 1);
            }
        }

        draw(ctx) {
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = Math.PI / 3 * i;
                const px = this.x + hexSize * Math.cos(angle);
                const py = this.y + hexSize * Math.sin(angle);
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fillStyle = this.baseColor;
            ctx.globalAlpha = this.opacity;
            ctx.shadowBlur = 10 + this.layer * 5;
            ctx.shadowColor = this.baseColor;
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
        }
    }

    const mouse = { x: -1000, y: -1000 };
    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    function createHexGrid() {
        hexagons.length = 0;
        const cols = Math.ceil(width / hexWidth) + 1;
        const rows = Math.ceil(height / hexHeight) + 1;

        for (let layer = 0; layer < hexLayers; layer++) {
            const offset = layer * 10; // slight offset for depth
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const x = col * hexWidth + (row % 2) * (hexWidth / 2) + offset;
                    const y = row * hexHeight * 0.66 + offset;
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    hexagons.push(new Hexagon(x, y, color, layer));
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        hexagons.forEach(hex => {
            hex.update(mouse);
            hex.draw(ctx);
        });
        requestAnimationFrame(animate);
    }

    createHexGrid();
    animate();

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        createHexGrid();
    });
});
