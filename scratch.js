const boolean = true

const char = new function () {
        return(
            this.maxHealth = 2,
            this.health = this.maxHealth + (boolean ? 1 : 0)
        )
}

console.log(char);