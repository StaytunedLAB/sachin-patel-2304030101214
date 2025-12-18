let year = parseInt(prompt("Enter a year: "));

if ((year % 400 == 0) || (year % 4 == 0 && year % 100 != 0))
    console.log(year + " is a Leap Year");
else
    console.log(year + " is Not a Leap Year");

