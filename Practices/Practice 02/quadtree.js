class Point {
    constructor (x, y, userData ){
        this.x = x;
        this.y = y;
        this.userData = userData ;
    }
}
class Rectangle {
    constructor (x, y, w, h){
        this.x = x; // center
        this.y = y;
        this.w = w; // half width
        this.h = h; // half height
    }

    // verifica si este objeto contiene un objeto Punto
    contains(point) {
        return (point.x >= this.x - this.w &&
        point.x <= this.x + this.w &&
        point.y >= this.y - this.h &&
        point.y <= this.y + this.h);
    }

    // verifica si este objeto se intersecta con otro objeto Rectangle
    intersects(range) {
        return !(range.x - range.w > this.x + this.w ||
        range.x + range.w < this.x - this.w ||
        range.y - range.h > this.y + this.h ||
        range.y + range.h < this.y - this.h);
    }
}

class QuadTree {
    constructor(boundary, n) {
        if (!boundary) {
            throw TypeError('boundary is null or undefined');
        }

        if (!(boundary instanceof Rectangle)) {
            throw TypeError('boundary should be a Rectangle');
        }

        if (typeof n !== 'number') {
            throw TypeError(`capacity should be a number but is a ${typeof n}`);
        }

        if (n < 1) {
            throw RangeError('capacity must be greater than 0');
        }
        
        this.boundary = boundary; // Rectangule
        this.capacity = n; // Capacidad maxima de cada cuadrante
        this.points = []; // Vector, almacena los punto a almacenar
        this.divided = false;
    }

    // Divide el quadtree en 4 quadtrees
    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w / 2;
        let h = this.boundary.h / 2;

        // 1:  Creamos 4 hijos : qt_northeast  , qt_northwest,qt_southeast  , qt_southwest
        let qt_northeast = new Rectangle(x + w, y - h, w, h);
        let qt_northwest = new Rectangle(x - w, y - h, w, h);
        let qt_southeast = new Rectangle(x + w, y + h, w, h);
        let qt_southwest = new Rectangle(x - w, y + h, w, h);

        // 2:  Asignamos  los  QuadTree  creados a cada  hijo
        this.northeast = new QuadTree(qt_northeast, this.capacity);
        this.northwest = new QuadTree(qt_northwest, this.capacity);
        this.southeast = new QuadTree(qt_southeast, this.capacity);
        this.southwest = new QuadTree(qt_southwest, this.capacity);

        // 3. - Hacemos : this . divided  <- true
        this.divided = true;
    }

    insert(point) {
        // 1: Si el  punto no esta en los  limites ( boundary )del quadtree  Return
        if (!this.boundary.contains(point)) {
            return false;
        }

        // 2: Si ( this . points . length ) < ( this . capacity),
        if (this.points.length < this.capacity) {
            this.points.push(point); // 2.1  Insertamos  en el  vector  this . points
            return true;
        }
        else{ 
            // 2.2  Dividimos  si aun no ha sido  dividido
            if (!this.divided) {
                this.subdivide();
            }
            
            // 2.3  Insertamos en los 4 hijos
            if (this.northeast.insert(point) || this.northwest.insert(point) ||
                this.southeast.insert(point) || this.southwest.insert(point)) {
                return true;
            }
        }
    }

    show () {
        stroke(255) ;
        strokeWeight(1) ;
        noFill() ;
        rectMode( CENTER );
        rect( this.boundary.x, this.boundary.y, this.boundary.w * 2 , this.boundary.h * 2) ;
        if( this.divided ){
            this.northeast.show();
            this.northwest.show();
            this.southeast.show();
            this.southwest.show();
        }
        for (let p of this.points ){
            strokeWeight(4) ;
            point(p.x, p.y);
        }
    }
}