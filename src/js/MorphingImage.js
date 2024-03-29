class MorphingImage {
    constructor(image, points, faces) {
        this.domElement = image;

        this.originalPoints = points;
        this.points = []; //描画する際の動的な座標
        this._clonePoints();

        this.faces = faces;

        this.container = new createjs.Container();
        this._addBitmaps();

        return this;
    }
    _clonePoints() {
        this.originalPoints.forEach((point, index) => { //対応する座標を保持する
            this.points[index] = {x: point.x, y: point.y};
        });
    }
    _addBitmaps() {
        this.faces.forEach((face) => {
            var bmp = new createjs.Bitmap(this.domElement);
            var shape = new createjs.Shape();
            shape.graphics.moveTo(this.points[face[0]].x, this.points[face[0]].y)
                .lineTo(this.points[face[1]].x, this.points[face[1]].y)
                .lineTo(this.points[face[2]].x, this.points[face[2]].y);
            bmp.mask = shape;
            this.container.addChild(bmp);
        });
    }
    setAlpha(a) {
        this.container.alpha = a;
    }
    update() {
        //アフィン変換行列を求め、パーツを描画
        this.faces.forEach((face, index) => {
            var points1 = [this.originalPoints[face[0]], this.originalPoints[face[1]], this.originalPoints[face[2]]];
            var points2 = [this.points[face[0]], this.points[face[1]], this.points[face[2]]];
            var matrix = this._getAffineTransform(points1, points2);
            this.container.children[index].transformMatrix = this.container.children[index].mask.transformMatrix = matrix;
        });
    }
    _getAffineTransform(points1, points2){
        var a, b, c, d, tx, ty;

        // 連立方程式を解く
        a = (points2[0].x * points1[1].y + points2[1].x * points1[2].y + points2[2].x * points1[0].y - points2[0].x * points1[2].y - points2[1].x * points1[0].y - points2[2].x * points1[1].y) / (points1[0].x * points1[1].y + points1[1].x * points1[2].y + points1[2].x * points1[0].y - points1[0].x * points1[2].y - points1[1].x * points1[0].y - points1[2].x * points1[1].y);
        b = (points2[0].y * points1[1].y + points2[1].y * points1[2].y + points2[2].y * points1[0].y - points2[0].y * points1[2].y - points2[1].y * points1[0].y - points2[2].y * points1[1].y) / (points1[0].x * points1[1].y + points1[1].x * points1[2].y + points1[2].x * points1[0].y - points1[0].x * points1[2].y - points1[1].x * points1[0].y - points1[2].x * points1[1].y);
        c = (points1[0].x * points2[1].x + points1[1].x * points2[2].x + points1[2].x * points2[0].x - points1[0].x * points2[2].x - points1[1].x * points2[0].x - points1[2].x * points2[1].x) / (points1[0].x * points1[1].y + points1[1].x * points1[2].y + points1[2].x * points1[0].y - points1[0].x * points1[2].y - points1[1].x * points1[0].y - points1[2].x * points1[1].y);
        d = (points1[0].x * points2[1].y + points1[1].x * points2[2].y + points1[2].x * points2[0].y - points1[0].x * points2[2].y - points1[1].x * points2[0].y - points1[2].x * points2[1].y) / (points1[0].x * points1[1].y + points1[1].x * points1[2].y + points1[2].x * points1[0].y - points1[0].x * points1[2].y - points1[1].x * points1[0].y - points1[2].x * points1[1].y);
        tx = (points1[0].x * points1[1].y * points2[2].x + points1[1].x * points1[2].y * points2[0].x + points1[2].x * points1[0].y * points2[1].x - points1[0].x * points1[2].y * points2[1].x - points1[1].x * points1[0].y * points2[2].x - points1[2].x * points1[1].y * points2[0].x) / (points1[0].x * points1[1].y + points1[1].x * points1[2].y + points1[2].x * points1[0].y - points1[0].x * points1[2].y - points1[1].x * points1[0].y - points1[2].x * points1[1].y);
        ty = (points1[0].x * points1[1].y * points2[2].y + points1[1].x * points1[2].y * points2[0].y + points1[2].x * points1[0].y * points2[1].y - points1[0].x * points1[2].y * points2[1].y - points1[1].x * points1[0].y * points2[2].y - points1[2].x * points1[1].y * points2[0].y) / (points1[0].x * points1[1].y + points1[1].x * points1[2].y + points1[2].x * points1[0].y - points1[0].x * points1[2].y - points1[1].x * points1[0].y - points1[2].x * points1[1].y);

        var matrix = new createjs.Matrix2D(a, b, c, d, tx, ty);
        return matrix;
    }
}

export default MorphingImage;