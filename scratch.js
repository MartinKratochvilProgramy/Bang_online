const str = "Rev.Carabine"

const cardSource = str.replace(/!/, '').replace(/\s/, '').replace(/\./g, '')+ ".png"

console.log(cardSource);