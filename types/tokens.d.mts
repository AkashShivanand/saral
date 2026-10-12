// A theme's tokens: each mode maps a token path (surface.ground) to its CSS value.
declare const tokens: {
  readonly light: Readonly<Record<string, string>>;
  readonly dark: Readonly<Record<string, string>>;
};
export default tokens;
