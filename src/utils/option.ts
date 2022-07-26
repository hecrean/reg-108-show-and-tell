import { noop } from "svelte/internal";

export interface Some<A> {
  readonly _tag: "some";
  readonly value: A;
}
export const some = <T>(v: T): Some<T> => ({ _tag: "some", value: v });
export const isSome = <A>(fa: Option<A>): fa is Some<A> => fa._tag === "some";
export interface None {
  readonly _tag: "none";
}
export const none: None = { _tag: "none" };
export const isNone = (fa: Option<unknown>): fa is None => fa._tag === "none";

export type Option<A> = Some<A> | None;

export const mapO: <A, B>(f: (a: A) => B) => (fa: Option<A>) => Option<B> =
  (f) => (fa) =>
    isNone(fa) ? none : some(f(fa.value));

export const tapO: <A>(f: (a: A) => void) => (fa: Option<A>) => void =
  (f) => (fa) =>
    isNone(fa) ? noop() : f(fa.value);
