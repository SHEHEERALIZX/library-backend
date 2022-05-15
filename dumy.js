let data = [
  ["Name", "admno", "password"],
  ["sheheer", "12009", "sheheer@123"],
  ["Afsal", "12889", "afsal@123"],
];

let result = [
  {
    Name: "Sheheer",
    admno: "12009",
    password: "sheheer@123",
  },
  {
    Name: "Afsal",
    admno: "12889",
    password: "afsal@123",
  },
];

const map = (k, v) =>
  v.map((i) => 
  i.reduce((m, v, j) => ({ ...m, [k[j]]: v }), {}));


let hai = map(data[0], data.slice(1));

// console.log(data.slice(1));


console.log(hai);