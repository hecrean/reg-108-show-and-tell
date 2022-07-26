export enum BreakPoint {
	xxxs = 200,
	// screen fragment
	xxs = 400,
	// Small tablets and large smartphones (landscape view)
	xs = 576,
	// Small tablets (portrait view)
	sm = 768,
	// Tablets and small desktops
	md = 992,
	// Large tablets and desktops
	lg = 1200
}

export const mapToBreakpoint = (width: number): 'xxxs' | 'xxs' | 'xs' | 'sm' | 'md' | 'lg' => {
	if (width < BreakPoint.xxxs) {
		return 'xxxs';
	}
	if (width < BreakPoint.xxs) {
		return 'xxs';
	}
	if (width < BreakPoint.xs) {
		return 'xs';
	}
	if (width < BreakPoint.sm) {
		return 'sm';
	}
	if (width < BreakPoint.md) {
		return 'md';
	}
	return 'lg';
};
