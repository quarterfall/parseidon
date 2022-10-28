import { hello } from "./hello";

test("Is a Hello world string", () => {
    expect(hello).toBe("Hello world");
});
