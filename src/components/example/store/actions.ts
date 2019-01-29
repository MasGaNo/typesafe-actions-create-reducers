import { createStandardAction } from "typesafe-actions";

export const ExampleActions = {
    First: createStandardAction('ExampleActions/First')<{foo: string, bar: string}>(),
    Second: createStandardAction('ExampleActions/Second')<{example: number, test: string}>()
};
