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
    let rectWidth = 480;
    let rectHeight = 350;

    if (action !== 'mixed') {
        if (barcodeType === 'datamatrix') {
            rectWidth = 200;
            rectHeight = 200;
        }
        else if (barcodeType === 'azteccode') {
            rectWidth = 200;
            rectHeight = 200;
        }
        else if (barcodeType === 'maxicode') {
            rectWidth = 400;
            rectHeight = 350;
        }
        else if (barcodeType === 'pdf417') {
            rectWidth = 400;
            rectHeight = 150;
        }
        else if (barcodeType === 'ean13') {
            rectWidth = 250;
            rectHeight = 150;
        } else if (barcodeType === 'qrcode') {
            rectWidth = 200;
            rectHeight = 200;
        } else if (barcodeType === 'code128') {
            rectWidth = 250;
            rectHeight = 150;
        } else if (barcodeType === 'code39') {
            rectWidth = 480;
            rectHeight = 150;
        } else if (barcodeType === 'itf') {
            rectWidth = 270;
            rectHeight = 150;
        } else if (barcodeType === 'msi') {
            rectWidth = 330;
            rectHeight = 150;
        } else if (barcodeType === 'pharmacode') {
            rectWidth = 170;
            rectHeight = 150;
        } else if (barcodeType === 'codabar') {
            rectWidth = 320;
            rectHeight = 150;
        }
    }
    else {
        rectWidth = 480;
        rectHeight = 350;
    }

    const radius = 10;
    const spacing = 10;
    const gridWidth = rectWidth;
    const gridHeight = rectHeight;
    canvas.width = cols * (gridWidth + spacing);
    canvas.height = rows * (gridHeight + spacing);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '14px Arial';

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

            const x = col * (gridWidth + spacing);
            const y = row * (gridHeight + spacing);

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
                    ctx.fillText(value, x + 5, y + tempCanvas.height + 30);
                } else if (barcodeType === 'ean13') {
                    JsBarcode(tempCanvas, value, {
                        format: "ean13",
                        width: 2,
                        height: 100,
                        displayValue: true
                    });
                } else if (barcodeType === 'code128') {
                    JsBarcode(tempCanvas, value, {
                        format: "CODE128",
                        width: 2,
                        height: 100,
                        displayValue: true
                    });
                } else if (barcodeType === 'code39') {
                    JsBarcode(tempCanvas, value, {
                        format: "CODE39",
                        width: 2,
                        height: 100,
                        displayValue: true
                    });
                } else if (barcodeType === 'itf') {
                    JsBarcode(tempCanvas, value, {
                        format: "ITF",
                        width: 2,
                        height: 100,
                        displayValue: true
                    });
                } else if (barcodeType === 'msi') {
                    JsBarcode(tempCanvas, value, {
                        format: "MSI",
                        width: 2,
                        height: 100,
                        displayValue: true
                    });
                } else if (barcodeType === 'pharmacode') {
                    JsBarcode(tempCanvas, value, {
                        format: "pharmacode",
                        width: 2,
                        height: 100,
                        displayValue: true
                    });
                } else if (barcodeType === 'codabar') {
                    JsBarcode(tempCanvas, value, {
                        format: "codabar",
                        width: 2,
                        height: 100,
                        displayValue: true
                    });
                }

                // Draw rounded rect
                if (!is2D && action !== 'mixed') {
                    ctx.strokeStyle = '#000';
                    drawRoundedRect(ctx, x, y, rectWidth, rectHeight, radius);
                }

                // Draw barcode
                ctx.drawImage(tempCanvas, x + 5, y + 5);

            } catch (error) {
                alert(error);
                needStop = true;
                break;
            }
        }
    }
}

