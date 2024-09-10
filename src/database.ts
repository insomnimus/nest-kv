function isObj(x: any): x is object {
	return x !== null && typeof x === "object" && !Array.isArray(x);
}

export class Database {
	#db: Map<string, any>;

	constructor() {
		this.#db = new Map();
	}

	getAll(): ReadonlyMap<string, any> {
		return this.#db;
	}

	get(key: string): any | undefined {
		return this.#db.get(key);
	}

	set(key: string, val: any) {
		this.#db.set(key, val);
	}

	remove(key: string): boolean {
		return this.#db.delete(key);
	}

	// Merges 2 objects and saves to the database.
	setFields(key: string, obj: Record<string, any>) {
		const o = this.get(key);
		if (o === undefined || o === null || !isObj(o)) {
			this.set(key, obj);
			return;
		}

		// This takes care of updating the value in this.#db.
		Object.assign(o, obj);
	}

	getFields(key: string, fields: string[]): Record<string, any> | null {
		const o = this.get(key);
		if (o === undefined) {
			return null;
		} else if (!isObj(o)) {
			return {};
		}

		const res: Record<string, any> = {};
		for (const field of fields) {
			res[field] = (o as Record<string, any>)[field];
		}

		return res;
	}
}
