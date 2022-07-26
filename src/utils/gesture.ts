import { fromEvent, Observable } from 'rxjs';
import {
	buffer,
	debounceTime,
	filter,
	map,
	mergeWith,
	scan,
	share,
	switchMap,
	takeUntil,
	tap
} from 'rxjs/operators';

type InputSurface = HTMLCanvasElement | HTMLDivElement;

type PointerEventTag =
	| 'pointercancel'
	| 'pointerdown'
	| 'pointerenter'
	| 'pointerleave'
	| 'pointermove'
	| 'pointerout'
	| 'pointerover'
	| 'pointerup';

type EventTag = keyof HTMLElementEventMap;
type EventFromEventTag<K extends EventTag> = HTMLElementEventMap[K];

interface TaggedEvent<K extends EventTag, El extends InputSurface = InputSurface> {
	tag: K;
	element: El;
	event: HTMLElementEventMap[K];
}

const mkObservable = <K extends EventTag, El extends InputSurface>(
	el: El,
	tag: K
): Observable<TaggedEvent<K, El>> => {
	return fromEvent<EventFromEventTag<K>>(el, tag).pipe(
		map((ev) => ({ tag: tag, element: el, event: ev }))
	);
};

/**
 *
 *  First order observables (pointer, wheel, keyboard)
 *
 */

const pointerdown = (el: InputSurface) => mkObservable(el, 'pointerdown').pipe(share());
const pointerup = (el: InputSurface) => mkObservable(el, 'pointerup').pipe(share());
const pointermove = (el: InputSurface) => mkObservable(el, 'pointermove').pipe(share());

const wheel = (el: InputSurface) => mkObservable(el, 'wheel').pipe(share());
const resize = (el: InputSurface) => mkObservable(el, 'resize').pipe(share());
const keyup = (el: InputSurface) => mkObservable(el, 'keyup').pipe(share());
const keydown = (el: InputSurface) => mkObservable(el, 'keydown').pipe(share());
const keypress = (el: InputSurface) => mkObservable(el, 'keypress').pipe(share());

enum Direction {
	None = 0,
	Up = 1 << 0, // 0001 -- the bitshift is unnecessary, but done for consistency
	Down = 1 << 1, // 0010
	Left = 1 << 2, // 0100
	Right = 1 << 3, // 1000
	All = ~(~0 << 4) // 1111
}

// @TODO
const filterDirections = (direction: Direction, dx: number, dy: number) => {
	switch (direction) {
		case Direction.None:
			return false;
		case Direction.All:
			return true;
		case Direction.Left:
			return true;
		case Direction.Right:
			return true;
		case Direction.Up:
			return dy < 0 && dx < Math.abs(0.2);
		case Direction.Down:
			return dy > 0 && dx < Math.abs(0.2);
		case Direction.Up | Direction.Down:
			return dy < 0 || (dy > 0 && dx < Math.abs(0.2));
		case Direction.Left | Direction.Right:
			return dy < 0 || (dy > 0 && dx < Math.abs(0.2));
		case Direction.Up | Direction.Right:
			return true;
		case Direction.Up | Direction.Left:
			return true;
		case Direction.Down | Direction.Right:
			return true;
		case Direction.Down | Direction.Left:
			return true;
		case Direction.Up | Direction.Down | Direction.Left:
			return true;
		case Direction.Up | Direction.Down | Direction.Right:
			return true;
		case Direction.Up | Direction.Left | Direction.Right:
			return true;
		case Direction.Down | Direction.Left | Direction.Right:
			return true;
	}
};

type Range = {
	min: number;
	max: number;
};

/**
 *
 *  Gestures (composed from first order observables)
 *
 */

interface DragParams {
	pointers: number;
}

interface Tap {
	readonly _tag: 'Tap';
	readonly value: {
		dx: number;
		dy: number;
	};
}

interface DoubleTapParams {
	pointers: 1;
	threshold: { timeBetweenTaps: Range };
}

interface DoubleTap {
	readonly _tag: 'DoubleTap';
	readonly value: {
		dx: number;
		dy: number;
	};
}

