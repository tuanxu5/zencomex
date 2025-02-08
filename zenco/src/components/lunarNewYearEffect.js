import { useEffect } from "react";

const CombinedEffect = () => {
    useEffect(() => {
        const canvas = document.createElement("canvas");
        document.body.appendChild(canvas);
        const ctx = canvas.getContext("2d");

        // Set canvas size and handle resizing
        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        setCanvasSize();
        window.addEventListener("resize", setCanvasSize);

        // Tet Blossom Effect (Falling peach blossoms)
        class Blossom {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 15 + 5; // Size of the blossom
                this.speed = Math.random() * 0.01 + 0.05; // Falling speed
                this.opacity = Math.random() * 0.5 + 0.5; // Opacity of the blossom
                this.color = `rgba(255, 105, 180, ${this.opacity})`; // Peach blossom color (light pink)
                this.angle = Math.random() * Math.PI * 2;
                this.spinSpeed = Math.random() * 0.03 + 0.01; // Rotation speed
                this.windSpeed = Math.random() * 1 - 0.2; // Tăng cường độ gió (di chuyển ngang)
                this.acceleration = 0.003; // Giảm gia tốc (hoặc bỏ để hoa không tăng tốc độ rơi quá nhanh)
            }

            // Draw a petal shape
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-this.size / 2, -this.size, this.size / 2, -this.size, 0, 0); // Petal shape
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.restore();
            }

            // Cập nhật vị trí và góc quay của hoa
            update() {
                this.x += this.windSpeed; // Thêm hiệu ứng gió (di chuyển ngang)
                this.y += this.speed; // Di chuyển xuống dưới
                this.speed += this.acceleration; // Gia tốc nhẹ, hoặc có thể bỏ qua nếu không muốn tăng tốc độ rơi
                this.angle += this.spinSpeed; // Quay hoa
                if (this.y > canvas.height) {
                    this.y = -this.size; // Nếu hoa rơi ra ngoài màn hình, đặt lại vị trí
                    this.x = Math.random() * canvas.width; // Tạo lại vị trí X ngẫu nhiên
                    this.speed = Math.random() * 0.005 + 0.005; // Đặt lại tốc độ rơi chậm
                }
            }
        }

        const blossoms = [];
        for (let i = 0; i < 50; i++) {
            blossoms.push(new Blossom()); // Create blossoms
        }

        // Firework Effect (Updated)
        class Particle {
            constructor(x, y, color) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 3 + 1;
                this.speedX = (Math.random() - 0.5) * 5;
                this.speedY = (Math.random() - 0.5) * 4;
                this.color = color;
                this.life = 100; // Particle's life in frames
                this.opacity = 1;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.restore();
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.life -= 0.8; // Reduce life over time
                this.opacity = this.life / 100; // Fade out
                this.size *= 0.98; // Shrink the particle over time
            }
        }

        class Firework {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.particles = [];
                this.color = `hsl(${Math.random() * 360}, 100%, 50%)`; // Random color for the firework
                this.createParticles();
            }

            createParticles() {
                const numParticles = 40; // Number of particles in the explosion
                for (let i = 0; i < numParticles; i++) {
                    this.particles.push(new Particle(this.x, this.y, this.color));
                }
            }

            draw() {
                this.particles.forEach((particle, index) => {
                    particle.update();
                    particle.draw();
                    if (particle.life <= 0) {
                        this.particles.splice(index, 1); // Remove dead particles
                    }
                });
            }
        }

        const fireworks = [];
        function createFireworks() {
            if (Math.random() < 0.01) {
                fireworks.push(new Firework(Math.random() * canvas.width, Math.random() * canvas.height));
            }
        }

        // Animation function
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

            // Update and draw each blossom
            blossoms.forEach((blossom) => {
                blossom.update();
                blossom.draw();
            });

            // Create firework effects
            createFireworks();
            fireworks.forEach((firework) => {
                firework.draw();
            });

            requestAnimationFrame(animate); // Continue animation
        }

        animate(); // Start the animation

        // Cleanup on unmount
        return () => {
            window.removeEventListener("resize", setCanvasSize);
            document.body.removeChild(canvas); // Remove canvas from DOM
        };
    }, []);

    return null;
};

export default CombinedEffect;
