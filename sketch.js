let fundoImagem;
let bolaImagem;
let jogadorImagem;
let computadorImagem;
let golSom;
let raqueteSom;

let pontosJogador = 0;
let pontosComputador = 0;


class Raquete {
    constructor(x) {
        this.x = x;
        this.y = height / 2;
        this.w = 15;
        this.h = 80;
    }

    update() {
        //Se a raquete é o jogador
        if (this.x < width / 2) {
            this.y = mouseY;
        } else {
            //Se a bola está acima da raquete
            if (bola.y < this.y) {
                this.y -= 3;
            } else {
                this.y += 3;
            }
        }
        //this.y = mouseY;
        if (this.y < 0) {
            this.y = 0;
        } else if (this.y + this.h > height) {
            this.y = height - this.h;
        }
    }

    desenha() {

        //Se a raquete é o jogador
        if (this.x < width / 2) {
            image(jogadorImagem, this.x, this.y, this.w, this.h);
        } else {
            image(computadorImagem, this.x, this.y, this.w, this.h);
        }

    }
}

class Bola {
    constructor() {
        this.raio = 16;
        this.reset();
    
    }

    reset() {
        this.x = width / 2;
        this.y = height / 2;
        this.xSpeed = Math.random() * 10 - 5;
        this.ySpeed = Math.random() * 10 - 5;

        this.angle = 0;
     
    }

    update() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;

        this.angle += this.xSpeed / 25;

        if (this.x - this.raio < 0 || this.x + this.raio > width) {
            //Se a bola passar da raquete do jogador
            if (this.x < width / 2) {
                pontosComputador++;
            } else {
                pontosJogador++;
            }
            golSom.play();
            falaPontos();
            this.reset();
        }

        if (this.y - this.raio < 0 || this.y + this.raio > height) {
            this.ySpeed *= -1;
        }

        if (colisaoCirculoRetangulo(this.x, this.y, this.raio, jogador.x, jogador.y, jogador.w, jogador.h) ||
            colisaoCirculoRetangulo(this.x, this.y, this.raio, computador.x, computador.y, computador.w, computador.h)) {
            raqueteSom.play();
            this.xSpeed *= -1;
            this.xSpeed *= 1.1;
            this.ySpeed *= 1.1;
        }

    }

    draw() {
        //rotaciona antes de desenhar
        push();
        translate(this.x, this.y);
        rotate(this.angle);
        imageMode(CENTER);
        image(bolaImagem, 0, 0, this.raio * 2, this.raio * 2);
        pop();

        
        
    }
}

function colisaoCirculoRetangulo(cx, cy, raio, x, y, w, h) {
    let testX = cx;
    let testY = cy;

    if (cx < x) {
        testX = x;
    } else if (cx > x + w) {
        testX = x + w;
    }

    if (cy < y) {
        testY = y;
    } else if (cy > y + h) {
        testY = y + h;
    }

    let distX = cx - testX;
    let distY = cy - testY;
    let distance = sqrt((distX * distX) + (distY * distY));

    if (distance <= raio) {
        return true;
    }
    return false;
}

// Variável global para a bola
let bola;
let jogador;
let computador;

function falaPontos() {
    let voz = new SpeechSynthesisUtterance();
    voz.text = pontosJogador + " a " + pontosComputador;
    voz.lang = "pt-BR";
    voz.rate = 1;
    speechSynthesis.speak(voz);
}

function preload() {
    fundoImagem = loadImage('./assets/fundo1.png');
    bolaImagem = loadImage('./assets/bola.png');
    jogadorImagem = loadImage('./assets/barra01.png');
    computadorImagem = loadImage('./assets/barra02.png');
    golSom = loadSound('./assets/gol.mp3');
    raqueteSom = loadSound('./assets/raquetesom.mp3');
}

function setup() {
    background(255)
    createCanvas(1280, 680);
    bola = new Bola(200, 200, 25);
    jogador = new Raquete(30);
    computador = new Raquete(width - 30 - 10);
}

function draw() {
    let canvasAspectRatio = width / height;
    let aspectRatio = fundoImagem.width / fundoImagem.height;
    let zoom = 1;
    if (canvasAspectRatio > aspectRatio) {
        zoom = width / fundoImagem.width;
    } else {
        zoom = height / fundoImagem.height;
    }
    let scaledWidth = fundoImagem.width * zoom;
    let scaledHeight = fundoImagem.height * zoom;
    image(fundoImagem, (width - scaledWidth) / 2, (height - scaledHeight) / 2, scaledWidth, scaledHeight);


    bola.update();
    bola.draw();
    jogador.update();
    jogador.desenha();
    computador.update();
    computador.desenha();
}