/**
 * Recognized when the pointer is down and moved in the allowed direction.
 */
interface DragParams {
	pointers: number;
	threshold: { distancePointerMoved: Range };
	direction: Direction;
}
interface Drag {
	readonly _tag: 'Drag';
	readonly value: {
		dt: number;
		dP_Normal: number;
		dP_Tangential: number;
		dA: number;
		dTiltX: number;
		dTiltY: number;
		dTwist: number;
		dNormalisedDeviceCoords: {
			dx: number;
			dy: number;
		};
		dPixelCoords: {
			dx: number;
			dy: number;
		};
	};
}
/**
 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
 */
interface SwipeParams {
	pointers: 1;
	direction: Direction;
	thresholds: {
		pointerVelocity: Range;
		distancePointerMoved: Range;
	};
}

interface Swipe {
	readonly _tag: 'Swipe';
}

interface PressParams {
	pointers: 1;
	thresholds: {
		pointerPressure: Range;
		pointerTangentialPressure: Range;
		timePointerPressed: Range;
		distancePointerMoved: Range;
	};
}
interface Press {
	readonly _tag: 'Press';
	readonly value: {
		dx: number;
		dy: number;
	};
}

interface PinchParams {
	pointers: 2;
	threshold: {
		scaling: Range;
	};
}
interface Pinch {
	readonly _tag: 'Pinch';
	readonly value: {
		magnitude: number;
	};
}

interface RotateParams {
	pointers: 2;
	threshold: {
		rotation: Range;
	};
}
interface Rotate {
	readonly _tag: 'Rotate';
	readonly value: {
		rotationZ: number;
	};
}

const coordinates = ({ element, event, tag }: TaggedEvent<PointerEventTag>) => {
	const rect = element.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;

	return {
		ndc: {
			x: (x / rect.width) * 2 - 1,
			y: (y / rect.height) * -2 + 1
		},
		pixel: {
			x: x,
			y: y
		}
	};
};

const pointerDifference = (
	pointer1: TaggedEvent<PointerEventTag>,
	pointer2: TaggedEvent<PointerEventTag>
) => {
	const pointer1Coords = coordinates(pointer1);
	const pointer2Coords = coordinates(pointer2);

	return {
		dt: pointer2.event.timeStamp - pointer1.event.timeStamp,
		dP_Normal: pointer2.event.pressure - pointer1.event.pressure,
		dP_Tangential: pointer2.event.tangentialPressure - pointer1.event.tangentialPressure,
		dA: pointer2.event.width * pointer2.event.height - pointer1.event.width * pointer1.event.height,
		dTiltX: pointer2.event.tiltX - pointer1.event.tiltX,
		dTiltY: pointer2.event.tiltY - pointer1.event.tiltY,
		dTwist: pointer2.event.twist - pointer1.event.twist,
		dNormalisedDeviceCoords: {
			dx: pointer2Coords.ndc.x - pointer1Coords.ndc.x,
			dy: pointer2Coords.ndc.y - pointer1Coords.ndc.y
		},
		dPixelCoords: {
			dx: pointer2Coords.pixel.x - pointer1Coords.pixel.x,
			dy: pointer2Coords.pixel.y - pointer1Coords.pixel.y
		}
	};
};

// Composed Observables :
/**not suitable for multitouch. */
const mousedrag = (el: InputSurface, { direction, threshold }: DragParams): Observable<Drag> => {
	const pointerdown$ = pointerdown(el);
	const pointermove$ = pointermove(el);

	return pointerdown$.pipe(
		switchMap((down) =>
			pointermove$.pipe(
				tap((move) => move.event.preventDefault()),
				filter((move) => move.event.pointerId === down.event.pointerId),
				map((move) => pointerDifference(down, move)),
				// filter(
				//   ({ dNormalisedDeviceCoords: { dx, dy } }) =>
				//     Math.sqrt(dx * dx + dy * dy) < threshold.distancePointerMoved.min &&
				//     Math.sqrt(dx * dx + dy * dy) < threshold.distancePointerMoved.max
				// ),
				takeUntil(pointerup(el).pipe(filter((up) => up.event.pointerId === down.event.pointerId)))
			)
		),
		map((v) => ({ _tag: 'Drag', value: v }))
	);
};

