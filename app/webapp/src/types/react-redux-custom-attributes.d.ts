import { Action, AnyAction, Dispatch } from 'redux';

declare module 'react-redux' {
  /**
   * @deprecated use `useAppDispatch` instead
   * @example ```
   * import { useAppDispatch } from 'hooks';
   * ```
   */
  export function useDispatch<TDispatch = Dispatch<any>>(): TDispatch;
  /**
   * @deprecated use `useAppDispatch` instead
   * @example ```
   * import { useAppDispatch } from 'hooks';
   * ```
   */
  export function useDispatch<A extends Action = AnyAction>(): Dispatch<A>;

  /**
   * @deprecated use `useAppSelector` instead
   * @example ```
   * import { useAppSelector } from 'hooks';
   * ```
   */
  export function useSelector<TState = DefaultRootState, TSelected = unknown>(
    selector: (state: TState) => TSelected,
    equalityFn?: (left: TSelected, right: TSelected) => boolean
  ): TSelected;
}
