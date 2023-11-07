const alltypes = ["qrcode", "datamatrix", "pdf417", "azteccode", "maxicode", "ean13", "code128", "code39", "itf", "msi", "pharmacode", "codabar"];

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomEAN13Number() {
    // Generate 12 random digits
    let value = '';
    for (let i = 0; i < 12; i++) {
        value += Math.floor(Math.random() * 10);
    }
    return value;
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
    ctx.stroke();
}

function randomPharmacodeNumber() {
    return Math.floor(Math.random() * (131070 - 3 + 1)) + 3;
}

function generate(action) {
    const text = document.getElementById('text').value;
    const canvas = document.getElementById('barcodeCanvas');
    let barcodeType = document.getElementById('barcodeType').value;
    let rows = document.getElementById('rows').value;
    let cols = document.getElementById('cols').value;
    let maxWidth = 0, maxHeight = 0;
    let allCanvas = [];

    let isRandom = true;
    let needStop = false;
    if (action === 'direct') {
        isRandom = false;
    }

    for (let row = 0; row < rows; row++) {
        if (needStop) {
            break;
        }
        for (let col = 0; col < cols; col++) {
            let is2D = false;
            let tempCanvas = document.createElement('canvas');
            let value = '';

            if (action === 'mixed') {
                barcodeType = alltypes[randomInt(0, alltypes.length - 1)];
            }

            if (isRandom) {
                if (barcodeType === 'pharmacode') {
                    value = randomPharmacodeNumber();
                }
                else {
                    value = randomEAN13Number();
                }
            }
            else {
                value = text;
                if (value === '') {
                    alert('Please input barcode text!');
                    needStop = true;
                    break;
                }
            }

            try {
                if (barcodeType === 'maxicode' || barcodeType === 'qrcode' || barcodeType === 'pdf417' || barcodeType === 'azteccode' || barcodeType === 'datamatrix') {
                    is2D = true;
                    if (isRandom) {
                        value = 'Dynamsoft-' + value;
                    }
                    try {
                        bwipjs.toCanvas(tempCanvas, {
                            bcid: barcodeType,
                            text: value,
                            scale: 3,
                            includetext: true,
                            textxalign: 'center',
                        });
                    } catch (e) {
                        console.log(e);
                    }
                } else {
                    JsBarcode(tempCanvas, value, {
                        format: barcodeType,
                        width: 2,
                        height: 100,
                        displayValue: true
                    });
                } 

                if (tempCanvas.width >= maxWidth) {
                    maxWidth = tempCanvas.width;
                }
                if (tempCanvas.height >= maxHeight) {
                    maxHeight = tempCanvas.height;
                }
                allCanvas.push([tempCanvas, is2D, value]);

            } catch (error) {
                alert(error);
                needStop = true;
                break;
            }
        }
    }

    if (needStop) return;

    let index = 0;
    const radius = 10;
    const spacing = 10;
    const padding = 40;
    let canvasWidth = cols * (maxWidth + padding * 2 + spacing);
    let canvasHeight = rows * (maxHeight + padding * 2 + spacing);
    const ctx = canvas.getContext('2d');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.font = '14px Arial';
    ctx.fillStyle = 'black';
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let tempCanvas = allCanvas[index][0];
            let is2D = allCanvas[index][1];
            let value = allCanvas[index][2];
            index += 1;

            const x = col * (maxWidth + padding * 2 + spacing);
            const y = row * (maxHeight + padding * 2 + spacing);

            if (is2D) {
                ctx.fillText(value, x + padding, y + tempCanvas.height + padding * 3 / 2);
            }

            // Draw rounded rect
            if (!is2D && action !== 'mixed') {
                ctx.strokeStyle = '#000';
                drawRoundedRect(ctx, x + padding / 2, y + padding / 2, maxWidth + padding, maxHeight + padding, radius);
            }

            // Draw barcode
            ctx.drawImage(tempCanvas, x + padding, y + padding);
        }
    }
}

