class Cell {
	constructor(x, y, symbol, color) {
		this.x = x;
		this.y = y;
		this.symbol = symbol;
		this.color = color;
	}

	draw(ctx) {
		ctx.fillStyle = 'white';
		ctx.fillText(this.symbol, this.x + 0.5, this.y + 0.5);
		ctx.fillStyle = this.color;
		ctx.fillText(this.symbol, this.x, this.y);
	}
}

export default class AsciiEffects {
	#imageCellArray = [];
	#pixels = [];
	#ctx;
	#width;
	#height;

	constructor(ctx, width, height, image) {
		this.#ctx = ctx;
		this.#width = width;
		this.#height = height;
		this.#ctx.drawImage(image, 0, 0, this.#width, this.#height);
		this.#pixels = this.#ctx.getImageData(0, 0, this.#width, this.#height);
		console.log(this.#pixels.data); // 画像の各ピクセルは、配列の4つの要素で表される。　配列内上からindex順に0(red),1(green),2(blue),3(alpha),4(red)...。
		// 今回取得使用している画像は11059200(dataで取得したUint8ClampedArrayの引数) / 4(1pxで使用している配列の数) = 2764800px
	}

	#convertToSymbol(g) {
		if (g > 250) return '#';
		else if (g < 240) return '%';
		else if (g < 230) return '$';
		else if (g < 200) return '&';
		else if (g < 180) return '-';
		else if (g < 150) return '=';
		else if (g < 120) return '^';
		else if (g < 100) return '3';
		else if (g < 80) return '0';
		else if (g < 40) return '@';
		else if (g < 20) return '0';
		else if (g < 10) return '1';
		else return '';
	}

	#scanImage(cellSize) {
		this.#imageCellArray = [];
		for (let y = 0; y < this.#pixels.height; y += cellSize) {
			for (let x = 0; x < this.#pixels.width; x += cellSize) {
				const posX = x * 4;
				const posY = y * 4;
				const pos = posY * this.#pixels.width + posX; // filled rows

				if (this.#pixels.data[pos + 3] > 128) {
					const red = this.#pixels.data[pos];
					const green = this.#pixels.data[pos + 1];
					const blue = this.#pixels.data[pos + 2];
					const total = red + green + blue;
					const averageColorValue = total / 3;
					const color = `rgb(${red},${green},${blue})`;
					const symbol = this.#convertToSymbol(averageColorValue);
					if (total > 200)
						this.#imageCellArray.push(new Cell(x, y, symbol, color));
				}
			}
		}
		console.log(this.#imageCellArray);
	}

	#drawAscii() {
		this.#ctx.clearRect(0, 0, this.#width, this.#height);
		for (let i = 0; i < this.#imageCellArray.length; i++) {
			this.#imageCellArray[i].draw(this.#ctx);
		}
	}

	draw(cellSize) {
		this.#scanImage(cellSize);
		this.#drawAscii();
	}
}
