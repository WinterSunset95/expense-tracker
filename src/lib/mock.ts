import { faker } from "@faker-js/faker";
import { ITransaction } from "./types";

export const mockTransaction = (): ITransaction => {
	const randomParentCategory = Math.floor(Math.random() * 3) + 1;
	return {
		transactionId: faker.string.uuid(),
		amount: faker.number.int({
			min: -10000,
			max: 10000,
		}),
		currency: "INR",
		date: Date.now(),
		category: faker.lorem.word(),
		parentCategory: randomParentCategory.toString() as "1" | "2" | "3",
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
	const transactions: ITransaction[] = []
	for (let i = 0; i < 50; i++) {
		transactions.push(mockTransaction())
	}

	return transactions
}
