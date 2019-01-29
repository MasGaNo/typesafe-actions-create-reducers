import { ActionType } from "typesafe-actions";
import { ActionCreator, TypeMeta, StringType, ActionCreatorMap } from "typesafe-actions/dist/types";

type TActionCreator = ActionCreator<StringType> | ActionCreatorMap<{}>;

/**
 * Like getType, but for definition.
 */
export type GetType<T extends ActionCreator<StringType>> = ReturnType<T> extends {type: StringType} ? ReturnType<T>['type'] : never;

/**
 * Get the list of all type from a list of actions
 */
export type GetActionType<T extends ActionType<TActionCreator>> = T['type'];

/**
 * Get the complete action from a specific type
 */
export type GetAction<T extends ActionType<TActionCreator>, P extends GetActionType<T>> = T extends { type: P } ? T : never;

/**
 * Return an action reducer definition
 */
export type ActionReducer<S, AT extends ActionType<TActionCreator>, P extends GetActionType<AT>> = (state: S, action: GetAction<AT, P>) => S;

/**
 * Create a reducers from a defined handlerMap
 * @param initialState 
 * @param handlersMap 
 */
export function createReducers<S, T extends ActionType<TActionCreator>>(
    initialState: S,
    handlersMap: {
        [P in GetActionType<T>]?: ActionReducer<S, T, P>;
    }
) {
    return function <P extends GetActionType<T>>(state: S = initialState, action: GetAction<T, P>) {
        if (handlersMap.hasOwnProperty(action.type)) {
            return handlersMap[action.type]!(state, action);
        }
        return state;
    }
}
