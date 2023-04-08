class Class {
	constructor() {
		this.name = "XLR-8";
	}

	getName() {
		return this.name;
	}
}

const object = new Class();

console.log(object.getName()); // "XLR-8"

const getName = object.getName;

console.log(getName()); // ERROR
