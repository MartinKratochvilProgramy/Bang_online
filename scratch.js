const namesOfCharacters = [{name: "Bart Cassidy", health: 4}, {name: "Black Jack", health: 4}, {name: "Calamity Janet", health: 69}, {name: "El Gringo", health: 4}] 


console.log(namesOfCharacters.findIndex(character => {return (character.name === "Calamity Janet")}));