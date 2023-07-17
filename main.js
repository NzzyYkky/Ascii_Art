import './style.css';
import AsciiEffects from './js/AsciiEffects';
import imageTxt from './images/image.txt';

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const image1 = new Image();

const inputSlider = document.getElementById('resolution');
const inputLabel = document.getElementById('resolutionLabel');
inputSlider.addEventListener('change', handleSlider);

let effect;

function handleSlider() {
	if (inputSlider.value === 1) {
		inputLabel.innerHTML = 'Original Image';
		ctx.drawImage(image1, 0, 0, canvas.width, canvas.height);
	} else {
		inputLabel.innerHTML = 'Resolution :' + inputSlider.value + 'px';
		ctx.font = parseInt(inputSlider.value) * 1.2 + 'px Verdana';
		effect.draw(parseInt(inputSlider.value));
		console.log(ctx.font);
	}
}

image1.onload = function initialize() {
	canvas.width = image1.width;
	canvas.height = image1.height;
	effect = new AsciiEffects(ctx, image1.width, image1.height, image1);
};

fetch(imageTxt)
	.then((response) => response.text())
	.then((base64Data) => {
		image1.src = base64Data;
		image1.onload = function initialize() {
			canvas.width = image1.width;
			canvas.height = image1.height;
			effect = new AsciiEffects(ctx, image1.width, image1.height, image1);
			effect.draw(15);
		};
	})
	.catch((error) => {
		console.log(error);
	});
