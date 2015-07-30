var defaultColour = "#000000";

function getCanvas()
{
	return $("#canvas")[0].getContext("2d");
}

function drawPointColour(x, y, col)
{
	var c = getCanvas();
	c.beginPath();
	c.fillStyle = col;
	c.fillRect(x, y, 1, 1);
	c.closePath();
}

function drawPoint(x, y)
{
	drawPointColour(x, y, defaultColour);
}

function drawLineColour(x1, y1, x2, y2, lw, col)
{
	var c = getCanvas();
	c.beginPath();
	c.moveTo(x1, y1);
	c.lineTo(x2, y2);
	c.lineWidth = lw;
	c.strokeStyle = col;
	c.stroke();
	c.closePath();
}

function drawLine(x1, y1, x2, y2, lw)
{
	drawLineColour(x1, y1, x2, y2, lw, defaultColour);
}

function drawRectangleColour(x, y, w, h, lw, col)
{
	var c = getCanvas();
	c.beginPath();
	c.rect(x, y, w, h);
	c.lineWidth = lw;
	c.strokeStyle = col;
	c.stroke();
	c.closePath();
}

function drawRectangle(x, y, w, h, lw)
{
	drawRectangleColour(x, y, w, h, lw, defaultColour);
}

function drawRectangleFilledColour(x, y, w, h, col)
{
	var c = getCanvas();
	c.beginPath();
	c.fillStyle = col;
	c.fillRect(x, y, w, h);
	c.closePath();
}

function drawRectangleFilled(x, y, w, h)
{
	drawRectangleFilledColour(x, y, w, h, defaultColour);
}

function drawRectangle(x, y, w, h)
{
	drawRectangleColour(x, y, w, h, defaultColour);
}

function drawRectangleFilledColour(x, y, w, h, col)
{
	var c = getCanvas();
	c.beginPath();
	c.fillStyle = col;
	c.fillRect(x, y, w, h);
	c.closePath();
}

function drawRectangleFilled(x, y, w, h)
{
	drawRectangleFilledColour(x, y, w, h, defaultColour);
}

function drawCurveColour(x1, y1, x2, y2, mx, my, w, col)
{
	var c = getCanvas();
	c.beginPath();
	c.moveTo(x1, y1);
	c.quadraticCurveTo(mx, my, x2, y2);
	c.lineWidth = w;
	c.strokeStyle = col;
	c.stroke();
	c.closePath();
}

function drawCurve(x1, y1, x2, y2, mx, my, w)
{
	drawCurveColour(x1, y1, x2, y2, mx, my, w, defaultColour);
}

function drawArcColour(x, y, as, ae, r, w, col)
{
	var c = getCanvas();
	c.beginPath();
	c.arc(x, y, r, as, ae, false);
	c.lineWidth = w;
	c.strokeStyle = col;
	c.stroke();
	c.closePath();
}

function drawArc(x, y, as, ae, r, w)
{
	drawArcColour(x, y, as, ae, r, w, defaultColour);
}