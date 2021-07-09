export function hsla(hue, saturation, lightness, alpha) {
    return `hsla(${hue}, ${saturation * 100}%, ${lightness * 100}%, ${alpha * 100}%)`;
}