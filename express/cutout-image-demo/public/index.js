// https://www.zhangxinxu.com/study/201804/background-color-replaced-by-transparent.html

// image to canvas
const $pic = document.getElementById("pic");

const drawCanvas = (image) => {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage($pic, 0, 0);
  return { ctx, canvas };
};

const { canvas, ctx } = drawCanvas($pic);

const parseCanvasColor = (ctx) => {
  const replaceColor = [255, 255, 255, 255];
  const imageData = ctx.getImageData(0, 0, $pic.width, $pic.height);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const data = imageData.data;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (
      Math.sqrt(
        Math.pow(r - replaceColor[0], 2) +
          Math.pow(g - replaceColor[1], 2) +
          Math.pow(b - replaceColor[2], 2)
      ) < 10
    ) {
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 0;
    }
  }
  console.log(imageData)
  ctx.putImageData(imageData, 0, 0);
};

parseCanvasColor(ctx);

document.getElementById("draw").appendChild(canvas);

// canvas 取色

// cancas 替换颜色
