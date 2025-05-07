import { faker } from "@faker-js/faker";
import { ICategories, ITransaction } from "./types";
import { collection, CollectionReference, doc, DocumentReference, getFirestore, setDoc } from "firebase/firestore";
import { app } from "./firebase";
import { User } from "firebase/auth";

export const mockTransaction = (): ITransaction => {
	// Randomly choose between "needs", "wants" and "savings"
	const categories = ["needs", "wants", "savings"];
	const spendings = [-100, -100, -100, -500, -500, -500, -500, -100, -200, -300, -400, -500];

	return {
		transactionId: faker.string.uuid(),
		//amount: faker.number.int({ min: -5000, max: 10000, }),
		amount: faker.helpers.arrayElement(spendings),
		currency: "INR",
		date: new Date(),
		category: faker.helpers.arrayElement(categories),
		description: faker.lorem.word({
			length: {
				min: 1,
				max: 3,
			}
		}),
		paymentMethod: faker.lorem.word(),
		isRecurring: faker.datatype.boolean(),
		recurringInterval: faker.number.int({
			min: 1,
			max: 30,
		}),
	}
}

export const mockTransactionList = (): ITransaction[] => {
	const transactions: ITransaction[] = [{
		transactionId: faker.string.uuid(),
		//amount: faker.number.int({ min: -5000, max: 10000, }),
		amount: 15000,
		currency: "INR",
		date: new Date(),
		category: "income",
		description: "By Salary",
		paymentMethod: faker.lorem.word(),
		isRecurring: faker.datatype.boolean(),
		recurringInterval: faker.number.int({
			min: 1,
			max: 30,
		}),
	}]
	for (let i = 0; i < 10; i++) {
		transactions.push(mockTransaction())
	}

	return transactions
}

export const generateFirestoreData = (user: User) => {
	const collRef = collection(getFirestore(app), "tenants", user.tenantId as string, "users", user.uid, "categories");
	ICategories.map((cat) => {
		setDoc(doc(collRef, cat.categoryId), cat);
	});
}
