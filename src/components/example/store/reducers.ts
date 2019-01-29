import { ExampleActions } from "./actions";
import { ExampleInitialState, ExampleStoreStateInterface } from "./state";
import { ActionReducer, GetAction, GetActionType, createReducers, GetType } from "../../../create-reducers";
import { ActionType, getType } from "typesafe-actions";
import { ActionCreator } from "typesafe-actions/dist/types";

type TExampleActions = ActionType<typeof ExampleActions>;
type ExampleReducer<P extends GetActionType<TExampleActions>> = ActionReducer<ExampleStoreStateInterface, TExampleActions, P>;
type ExampleAction<AT extends ActionCreator<any>> = GetAction<TExampleActions, GetType<AT>>;

const exampleActionSecondReducer: ExampleReducer<'ExampleActions/Second'> = (state, action) => {
    action.payload.example;
    return state;
}

createReducers<ExampleStoreStateInterface, TExampleActions>(ExampleInitialState, {
    // If I specify the full string version, state and action are perfectly defined.
    "ExampleActions/First": (state, action) => {
        action.payload.bar;
        return state;
    },
    // I can also 
    "ExampleActions/Second": exampleActionSecondReducer
});

export const exampleWithoutConstantReducer = (state: ExampleStoreStateInterface, action: ExampleAction<typeof ExampleActions.Second>) => {
    action.payload.example;
    return state;
}

const exampleBadReducer = (state: string, action: number) => {
    return Boolean;
}

createReducers<ExampleStoreStateInterface, TExampleActions>(ExampleInitialState, {
    // We expect indeed a transpilation error
    "ExampleActions/First": exampleBadReducer,

    "ExampleActions/Second": exampleWithoutConstantReducer
});

// This part, I want to remove usage of constant
createReducers<ExampleStoreStateInterface, TExampleActions>(ExampleInitialState, {
    // /!\ here state and action have implicit any
    [getType(ExampleActions.First)]: (state, action) => {
        action.payload.bar;
        return state;
    },
    // /!\ Even by enforcing type
    [getType(ExampleActions.Second) as GetType<typeof ExampleActions.Second>]: (state, action) => {
        action.blablabla;
        return state;
    },

    // /!\ I can have several time the same key
    [getType(ExampleActions.First)]: (state: ExampleStoreStateInterface, action: ExampleAction<typeof ExampleActions.First>) => {
        return state;
    },
});

createReducers<ExampleStoreStateInterface, TExampleActions>(ExampleInitialState, {
    // Here we have correctly the error as my action is from Second and not First
    [getType(ExampleActions.First)]: (state: ExampleStoreStateInterface, action: ExampleAction<typeof ExampleActions.Second>) => {
        return state;
    },
    [getType(ExampleActions.Second)]: (state: ExampleStoreStateInterface, action: ExampleAction<typeof ExampleActions.Second>) => {
        return state;
    }
});