type CacheEntry = Array<TaggedEvent<PointerEventTag>>;

const pointerCache = (el: InputSurface) => {
	const pointerdown$ = pointerdown(el);
	const pointerup$ = pointerup(el);
	const pointermove$ = pointermove(el);

	return pointerdown$.pipe(mergeWith(pointerup$, pointermove$)).pipe(
		tap((obs) => obs.event.preventDefault()),
		scan((cache, o) => {
			switch (o.tag) {
				case 'pointerdown':
					cache.set(`${o.event.pointerId}`, [o, o]);
					return cache;
				case 'pointermove': {
					const cacheEntry = cache.get(`${o.event.pointerId}`);
					if (cacheEntry) {
						cache.set(`${o.event.pointerId}`, [...cacheEntry, o]);
					}
					return cache;
				}
				case 'pointerup':
					cache.delete(`${o.event.pointerId}`);
					return cache;
			}
		}, new Map<string, CacheEntry>())
	);
};

const pinch = (el: InputSurface, { pointers }: PinchParams): Observable<Pinch> => {
	const pointerCache$ = pointerCache(el);

	// This calculates the absolute difference between the initial 'closeness' of the pointers, and the current pointers. The centroid
	// is recalculated when new pointers are added.
	const pinchOffset = ([point1, point2]: [CacheEntry, CacheEntry]) => {
		const { x: x1_i, y: y1_i } = coordinates(point1[point1.length - 2]).ndc;
		const { x: x2_i, y: y2_i } = coordinates(point1[point2.length - 2]).ndc;
		const { x: x1_f, y: y1_f } = coordinates(point1[point1.length - 1]).ndc;
		const { x: x2_f, y: y2_f } = coordinates(point2[point2.length - 1]).ndc;

		return (
			Math.sqrt((x2_f - x1_f) * (x2_f - x1_f) + (y2_f - y1_f) * (y2_f - y1_f)) -
			Math.sqrt((x2_i - x1_i) * (x2_i - x1_i) + (y2_i - y1_i) * (y2_i - y1_i))
		);
	};

	return pointerCache$.pipe(
		map((cache) => Array.from(cache, ([key, value]) => value)),
		filter((arr) => arr.length === 2),
		map(([point1, point2]) => pinchOffset([point1, point2])),
		map((v) => ({ _tag: 'Pinch', value: { magnitude: v } }))
	);
};

const pointerPosition = (el: InputSurface) => {
	const pointermove$ = pointermove(el);
	return pointermove$.pipe(map(coordinates), share());
};

const drag = (el: InputSurface, { direction, threshold }: DragParams): Observable<Drag> => {
	const pointerCache$ = pointerCache(el);

	return pointerCache$.pipe(
		map((cache) => Array.from(cache, ([key, value]) => value)),
		filter((arr) => arr.length === 1),
		map(([cacheEntry]) =>
			pointerDifference(cacheEntry[cacheEntry.length - 2], cacheEntry[cacheEntry.length - 1])
		),
		// ease({

		// }),
		map((v) => ({ _tag: 'Drag', value: v }))
	);
};

// const longpress = (el: InputSurface) => {
//   const pointerdown$ = pointerdown(el);
//   const pointerup$ = pointerup(el);
//   const pointermove$ = pointermove(el);

//   return pointerdown$.pipe(
//     mergeMap((e) => {
//       return of(e).pipe(delay(2000), takeUntil(pointerup$));
//     })
//   );
// };

const doubletap = (el: InputSurface) => {
	const pointerdown$ = pointerdown(el);

	return pointerdown$.pipe(
		buffer(pointerdown$.pipe(debounceTime(250))),
		map((tap) => tap.length),
		filter((tapsLength) => tapsLength === 2)
	);
};

type MultiTouchGestures = Tap | DoubleTap | Drag | Swipe | Press | Pinch | Rotate;

export { pinch, drag, pointerPosition, Direction, doubletap, wheel, resize };
