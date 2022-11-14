const arr = [1, 1, 2]

class Object{
    constructor(arr) {
        this.arr = [...arr]
    }
    
    shuffle() {
        this.arr[1] = 3;
        this.arr[2] = 4;
    }

    getArr() {
        return this.arr
    }
}

const obj1 = new Object(arr);
const obj2 = new Object(arr);

obj1.shuffle();

console.log(obj1.getArr());
console.log(obj2.getArr());