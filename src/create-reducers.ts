import { ActionType } from "typesafe-actions";
import { ActionCreator, TypeMeta } from "typesafe-actions/dist/types";

/**
 * Like getType, but for definition.
 */
export type GetType<T extends ActionCreator<any> & TypeMeta<any>> = ReturnType<T> extends {type: any} ? ReturnType<T>['type'] : never;

/**
 * Get the list of all type from a list of actions
 */
export type GetActionType<T extends ActionType<any>> = T['type'];

/**
 * Get the complete action from a specific type
 */
export type GetAction<T extends ActionType<any>, P extends GetActionType<T>> = T extends { type: P } ? T : never;

/**
 * Return an action reducer definition
 */
export type ActionReducer<S, AT extends ActionType<any>, P extends GetActionType<AT>> = (state: S, action: GetAction<AT, P>) => S;

/**
 * Create a reducers from a defined handlerMap
 * @param initialState 
 * @param handlersMap 
 */
export function createReducers<S, T extends ActionType<any>>(
    initialState: S,
    handlersMap: {
        [P in GetActionType<T>]?: ActionReducer<S, T, P>;
    }
) {
    return function <P extends GetActionType<T>>(state: S = initialState, action: GetAction<T, P>) {
        if (handlersMap.hasOwnProperty(action.type)) {
            // Cannot find a way to handle this error.
            return handlersMap[action.type]!(state, action);
        }
        return state;
    }
}