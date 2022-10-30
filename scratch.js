console.log("pět = ", 5)

class Game {
    constructor(variable) {
        this.variable = variable;
    }

    printVariable() {
        console.log(this.variable);
    }
}

const game = Game("variable");