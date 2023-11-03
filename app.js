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

function generateBarcodes() {
    const rows = document.getElementById('rows').value;
    const cols = document.getElementById('cols').value;
    const text = document.getElementById('text').value;
    const barcodeType = document.getElementById('barcodeType').value;
    const canvas = document.getElementById('barcodeCanvas');

    const barcodeWidth = 100;
    const barcodeHeight = 120;
    const rectWidth = 260;
    const rectHeight = 150;
    const radius = 10;
    const spacing = 10;
    canvas.width = cols * (rectWidth + spacing);
    canvas.height = rows * (rectHeight + spacing);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '14px Arial';

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const tempCanvas = document.createElement('canvas');
            const value = (text === "" ? randomEAN13Number() : text);
            // const value = barcodeType === 'qrcode' ? 'QRData-' + (row * cols + col) : content;

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
                        ctx.drawImage(img, x + 5, y + 5);
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
            }
        }
    }
}

