import { useEffect } from "react";

const ChristmasEffect = () => {
    useEffect(() => {
        // Create canvas and get context
        const canvas = document.createElement("canvas");
        document.body.appendChild(canvas);
        const ctx = canvas.getContext("2d");

        // Set canvas size to cover the full viewport
        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        setCanvasSize();
        window.addEventListener("resize", setCanvasSize);

        // Create array of snowflakes
        const snowflakes = [];

        // Snowflake class
        class Snowflake {
            constructor() {
                this.x = Math.random() * canvas.width; // Position of the snowflake
                this.y = Math.random() * canvas.height; // Position of the snowflake
                this.size = Math.random() * 5 + 2; // Size of the snowflake
                this.speed = Math.random() * 2 + 1; // Falling speed
                this.opacity = Math.random() * 0.5 + 0.3; // Snowflake opacity
                this.angle = Math.random() * Math.PI * 2; // Snowflake rotation angle
            }

            // Draw the snowflake as a star shape
            draw(scrollY) {
                const numArms = 6; // Number of snowflake arms
                const armLength = this.size + Math.random() * 5;

                ctx.save();
                ctx.translate(this.x, this.y - scrollY); // Adjust position relative to scroll
                ctx.rotate(this.angle);

                ctx.beginPath();
                for (let i = 0; i < numArms; i++) {
                    const angle = ((Math.PI * 2) / numArms) * i;
                    const xEnd = Math.cos(angle) * armLength;
                    const yEnd = Math.sin(angle) * armLength;
                    ctx.moveTo(0, 0);
                    ctx.lineTo(xEnd, yEnd);
                }
                ctx.closePath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.restore();
            }

            // Update the position of the snowflake
            update(scrollY) {
                this.y += this.speed;
                if (this.y > canvas.height + scrollY) {
                    this.y = scrollY - this.size; // Reset the snowflake when it goes off screen
                    this.x = Math.random() * canvas.width; // New position for the snowflake
                }
            }
        }

        // Create snowflakes
        for (let i = 0; i < 100; i++) {
            snowflakes.push(new Snowflake());
        }

        // Create the snowfall effect
        function animateSnow() {
            const scrollY = window.scrollY;
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
            snowflakes.forEach((snowflake) => {
                snowflake.update(scrollY);
                snowflake.draw(scrollY);
            });
            requestAnimationFrame(animateSnow); // Continue the animation
        }

        animateSnow();

        // Cleanup function to remove canvas on component unmount
        return () => {
            window.removeEventListener("resize", setCanvasSize);
            document.body.removeChild(canvas);
        };
    }, []);

    return null; // No need to return any element as the canvas is added directly to the DOM
};

export default ChristmasEffect;
