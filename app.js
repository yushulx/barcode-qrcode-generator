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

function generate(action) {
    const rows = document.getElementById('rows').value;
    const cols = document.getElementById('cols').value;
    const text = document.getElementById('text').value;
    const barcodeType = document.getElementById('barcodeType').value;
    const canvas = document.getElementById('barcodeCanvas');

    const rectWidth = barcodeType === 'qrcode' ? 200 : 220;
    const rectHeight = barcodeType === 'qrcode' ? 200 : 150;
    const radius = 10;
    const spacing = 10;
    canvas.width = cols * (rectWidth + spacing);
    canvas.height = rows * (rectHeight + spacing);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '14px Arial';

    let isRandom = false;
    let needStop = false;
    if (action === 'direct') {
        isRandom = false;
    } else if (action === 'random') {
        isRandom = true;
    }

    for (let row = 0; row < rows; row++) {
        if (needStop) {
            break;
        }
        for (let col = 0; col < cols; col++) {
            const tempCanvas = document.createElement('canvas');
            let value = '';

            if (isRandom) {
                value = randomEAN13Number();
            }
            else {
                value = text;
                if (value === '') {
                    alert('Please input barcode text!');
                    needStop = true;
                    break;
                }
            }

            if (barcodeType === 'qrcode' && isRandom) {
                value = 'Dynamsoft-' + value;
            }

            const x = col * (rectWidth + spacing);
            const y = row * (rectHeight + spacing);

            try {
                if (barcodeType === 'ean13') {
                    JsBarcode(tempCanvas, value, {
                        format: "ean13",
                        width: 2,
                        height: 100,
                        displayValue: false
                    });
                } else if (barcodeType === 'qrcode') {
                    const qr = qrcode(4, 'L');
                    qr.addData(value);
                    qr.make();
                    const imgTag = qr.createImgTag(4);
                    const img = new Image();
                    img.src = imgTag.split('\"')[1];
                    img.onload = function () {
                        ctx.drawImage(img, x, y);
                        ctx.fillText(value, x + 15, y + img.height + 20);
                    };

                    continue;
                }

                // Draw rounded rect
                ctx.strokeStyle = '#000';
                drawRoundedRect(ctx, x, y, rectWidth, rectHeight, radius);

                // Draw barcode
                ctx.drawImage(tempCanvas, x + 5, y + 5);

                // Draw text below barcode
                ctx.fillText(value, x + 45, y + 140);
            } catch (error) {
                alert(error);
                needStop = true;
                break;
            }
        }
    }
}

