const arr = [
    {key: "value"},
    {key: "value2"}
]

const index = arr.findIndex(item => item.key ==="value");
const value = arr.splice(index, 1);
console.log(index);
console.log(value);