type Values = {
  value1: number;
  value2: number;
}

type Operation = (value1: number, value2: number) => number;

type ScientificOperation = (value: number) => number

type OperationsSupported = Record<string, Operation | ScientificOperation>


class OperationNotSupportedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OperationNotSupportedError";
  }
}


interface BasicCalculatorOperations {
  add: Operation
  substract: Operation
  multiply: Operation
  power: Operation
  divide: Operation
}


interface ScientificCalculatorOperations extends BasicCalculatorOperations{
  sin: ScientificOperation
  cos: ScientificOperation
  tan: ScientificOperation
}


interface Calculator {
  operations: OperationsSupported
  executeOperation(operation: string, { value1, value2 }: Values): number
}

interface SupportedOperations {
  operations
}

class BasicCalculatorOperationFn implements BasicCalculatorOperations {
  public add(value1: number, value2: number) {
    return value1 + value2;
  }

  public substract(value1: number, value2: number) {
    return value1 - value2;
  }

  public multiply(value1: number, value2: number) {
    return value1 * value2;
  }

  public power(value1: number, value2: number) {
    return value1 ** value2;
  }

  public divide(value1: number, value2: number) {
    return value1 / value2;
  }
  
}


class ScientificCalculatorOperationFn implements ScientificCalculatorOperations {
  private basicCalculatorOperations: BasicCalculatorOperations

  constructor(basicCalculatorFn: BasicCalculatorOperations) {
    this.basicCalculatorOperations = basicCalculatorFn

  }
  public add(value1: number, value2: number): number {
    return this.basicCalculatorOperations.add(value1, value2)
  }

  public substract(value1: number, value2: number): number {
    return this.basicCalculatorOperations.substract(value1, value2)
  }

  public multiply(value1: number, value2: number): number {
    return this.basicCalculatorOperations.multiply(value1, value2)
  }

  public power(value1: number, value2: number): number {
    return this.basicCalculatorOperations.power(value1, value2)
  }

  public divide(value1: number, value2: number): number {
    return this.basicCalculatorOperations.divide(value1, value2)
  }
  
  public sin(value: number): number {
    return Math.sin(value)
  }

  public cos(value: number): number {
    return Math.cos(value)
  }

  public tan(value: number): number {
    return Math.tan(value)
  }


}


class SupportedBasicCalculatorOperations {
  private _operations: OperationsSupported

  constructor(operations: BasicCalculatorOperations) {
    this._operations = {
      add: operations.add,
      substract: operations.substract,
      multiply: operations.multiply,
      power: operations.power,
      divide: operations.divide,
    }
  }

  public get getOperations(): OperationsSupported {
    return this._operations
  }


}

class SupportedScientificCalculatorOperations {
  private _operations: OperationsSupported

  constructor(operations: ScientificCalculatorOperations) {
    this._operations = {
      add: operations.add,
      substract: operations.substract,
      multiply: operations.multiply,
      power: operations.power,
      divide: operations.divide,
      sin: operations.sin,
      cos: operations.cos,
      tan: operations.tan,
    }

  }

  public get getOperations(): OperationsSupported { 
    return this._operations
  }

}

  
abstract class AbstractCalculator implements Calculator {
   operations: OperationsSupported;

     constructor(operations: OperationsSupported) {
       this.operations = operations;
     }

     public executeOperation(operation: string, { value1, value2 }: Values): number {
       const operationFn = this.operations[operation];
       if (!operationFn) {
         throw new OperationNotSupportedError(
           `Operation "${operation}" not supported, choice a valid operation [${Object.keys(this.operations).join(", ")}]`
         );
       }

       return operationFn(value1, value2);
     }
}

class BasicCalculator extends AbstractCalculator {
  constructor(operations: SupportedBasicCalculatorOperations) {
    super(operations.getOperations)
  }

}


class ScientificCalculator extends AbstractCalculator {
  constructor(operations: SupportedScientificCalculatorOperations) {
    super(operations.getOperations)

  }

}


class Main {
  public static main(): void {
    try {
      const operations = new BasicCalculatorOperationFn()
      const allOperations = new SupportedBasicCalculatorOperations(operations)
      const calculator = new BasicCalculator(allOperations)


      const basicOperations = new BasicCalculatorOperationFn();
      const scientificOperations = new ScientificCalculatorOperationFn(basicOperations);
      const allScientificOperations = new SupportedScientificCalculatorOperations(scientificOperations);
      const scientificCalculator = new ScientificCalculator(allScientificOperations);


      
      console.log(calculator.executeOperation("add", { value1: 10, value2: 20 }))
      console.log(calculator.executeOperation("multiply", { value1: 5, value2: 6 })); // Output: 30
      console.log(calculator.executeOperation("divide", { value1: 15, value2: 3 }));


      console.log(scientificCalculator.executeOperation("sin", { value1: Math.PI / 2, value2: 0 })); // Output: 1
      console.log(scientificCalculator.executeOperation("cos", { value1: 0, value2: 0 })); // Output: 1   
      console.log(scientificCalculator.executeOperation("tan", { value1: Math.PI / 4, value2: 0 })); // Output: 1
  } catch (err) {
    console.log(err)
  }

  }
}


Main.main()
