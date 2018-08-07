window.onload = function()
{
	
	var canvasWidth = 900;
	var canvasHeight = 600;
	var blockSize = 30;
	var ctx;
	var delay = 100;
	var snakee;
	var applee;
	var widthInBlocks = canvasWidth/blockSize;
	var heightInBlock = canvasHeight/blockSize;
	var score;
	var timeout;

	init();

	
	function init()
	{	
		var canvas = document.createElement("canvas");
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		canvas.style.border = "30px solid grey";
		canvas.style.margin = "50 auto";
		canvas.style.display = "block";
		canvas.style.backgroundColor = "#ddd"
		document.body.appendChild(canvas);
		ctx = canvas.getContext('2d');
		snakee = new Snake([[6,4],[5,4],[4,4]], "right");
		applee = new Apple([10,10]);
		score = 0;
		refreshCanvas();
	}

	function lose()
	{
		alert("vous avez perdu ");
		snakee.init();
	}
	
	function refreshCanvas()
	{
		snakee.advance();
		if (snakee.checkColision())
		{
			gameOver();
		}
		else
		{
			if (snakee.isEatingApple(applee))
			{
				snakee.ateApple = true;
				score++;
				do
				{
					applee.setNewPosition();
				}
				while(applee.isOnSnake(snakee));

			}
			ctx.clearRect(0,0,canvasWidth,canvasHeight);
			drawScore();
			snakee.draw();
			applee.draw();
			timeout = setTimeout(refreshCanvas,delay);
		}
		
	}
	function gameOver()
	{
		ctx.save();
		ctx.font = "bold 70px sans-serif"
		ctx.fillStyle = "#000";
		ctx.textAlign = "center"
		ctx.textBaseline = "middle";
		ctx.strokeStyle = "white";
		ctx.lineWidth = 5;
		var centerX = canvasWidth / 2;
		var centerY = canvasHeight / 2;
		ctx.strokeText("Game Over",centerX, centerY - 180);
		ctx.fillText("Game Over" , centerX, centerY - 180);
		ctx.font = "bold 30px sans-serif";
		ctx.strokeText("Appuyez Sur Espace Pour Continuer",centerX, centerY - 120);
		ctx.fillText("Appuyez Sur Espace Pour Continuer",centerX, centerY - 120);
		ctx.restore();
	}
	function restart()
	{
		snakee = new Snake([[6,4],[5,4],[4,4]], "right");
		applee = new Apple([10,10]);
		score = 0;
		clearTimeout(timeout);
		refreshCanvas();
	}
	function drawScore()
	{
		ctx.save();
		ctx.font = "bold 200px sans-serif";
		ctx.fillStyle = "gray";
		ctx.textAlign = "center"
		ctx.textBaseline = "middle";
		var centerX = canvasWidth / 2;
		var centerY = canvasHeight / 2;
		ctx.fillText(score.toString(), centerX, centerY - 5);
		ctx.restore();
	}

	function drawBlock(ctx, position)
	{
		var x = position[0] * blockSize;
		var y = position[1] * blockSize;
		ctx.fillRect(x,y,blockSize,blockSize);
	}

	function Snake (body, direction)
	{
		this.body = body;
		this.direction = direction;
		this.ateApple = false;
		this.draw = function()
		{
			ctx.save();
			ctx.fillStyle = "#ff0000";
			for(var i = 0; i < this.body.length; i++)
			{
				drawBlock(ctx, this.body[i]);
			}
			ctx.restore();
		};
		this.advance = function()
		{
			var nextPosition = this.body[0].slice();
			switch(this.direction)
			{
				case "left":
					nextPosition[0] -= 1;
					break;
				case "right":
					nextPosition[0] += 1;
					break;
				case "down":
					nextPosition[1] += 1;
					break;
				case "up":
					nextPosition[1] -= 1;
					break;

			}
			this.body.unshift(nextPosition);
			if(!this.ateApple)
			{
				this.body.pop();
			}
			else
			{
				this.ateApple = false;
				
			}
		};
		this.setDirection = function(newDirection)
		{
			var allowDirection;
			switch(this.direction)
			{
				case "left":
				case "right":
					allowDirection = ["up", "down"];
					break;
				case "up":
				case "down":
					allowDirection = ["right", "left"];
					break;
			}

			if(allowDirection.indexOf(newDirection) > -1)
			{
				this.direction = newDirection;
			}
		};
		this.checkColision = function()
		{
			var wallCollision = false;
			var snakeCollision = false;
			var head = this.body[0];
			var rest = this.body.slice(1);
			var snakeX = head[0];
			var snakeY = head[1];
			var minX = 0;
			var minY = 0;
			var maxX = widthInBlocks - 1;
			var maxY = heightInBlock - 1;
			var isNotBetweenHorizontalwall = snakeX < minX || snakeX > maxX;
			var isNotBetweenVerticalwall = snakeY < minY || snakeY > maxY;

			if(isNotBetweenHorizontalwall || isNotBetweenVerticalwall)
			{
				wallCollision = true;
			}

			for (var i = 0; i < rest.length; i++)
			{
				if (snakeX === rest[i][0] && snakeY === rest[i][1])
				{
					snakeCollision = true;
				}
			}
			return snakeCollision || wallCollision ;
		};
		this.isEatingApple = function(appleToEat) 
		{
			var head = this.body[0];
			if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
			{
				return true;
			}
			else 
			{
				return false;
			}
		};
	}

	function Apple (position)
	{
		this.position = position;
		this.draw =  function ()
		{
			ctx.save();
			ctx.fillStyle = "#33CC33";
			ctx.beginPath();
			var radius = blockSize/2;
			var x = this.position[0]*blockSize + radius;
			var y = this.position[1]*blockSize + radius;
			ctx.arc(x,y,radius, 0, Math.PI*2, true);
			ctx.fill();
			ctx.restore();
		};
		this.setNewPosition = function()
		{
			console.log("position actuelle "+this.position);
			var newX = Math.round(Math.random() * (widthInBlocks - 1));
			var newY = Math.round(Math.random() * (heightInBlock - 1));
			this.position = [newX,newY];
			console.log("position nouvelle "+this.position);
		};
		this.isOnSnake = function(snakeToCheck)
		{
			var isOnSnake = false;
			var rest = snakeToCheck.body.slice(1);
			for(var i = 0; i < rest; i++)
			{
				if(this.position[0] === snakeToCheck[i][0] && this.position[1] === snakeToCheck[i][1])
				{
					isOnSnake = True;
				}
			}
		}

	}
	document.onkeydown = function(e)
	{
		var key = e.keyCode;
		var newDirection;
		switch(key)
		{
			case 37:
				newDirection = "left";
				break;
			case 38:
				newDirection = "up";
				break;
			case 39:
				newDirection = "right";
				break;
			case 40:
				newDirection = "down";
				break;
			case 32:
				restart();
					return;
				break;
		}
		console.log(newDirection);
		snakee.setDirection(newDirection);
		
	}
	

	
}



