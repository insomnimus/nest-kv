import {
	Controller,
	Delete,
	Get,
	Header,
	Put,
	Body,
	Query,
	Param,
} from "@nestjs/common";
import { Database } from "./database";

const db = new Database();
for (const [k, v] of Object.entries({
	turkey: {
		continent: "asia",
		capital: "ankara",
		languages: ["turkish"],
		population: 85372377,
	},
	uk: {
		continent: "europe",
		capital: "london",
		languages: ["english"],
		population: 67596281,
	},
	canada: {
		continent: "north america",
		capital: "ottawa",
		languages: ["english", "french"],
		population: 41012563,
	},
	finland: {
		continent: "europe",
		capital: "helsinki",
		languages: ["finnish"],
		population: 5603851,
	},
})) {
	db.set(k, v);
}

@Controller("api")
export class ApiController {
	@Get("get/:key")
	@Header("content-type", "application/json")
	getValue(@Param("key") key: string, @Query("fields") fields: string): string {
		if ((fields ?? "") != "") {
			const x = db.getFields(key, fields.split(","));
			return JSON.stringify(x);
		}

		const x = db.get(key) ?? null;
		return JSON.stringify(x);
	}

	@Put("set/:key")
	setValue(@Param("key") key: string, @Body() value: any) {
		db.set(key, value);
	}

	@Put("append/:key")
	appendValue(@Param("key") key: string, @Body() obj: Record<string, any>) {
		db.setFields(key, obj);
	}

	@Delete("delete/:key")
	deleteKey(@Param("key") key: string) {
		db.remove(key);
	}
}
