const testVariable = "12345678910";

class Test{
    constructor(number1, number2){
        this.num1 = number1;
        this.num2 = number2;
    }

    printTotal(){
        console.log(this.num1 + this.num2);
    }
}