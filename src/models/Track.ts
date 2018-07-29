import Sprite = Phaser.GameObjects.Sprite;
import { TrackPointSprite } from './TrackPointSprite';

export class Track {
	// public x: number[] = [];
	// public y: number[] = [];

	private linePoints: Sprite[] = [];

	constructor(private graphics: Phaser.GameObjects.Graphics, private scene: Phaser.Scene) {

	}

	public addPoint(newX: number, newY: number) {
		// this.x.push(newX);
		// this.y.push(newY);

		let pointSpite = new TrackPointSprite(this.scene, newX, newY, 'centroid', 0);
		this.scene.add.existing(pointSpite);
		pointSpite.setTrack(this);
		pointSpite.setInteractive();
		this.scene.input.setDraggable(pointSpite);
		this.linePoints.push(pointSpite);
	}

	public plot(tempX?, tempY?) {
		let x = [];
		let y = [];

		// TODO: Optimize: Call this only when a point changes
		for (let sprite of this.linePoints) {
			x.push(sprite.x);
			y.push(sprite.y);
		}

		if (tempX) {
			x.push(tempX);
		}
		if (tempY) {
			y.push(tempY);
		}

		this.graphics.clear();

		var ix = 0;

		//  100 points per path segment
		var dx = 1 / (x.length * 100);

		let path = [];

		for (var i = 0; i <= 1; i += dx)
		{
			let px = Phaser.Math.Interpolation.CatmullRom(x, i);
			let py = Phaser.Math.Interpolation.CatmullRom(y, i);

			var node = { x: px, y: py, angle: 0 };

			if (ix > 0)
			{
				Phaser.Math.Angle.BetweenPoints(path[ix - 1], node);
			}

			path.push(node);

			ix++;

			if (i === 0) {
				this.graphics.beginPath().moveTo(px, py);
			} else {
				this.graphics.lineTo(px, py);
			}
		}
		this.graphics.strokePath();

	}
}