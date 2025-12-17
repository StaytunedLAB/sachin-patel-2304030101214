let marks = parseInt(prompt("Enter marks: "));
let grade;

switch (true) {
    case marks >= 90: grade = "A"; break;
    case marks >= 80: grade = "B"; break;
    case marks >= 70: grade = "C"; break;
    case marks >= 60: grade = "D"; break;
    case marks >= 50: grade = "E"; break;
    default: grade = "F";
}

console.log("Your Grade is: " + grade);

