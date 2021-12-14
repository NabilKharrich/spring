import gsap from 'gsap';
import spring from './spring';

const stiffnessInput = document.querySelector('#stiffness');
const stiffnessSpan = document.querySelector('.stiffness-span');
const dampeningInput = document.querySelector('#dampening');
const dampeningSpan = document.querySelector('.dampening-span');

async function a() {
    const obj = document.querySelector('.object');

    const x = spring(
        { x: 0, y: 0 },
        {
            stiffness: 1,
            dampening: 1,
            mass: 1,
            onUpdate: ({ x, y }) => gsap.set(obj, { x, y }),
            onComplete: (val) => {},
        }
    );

    window.addEventListener('mousemove', (e) => {
        x.goTo({ x: e.clientX, y: e.clientY });
    });

    stiffnessInput.addEventListener('input', (e) => {
        x.updateConfig({ stiffness: stiffnessInput.value });
        stiffnessSpan.textContent = stiffnessInput.value;
    });

    dampeningInput.addEventListener('input', (e) => {
        x.updateConfig({ dampening: dampeningInput.value });
        dampeningSpan.textContent = dampeningInput.value;
    });
}

a();
